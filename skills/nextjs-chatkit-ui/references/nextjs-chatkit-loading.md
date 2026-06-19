# Next.js ChatKit UI - CDN Loading Reference

Complete guide to loading ChatKit in Next.js applications using the **CDN web component approach**.

**IMPORTANT: We ONLY use the CDN approach. Do NOT install or use `@openai/chatkit-react` npm package.**

---

## CDN Script URL

```
https://cdn.platform.openai.com/deployments/chatkit/chatkit.js
```

---

## Setup in Next.js Layout

```typescript
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
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

## ChatWidget Component (Client Component)

```typescript
// components/ChatWidget.tsx
'use client';

import { useEffect, useRef } from 'react';

export function ChatWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create ChatKit web component
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
          { icon: 'lightning', label: 'Quick demo', prompt: 'Show me what you can do' },
          { icon: 'book', label: 'Learn more', prompt: 'Tell me about your services' },
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

## Full Page Chat Layout

```typescript
// app/chat/page.tsx
import { ChatWidget } from '@/components/ChatWidget';

export default function ChatPage() {
  return (
    <main className="h-screen w-screen">
      <ChatWidget />
    </main>
  );
}
```

---

## Floating Chat Button Pattern

```typescript
// components/ChatButton.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chatkitRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen || !containerRef.current || chatkitRef.current) return;

    const chatkit = document.createElement('openai-chatkit');

    chatkit.setOptions({
      api: {
        url: '/api/chatkit',
      },
      theme: {
        colorScheme: 'dark',
        radius: 'pill',
        density: 'normal',
      },
      composer: {
        placeholder: 'Ask me anything...',
        attachments: { enabled: false },
      },
      startScreen: {
        greeting: 'Hi! How can I help?',
        prompts: [
          { icon: 'circle-question', label: 'Get help', prompt: 'I need help' },
        ],
      },
    });

    containerRef.current.appendChild(chatkit);
    chatkitRef.current = chatkit;

    return () => {
      chatkit.remove();
      chatkitRef.current = null;
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[400px] h-[600px] rounded-2xl shadow-2xl overflow-hidden">
          <div ref={containerRef} className="h-full w-full" />
        </div>
      )}
    </>
  );
}
```

---

## Custom Fetch Handler (Backend Proxy)

When your backend is on a different port or needs auth:

```typescript
chatkit.setOptions({
  api: {
    url: '/api/chatkit',
    fetch: async (url, init) => {
      const backendUrl = url.replace('/api/chatkit', 'http://localhost:8000/chatkit');
      return fetch(backendUrl, {
        ...init,
        credentials: 'include',
      });
    },
  },
  // ... theme, composer, startScreen
});
```

---

## Next.js API Route Proxy (Alternative)

If you prefer server-side proxy instead of custom fetch:

```typescript
// app/api/chatkit/[...path]/route.ts
import { NextRequest } from 'next/server';

const BACKEND_URL = process.env.CHATKIT_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace('/api/chatkit', '/chatkit');
  const body = await request.text();

  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body,
  });

  return new Response(response.body, {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

---

## FORBIDDEN

| Do NOT | Do Instead |
|--------|-----------|
| `npm install @openai/chatkit-react` | Use CDN script tag |
| `import { ChatKit, useChatKit } from '@openai/chatkit-react'` | `document.createElement('openai-chatkit')` |
| `cdn.jsdelivr.net/npm/@openai/chatkit-react@...` | `cdn.platform.openai.com/deployments/chatkit/chatkit.js` |
| Server-side rendering ChatKit | Always use `'use client'` + `useEffect` |
