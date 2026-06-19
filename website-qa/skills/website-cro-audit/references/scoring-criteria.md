# Website CRO Audit — Scoring Criteria

Score each of the 7 dimensions **0–10** using the five-band tables below, then
apply the weights to get a final score out of 100. Weights are derived from the
CRO brief's impact ordering and the "~80% of impact is above the fold" rule.

## Dimensions & weights

| #   | Dimension                          | Weight | What it covers                                                                 |
| --- | ---------------------------------- | ------ | ----------------------------------------------------------------------------- |
| 1   | Value Proposition Clarity          | 20%    | 5-second test, plain-language what/who/outcome, differentiation               |
| 2   | Hero Section                       | 20%    | Headline, subheadline, hero visual, primary CTA above the fold, hero trust    |
| 3   | CTA Effectiveness                  | 15%    | Single primary action, value-based copy, contrast, repetition, sticky mobile  |
| 4   | Trust Signals & Social Proof       | 15%    | Logos, testimonials, ratings, risk reversal, trust near forms, placement      |
| 5   | Friction & Flow                    | 12%    | Form field count, inline validation, steps, distractions/nav, next-step clarity|
| 6   | Visual Hierarchy & Scannability    | 8%     | Scan-in-10s, subheads/bullets, one visual path, cognitive load (Hick's Law)   |
| 7   | Mobile & Performance               | 10%    | Above-fold CTA on mobile, 44px tap targets, single column, ~2.5s load, CWV     |

Weights sum to 100%.

## Band tables (0–10 per dimension)

Use the same band shape for every dimension. `0` is reserved for **could not
assess** (e.g. browser unavailable, page blocked).

### 1. Value Proposition Clarity
| Band | Criteria |
| --- | --- |
| 9–10 | A stranger states what it is, who it's for, and the outcome in <5s. Plain language, clearly differentiated. |
| 7–8  | Clear what/who, but the outcome or differentiation is soft. |
| 5–6  | Understandable only after reading carefully; feature-led or a little vague. |
| 3–4  | Vague/clever ("Reimagine…"), jargon-heavy, or tries to say everything. |
| 1–2  | Visitor cannot tell what this is or who it's for. |
| 0    | Could not assess. |

### 2. Hero Section
| Band | Criteria |
| --- | --- |
| 9–10 | Headline 6–12 words & specific; supporting sub; outcome-driven visual; exactly one primary CTA visible above the fold; trust cue present. Passes 5-second test. |
| 7–8  | Strong hero, one or two spec-sheet items off (e.g. sub restates headline, weak visual). |
| 5–6  | Hero present but headline vague OR CTA not clearly above the fold OR generic visual. |
| 3–4  | Multiple hero mistakes (competing CTAs, stock imagery, wall of text, carousel). |
| 1–2  | No clear hero / CTA below the fold / autoplay-with-sound. |
| 0    | Could not assess. |

### 3. CTA Effectiveness
| Band | Criteria |
| --- | --- |
| 9–10 | One unambiguous primary action; value-based copy ("Get my free audit"); highest-contrast element; reassurance microcopy; repeated on long pages; sticky on mobile. |
| 7–8  | Strong primary CTA, missing one of: microcopy, repetition, sticky mobile. |
| 5–6  | CTA present but generic copy ("Submit"/"Learn more") OR low contrast OR competing secondary. |
| 3–4  | Several competing CTAs OR buried/low-contrast primary. |
| 1–2  | No clear primary CTA. |
| 0    | Could not assess. |

### 4. Trust Signals & Social Proof
| Band | Criteria |
| --- | --- |
| 9–10 | Specific, attributed proof (names/faces/results) early and near CTAs; risk reversal; trust signals near forms. |
| 7–8  | Good proof present but generic OR placed too low. |
| 5–6  | Some proof (a logo strip or one testimonial) but thin or vague. |
| 3–4  | Token/invented-looking proof only. |
| 1–2  | No social proof or trust signals. |
| 0    | Could not assess. |

### 5. Friction & Flow
| Band | Criteria |
| --- | --- |
| 9–10 | Minimal fields (≈3), inline validation, clear next-step, distractions stripped, single goal. |
| 7–8  | Mostly low friction; 4–6 fields OR minor nav distraction. |
| 5–6  | Noticeable friction: 7+ fields OR no validation OR unclear next step. |
| 3–4  | High friction: long form, escape routes everywhere, confusing flow. |
| 1–2  | Conversion path broken or hidden. |
| 0    | Could not assess. |

### 6. Visual Hierarchy & Scannability
| Band | Criteria |
| --- | --- |
| 9–10 | Main message lands when skimmed in 10s; subheads/bullets; one clear eye path; low cognitive load. |
| 7–8  | Scannable, hierarchy mostly clear, minor competing elements. |
| 5–6  | Dense in places; hierarchy unclear; too many choices/links. |
| 3–4  | Wall of text or chaotic layout. |
| 1–2  | No discernible hierarchy. |
| 0    | Could not assess. |

### 7. Mobile & Performance
| Band | Criteria |
| --- | --- |
| 9–10 | CTA above fold on mobile; ≥44px tap targets w/ spacing; single column; correct input types; ~≤2.5s load; LCP<2.5s, CLS<0.1; no intrusive interstitial. |
| 7–8  | Solid mobile; one issue (e.g. small tap targets OR load ~2.5–4s). |
| 5–6  | Usable but cramped: pinch-zoom needed OR slow OR hover-dependent bits. |
| 3–4  | Multiple mobile failures (horizontal scroll, tiny text, CTA buried, >4s). |
| 1–2  | Effectively broken on mobile. |
| 0    | Could not assess. |

## Final score & grade

```
Final = (D1 × 0.20) + (D2 × 0.20) + (D3 × 0.15) + (D4 × 0.15)
      + (D5 × 0.12) + (D6 × 0.08) + (D7 × 0.10)
Scale ×10  →  score out of 100
```

| Score  | Grade | Meaning                                                   |
| ------ | ----- | --------------------------------------------------------- |
| 85–100 | A     | Well-optimized; focus on A/B testing and iteration        |
| 70–84  | B     | Good foundation; clear opportunities to improve           |
| 50–69  | C     | Significant gaps; prioritized fixes will have high impact  |
| 30–49  | D     | Major optimization needed across multiple dimensions       |
| 0–29   | F     | Page needs a complete overhaul                             |

Per-dimension grade: 9–10 = A, 7–8 = B, 5–6 = C, 3–4 = D, 1–2 = F.

## Worked example

A SaaS landing page from a Google Ads campaign (goal = free trial):

| Dimension                  | Score | × Weight |
| -------------------------- | ----- | -------- |
| Value Proposition Clarity  | 7     | 1.40     |
| Hero Section               | 6     | 1.20     |
| CTA Effectiveness          | 8     | 1.20     |
| Trust Signals              | 5     | 0.75     |
| Friction & Flow            | 7     | 0.84     |
| Visual Hierarchy           | 8     | 0.64     |
| Mobile & Performance       | 6     | 0.60     |
| **Sum**                    |       | **6.63** |

Final = 6.63 × 10 = **66 / 100 → Grade C** ("significant gaps; prioritized
fixes will have high impact"). Biggest constraint = Trust Signals (lowest
weighted contribution relative to its 15% weight) and Hero.

## Calibration note (context tiering)

Before docking points, weigh intent and traffic. A polished brand homepage and a
single-purpose paid landing page are held to different standards:

- **Paid / single-goal landing page** — strictest. Message match, one CTA, nav
  stripped, above-the-fold CTA all matter intensely.
- **Homepage / multi-audience** — some nav and multiple paths are legitimate;
  judge whether the *primary* path is still obvious.
- **Content/blog page** — score contextual CTAs and inline conversion points,
  not a single hero CTA.

Ask: "Is this a mistake, or a deliberate choice by a team with data I don't
have?" Note the page type in the report and calibrate accordingly.

---

## Doc-coverage notes — new signals (recipes 12–17)

These additional checks complete coverage of the CRO brief and hero spec sheet.
They do NOT add a new weighted dimension; they feed the existing dimensions:

| New signal (recipe) | Feeds dimension |
| --- | --- |
| Click-to-call & tap-to-map (12) | Mobile & Performance (7) |
| Hover-only interaction risk (13) | Mobile & Performance (7) |
| Sticky CTA (14) | CTA Effectiveness (3) + Mobile (7) |
| Hero word-count spec (15) | Hero Section (2) |
| Analytics & tracking tags (16) | reported as a finding (informs §8 readiness) |
| Persuasion & objection signals — FAQ, pricing, genuine urgency (17) | Trust Signals (4) + Value Proposition (1); report objection-handling in Detailed Findings |

**Objection handling (brief §6):** there is no separate weighted dimension for it;
assess it from recipe 17 + the page content and report it under Detailed Findings
(FAQ present? objections answered? genuine vs fake urgency? pricing framing?).

## Out of automated scope (always list under Limitations, never silently skip)
Post-conversion confirmation page, A/B-test readiness, real-device + throttled-4G
testing, motion-with-purpose, and localization cannot be judged from a single
page-load. Flag them in the report's Limitations and recommend a manual/separate
check — do not invent a pass/fail for them.
