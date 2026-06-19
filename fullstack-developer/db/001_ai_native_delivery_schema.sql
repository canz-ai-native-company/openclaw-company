-- 001_ai_native_delivery_schema.sql
-- AI-native Local Business Delivery Factory schema for Neon Postgres
-- Purpose: CRM -> Nervous System -> Research Agent -> Website Agent -> Creative Agent -> Human Approval loop

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ---------- Common updated_at trigger ----------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------- Enum types ----------
DO $$ BEGIN
  CREATE TYPE workflow_status AS ENUM ('queued','running','waiting_review','waiting_dependency','revision_requested','blocked','completed','failed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE step_status AS ENUM ('queued','running','waiting_review','revision_requested','completed','failed','skipped','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE artifact_status AS ENUM ('draft','ready_for_review','approved','revision_requested','rejected','archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE approval_status AS ENUM ('pending','approved','changes_requested','rejected','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE worker_run_status AS ENUM ('queued','running','succeeded','failed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE outbox_status AS ENUM ('pending','processing','processed','failed','cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE deployment_status AS ENUM ('pending','approved','deploying','deployed','failed','rolled_back');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ---------- 1) Clients: CRM client profile / main business record ----------
CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crm_provider text NOT NULL DEFAULT 'manual',
  crm_record_id text,
  business_name text NOT NULL,
  niche text,
  location_city text,
  location_state text,
  location_country text DEFAULT 'USA',
  existing_website_url text,
  client_goal text,
  package_type text DEFAULT 'full_delivery', -- full_delivery | research_only | website_only | website_update | creatives_only
  status text NOT NULL DEFAULT 'active',
  raw_crm_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  intake_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT clients_crm_unique UNIQUE (crm_provider, crm_record_id)
);

CREATE TRIGGER trg_clients_updated_at
BEFORE UPDATE ON clients
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 2) CRM events: incoming webhook/polling events from CRM ----------
CREATE TABLE IF NOT EXISTS crm_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  event_key text NOT NULL UNIQUE, -- idempotency key from CRM or generated hash
  event_type text NOT NULL, -- client.created | client.updated | deal.stage_changed
  crm_record_id text,
  client_id uuid REFERENCES clients(id) ON DELETE SET NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'received', -- received | processed | ignored | failed
  error_message text,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_crm_events_status ON crm_events(status, received_at);
CREATE INDEX IF NOT EXISTS idx_crm_events_client_id ON crm_events(client_id);

-- ---------- 3) Workflows: one delivery pipeline per client/job ----------
CREATE TABLE IF NOT EXISTS workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workflow_type text NOT NULL DEFAULT 'full_delivery',
  status workflow_status NOT NULL DEFAULT 'queued',
  current_stage text NOT NULL DEFAULT 'intake',
  priority integer NOT NULL DEFAULT 5,
  created_by_event_id uuid REFERENCES crm_events(id) ON DELETE SET NULL,
  input_summary text,
  plan jsonb NOT NULL DEFAULT '{}'::jsonb, -- intake decision: research_required, website_required, creatives_required
  started_at timestamptz,
  completed_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workflows_client_status ON workflows(client_id, status);
CREATE INDEX IF NOT EXISTS idx_workflows_stage_status ON workflows(current_stage, status);

CREATE TRIGGER trg_workflows_updated_at
BEFORE UPDATE ON workflows
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 4) Workflow steps: concrete queued work for each Digital FTE ----------
CREATE TABLE IF NOT EXISTS workflow_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  step_key text NOT NULL, -- intake, research, website, creatives, final_qa
  worker_key text NOT NULL, -- intake_decision, research_agent, website_agent, creative_agent, qa_agent
  status step_status NOT NULL DEFAULT 'queued',
  sequence_no integer NOT NULL DEFAULT 0,
  depends_on_step_id uuid REFERENCES workflow_steps(id) ON DELETE SET NULL,
  input jsonb NOT NULL DEFAULT '{}'::jsonb,
  output jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_message text,
  queued_at timestamptz NOT NULL DEFAULT now(),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT workflow_steps_unique UNIQUE (workflow_id, step_key)
);

CREATE INDEX IF NOT EXISTS idx_workflow_steps_queue ON workflow_steps(worker_key, status, queued_at);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow ON workflow_steps(workflow_id, sequence_no);

CREATE TRIGGER trg_workflow_steps_updated_at
BEFORE UPDATE ON workflow_steps
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 5) Agent runs: execution trace for each worker call ----------
CREATE TABLE IF NOT EXISTS agent_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  workflow_step_id uuid REFERENCES workflow_steps(id) ON DELETE SET NULL,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  worker_key text NOT NULL,
  runtime text NOT NULL DEFAULT 'openclaw', -- openclaw | openai_agents_sdk | custom
  status worker_run_status NOT NULL DEFAULT 'queued',
  input jsonb NOT NULL DEFAULT '{}'::jsonb,
  output jsonb NOT NULL DEFAULT '{}'::jsonb,
  tool_calls jsonb NOT NULL DEFAULT '[]'::jsonb,
  error_message text,
  cost_usd numeric(12,4),
  tokens_input integer,
  tokens_output integer,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agent_runs_client_worker ON agent_runs(client_id, worker_key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_runs_step ON agent_runs(workflow_step_id);

-- ---------- 6) Generic artifacts: single registry for report/page/theme/creative/QA files ----------
CREATE TABLE IF NOT EXISTS artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  artifact_type text NOT NULL, -- research_report | website | brand_theme | creative | qa_report | screenshot | deployment
  title text NOT NULL,
  status artifact_status NOT NULL DEFAULT 'draft',
  version integer NOT NULL DEFAULT 1,
  storage_url text,
  notion_url text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_artifacts_client_type_status ON artifacts(client_id, artifact_type, status, version DESC);

CREATE TRIGGER trg_artifacts_updated_at
BEFORE UPDATE ON artifacts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 7) Research reports ----------
CREATE TABLE IF NOT EXISTS research_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  artifact_id uuid REFERENCES artifacts(id) ON DELETE SET NULL,
  status artifact_status NOT NULL DEFAULT 'draft',
  version integer NOT NULL DEFAULT 1,
  notion_url text,
  report_summary text,
  recommended_positioning text,
  recommended_cta text,
  target_keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
  gaps jsonb NOT NULL DEFAULT '[]'::jsonb,
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_by_run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_research_reports_client_status ON research_reports(client_id, status, version DESC);

CREATE TRIGGER trg_research_reports_updated_at
BEFORE UPDATE ON research_reports
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 8) Competitors found during research ----------
CREATE TABLE IF NOT EXISTS competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  research_report_id uuid REFERENCES research_reports(id) ON DELETE CASCADE,
  name text NOT NULL,
  website_url text,
  google_profile_url text,
  location text,
  rating numeric(3,2),
  review_count integer,
  strengths jsonb NOT NULL DEFAULT '[]'::jsonb,
  weaknesses jsonb NOT NULL DEFAULT '[]'::jsonb,
  gaps jsonb NOT NULL DEFAULT '[]'::jsonb,
  evidence jsonb NOT NULL DEFAULT '{}'::jsonb, -- source URLs, screenshots, search query, captured date
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_competitors_client ON competitors(client_id);
CREATE INDEX IF NOT EXISTS idx_competitors_report ON competitors(research_report_id);

CREATE TRIGGER trg_competitors_updated_at
BEFORE UPDATE ON competitors
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 9) Brand themes: website -> creatives bridge ----------
CREATE TABLE IF NOT EXISTS brand_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  artifact_id uuid REFERENCES artifacts(id) ON DELETE SET NULL,
  status artifact_status NOT NULL DEFAULT 'draft',
  version integer NOT NULL DEFAULT 1,
  primary_color text,
  secondary_color text,
  accent_color text,
  colors jsonb NOT NULL DEFAULT '{}'::jsonb,
  typography jsonb NOT NULL DEFAULT '{}'::jsonb,
  button_style jsonb NOT NULL DEFAULT '{}'::jsonb,
  image_style jsonb NOT NULL DEFAULT '{}'::jsonb,
  tone text,
  cta text,
  design_tokens jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_brand_themes_client_status ON brand_themes(client_id, status, version DESC);

CREATE TRIGGER trg_brand_themes_updated_at
BEFORE UPDATE ON brand_themes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 10) Websites / landing pages ----------
CREATE TABLE IF NOT EXISTS websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  artifact_id uuid REFERENCES artifacts(id) ON DELETE SET NULL,
  brand_theme_id uuid REFERENCES brand_themes(id) ON DELETE SET NULL,
  status artifact_status NOT NULL DEFAULT 'draft',
  version integer NOT NULL DEFAULT 1,
  page_type text NOT NULL DEFAULT 'landing_page',
  staging_url text,
  production_url text,
  repo_url text,
  branch_name text,
  commit_sha text,
  build_status text,
  qa_status text,
  lighthouse_summary jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by_run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  approved_by text,
  approved_at timestamptz,
  deployed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_websites_client_status ON websites(client_id, status, version DESC);

CREATE TRIGGER trg_websites_updated_at
BEFORE UPDATE ON websites
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 11) Creative assets ----------
CREATE TABLE IF NOT EXISTS creatives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  website_id uuid REFERENCES websites(id) ON DELETE SET NULL,
  brand_theme_id uuid REFERENCES brand_themes(id) ON DELETE SET NULL,
  artifact_id uuid REFERENCES artifacts(id) ON DELETE SET NULL,
  status artifact_status NOT NULL DEFAULT 'draft',
  version integer NOT NULL DEFAULT 1,
  creative_type text NOT NULL, -- image | video | ad_copy | banner | story | carousel
  platform text, -- facebook | instagram | google_ads | tiktok | generic
  size_label text, -- 1080x1080 | 1080x1920 etc.
  asset_url text,
  thumbnail_url text,
  brief jsonb NOT NULL DEFAULT '{}'::jsonb,
  prompt_used text,
  qa_status text,
  created_by_run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  approved_by text,
  approved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_creatives_client_status ON creatives(client_id, status, version DESC);
CREATE INDEX IF NOT EXISTS idx_creatives_website ON creatives(website_id);

CREATE TRIGGER trg_creatives_updated_at
BEFORE UPDATE ON creatives
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 12) QA reports: Playwright/screenshots/Lighthouse/link checks ----------
CREATE TABLE IF NOT EXISTS qa_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  target_type text NOT NULL, -- website | creative | research_report | workflow
  target_id uuid,
  status text NOT NULL DEFAULT 'draft', -- draft | passed | failed | warning
  score numeric(5,2),
  checks jsonb NOT NULL DEFAULT '{}'::jsonb,
  screenshots jsonb NOT NULL DEFAULT '[]'::jsonb,
  playwright_report_url text,
  lighthouse_report_url text,
  created_by_run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_qa_reports_target ON qa_reports(target_type, target_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_qa_reports_client ON qa_reports(client_id, created_at DESC);

-- ---------- 13) Human approvals: gates before next step/deploy/export ----------
CREATE TABLE IF NOT EXISTS approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  target_type text NOT NULL, -- research_report | website | brand_theme | creative | deployment
  target_id uuid NOT NULL,
  gate_key text NOT NULL, -- research_approval | brand_theme_approval | website_staging_approval | production_deploy_approval | creative_approval
  status approval_status NOT NULL DEFAULT 'pending',
  requested_by_run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  requested_by_worker text,
  decided_by text,
  decision_notes text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_approvals_pending ON approvals(status, requested_at);
CREATE INDEX IF NOT EXISTS idx_approvals_client ON approvals(client_id, status);

CREATE TRIGGER trg_approvals_updated_at
BEFORE UPDATE ON approvals
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 14) Change requests: human feedback goes here, not direct chat ----------
CREATE TABLE IF NOT EXISTS change_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  approval_id uuid REFERENCES approvals(id) ON DELETE SET NULL,
  target_type text NOT NULL, -- research_report | website | brand_theme | creative
  target_id uuid NOT NULL,
  issue_type text NOT NULL, -- wrong_info | design_change | copy_change | layout_issue | theme_mismatch | broken_link | other
  priority text NOT NULL DEFAULT 'medium', -- low | medium | high | urgent
  description text NOT NULL,
  requested_change text,
  acceptance_criteria text,
  status text NOT NULL DEFAULT 'open', -- open | assigned | in_progress | resolved | rejected | cancelled
  assigned_worker_key text,
  submitted_by text,
  resolved_by_run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_change_requests_worker_status ON change_requests(assigned_worker_key, status, priority, created_at);
CREATE INDEX IF NOT EXISTS idx_change_requests_client_status ON change_requests(client_id, status);

CREATE TRIGGER trg_change_requests_updated_at
BEFORE UPDATE ON change_requests
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 15) Deployments ----------
CREATE TABLE IF NOT EXISTS deployments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  website_id uuid REFERENCES websites(id) ON DELETE CASCADE,
  status deployment_status NOT NULL DEFAULT 'pending',
  environment text NOT NULL DEFAULT 'production', -- staging | production
  provider text,
  target_url text,
  commit_sha text,
  approved_by text,
  deployed_by_run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  rollback_url text,
  error_message text,
  deployed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deployments_website ON deployments(website_id, created_at DESC);

CREATE TRIGGER trg_deployments_updated_at
BEFORE UPDATE ON deployments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ---------- 16) Eval results: AI worker quality checks ----------
CREATE TABLE IF NOT EXISTS eval_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  workflow_id uuid REFERENCES workflows(id) ON DELETE CASCADE,
  agent_run_id uuid REFERENCES agent_runs(id) ON DELETE SET NULL,
  worker_key text NOT NULL,
  eval_key text NOT NULL, -- mobile_responsive | links_working | theme_match | source_quality etc.
  target_type text,
  target_id uuid,
  passed boolean NOT NULL DEFAULT false,
  score numeric(5,2),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eval_results_worker ON eval_results(worker_key, eval_key, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_eval_results_target ON eval_results(target_type, target_id);

-- ---------- 17) Outbox events: simple nervous-system event queue ----------
CREATE TABLE IF NOT EXISTS outbox_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL, -- workflow.created | step.queued | approval.requested | change_request.created
  aggregate_type text NOT NULL, -- client | workflow | step | approval | change_request
  aggregate_id uuid NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status outbox_status NOT NULL DEFAULT 'pending',
  attempts integer NOT NULL DEFAULT 0,
  available_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_outbox_pending ON outbox_events(status, available_at, attempts);

-- ---------- Helpful views ----------
CREATE OR REPLACE VIEW v_pending_website_jobs AS
SELECT
  ws.id AS workflow_step_id,
  ws.workflow_id,
  ws.client_id,
  c.business_name,
  c.niche,
  c.location_city,
  c.location_state,
  c.existing_website_url,
  ws.status AS step_status,
  ws.input AS step_input,
  w.plan AS workflow_plan,
  rr.id AS latest_approved_research_report_id,
  rr.report_summary,
  rr.recommended_positioning,
  rr.recommended_cta,
  rr.gaps,
  bt.id AS latest_approved_brand_theme_id,
  bt.design_tokens,
  ws.queued_at
FROM workflow_steps ws
JOIN workflows w ON w.id = ws.workflow_id
JOIN clients c ON c.id = ws.client_id
LEFT JOIN LATERAL (
  SELECT * FROM research_reports rr
  WHERE rr.client_id = c.id AND rr.status = 'approved'
  ORDER BY rr.version DESC, rr.created_at DESC
  LIMIT 1
) rr ON true
LEFT JOIN LATERAL (
  SELECT * FROM brand_themes bt
  WHERE bt.client_id = c.id AND bt.status = 'approved'
  ORDER BY bt.version DESC, bt.created_at DESC
  LIMIT 1
) bt ON true
WHERE ws.worker_key = 'website_agent'
  AND ws.status IN ('queued','revision_requested');

CREATE OR REPLACE VIEW v_pending_approvals AS
SELECT
  a.id AS approval_id,
  a.client_id,
  c.business_name,
  a.workflow_id,
  a.target_type,
  a.target_id,
  a.gate_key,
  a.status,
  a.requested_by_worker,
  a.requested_at
FROM approvals a
JOIN clients c ON c.id = a.client_id
WHERE a.status = 'pending'
ORDER BY a.requested_at ASC;

CREATE OR REPLACE VIEW v_workflow_dashboard AS
SELECT
  w.id AS workflow_id,
  w.client_id,
  c.business_name,
  c.niche,
  c.location_city,
  c.location_state,
  w.workflow_type,
  w.status,
  w.current_stage,
  w.priority,
  w.created_at,
  w.updated_at,
  COUNT(ws.id) AS total_steps,
  COUNT(ws.id) FILTER (WHERE ws.status = 'completed') AS completed_steps,
  COUNT(a.id) FILTER (WHERE a.status = 'pending') AS pending_approvals,
  COUNT(cr.id) FILTER (WHERE cr.status IN ('open','assigned','in_progress')) AS open_change_requests
FROM workflows w
JOIN clients c ON c.id = w.client_id
LEFT JOIN workflow_steps ws ON ws.workflow_id = w.id
LEFT JOIN approvals a ON a.workflow_id = w.id
LEFT JOIN change_requests cr ON cr.workflow_id = w.id
GROUP BY w.id, c.id;

COMMIT;
