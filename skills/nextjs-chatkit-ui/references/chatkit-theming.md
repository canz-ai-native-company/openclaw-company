# ChatKit Theme Configuration

Custom theme configuration for ChatKit widget. By default, no theme config is needed.

---

## When to Add Theme

Only add theme config when user requests:
- Custom brand colors
- Dark mode
- Custom fonts
- Specific styling

**Default behavior (no theme):** ChatKit uses its built-in light theme.

---

## Complete Working Theme Pattern

```typescript
theme: {
  colorScheme: 'light',           // 'light' or 'dark'
  radius: 'pill',                 // 'none', 'sm', 'md', 'lg', 'pill'
  density: 'normal',              // 'compact', 'normal', 'spacious'
  color: {
    grayscale: {                  // REQUIRED - DO NOT SKIP
      hue: 0,
      tint: 0,
    },
    accent: {                     // REQUIRED - DO NOT SKIP
      primary: '#121212',         // Button/accent color
      level: 1,
    },
    surface: {                    // REQUIRED - DO NOT SKIP
      background: '#ffffff',      // Chat background
      foreground: '#ffffff',      // Message bubbles
    },
  },
  typography: {
    baseSize: 16,
    fontFamily: '"OpenAI Sans", system-ui, sans-serif',
    fontFamilyMono: 'ui-monospace, monospace',
    fontSources: [                // Keep to 1-2 fonts MAX
      {
        family: 'OpenAI Sans',
        src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2',
        weight: 400,
        style: 'normal',
        display: 'swap',
      },
    ],
  },
},
```

---

## Theme Rules - MUST FOLLOW

| Property | Status | Issue if Missing |
|----------|--------|------------------|
| `color.grayscale` | REQUIRED | Blank screen |
| `color.accent` | REQUIRED | Blank screen |
| `color.surface` | REQUIRED | Blank screen |
| `fontSources` | Max 1-2 fonts | Performance issues |
| Incomplete `color` object | FORBIDDEN | Blank screen |

---

## Theme Colors by Niche

| Niche | colorScheme | surface.background | accent.primary |
|-------|-------------|-------------------|----------------|
| Beauty/Skincare | light | #fbeff7 (pink) | #121212 (black) |
| Travel | light | #e6f2ff (sky blue) | #1e71ea (blue) |
| Fitness | dark | #1a1a1a (dark) | #FF4500 (orange) |
| Real Estate | light | #f5f5f5 (light gray) | #1B3A6B (navy) |
| Restaurant | light | #fff8f0 (cream) | #D4380D (red) |
| Education | light | #f0f4ff (light blue) | #1E3A8A (deep blue) |
| E-commerce | light | #ffffff (white) | #2563eb (blue) |
| Medical | light | #f0fdf4 (mint) | #059669 (green) |
| SaaS | light | #fafafa (gray) | #6366f1 (indigo) |

---

## Example: Beauty/Skincare Theme

```typescript
chatkit.setOptions({
  api: { /* ... */ },
  startScreen: { /* ... */ },
  theme: {
    colorScheme: 'light',
    radius: 'lg',
    density: 'normal',
    color: {
      grayscale: { hue: 350, tint: 0.05 },
      accent: { primary: '#121212', level: 1 },
      surface: {
        background: '#fbeff7',
        foreground: '#ffffff',
      },
    },
  },
});
```

---

## Example: Fitness Dark Theme

```typescript
chatkit.setOptions({
  api: { /* ... */ },
  startScreen: { /* ... */ },
  theme: {
    colorScheme: 'dark',
    radius: 'md',
    density: 'normal',
    color: {
      grayscale: { hue: 0, tint: 0 },
      accent: { primary: '#FF4500', level: 1 },
      surface: {
        background: '#1a1a1a',
        foreground: '#2d2d2d',
      },
    },
  },
});
```

---

## Common Mistakes

### WRONG - Missing grayscale and accent

```typescript
// WRONG
theme: {
  colorScheme: 'light',
  color: {
    surface: { background: '#ffffff', foreground: '#ffffff' }
  }
}
```

### WRONG - Too many fontSources

```typescript
// WRONG
theme: {
  typography: {
    fontSources: [ /* 8 different fonts */ ]
  }
}
```

### CORRECT - Always include all three color properties

```typescript
// CORRECT
theme: {
  colorScheme: 'light',
  color: {
    grayscale: { hue: 0, tint: 0 },           // Required
    accent: { primary: '#1e71ea', level: 1 }, // Required
    surface: { background: '#fff', foreground: '#fff' }, // Required
  },
}
```

---

## Matching Tailwind Theme

When using custom theme, align ChatKit colors with Tailwind config:

| Tailwind | ChatKit | Purpose |
|----------|---------|---------|
| `primary-600` | `accent.primary` | Buttons, links, accents |
| `gray-50` | `surface.foreground` | Message bubbles |
| `white` / `gray-900` | `surface.background` | Chat background |
