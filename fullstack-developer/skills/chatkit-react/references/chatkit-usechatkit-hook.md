# ChatKit CDN - setOptions() API Reference

Complete API reference for the CDN web component approach using `chatkit.setOptions()`.

**IMPORTANT: We ONLY use the CDN approach. Do NOT use the npm package `@openai/chatkit-react` or `useChatKit()` hook.**

---

## CDN Setup

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
```

---

## Web Component Initialization

```typescript
// components/ChatWidget.tsx
'use client';

import { useEffect, useRef } from 'react';

export function ChatWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const chatkit = document.createElement('openai-chatkit');

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
          fontFamily: '"OpenAI Sans", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontFamilyMono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          fontSources: [
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
      composer: {
        placeholder: 'Ask me anything...',
        attachments: { enabled: false },
      },
      startScreen: {
        greeting: '',
        prompts: [
          { icon: 'circle-question', label: 'How can you help?', prompt: 'What can you help me with?' },
          { icon: 'lightning', label: 'Quick demo', prompt: 'Show me what you can do' },
        ],
      },
    });

    containerRef.current.appendChild(chatkit);

    return () => {
      chatkit.remove();
    };
  }, []);

  return <div ref={containerRef} className="h-full w-full" />;
}
```

---

## Configuration Options

### api (Required)

```typescript
api: {
  url: string;        // Backend endpoint (e.g. '/api/chatkit')
  fetch?: (url: string, init?: RequestInit) => Promise<Response>;  // Custom fetch
}
```

**Custom fetch example (with auth):**

```typescript
api: {
  url: '/api/chatkit',
  fetch: async (url, init) => {
    return fetch(url, {
      ...init,
      credentials: 'include',
      headers: {
        ...init?.headers,
        'Authorization': `Bearer ${getToken()}`,
      },
    });
  },
},
```

---

### theme

See `chatkit-theme-customization.md` for complete reference. Quick summary:

```typescript
theme: {
  colorScheme: 'light' | 'dark' | 'system',
  radius: 'none' | 'sm' | 'md' | 'lg' | 'pill',
  density: 'compact' | 'normal' | 'spacious',
  color: {
    grayscale: { hue: number, tint: number },
    accent: { primary: string, level: 1 | 2 | 3 },
    surface: { background: string, foreground: string },
  },
  typography: {
    baseSize: number,
    fontFamily: string,
    fontFamilyMono: string,
    fontSources: Array<{ family, src, weight, style, display }>,
  },
},
```

---

### startScreen

```typescript
startScreen: {
  greeting: string,      // Welcome message ('' = no greeting)
  prompts: Array<{
    icon: string,        // See Available Icons
    label: string,       // Button text
    prompt: string,      // Message sent on click
  }>,
},
```

**Available Icons:**
`circle-question`, `lifesaver`, `info`, `lightning`, `book`, `code`, `chart`, `question`, `settings`, `menu`

**Example:**

```typescript
startScreen: {
  greeting: 'Welcome! How can I help?',
  prompts: [
    { icon: 'circle-question', label: 'Get Support', prompt: 'I need help with a technical issue' },
    { icon: 'info', label: 'Learn More', prompt: 'Tell me about your features' },
    { icon: 'lightning', label: 'Quick Start', prompt: 'Help me get started quickly' },
    { icon: 'book', label: 'Documentation', prompt: 'Where can I find documentation?' },
  ],
},
```

---

### composer

```typescript
composer: {
  placeholder: string,              // Placeholder text in input
  attachments: {
    enabled: boolean,               // Allow file uploads
  },
},
```

**Example:**

```typescript
composer: {
  placeholder: 'Message the Travel Agent',
  attachments: {
    enabled: false,
  },
},
```

---

### header

```typescript
header: {
  enabled: boolean,
  title?: string,
  rightAction?: {
    icon: string,
    onClick: () => void,
  },
},
```

---

### threadItemActions

```typescript
threadItemActions: {
  feedback?: boolean,    // Thumbs up/down buttons
  retry?: boolean,       // Retry button on messages
},
```

---

## Complete Production Example

```typescript
chatkit.setOptions({
  api: {
    url: '/api/chatkit',
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
    attachments: { enabled: false },
  },
  startScreen: {
    greeting: '',
    prompts: [
      { icon: 'circle-question', label: 'How can you help?', prompt: 'What can you help me with?' },
      { icon: 'lightning', label: 'Quick demo', prompt: 'Show me a quick demo' },
      { icon: 'book', label: 'Learn more', prompt: 'Tell me about your services' },
      { icon: 'info', label: 'Pricing', prompt: 'What are your pricing plans?' },
    ],
  },
  header: {
    enabled: true,
    title: 'AI Assistant',
  },
  threadItemActions: {
    feedback: true,
    retry: true,
  },
});
```

---

## FORBIDDEN (Common Mistakes)

| Do NOT Use | Use Instead |
|-----------|-------------|
| `import { useChatKit } from '@openai/chatkit-react'` | `chatkit.setOptions({...})` |
| `npm install @openai/chatkit-react` | CDN script tag |
| `radius: 'sharp'` / `'soft'` / `'round'` | `radius: 'none'` / `'sm'` / `'md'` / `'lg'` / `'pill'` |
| `density: 'relaxed'` | `density: 'spacious'` |
| `typography: { fontSize: 'small' }` | `typography: { baseSize: 14 }` |
| `allowAttachments: true` | `attachments: { enabled: true }` |
| `theme: 'dark'` (string) | `theme: { colorScheme: 'dark' }` (object) |
