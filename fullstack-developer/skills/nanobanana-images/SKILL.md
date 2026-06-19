---
name: nanobanana-images
description: |
  Generate AI images for websites using Nanobanana MCP (Google Gemini).
  PAID service (~$0.05/image). Only use when user EXPLICITLY requests
  image generation. For hero banners, product photos, custom backgrounds.
  This skill should be used when users say "generate image", "create image",
  "AI image", "nanobanana", or "custom image for website".
---

# Nanobanana Images

AI image generation for websites using Nanobanana MCP (Google Gemini).

## What This Skill Does

- Generates custom AI images for websites
- Provides optimized prompts for different image types
- Handles aspect ratios and quality settings automatically
- Saves images to correct project location

## What This Skill Does NOT Do

- Auto-generate images without explicit user request
- Replace free Unsplash images unnecessarily
- Generate images for non-website purposes
- Proceed without cost acknowledgment

---

## CRITICAL: Cost Awareness

This is a **PAID SERVICE**. Always confirm before generating.

| Quality | Resolution | Cost |
|---------|------------|------|
| Standard | 1024x1024 | ~$0.04-0.05 |
| High | 2048x2048 | ~$0.08-0.10 |
| Premium | 4096x4096 | ~$0.15 |

---

## Trigger Conditions

**ONLY** activate when user explicitly says:
- "generate image", "create image", "make image"
- "AI image", "generate photo"
- "nanobanana", "gemini image"
- "custom image for website"

**DO NOT** auto-trigger during general website building.

---

## Smart Clarification (Single Question)

If the user hasn't specified, ask **ONE question**:

> "What type of image do you need? (hero banner, product photo, background, about section, icon)"

Then **auto-infer** everything else from this table:

| Image Type | Aspect Ratio | Style | Quality |
|------------|--------------|-------|---------|
| Hero Banner | 16:9 | Cinematic photography | High |
| Product Photo | 1:1 | Product photography, white bg | Standard |
| Background | 16:9 | Abstract, subtle, blurred | Standard |
| About Section | 4:3 | Lifestyle photography | Standard |
| Icon/Badge | 1:1 | Flat design, minimal | Standard |
| Feature Image | 4:3 | Clean, modern photography | Standard |
| Testimonial | 1:1 | Professional headshot style | Standard |

See `references/website-image-types.md` for detailed prompt templates.

---

## Generation Workflow

### Step 1: Confirm Image Type
Ask only if not clear from context:
> "What type of image do you need?"

### Step 2: Show Prompt & Cost
```
I'll generate a [type] image using this prompt:

"[Full prompt here]"

Settings: [aspect_ratio], [quality]
Estimated cost: ~$[cost]

Proceed with generation?
```

### Step 3: Generate (Only After Approval)
```python
mcp__nanobanana__generate_image(
    prompt="[optimized prompt]",
    aspect_ratio="[auto-selected]",
    quality="[auto-selected]"
)
```

### Step 4: Save & Provide Code
Save to: `public/images/[descriptive-name].png`

Provide usage:
```jsx
<Image
  src="/images/[name].png"
  alt="[descriptive alt text]"
  width={[width]}
  height={[height]}
/>
```

---

## MCP Tools Available

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `mcp__nanobanana__generate_image` | Create new image | Primary tool |
| `mcp__nanobanana__edit_image` | Modify existing | Adjustments needed |
| `mcp__nanobanana__upload_file` | Upload for editing | Edit workflow |

See `references/mcp-tools-reference.md` for parameter details.

---

## Decision: AI vs Unsplash

**Rule**: If free stock works → Use Unsplash. If custom needed → Use Nanobanana.

| Scenario | Use AI | Use Unsplash |
|----------|--------|--------------|
| Specific product that doesn't exist | Yes | No |
| Generic hero background | No | Yes |
| Custom branded imagery | Yes | No |
| Real people/teams | No | Yes |
| Unique product combinations | Yes | No |
| Generic nature/city scenes | No | Yes |

See `references/ai-vs-unsplash.md` for full decision matrix.

---

## Prompt Engineering

**Structure**: `[Subject] + [Style] + [Lighting] + [Composition] + [Background]`

**Good Prompt**:
```
"Professional product photo of organic green powder in glass jar,
studio lighting, white background, minimal shadows,
e-commerce product photography, centered composition"
```

**Bad Prompt**:
```
"powder jar" (too vague)
```

See `references/prompt-best-practices.md` for templates by image type.

---

## Forbidden Actions

| Action | Why |
|--------|-----|
| Auto-generating without asking | Paid service, needs consent |
| Generating for every page | Cost-prohibitive |
| Replacing Unsplash unnecessarily | Wasting money |
| Generating without showing prompt | User should approve |
| Skipping cost confirmation | User needs cost awareness |

---

## Integration with Website Building

1. User builds website (nextjs-chatkit-ui skill)
2. Website uses Unsplash placeholders initially
3. User explicitly asks: "Generate custom hero image"
4. Load this skill
5. Ask image type (if not clear)
6. Show prompt + cost, get approval
7. Generate and save to `public/images/`
8. Update component with new image path

---

## Output Checklist

Before generating, verify:

- [ ] User explicitly requested image generation
- [ ] Image type identified (or asked)
- [ ] Prompt shown to user
- [ ] Cost acknowledged
- [ ] User approved generation
- [ ] Save location confirmed

---

## Reference Files

| File | When to Read |
|------|--------------|
| `references/website-image-types.md` | Get prompt templates per type |
| `references/prompt-best-practices.md` | Craft effective prompts |
| `references/ai-vs-unsplash.md` | Decide AI vs free stock |
| `references/mcp-tools-reference.md` | MCP tool parameters |
