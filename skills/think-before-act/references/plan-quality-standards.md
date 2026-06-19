# Plan Quality Standards

Mandatory standards for each project type. Plans MUST meet these — verified in Phase 5.

---

## Website Plan Standards

### A. Design System (MANDATORY)

From theme-factory + design-system references:

```
Primary Color:   Full 50-950 scale (11 shades)
Accent Color:    Full 50-950 scale
Background:      Light sections + dark sections (alternating)
Typography:
  - Heading font: [specific font name]
  - Body font: [specific font name]
  - Fluid sizes: clamp() based
Spacing:         8px grid system (4, 8, 12, 16, 24, 32, 48, 64, 96, 128)
Shadows:         5-level system (xs, sm, md, lg, xl)
Border Radius:   Token set (sm, md, lg, full)
```

**NOT acceptable**: "Use blue theme" or "Modern design"

### B. Sections (MINIMUM 12-15)

From section-components reference. Each section MUST have:

| Detail | Required | Example |
|--------|----------|---------|
| Section name | Yes | "Hero" |
| Purpose | Yes | "First impression, value proposition" |
| Specific animation | Yes | "TextReveal headline, floating gradient orbs" |
| Content outline | Yes | "Headline: 'Fresh From Our Oven', subtext, CTA" |
| Layout notes | Yes | "Full-width, centered content, stats strip below" |

**Section Types to Choose From**:

1. Hero (TextReveal + AnimatedButton + gradient orbs)
2. Features/Services (StaggeredList + hover transforms)
3. About/Story (ScrollReveal + parallax image)
4. Testimonials (carousel + fade transitions)
5. Pricing (AnimatedCounter + toggle annual/monthly)
6. FAQ (accordion + smooth expand)
7. CTA/Contact (form + floating labels)
8. Gallery/Portfolio (masonry + lightbox)
9. Team (grid + hover flip cards)
10. Stats/Numbers (AnimatedCounter + scroll-triggered)
11. Process/How It Works (timeline + step animations)
12. Blog/News (card grid + hover effects)
13. Partners/Logos (infinite scroll marquee)
14. Newsletter (input + animated submit)
15. Footer (multi-column + social links)
16. Navigation (sticky + blur backdrop + mobile drawer)
17. Video/Demo (modal player + thumbnail)

**NOT acceptable**: 6-7 generic sections with "Add animation here"

### C. SEO (MANDATORY)

From seo-performance reference:

- [ ] JSON-LD structured data (LocalBusiness/Organization/Product)
- [ ] Open Graph meta tags (title, description, image)
- [ ] Twitter Card meta tags
- [ ] Sitemap.xml generation
- [ ] Robots.txt
- [ ] Image optimization strategy (next/image, WebP, lazy load)
- [ ] Font loading strategy (next/font, display: swap)
- [ ] Semantic HTML (header, main, nav, section, article, footer)

### D. Responsive (MANDATORY)

From responsive-patterns reference:

- [ ] Mobile navigation (hamburger/drawer with AnimatePresence)
- [ ] Touch targets (minimum 44x44px)
- [ ] Fluid typography (clamp-based)
- [ ] Mobile-specific layouts (stack instead of grid)
- [ ] Sticky mobile CTA
- [ ] Breakpoints: mobile (< 640px), tablet (640-1024px), desktop (> 1024px)

### E. Copy/Content (NICHE-SPECIFIC)

From copy-guide reference:

| Element | Must Be | NOT |
|---------|---------|-----|
| Headlines | Niche-specific | "Welcome to our website" |
| CTAs | Action-oriented | "Click here" |
| Features | Benefit-focused | "Feature 1, Feature 2" |
| Testimonials | Realistic quotes | "Great service!" |
| About | Story-driven | "We are a company" |

**Example — Bakery**:
- Hero: "Freshly Baked, Made with Love Since 2010"
- CTA: "Order Your Custom Cake"
- Feature: "Artisan Sourdough, baked fresh every morning at 5 AM"

---

## Agent Plan Standards

### A. Agent Architecture (MANDATORY)

From agent-builder-V5 references + Context7 OpenAI Agents SDK:

```python
# Agent definition pattern (from Context7)
from agents import Agent, Runner

agent = Agent(
    name="[Agent Name]",
    instructions="[System prompt — personality + rules]",
    model="gpt-4o",
    tools=[tool1, tool2],
    handoffs=[specialist_agent],  # if multi-agent
)
```

Plan must include:
- Agent name + personality description
- Model selection + reasoning
- System prompt outline (key instructions)
- Tool list with descriptions

### B. Tools (MANDATORY)

Each tool must specify:

| Field | Example |
|-------|---------|
| Name | `lookup_drug` |
| Description | "Search drug database for information" |
| Parameters | `drug_name: str` |
| Return Type | `DrugInfo(name, dosage, interactions)` |
| Error Handling | "Returns 'not found' message if unknown" |

### C. Guardrails (MANDATORY)

From agent-builder references:

| Type | Purpose | Example |
|------|---------|---------|
| Input Guardrail | Validate user input | Block jailbreak attempts |
| Output Guardrail | Validate agent output | Ensure medical disclaimer |
| Emergency | Short-circuit dangerous inputs | "suicide", "self-harm" → helpline |

### D. Memory (MANDATORY)

From Context7 OpenAI Agents SDK:

```python
# SQLiteSession pattern (from Context7)
from agents import SQLiteSession

session = SQLiteSession("conversation_123", "history.db")
result = await Runner.run(agent, user_input, session=session)
```

Plan must specify:
- Session type: SQLiteSession (simple) / Redis (production)
- What to persist: conversation history, user preferences, context
- Session ID strategy: user-based, conversation-based

### E. Multi-Agent Handoffs (IF APPLICABLE)

Two patterns from Context7:

**Manager Pattern** (central orchestrator):
```python
customer_agent = Agent(
    tools=[
        booking_agent.as_tool(tool_name="booking_expert", ...),
        refund_agent.as_tool(tool_name="refund_expert", ...),
    ],
)
```

**Handoffs Pattern** (peer-to-peer):
```python
triage_agent = Agent(
    handoffs=[billing_agent, tech_support_agent],
)
```

Plan must specify which pattern and why.

### F. API Design (MANDATORY for deployed agents)

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/chat` | Send message to agent | API key |
| GET | `/api/chat/:id/history` | Get conversation | API key |
| POST | `/api/chat/:id/feedback` | Rate response | API key |
| GET | `/api/health` | Health check | None |

### G. Database (MANDATORY for persistent agents)

```prisma
// From Context7 Prisma patterns
model Conversation {
  id        String    @id @default(uuid())
  userId    String
  messages  Message[]
  createdAt DateTime  @default(now())
}

model Message {
  id             String       @id @default(uuid())
  conversationId String
  conversation   Conversation @relation(fields: [conversationId], references: [id])
  role           String       // "user" | "assistant"
  content        String
  createdAt      DateTime     @default(now())
}
```

---

## Full-Stack Plan Standards

Full-stack = Website Standards + Agent/Backend Standards combined.

Additional requirements:
- How frontend connects to backend (API calls, Server Actions)
- Shared types between frontend and backend
- Authentication flow across both layers
- Real-time updates strategy (if needed)

---

## Quality Verification Checklist

### Website Plans — ALL must pass

- [ ] Design system: colors (50-950), fonts (2), spacing (8px grid), shadows (5 levels)
- [ ] Sections: 12+ listed with name, purpose, specific animation, content outline
- [ ] SEO: JSON-LD, OG tags, sitemap, robots.txt, image optimization
- [ ] Responsive: mobile nav, touch targets, fluid typography, breakpoints
- [ ] Copy: niche-specific headlines, CTAs, feature descriptions
- [ ] File structure: complete tree, every file with purpose
- [ ] Animations: specific animation type per section (not "add animation")
- [ ] TDD: test files listed with specific test cases
- [ ] Pre-implementation checklist included

### Agent Plans — ALL must pass

- [ ] Agent: name, personality, model, system prompt outline
- [ ] Tools: each with name, description, parameters, return type
- [ ] Guardrails: input + output + emergency
- [ ] Memory: session type, what to persist, session ID strategy
- [ ] Handoffs: pattern specified (if multi-agent)
- [ ] API: endpoints listed with methods, auth, rate limits
- [ ] Database: schema with models, relations, migrations
- [ ] Safety: input validation, PII handling, disclaimers
- [ ] TDD: test files listed with specific test cases
- [ ] Pre-implementation checklist included

**If ANY checkbox fails → fix before presenting plan**
