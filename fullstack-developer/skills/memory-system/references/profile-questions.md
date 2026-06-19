# Profile Questions Guide

Questions to extract client preferences for CLIENT_PROFILE.md.

---

## Communication Preferences

### Language
- "What language do you prefer for communication?"
- Options: English / Urdu / Roman Urdu / Mixed

### Tone
- "How formal should responses be?"
- Options: Formal / Casual / Technical / Friendly

### Response Length
- "Do you prefer short answers or detailed explanations?"
- Options: Short / Medium / Detailed

### Explanation Level
- "How technical should explanations be?"
- Options: Beginner / Intermediate / Expert

---

## Technical Preferences

### Frontend
- "What frontend framework do you use?"
- Options: Next.js / React / Vue / None

### Backend
- "What backend framework do you prefer?"
- Options: FastAPI / Express / Django / None

### Database
- "What database do you typically use?"
- Options: PostgreSQL / MySQL / MongoDB / SQLite

### Styling
- "What CSS approach do you prefer?"
- Options: Tailwind CSS / CSS Modules / SCSS / Styled Components

### Language
- "TypeScript or JavaScript?"
- Options: TypeScript / JavaScript

---

## Design Preferences

### Colors
- "What are your brand colors?"
- Ask for: Primary, Secondary, Accent (hex codes)

### Style
- "What design style do you prefer?"
- Options: Modern / Classic / Playful / Minimalist

### Font
- "Any font preferences?"
- Ask for: Font family name or style

---

## Business Context

### Industry
- "What industry is your business in?"
- Examples: Restaurant / Medical / SaaS / E-commerce

### Type
- "Is your business B2B, B2C, or both?"
- Options: B2B / B2C / Both

### Audience
- "Who is your target audience?"
- Free text description

---

## Implicit Preference Detection

Watch for these signals to update profile:

| Signal | Preference to Update |
|--------|---------------------|
| User corrects tone | Update Communication > Tone |
| User asks to simplify | Update Explanation Level |
| User mentions "always use X" | Update Technical preferences |
| User says "I dont like Y" | Add to Avoid section |
| User shares color code | Update Brand > Colors |

---

## Initial Profile Template

```markdown
# Client Profile: [Name]

**Created:** [Date]
**Last Updated:** [Date]

---

## Communication Preferences

| Aspect | Preference |
|--------|------------|
| **Language** | [TBD] |
| **Tone** | [TBD] |
| **Response Length** | [TBD] |
| **Explanation Level** | [TBD] |

---

## Technical Preferences

| Aspect | Preference |
|--------|------------|
| **Frontend** | [TBD] |
| **Backend** | [TBD] |
| **Database** | [TBD] |
| **Styling** | [TBD] |
| **Language** | [TBD] |

---

## Brand & Design

| Aspect | Value |
|--------|-------|
| **Primary Color** | [TBD] |
| **Secondary Color** | [TBD] |
| **Accent Color** | [TBD] |
| **Font Style** | [TBD] |

---

## Business Context

| Aspect | Value |
|--------|-------|
| **Industry** | [TBD] |
| **Business Type** | [TBD] |
| **Target Audience** | [TBD] |

---

## Avoid (Things Client Does Not Like)

- [To be learned]

---

## Special Instructions

- [To be learned]

---

## Projects History

| Project | Date | Type | Status |
|---------|------|------|--------|
| | | | |
```
