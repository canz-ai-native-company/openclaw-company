# ChatKit CDN - Theme Customization Reference

Complete guide to customizing ChatKit appearance using the **CDN web component approach**.

**IMPORTANT: We ONLY use the CDN approach (`chatkit.setOptions()`), NOT the npm package (`@openai/chatkit-react`).**

---

## CDN Script URL

```html
<Script src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js" strategy="afterInteractive" />
```

---

## Complete ChatKitOptions Type (CDN)

```typescript
const options: ChatKitOptions = {
  api: {
    url: '/api/chatkit',  // Your project's backend endpoint
    fetch: async (url, init) => {
      return fetch(url, { ...init, credentials: 'include' });
    },
  },
  theme: {
    colorScheme: 'light' | 'dark' | 'system',
    radius: 'none' | 'sm' | 'md' | 'lg' | 'pill',
    density: 'compact' | 'normal' | 'spacious',
    color: {
      grayscale: { hue: number, tint: number },     // Controls gray tones
      accent: { primary: string, level: 1 | 2 | 3 }, // Brand color
      surface: {                                      // Background colors
        background: string,  // Main background
        foreground: string,  // Card/panel background
      },
    },
    typography: {
      baseSize: number,        // e.g. 16
      fontFamily: string,      // CSS font-family string
      fontFamilyMono: string,  // Monospace font-family
      fontSources: Array<{     // Custom font loading
        family: string,
        src: string,           // URL to .woff2 file
        weight: number,
        style: 'normal' | 'italic',
        display: 'swap' | 'fallback' | 'optional',
      }>,
    },
  },
  composer: {
    placeholder: string,       // Input placeholder text
    attachments: {
      enabled: boolean,        // Allow file uploads
    },
  },
  startScreen: {
    greeting: string,          // Welcome message (empty string = no greeting)
    prompts: Array<{
      icon: string,            // Icon name (see Available Icons below)
      label: string,           // Button label text
      prompt: string,          // Message sent when clicked
    }>,
  },
  // Optional fields:
  // locale, initialThread, threadItemActions, header, onClientTool, entities, widgets
};

chatkit.setOptions(options);
```

---

## Available Icons for Prompts

Use these icon names in `startScreen.prompts[].icon`:

- `circle-question` — Question mark in circle
- `lifesaver` — Help/support
- `info` — Information
- `lightning` — Quick action
- `book` — Documentation
- `code` — Technical/code
- `chart` — Analytics/data
- `question` — Simple question mark
- `settings` — Configuration
- `menu` — Menu icon

---

## Dark Theme Example (Complete)

```typescript
chatkit.setOptions({
  api: {
    url: '/api/chatkit',  // Your project's backend endpoint
  },
  theme: {
    colorScheme: 'dark',
    radius: 'pill',
    density: 'normal',
    typography: {
      baseSize: 16,
      fontFamily: '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
      fontFamilyMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
      fontSources: [
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2',
          weight: 400,
          style: 'normal',
          display: 'swap',
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Medium.woff2',
          weight: 500,
          style: 'normal',
          display: 'swap',
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-SemiBold.woff2',
          weight: 600,
          style: 'normal',
          display: 'swap',
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Bold.woff2',
          weight: 700,
          style: 'normal',
          display: 'swap',
        },
      ],
    },
  },
  composer: {
    placeholder: 'Ask me anything...',
    attachments: {
      enabled: false,
    },
  },
  startScreen: {
    greeting: '',
    prompts: [
      {
        icon: 'circle-question',
        label: 'How can you help me?',
        prompt: 'What can you help me with?',
      },
      {
        icon: 'lightning',
        label: 'Quick demo',
        prompt: 'Show me a quick demo of what you can do',
      },
      {
        icon: 'book',
        label: 'Learn more',
        prompt: 'Tell me more about your services',
      },
    ],
  },
});
```

---

## Light Theme Example (Complete)

```typescript
chatkit.setOptions({
  api: {
    url: '/api/chatkit',  // Your project's backend endpoint
  },
  theme: {
    colorScheme: 'light',
    radius: 'pill',
    density: 'normal',
    color: {
      surface: {
        background: '#e3e3f8',
        foreground: '#e8e8e8',
      },
    },
    typography: {
      baseSize: 16,
      fontFamily: '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif',
      fontFamilyMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", "Courier New", monospace',
      fontSources: [
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Regular.woff2',
          weight: 400,
          style: 'normal',
          display: 'swap',
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Medium.woff2',
          weight: 500,
          style: 'normal',
          display: 'swap',
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-SemiBold.woff2',
          weight: 600,
          style: 'normal',
          display: 'swap',
        },
        {
          family: 'OpenAI Sans',
          src: 'https://cdn.openai.com/common/fonts/openai-sans/v2/OpenAISans-Bold.woff2',
          weight: 700,
          style: 'normal',
          display: 'swap',
        },
      ],
    },
  },
  composer: {
    placeholder: 'Ask me anything...',
    attachments: {
      enabled: false,
    },
  },
  startScreen: {
    greeting: '',
    prompts: [
      {
        icon: 'circle-question',
        label: 'How can you help me?',
        prompt: 'What can you help me with?',
      },
      {
        icon: 'lightning',
        label: 'Quick demo',
        prompt: 'Show me a quick demo of what you can do',
      },
      {
        icon: 'book',
        label: 'Learn more',
        prompt: 'Tell me more about your services',
      },
    ],
  },
});
```

---

## Niche-Specific Theme Presets (CDN)

### MedSpa / Healthcare

```typescript
theme: {
  colorScheme: 'light',
  radius: 'pill',
  density: 'normal',
  color: {
    accent: { primary: '#059669', level: 2 },
    surface: { background: '#f0fdf4', foreground: '#ffffff' },
  },
},
startScreen: {
  greeting: 'Welcome! How can we help you today?',
  prompts: [
    { icon: 'circle-question', label: 'Book appointment', prompt: 'I want to book an appointment' },
    { icon: 'info', label: 'Our services', prompt: 'What services do you offer?' },
    { icon: 'lightning', label: 'Pricing', prompt: 'What are your prices?' },
  ],
},
```

### Real Estate

```typescript
theme: {
  colorScheme: 'dark',
  radius: 'lg',
  density: 'normal',
  color: {
    accent: { primary: '#2563EB', level: 2 },
  },
},
startScreen: {
  greeting: 'Find your dream property',
  prompts: [
    { icon: 'lightning', label: 'Search properties', prompt: 'I want to search for properties' },
    { icon: 'circle-question', label: 'Get pre-approved', prompt: 'How do I get pre-approved for a mortgage?' },
    { icon: 'book', label: 'Market insights', prompt: 'What are the current market trends?' },
  ],
},
```

### E-commerce

```typescript
theme: {
  colorScheme: 'light',
  radius: 'md',
  density: 'compact',
  color: {
    accent: { primary: '#EA580C', level: 2 },
    surface: { background: '#fff7ed', foreground: '#ffffff' },
  },
},
startScreen: {
  greeting: '',
  prompts: [
    { icon: 'lightning', label: 'Track my order', prompt: 'I want to track my order' },
    { icon: 'circle-question', label: 'Return policy', prompt: 'What is your return policy?' },
    { icon: 'info', label: 'Browse deals', prompt: 'Show me today\'s deals' },
  ],
},
```

---

## Property Reference

### radius values

| Value | Effect |
|-------|--------|
| `'none'` | Square corners (0px) |
| `'sm'` | Slight rounding (4px) |
| `'md'` | Medium rounding (8px) |
| `'lg'` | Large rounding (12px) |
| `'pill'` | Fully rounded (9999px) |

### density values

| Value | Effect |
|-------|--------|
| `'compact'` | Reduced padding, more content visible |
| `'normal'` | Standard spacing (recommended) |
| `'spacious'` | More breathing room |

### color.accent.level

| Level | Effect |
|-------|--------|
| `1` | Light, subtle accent |
| `2` | Balanced (default) |
| `3` | Bold, prominent |

### color.grayscale

Controls the gray tone of borders, backgrounds, and secondary text:

```typescript
color: {
  grayscale: {
    hue: 0,    // 0-360 (color wheel angle)
    tint: 0,   // 0-100 (how much color to mix into grays)
  },
},
```

### color.surface

Controls main background colors:

```typescript
color: {
  surface: {
    background: '#ffffff',  // Main page background
    foreground: '#f9f9f9',  // Card/panel background
  },
},
```

---

## Common Mistakes

| Mistake | Why It Fails | Fix |
|---------|-------------|-----|
| Using npm `@openai/chatkit-react` | Doesn't work with localhost/self-hosted backends | Use CDN: `cdn.platform.openai.com/deployments/chatkit/chatkit.js` |
| Using `radius: 'sharp'` / `'soft'` / `'round'` | These are npm values, not CDN | Use: `'none'` / `'sm'` / `'md'` / `'lg'` / `'pill'` |
| Using `density: 'relaxed'` | npm value, not CDN | Use: `'spacious'` |
| Using `theme: 'dark'` (string) | Wrong format | Use: `theme: { colorScheme: 'dark' }` (object) |
| Missing `color.surface` for light themes | Light theme may look washed out | Always set `surface.background` and `surface.foreground` |
| Using `useChatKit()` hook | npm-only API | Use: `chatkit.setOptions()` for CDN |
| Using `fontSize: 'small'` | npm format | Use: `baseSize: 14` (number in pixels) |
| Using `allowAttachments` | npm format | Use: `attachments: { enabled: true }` |
