# Prompt Best Practices

How to write effective prompts for Nanobanana/Gemini image generation.

---

## Prompt Structure

**Formula**: `[Subject] + [Style] + [Lighting] + [Composition] + [Background] + [Mood]`

| Component | Purpose | Examples |
|-----------|---------|----------|
| Subject | What to generate | "organic green powder in jar", "modern laptop" |
| Style | Visual approach | "product photography", "digital art", "minimal" |
| Lighting | Light quality | "soft studio", "natural window", "dramatic" |
| Composition | Arrangement | "centered", "rule of thirds", "close-up" |
| Background | Behind subject | "white", "gradient", "blurred office" |
| Mood | Emotional feel | "warm", "professional", "energetic" |

---

## Good vs Bad Prompts

### Bad Prompts

| Prompt | Problem |
|--------|---------|
| "powder jar" | Too vague, no style/context |
| "make it look good" | No specific direction |
| "website image" | What kind? For what? |
| "food" | No subject, style, or context |
| "professional" | Adjective alone isn't enough |

### Good Prompts

| Purpose | Good Prompt |
|---------|-------------|
| Product | "Professional product photo of organic spirulina powder in clear glass jar with bamboo lid, soft studio lighting, pure white background, minimal shadows, centered composition, e-commerce style" |
| Hero | "Wide cinematic landscape of rolling green hills at golden hour, soft warm lighting, peaceful atmosphere, space on left for text overlay, travel photography style" |
| Background | "Abstract soft gradient background, pastel lavender to mint green, subtle organic wave shapes, blurred edges, minimalist design, suitable for white text" |

---

## Style Keywords

### Photography Styles

| Style | When to Use | Keywords |
|-------|-------------|----------|
| Product | E-commerce, catalogs | "product photography", "studio shot", "commercial" |
| Food | Restaurant, recipes | "food photography", "culinary", "appetizing" |
| Lifestyle | About pages, blogs | "lifestyle photography", "candid", "authentic" |
| Portrait | Team, testimonials | "headshot", "professional portrait" |
| Architectural | Real estate, venues | "architectural photography", "interior design" |

### Artistic Styles

| Style | When to Use | Keywords |
|-------|-------------|----------|
| Flat Design | Icons, badges | "flat design", "vector style", "minimal" |
| 3D Render | Tech, modern | "3D render", "CGI", "photorealistic 3D" |
| Illustration | Playful, creative | "digital illustration", "hand-drawn style" |
| Abstract | Backgrounds | "abstract", "geometric", "organic shapes" |
| Watercolor | Artistic, soft | "watercolor style", "painted texture" |

---

## Lighting Keywords

| Lighting | Effect | Use For |
|----------|--------|---------|
| "soft studio lighting" | Even, no harsh shadows | Products |
| "natural window light" | Warm, authentic | Lifestyle |
| "golden hour" | Warm, dramatic | Hero images |
| "dramatic lighting" | High contrast | Impact |
| "ambient lighting" | Subtle, mood | Backgrounds |
| "backlit" | Silhouette, glow | Artistic |

---

## Composition Keywords

| Composition | Effect | Keywords |
|-------------|--------|----------|
| Centered | Focus on subject | "centered composition", "symmetrical" |
| Rule of thirds | Dynamic balance | "rule of thirds", "off-center" |
| Space for text | UI overlay area | "space on left/right for text" |
| Close-up | Detail focus | "close-up", "macro", "detail shot" |
| Wide shot | Context, environment | "wide angle", "establishing shot" |

---

## Background Keywords

| Type | Keywords |
|------|----------|
| Clean/Minimal | "white background", "clean background", "minimal" |
| Gradient | "gradient background", "color fade", "ombre" |
| Blurred | "bokeh", "blurred background", "shallow depth of field" |
| Environmental | "in context", "lifestyle setting", "natural environment" |
| Abstract | "abstract background", "geometric", "organic shapes" |

---

## Industry-Specific Keywords

### Food & Beverage
```
"appetizing", "fresh", "organic", "culinary",
"farm-to-table", "artisanal", "gourmet"
```

### Technology
```
"modern", "sleek", "minimal", "futuristic",
"clean lines", "high-tech", "innovative"
```

### Health & Wellness
```
"natural", "pure", "serene", "balanced",
"holistic", "clean", "refreshing"
```

### Fashion & Beauty
```
"elegant", "luxurious", "premium", "sophisticated",
"glamorous", "chic", "editorial"
```

### Finance & Business
```
"professional", "trustworthy", "corporate",
"reliable", "established", "secure"
```

---

## Common Mistakes to Avoid

| Mistake | Why It's Bad | Fix |
|---------|--------------|-----|
| Too many subjects | Confuses AI | Focus on one main subject |
| Contradicting styles | Inconsistent output | Pick one clear style |
| No lighting specified | Random results | Always include lighting |
| Vague adjectives | Misinterpretation | Be specific |
| Text in image | AI bad at text | Avoid or add via code |

---

## Prompt Templates by Use Case

### E-commerce Product
```
"Professional product photo of [PRODUCT DESCRIPTION],
soft studio lighting with subtle shadows,
[white/clean/gradient] background,
centered composition, e-commerce photography style,
high resolution, [MOOD] aesthetic"
```

### Website Hero
```
"Wide cinematic [SCENE DESCRIPTION],
[LIGHTING TYPE] lighting, [MOOD] atmosphere,
space on [left/right] for text overlay,
professional [photography/illustration] style,
high resolution, [ADDITIONAL MOOD]"
```

### Abstract Background
```
"Abstract [STYLE] background,
[COLOR 1] to [COLOR 2] gradient,
[PATTERN TYPE] pattern, [blurred/sharp] edges,
minimalist design, suitable for [light/dark] text overlay"
```

### Icon/Badge
```
"Simple flat icon of [SUBJECT],
minimal design, [PRIMARY COLOR] on white background,
vector style, clean lines, [STYLE] aesthetic"
```

---

## Quality Checklist

Before finalizing prompt:

- [ ] Subject is clearly defined
- [ ] Style/aesthetic specified
- [ ] Lighting mentioned
- [ ] Composition considered
- [ ] Background specified
- [ ] Mood/atmosphere included
- [ ] No contradicting elements
- [ ] Appropriate for aspect ratio
