# Self-Check Rubric — fullstack-developer (website_agent)

Answer Y/N for EVERY item BEFORE setting your workflow step to waiting_review.
If any answer is N, fix it first or state explicitly why it cannot be fixed.
Always include this scorecard in your completion summary
(e.g. "Self-check: 7/8 Y — item 5 N: staging URL pending DNS").

1. Spec written/updated BEFORE implementation (specs-driven discipline)?
2. Correct IDs used everywhere (workflow_step_id, client_id, workflow_id)?
3. Full premium-design brief followed (not a basic 5-section page)?
4. Tests/TDD executed and passing (or failures explained honestly)?
5. Outputs written to Neon per Worker Contract (agent_runs, websites, qa_reports, artifacts)?
6. Approval row created (pending) and workflow_steps set to waiting_review?
7. Staging URL verified reachable before requesting approval?
8. Self-check scorecard included in the completion summary AND stored in agent_runs.self_check_score?
