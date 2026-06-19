# AI vs Unsplash Decision Matrix

When to use paid AI generation vs free stock photos.

---

## Golden Rule

> **If a free stock image works for the purpose → Use Unsplash.**
> **If something custom/specific is needed → Use Nanobanana.**

---

## Quick Decision Table

| Scenario | Use AI (Nanobanana) | Use Unsplash |
|----------|:-------------------:|:------------:|
| Product that doesn't exist | Yes | No |
| Generic hero background | No | Yes |
| Custom branded imagery | Yes | No |
| Real people/teams | No | Yes |
| Unique product combinations | Yes | No |
| Generic nature scenes | No | Yes |
| Specific food arrangements | Yes | No |
| Generic office/workspace | No | Yes |
| Brand-specific illustration | Yes | No |
| City skyline | No | Yes |
| Custom icon/badge | Yes | No |
| Generic technology imagery | No | Yes |

---

## Detailed Decision Framework

### Use Nanobanana (AI) When:

**1. Product Doesn't Exist**
- Custom product mockups before manufacturing
- Unique product variations
- Fictional items for concept websites

**2. Specific Brand Requirements**
- Exact color scheme matching
- Specific composition for text overlay
- Brand-specific visual style

**3. Unique Combinations**
- Specific food ingredients together
- Product in specific context
- Custom scene that doesn't exist

**4. Customization Needed**
- Exact aspect ratio requirements
- Specific empty space for UI
- Particular lighting/mood

**5. No Stock Alternative**
- Very niche subjects
- Specific cultural contexts
- Unique conceptual imagery

---

### Use Unsplash (Free) When:

**1. Generic Backgrounds**
- Nature landscapes
- City skylines
- Abstract textures
- Gradient backgrounds

**2. Real People**
- Team photos (use actual team)
- Testimonial avatars (use real customers)
- Lifestyle with authentic humans

**3. Common Scenes**
- Office workspaces
- Coffee shops
- Generic technology
- Travel destinations

**4. Standard Hero Images**
- Mountain landscapes
- Ocean/beach scenes
- Forest/nature
- Urban environments

**5. Placeholder Content**
- MVP/prototype stages
- Content that will be replaced
- Demo purposes

---

## Cost Comparison

| Approach | Per Image | 10 Images | 50 Images |
|----------|-----------|-----------|-----------|
| Unsplash | $0 | $0 | $0 |
| Nanobanana Standard | ~$0.05 | ~$0.50 | ~$2.50 |
| Nanobanana High | ~$0.10 | ~$1.00 | ~$5.00 |
| Nanobanana Premium | ~$0.15 | ~$1.50 | ~$7.50 |

**Recommendation**: Start with Unsplash, only generate custom images for truly unique needs.

---

## By Website Section

| Section | Default | When to Use AI |
|---------|---------|----------------|
| Hero | Unsplash | Brand-specific scene needed |
| Products | AI (if custom product) | Always for unique products |
| About | Unsplash | Custom illustration wanted |
| Features | Unsplash | Custom icons/illustrations |
| Testimonials | Real photos | Avatar placeholders only |
| Blog | Unsplash | Unique article illustrations |
| Background | Unsplash | Exact brand colors needed |
| Footer | Unsplash | Custom pattern needed |

---

## Decision Flowchart

```
START: Need an image for website
         │
         ▼
    Does a suitable free
    stock image exist?
         │
    ┌────┴────┐
    │         │
   YES        NO
    │         │
    ▼         ▼
 Unsplash    Is it a product
             that doesn't exist?
                  │
             ┌────┴────┐
             │         │
            YES        NO
             │         │
             ▼         ▼
        Nanobanana   Does it need
                     exact branding?
                          │
                     ┌────┴────┐
                     │         │
                    YES        NO
                     │         │
                     ▼         ▼
                Nanobanana  Search Unsplash
                            harder, then AI
```

---

## Unsplash Integration

For free images, use Unsplash Source API:

```jsx
// Random by topic
<img src="https://source.unsplash.com/1920x1080/?food,healthy" />

// Specific photo by ID
<img src="https://source.unsplash.com/PHOTO_ID/1920x1080" />

// In Next.js (add to next.config.js)
images: {
  domains: ['source.unsplash.com', 'images.unsplash.com'],
}
```

---

## Hybrid Approach

Best practice for websites:

1. **Start with Unsplash** for all placeholders
2. **Identify unique needs** during development
3. **Generate AI images** only for specific requirements
4. **Replace placeholders** with custom images where needed

This minimizes cost while maximizing quality where it matters.

---

## Questions to Ask

Before generating an AI image, ask yourself:

1. "Can I find this on Unsplash?" → Search first
2. "Is this truly unique to this project?" → If generic, use stock
3. "Will the user see the difference?" → If not, save money
4. "Is this a one-time or reusable image?" → Consider value
5. "Does the client specifically want custom?" → Follow their preference
