---
name: nanobanana-landing-visuals
description: |
  Specialized Nano Banana (Gemini) image generation workflow for premium landing pages.
  Extends nanobanana-images with prompt templates for hero visuals, abstract
  backgrounds, feature illustrations, dashboard mockups, OG images, and avatars.
  Includes brand consistency rules and a cost-aware visual asset plan template.
  Triggers on "hero image", "feature illustration", "background graphic",
  "OG image", "landing page visual", or auto-loaded by premium-landing-page.
---

# Nano Banana — Landing Page Visuals Skill

The base `nanobanana-images` skill handles general use. This skill adds the
**landing-page-specific** workflow: which visuals each section needs, prompt
templates that match modern SaaS aesthetics, and cost-aware batching.

---

## Hard Rules

1. **Cost gate**: every Nano Banana call costs ~$0.04-$0.15. Show user the prompt and
   estimated cost BEFORE generating. Get approval.
2. **Real product screenshots beat AI illustrations** for B2B SaaS. Always check
   if the user has product UI to use FIRST.
3. **AI-generated faces are risky** — looks uncanny, raises trust questions. For
   testimonials prefer real photos. AI faces only with user consent.
4. **Brand consistency** — generate visuals as a SET in one session with shared
   style anchors, not piecemeal across sessions.
5. **Output format**: PNG default for transparency-needing items, JPG/WebP for
   photos. Always save to `public/images/` with descriptive names.
6. **Performance**: hero image targets 200-400KB after compression. Convert to
   WebP/AVIF where supported.

---

## Asset Plan Template (Phase 6 of premium-landing-page)

Save as `specs/<project>/06-visuals.md`:

```markdown
# Visual Asset Plan

## 1. Hero Visual
- Type: [product mockup / illustration / dashboard / abstract / hybrid]
- Source: [Real product screenshot | Figma export | Nano Banana | Unsplash]
- Aspect ratio: [16:9 / 4:3 / 1:1]
- Resolution: 2x device (so 2048×1152 for 16:9 desktop)
- File path: `public/images/hero-[descriptive].png`
- Cost: $___

## 2. Background / Depth Graphics
- Type: [mesh gradient / aurora / noise texture / grid SVG]
- Source: usually CSS-only (free) or noise PNG
- Cost: $0

## 3. Feature Section Visuals (per feature)
| # | Feature | Visual type | Source | Path | Cost |
|---|---------|-------------|--------|------|------|
| 1 | [name] | [icon/illust/screenshot] | [src] | `public/images/feature-1.png` | $___ |
| 2 | ... | ... | ... | ... | $___ |

## 4. Logo Cloud
- Source: real customer SVGs (preferred) | TODO: client to supply
- Cost: $0 if real

## 5. Testimonial Avatars
- Source: real customer photos (preferred) | TODO: client to supply
- Cost: $0 if real

## 6. OG / Twitter Card Image
- Aspect ratio: 1200×630
- Source: composed in Figma (preferred) or Nano Banana abstract
- File path: `public/og-image.png`
- Cost: $___

## Total Estimated Cost
$_____.____

User approved? [ ] yes [ ] no
```

---

## Prompt Template Library

### A. Hero — Abstract Background (cinematic, depth)

```
Subject: Abstract digital landscape with soft volumetric light, flowing gradient
geometry suggesting [domain — e.g., "data flows", "connected nodes", "layered code"]
Style: Premium SaaS hero background, ultra-modern, cinematic
Lighting: Soft ambient with directional accent in [accent color]
Composition: Wide 16:9, dark space on left for headline overlay (centered or
right-weighted visual interest)
Background: Deep [palette base — e.g., "near-black with violet and indigo
under-gradients"], subtle noise texture
Mood: Sophisticated, calm, premium
Avoid: Harsh edges, busy details, photorealistic faces, branding elements,
generic stock-illustration look, AI-art tropes (rainbow gradients, neon overload)
```

Settings: 1792×1024 or 2048×1152, high quality.

### B. Hero — Product Mockup (Frame around real screenshot)

DON'T regenerate the UI with AI — instead, take a real product screenshot and
FRAME it with Nano Banana for a premium device frame:

```
Subject: A modern laptop / browser window mockup with elegant glass-morphism frame,
holding a screenshot
Style: Product photography, isometric or front-facing 3/4 view, premium tech feel
Lighting: Soft studio with directional accent in [brand color]
Composition: Centered, ample negative space around mockup, optional subtle
shadow / reflection beneath
Background: Pure transparent (PNG) OR matching gradient
Mood: Premium, modern, confident
Avoid: Generic device renders, harsh shadows, watermarks
```

For mockups, prefer free tools: **DeviceVibes**, **mockuper**, or **Framer
mockup blocks**. Use Nano Banana only if a custom shot is needed.

### C. Feature Illustration (small icon-style)

```
Subject: Minimal dual-tone illustration of [feature concept — e.g., "a stack of
documents being auto-organized", "a dashboard receiving streaming data"]
Style: Modern flat illustration, dual-tone (one base color + one accent), thin
linework, 2026 SaaS aesthetic (think Linear, Vercel, Resend)
Lighting: N/A (flat)
Composition: 1:1, centered subject, ample padding
Background: Transparent OR very soft tinted accent
Mood: Clean, intentional, slightly playful
Avoid: Photo-realism, 3D rendering, gradient mesh, generic clipart
```

Settings: 1024×1024 standard quality.

### D. Section Background (Subtle Texture)

```
Subject: Abstract subtle texture, [pattern style — "grid lines fading at edges",
"organic noise gradient", "soft circuit pattern"]
Style: Background texture, very low contrast, designed to sit behind text
Lighting: N/A
Composition: Tileable OR full-bleed wide, low visual weight
Background: [Brand neutral base]
Mood: Quiet, supportive
Avoid: High contrast, busy detail, anything that competes with foreground text
```

### E. OG / Social Card

```
Subject: Brand statement design — large product wordmark / logo, tagline below,
optional small product UI snippet on side
Style: Modern OG card, [light/dark per brand], premium SaaS aesthetic
Composition: 1200×630, headline takes upper 40%, visual takes lower 60% OR
split left/right
Background: Brand gradient or solid + subtle pattern
Mood: Confident, scroll-stopping in a social feed
Avoid: Tiny text (must be readable at 600×315 thumbnail)
```

### F. Avatar (testimonial — only with user consent)

```
Subject: Professional headshot of [generic descriptor — "a software engineer in
mid-30s", "a finance manager"], looking warmly at camera
Style: Modern environmental portrait, natural lighting, soft background blur
Lighting: Window light from side, warm natural feel
Composition: Square crop, head and shoulders, eyes at upper third
Background: Slightly blurred [office / casual / natural — whatever fits brand]
Mood: Trustworthy, approachable
Avoid: Stock-photo grin, plastic skin, perfectly symmetrical face,
hyper-corporate setting
```

⚠️ Real photos always preferred. Always disclose if AI-generated.

---

## Brand-Consistency Anchors

When generating multiple assets in one project, append these anchors to EVERY
prompt to keep the visuals feeling like one set:

```
[end every prompt with:]

Style anchors (for visual consistency across this project):
- Palette: [exact hex values from visual-system-builder]
- Mood: [3 adjectives from design-direction]
- Reference vibe: [name 1 reference site, e.g., "Linear's clarity meets Stripe's warmth"]
- Avoid: [project's don't-do list]
```

---

## Workflow

### Step 1 — Confirm asset plan with user

Show the asset plan from Phase 6 with total cost. Get approval. Don't generate
anything that's not in the plan.

### Step 2 — Generate as a batch

Open one session with Nano Banana, generate the abstract background + each
feature illustration in succession with style anchors applied. Avoid switching
session mid-set.

### Step 3 — Review and regenerate selectively

Review each output:
- Does it match the brand mood?
- Is it distinct from the AI-art default look?
- Does it work in the actual layout (test by dropping into mockup)?

If not, edit the prompt or use `mcp__nanobanana__edit_image` for adjustments
rather than regenerating from scratch (cheaper).

### Step 4 — Compress and integrate

```bash
# Convert + compress
npx @squoosh/cli --webp '{"quality":80}' public/images/*.png
# Or use sharp via small script
```

In Next.js:
```tsx
<Image
  src="/images/hero-abstract.webp"
  alt="<descriptive>"
  width={2048}
  height={1152}
  priority   // hero only
  sizes="100vw"
  className="..."
/>
```

### Step 5 — Document

Update `06-visuals.md` with final paths, file sizes, and total cost spent.

---

## Decision Matrix — Generate vs Reuse vs Skip

| Visual need | Best source |
|-------------|-------------|
| Hero product screenshot | Real product, framed in Figma |
| Hero abstract background | Nano Banana OR CSS gradient (cheaper) |
| Feature illustrations | Nano Banana (custom set) OR icons + colored cards (free) |
| Background patterns | CSS / SVG (free) |
| Logos | Real SVGs from clients |
| Avatars | Real photos OR Unsplash (free) — Nano Banana only with consent |
| OG image | Composed in Figma (free if you have a template) OR Nano Banana |

**90% of premium SaaS sites use VERY FEW AI images** — most rely on real product
screenshots, CSS depth treatments, and minimal iconography. Don't over-generate.

---

## Cost Estimation Cheat Sheet

| Asset | Calls | Standard cost |
|-------|-------|---------------|
| 1 abstract hero background | 1-2 | $0.04 - $0.10 |
| 6 feature illustrations | 6-8 | $0.24 - $0.40 |
| 1 OG image | 1-2 | $0.04 - $0.10 |
| Set of 4 avatars | 4-6 | $0.16 - $0.30 |
| **Total typical landing page** | 12-18 | **$0.50 - $1.00** |

If estimated total > $2 — flag it. The user can probably get equivalent quality
from Unsplash + a $20/mo Figma + 1 hour of polish.

---

## Anti-Patterns

- Generating 20 images "just in case" — costly and bloats the project
- Asking Nano Banana to make logos for real companies (legal risk)
- Generating fake testimonial faces without user consent
- Using AI hero background AND AI illustrations AND AI mockup — too much AI feel,
  reads as "generic AI site" to users
- Forgetting to compress + convert to WebP/AVIF after generation
- Inconsistent style — some images cinematic, some flat, some 3D — looks like a
  collage, not a brand
- Not adding alt text in code after integrating — accessibility fail
