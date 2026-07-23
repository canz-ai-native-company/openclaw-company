# Visual Guide 1 — Analytical Blue  
**Rating:** 9.7/10  

## Typography  
- Headings: Poppins SemiBold, weights 600 (H1: 40px, H2: 28px, H3: 20px, H4: 18px)  
- Paragraphs: Inter Regular, weight 400 (16px body, 14px captions/metadata)  

## Colors  
- Primary: #1B4F72 (Brand headings, primary CTA background)  
- Secondary: #2874A6 (Link hover, secondary button background)  
- Background: #FFFFFF (Main page background)  
- Surface: #F8FAFC (Alternate section backgrounds)  
- Text Primary: #1F2933 (Body text)  
- Text Secondary: #6B7280 (Metadata, captions, form hints)  
- Border: #E5E7EB (Cards, tables, dividers)  
- Success: #10B981 (Success states)  
- Error: #EF4444 (Error states)  

## Layout  
- Grid: 12-column, mobile-first with 16px gutters on mobile, 24px gutters on desktop  
- Gutter: 16px mobile, 24px desktop  
- Max container width: ~1200px (centered) on desktop  
- Section spacing: ~80px vertical margin between major page sections  

## Buttons  
- Primary Default: background #1B4F72, text #FFFFFF  
- Primary Hover: background #2874A6  
- Primary Active: background #145374 (20% darker)  
- Primary Disabled: background #A3B3C1, text #6B7280  
- Secondary Default: background transparent, border #2874A6, text #2874A6  
- Secondary Hover: background #E5F0FA, border #1B4F72, text #1B4F72  
- Secondary Active: background #C0D8F3, border #145374, text #145374  
- Secondary Disabled: background transparent, border #A3B3C1, text #A3B3C1  
- Focus: 3px solid #F59E0B outline (visible on keyboard focus only)  
- Keyboard navigation: Focus visible on tab focus with distinct orange outline; keyboard trap avoided; logical tab order for all interactive elements  

## Motion  
- Default: 200ms ease-in-out transitions on hover/active states for buttons and link color  
- Reduce Motion: media query prefers-reduced-motion detected - disable transitions and animations, fade instant  

## Accessibility  
- Contrast ratio: All text and buttons maintain minimum WCAG AA (contrast ratio > 4.5:1)  
- Focus indicators: Consistent orange outline (#F59E0B) on keyboard focus for all controls  
- Keyboard navigation: Complete keyboard operability including nav menu, accordions, and forms  
- Reduced-motion: Preference respected; animations removed or simplified for motion sensitivity  

## Asset Checklist  
- Logo: primary horizontal (SVG + PNG), stacked version, monochrome version, favicon set (ICO, PNG 32x32, 16x16)  
- Color tokens documentation with hex and RGB values  
- Typography stylesheets for Poppins and Inter (woff2, woff, ttf)  
- Components: Header (desktop/mobile), Hero section variants, Trust band (logo strip), KPI cards, Service cards, Process timeline, Testimonials module, Pricing cards, Comparison tables, Case study tiles, Blog cards, Footer  
- Forms: Contact, audit request, newsletter sign-up; full state variants (default, focus, error, success)  
- Icons/illustrations: lifecycle icons set, results icons set (SVG, optimized)  
- Imagery: Licensed DTC lifecycle photos and contextual shots  
- Data visualization assets: charts styled in brand colors (bar, line), with labeling templates  
- Page templates: Home, Solutions, Results/Case Studies, Pricing, Resources, Contact  
- Email templates: announcement, newsletter, case study highlight  
- Social/ad assets: 1:1, 4:5, 9:16 format sets with CTA overlays and safe margins  
- Documentation: Accessibility checklist, spacing scale (8px base), grid specs  

---

# Visual Guide 2 — Clean Slate  
**Rating:** 9.6/10  

## Typography  
- Headings: Montserrat SemiBold, weights 600 (H1: 38px, H2: 26px, H3: 20px, H4: 18px)  
- Paragraphs: Roboto Regular, weight 400 (16px body, 14px small text and captions)  

## Colors  
- Primary: #1B4F72 (Brand and primary CTAs)  
- Secondary: #2874A6 (Links and secondary CTAs)  
- Background: #FFFFFF (Default background)  
- Surface: #F3F4FF (Light highlight background for data and cards)  
- Text Primary: #1F2933 (Main text)  
- Text Secondary: #6B7280 (Secondary text, metadata)  
- Border: #E5E7EB (Borders and separators)  
- Success: #10B981 (Success highlights)  
- Error: #EF4444 (Error highlights)  

## Layout  
- Grid: 12-column mobile-first grid with 20px gutters on mobile, 24px on desktop  
- Gutter: 20px mobile, 24px desktop  
- Max container width: ~1200px fixed width with horizontal centering on desktop  
- Section spacing: ~80px vertical padding between blocks  

## Buttons  
- Primary Default: background #1B4F72, text #FFFFFF, border none  
- Primary Hover: background #164664  
- Primary Active: background #123A55  
- Primary Disabled: background #9CA3AF, text #6B7280  
- Secondary Default: transparent background, border #2874A6, text #2874A6  
- Secondary Hover: background #E1E9F5, border #1B4F72, text #1B4F72  
- Secondary Active: background #BED1F0, border #164664, text #164664  
- Secondary Disabled: transparent background, border #9CA3AF, text #9CA3AF  
- Focus: 4px solid #f59e0b focus ring with 4px padding on all interactive elements; visible on keyboard focus only  
- Keyboard navigation: Logical tab order, all buttons and links accessible via keyboard; skip-links implemented for main nav and main content  

## Motion  
- Default: 150ms ease-in-out fade transition on hover states for buttons and nav link color  
- Reduce Motion: prefers-reduced-motion media query disables all animations and transitions immediately  

## Accessibility  
- Contrast ratio: All text meets WCAG AA minimum contrast ratios (>4.5:1)  
- Focus indicators: High-visibility orange (#F59E0B) focus ring applied on keyboard focus on all controls and links  
- Keyboard navigation: Full keyboard support for menus, modals, form controls, and navigation  
- Reduced-motion: System preference honored, disabling all non-essential animations and transitions  

## Asset Checklist  
- Logos: full color horizontal and vertical (SVG + PNG 300dpi), monochrome black and white versions, favicon set (ico and standard PNG)  
- Color palette tokens with hex/RGB and usage notes included  
- Typography resources: Montserrat and Roboto font files with weights for web and print  
- UI components: Sticky header (desktop/mobile), hero variants, client logo trust band, KPI cards, service cards, lifecycle process diagram, testimonial carousel, pricing cards, feature comparison tables, case study tiles, blog snippet cards, footer variants  
- Forms: audit request, contact form, newsletter signup with full visual states  
- Icons and illustrations: Minimal stroke icons and lifecycle illustrations (SVG optimized)  
- Photography: Curated photos emphasizing DTC lifecycle and brand impact with alt text descriptions  
- Data visualizations: Branded bar/line charts with axes and data labels in brand colors  
- Page templates: Home, Solutions, Results, Pricing, Resources, Contact pages scaffolded  
- Email designs: Announcement, newsletter, and case study highlight templates in HTML/CSS  
- Social and digital ads: Templates for 1:1, 4:5, and 9:16 with CTAs and safe zone markings  
- Documentation: Accessibility conformance checklist, grid specs, spacing scale (8px base)  

