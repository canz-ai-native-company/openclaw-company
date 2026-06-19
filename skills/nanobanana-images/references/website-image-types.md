# Website Image Types

Auto-inferred settings and prompt templates for each image type.

---

## Quick Reference

| Type | Aspect Ratio | Quality | Typical Dimensions |
|------|--------------|---------|-------------------|
| Hero Banner | 16:9 | High | 1920x1080 |
| Product Photo | 1:1 | Standard | 800x800 |
| Background | 16:9 | Standard | 1920x1080 |
| About Section | 4:3 | Standard | 1200x900 |
| Icon/Badge | 1:1 | Standard | 512x512 |
| Feature Image | 4:3 | Standard | 800x600 |
| Testimonial | 1:1 | Standard | 400x400 |
| Card Thumbnail | 4:3 | Standard | 600x450 |
| CTA Banner | 21:9 | High | 2100x900 |

---

## Hero Banner

**Auto Settings**:
- Aspect Ratio: `16:9`
- Quality: `High`
- Cost: ~$0.08-0.10

**Prompt Template**:
```
Wide cinematic shot of [SUBJECT], [LIGHTING],
[MOOD] atmosphere, space on [left/right] for text overlay,
professional photography, high resolution, [STYLE]
```

**Examples**:

Food Website:
```
"Wide cinematic shot of fresh organic vegetables arranged on rustic
wooden table, soft natural morning light from side window, warm
inviting atmosphere, space on left for text overlay, professional
food photography, high resolution"
```

Tech/SaaS:
```
"Wide cinematic shot of modern minimalist workspace with laptop
and plants, soft ambient lighting, clean professional atmosphere,
space on right for text overlay, lifestyle photography, high resolution"
```

E-commerce:
```
"Wide cinematic shot of elegant product display on marble surface,
studio lighting with soft shadows, luxurious atmosphere, space on
left for text overlay, commercial photography, high resolution"
```

---

## Product Photo

**Auto Settings**:
- Aspect Ratio: `1:1`
- Quality: `Standard`
- Cost: ~$0.04-0.05

**Prompt Template**:
```
Professional product photo of [PRODUCT], studio lighting,
white/clean background, minimal shadows, centered composition,
e-commerce product photography style, [ADDITIONAL DETAILS]
```

**Examples**:

Food Product:
```
"Professional product photo of organic green powder in clear glass
jar with wooden lid, studio lighting, pure white background, minimal
shadows, centered composition, e-commerce product photography"
```

Cosmetic:
```
"Professional product photo of luxury skincare bottle with gold cap,
soft studio lighting, gradient cream background, subtle reflection,
centered composition, premium cosmetic photography"
```

---

## Background Image

**Auto Settings**:
- Aspect Ratio: `16:9`
- Quality: `Standard`
- Cost: ~$0.04-0.05

**Prompt Template**:
```
Abstract [STYLE] background, [COLORS] gradient, subtle [PATTERN],
blurred organic shapes, minimalist design, suitable for text overlay
```

**Examples**:

Soft Gradient:
```
"Abstract soft gradient background, pastel purple to mint green,
subtle wave patterns, blurred organic shapes, minimalist design,
suitable for white text overlay"
```

Tech Pattern:
```
"Abstract geometric background, deep blue to dark purple gradient,
subtle network pattern, modern tech aesthetic, minimalist,
space for content overlay"
```

---

## About Section

**Auto Settings**:
- Aspect Ratio: `4:3`
- Quality: `Standard`
- Cost: ~$0.04-0.05

**Prompt Template**:
```
[SCENE TYPE] with [SUBJECTS], [LIGHTING], [MOOD] environment,
lifestyle photography style, authentic feel, [INDUSTRY] context
```

**Examples**:

Office/Team:
```
"Modern open office workspace with plants and natural light,
warm afternoon lighting, collaborative professional environment,
lifestyle photography, authentic startup feel"
```

Restaurant/Cafe:
```
"Cozy restaurant interior with warm lighting and wooden furniture,
soft evening ambiance, welcoming atmosphere, lifestyle photography,
hospitality context"
```

---

## Icon/Badge

**Auto Settings**:
- Aspect Ratio: `1:1`
- Quality: `Standard`
- Cost: ~$0.04-0.05

**Prompt Template**:
```
Simple flat icon of [SUBJECT], minimal design, [COLOR] on
white background, vector style, clean lines, [STYLE] aesthetic
```

**Examples**:

Leaf Icon:
```
"Simple flat icon of a single green leaf, minimal design,
forest green on white background, vector style, clean lines,
modern eco aesthetic"
```

Shield Badge:
```
"Simple flat icon of shield with checkmark, minimal design,
blue gradient on white background, vector style, clean lines,
trust badge aesthetic"
```

---

## Feature Image

**Auto Settings**:
- Aspect Ratio: `4:3`
- Quality: `Standard`
- Cost: ~$0.04-0.05

**Prompt Template**:
```
[SUBJECT/CONCEPT] representing [FEATURE], clean modern style,
[LIGHTING], professional imagery, [MOOD], subtle background
```

**Examples**:

Speed/Performance:
```
"Abstract representation of speed and efficiency, clean modern style,
bright lighting with motion blur effect, professional tech imagery,
dynamic energy, subtle gradient background"
```

Security:
```
"Digital security concept with lock and shield elements, clean
modern style, soft blue lighting, professional tech imagery,
trustworthy atmosphere, subtle dark background"
```

---

## Testimonial Avatar

**Auto Settings**:
- Aspect Ratio: `1:1`
- Quality: `Standard`
- Cost: ~$0.04-0.05

**Prompt Template**:
```
Professional headshot style portrait, [DESCRIPTION], soft studio
lighting, neutral background, friendly approachable expression,
business casual, high quality
```

**Note**: For real testimonials, prefer actual photos. Use AI only for
placeholder or when no real photo available.

---

## Usage After Generation

```jsx
// Hero Banner
<Image
  src="/images/hero-[name].png"
  alt="[Descriptive alt text]"
  width={1920}
  height={1080}
  priority
/>

// Product Photo
<Image
  src="/images/product-[name].png"
  alt="[Product name]"
  width={800}
  height={800}
/>

// Background (CSS)
style={{ backgroundImage: 'url(/images/bg-[name].png)' }}
```
