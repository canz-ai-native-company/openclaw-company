# Next.js Layout Patterns Reference

Advanced layout patterns for professional websites beyond basic single-column.

---

## Bento Grid (Asymmetric Card Layout)

Modern card layout with varying sizes. Great for features, portfolios, dashboards.

```tsx
// Bento grid — mixed sizes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Large card — spans 2 columns */}
  <div className="md:col-span-2 rounded-2xl bg-gray-900 text-white p-8 min-h-[300px]">
    <h3>Primary Feature</h3>
    <p>Description</p>
  </div>

  {/* Standard card */}
  <div className="rounded-2xl bg-gray-50 p-8 min-h-[300px]">
    <h3>Feature 2</h3>
  </div>

  {/* Standard card */}
  <div className="rounded-2xl bg-primary-50 p-8 min-h-[300px]">
    <h3>Feature 3</h3>
  </div>

  {/* Wide card — spans 2 columns */}
  <div className="md:col-span-2 rounded-2xl bg-gray-50 p-8 min-h-[250px]">
    <h3>Feature 4</h3>
  </div>
</div>
```

### Bento Variations

```tsx
// 4-column bento with featured large card
<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
  <div className="col-span-2 row-span-2 rounded-2xl bg-gray-900 text-white p-8">
    {/* Hero card */}
  </div>
  <div className="rounded-2xl bg-gray-50 p-6">{/* Small */}</div>
  <div className="rounded-2xl bg-gray-50 p-6">{/* Small */}</div>
  <div className="col-span-2 rounded-2xl bg-primary-50 p-6">{/* Wide */}</div>
</div>
```

---

## Split Screen (50/50 Layout)

Content on one side, visual on the other. Alternates direction per section.

```tsx
// Split section — image left, content right
<section className="py-section lg:py-section-lg">
  <div className="container mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* Image side */}
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
        <Image src="/feature.jpg" alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
      </div>

      {/* Content side */}
      <div>
        <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Feature</span>
        <h2 className="mt-2 text-h2 text-gray-900">Feature Heading</h2>
        <p className="mt-4 text-body-lg text-gray-600">Description paragraph</p>
        <ul className="mt-6 space-y-3">
          {/* Bullet points with check icons */}
        </ul>
        <Button className="mt-8">Learn More</Button>
      </div>
    </div>
  </div>
</section>

// Next split section — REVERSE order (content left, image right)
<section className="py-section lg:py-section-lg bg-gray-50">
  <div className="container mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      {/* Content side FIRST (appears left) */}
      <div>
        <h2 className="text-h2">...</h2>
      </div>

      {/* Image side SECOND (appears right) */}
      <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:order-none order-first">
        <Image src="/feature2.jpg" alt="" fill className="object-cover" sizes="50vw" />
      </div>
    </div>
  </div>
</section>
```

---

## Full-Width / Contained Alternation

Alternate between full-bleed backgrounds and contained content for visual rhythm.

```tsx
{/* Full-bleed dark section */}
<section className="bg-gray-900 text-white">
  <div className="container mx-auto px-4 py-section lg:py-section-lg">
    {/* Contained content within full-bleed background */}
  </div>
</section>

{/* Contained card floating over background transition */}
<section className="relative">
  <div className="absolute top-0 left-0 right-0 h-1/2 bg-gray-900" />
  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
  <div className="container relative mx-auto px-4">
    <div className="bg-white rounded-3xl shadow-floating p-8 lg:p-12">
      {/* Card content that bridges two background colors */}
    </div>
  </div>
</section>
```

---

## Overlapping Sections

Cards or elements that visually cross section boundaries.

```tsx
{/* Section with overlapping cards below */}
<section className="bg-primary-600 text-white pt-section lg:pt-section-lg pb-32 lg:pb-40">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-h2">Section Title</h2>
    <p className="mt-4 text-primary-100">Subtitle</p>
  </div>
</section>

{/* Cards that overlap into previous section */}
<section className="bg-white -mt-20 lg:-mt-24 relative z-10 pb-section lg:pb-section-lg">
  <div className="container mx-auto px-4">
    <div className="grid md:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-2xl shadow-elevated p-8">
          {/* Card content */}
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## Sticky Sidebar with Scrollable Content

For service pages, documentation, or long-form pages.

```tsx
<section className="py-section lg:py-section-lg">
  <div className="container mx-auto px-4">
    <div className="grid lg:grid-cols-12 gap-12">
      {/* Sticky sidebar */}
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-24">
          <h2 className="text-h2">Our Services</h2>
          <p className="mt-4 text-gray-600">Description</p>
          <nav className="mt-8 space-y-2">
            {services.map((s) => (
              <a key={s.id} href={`#${s.id}`}
                className="block px-4 py-2 rounded-lg text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="lg:col-span-8 space-y-16">
        {services.map((s) => (
          <div key={s.id} id={s.id}>
            <h3 className="text-h3">{s.title}</h3>
            <p className="mt-4 text-gray-600">{s.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>
```

---

## Z-Pattern / F-Pattern Awareness

### Z-Pattern (Landing Pages)

Users scan in a Z shape. Place key elements along this path:

```
┌─────────────────────────────┐
│ LOGO              NAV  CTA  │  ← Top bar (left-to-right)
│                             │
│     HEADLINE                │  ← Diagonal scan
│         SUBTEXT             │
│                             │
│ IMAGE          CTA BUTTON   │  ← Bottom (left-to-right)
└─────────────────────────────┘
```

### F-Pattern (Content-Heavy Pages)

Users scan in F shape on text-heavy pages:

```
┌─────────────────────────────┐
│ ████████████████████████    │  ← Full width scan (heading)
│ ██████████████              │  ← Shorter scan (subheading)
│ ████████                    │  ← Short scan (begin scanning)
│ ████                        │  ← Trailing off
│ █████████████               │  ← Catches on visual element
└─────────────────────────────┘
```

**Application:**
- Place CTAs at Z-pattern endpoints
- Use headings + subheadings to catch F-pattern scanners
- Break long content with images/cards to restart scan pattern

---

## Negative Space (Whitespace) Guidelines

```
Between sections:       80-112px (py-section / py-section-lg)
Section header → content: 48-64px (mb-12 lg:mb-16)
Between cards in grid:  24-32px (gap-6 lg:gap-8)
Between text blocks:    16-24px (mt-4 / mt-6)
Inside cards:           32px (p-8)
Page edge padding:      16-32px (px-4 lg:px-8)
```

**Rule:** When in doubt, add MORE whitespace. Cramped = unprofessional.

---

## Responsive Grid Cheat Sheet

```tsx
// 1 → 2 columns
"grid grid-cols-1 md:grid-cols-2 gap-6"

// 1 → 2 → 3 columns
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"

// 1 → 2 → 4 columns
"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"

// 2 → 4 columns (stats, small cards)
"grid grid-cols-2 md:grid-cols-4 gap-6"

// Sidebar layout (1/3 + 2/3)
"grid lg:grid-cols-3 gap-12"
// sidebar: lg:col-span-1, main: lg:col-span-2

// Wide sidebar (5/12 + 7/12)
"grid lg:grid-cols-12 gap-12"
// sidebar: lg:col-span-5, main: lg:col-span-7

// Auto-fit (flexible columns)
"grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6"
```
