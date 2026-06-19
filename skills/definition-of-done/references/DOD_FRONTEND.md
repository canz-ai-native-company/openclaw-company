# Definition of Done - Frontend

Quality gates specific to frontend/UI development tasks.

---

## Applicability

Use this checklist when changes include:
- React/Vue/Svelte components
- CSS/SCSS/Tailwind styles
- Client-side JavaScript/TypeScript
- Static assets (images, fonts, icons)
- UI state management

---

## Code Quality

### Component Standards
- [ ] ESLint passes (0 errors, 0 warnings)
- [ ] TypeScript compiles (0 errors)
- [ ] Prettier formatted
- [ ] No `console.log` statements

### Component Architecture
- [ ] Components follow single responsibility
- [ ] Props properly typed
- [ ] Default props where appropriate
- [ ] Component names are descriptive

### State Management
- [ ] State lifted to appropriate level
- [ ] No prop drilling (use context/store if deep)
- [ ] Derived state computed, not stored
- [ ] No unnecessary re-renders

### Performance
- [ ] Large lists virtualized
- [ ] Images optimized (WebP, lazy loading)
- [ ] Memoization used where beneficial
- [ ] No memory leaks (cleanup in useEffect)

---

## Testing

### Unit Tests
- [ ] Component unit tests pass
- [ ] Props and state changes tested
- [ ] Event handlers tested
- [ ] Edge cases covered

### Integration Tests
- [ ] Component integration tested
- [ ] State management tested
- [ ] API mocks realistic

### Visual/E2E Tests
- [ ] E2E tests pass (if applicable)
- [ ] Visual regression checked
- [ ] Critical user flows covered

### Coverage
- [ ] Test coverage maintained
- [ ] New components have tests

---

## UX States (Critical for Frontend)

### Loading States
- [ ] Loading spinners/skeletons present
- [ ] Buttons show loading state during actions
- [ ] Progress indicators for uploads/long operations
- [ ] Optimistic UI where appropriate

### Error States
- [ ] Form validation errors displayed
- [ ] API error messages shown
- [ ] Retry buttons where applicable
- [ ] Error boundaries catch crashes

### Empty States
- [ ] Empty state UI for lists/grids
- [ ] Helpful messaging in empty states
- [ ] Call-to-action buttons
- [ ] Illustration/icon for visual appeal

### Success States
- [ ] Success confirmations (toast/modal/inline)
- [ ] Clear feedback on form submission
- [ ] Appropriate success animations

### Edge Cases
- [ ] Long text handled (truncation/wrap)
- [ ] Missing images have fallbacks
- [ ] Null/undefined data handled

---

## Accessibility (A11y)

### Keyboard Navigation
- [ ] All interactive elements focusable
- [ ] Tab order logical
- [ ] Focus visible on all elements
- [ ] Keyboard shortcuts documented (if any)

### Screen Readers
- [ ] Semantic HTML used
- [ ] ARIA labels on icons/buttons
- [ ] Alt text on images
- [ ] Form labels associated

### Visual
- [ ] Color contrast meets WCAG AA
- [ ] Not relying on color alone
- [ ] Text resizable without breaking layout
- [ ] Animations can be disabled (prefers-reduced-motion)

---

## Responsive Design

### Breakpoints
- [ ] Mobile layout works (320px+)
- [ ] Tablet layout works (768px+)
- [ ] Desktop layout works (1024px+)
- [ ] Large screens handled (1440px+)

### Touch
- [ ] Touch targets minimum 44x44px
- [ ] Swipe gestures work (if applicable)
- [ ] No hover-only interactions

---

## Browser Compatibility

- [ ] Chrome (latest) tested
- [ ] Firefox (latest) tested
- [ ] Safari (latest) tested
- [ ] Edge (latest) tested
- [ ] Mobile browsers tested (if required)

---

## Security

- [ ] No sensitive data in client-side code
- [ ] User input sanitized before display (XSS)
- [ ] No secrets in frontend bundle
- [ ] HTTPS enforced for API calls

---

## Build

- [ ] Production build passes
- [ ] No build warnings
- [ ] Bundle size acceptable
- [ ] Assets properly hashed for caching
- [ ] Source maps configured appropriately

---

## Documentation

- [ ] Component props documented (Storybook/TSDoc)
- [ ] Complex UI logic commented
- [ ] README updated (if new component pattern)

---

## Quick Verification Commands

```bash
# Code Quality
npm run lint
npm run typecheck
npx prettier --check "src/**/*.{ts,tsx,css}"

# Testing
npm test -- --coverage
npm run test:e2e

# Build
npm run build
npx bundlesize  # if configured

# A11y Check
npx axe-cli http://localhost:3000
```

---

## Frontend-Specific Gates

| Gate | Required | Notes |
|------|----------|-------|
| Loading states | Yes | Every async operation |
| Error states | Yes | Every failure point |
| Empty states | Yes | Every list/collection |
| Mobile responsive | Yes | All new components |
| A11y basics | Yes | Labels, contrast, keyboard |
| E2E tests | If UI flow | Critical paths |

---

## Sign-off

```
Task: ________________________________
Components changed: __________________
Date: ________________________________

[ ] All UX states handled
[ ] Accessibility verified
[ ] Responsive design checked
[ ] Ready for review
```
