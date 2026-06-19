# Next.js Real-World Integrations Reference

Common integrations that professional websites need. Patterns for forms, analytics, newsletters, maps, and third-party embeds.

---

## Contact Form with Validation

### Client-Side Form with Server Action

```typescript
// app/actions/contact.ts
'use server'

interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
}

export async function submitContactForm(data: ContactFormData) {
  // Validate server-side
  if (!data.name || data.name.length < 2) {
    return { success: false, error: 'Name is required' }
  }
  if (!data.email || !data.email.includes('@')) {
    return { success: false, error: 'Valid email is required' }
  }
  if (!data.message || data.message.length < 10) {
    return { success: false, error: 'Message must be at least 10 characters' }
  }

  // Send email via API (Resend, SendGrid, etc.)
  try {
    // Option 1: Resend
    // await resend.emails.send({
    //   from: 'noreply@yourdomain.com',
    //   to: 'hello@yourdomain.com',
    //   subject: `Contact: ${data.subject || 'New Message'}`,
    //   text: `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`,
    // })

    // Option 2: Simple fetch to external API
    // await fetch('https://api.example.com/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // })

    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send. Please try again.' }
  }
}
```

### Form Component with Animated States

```tsx
// components/forms/ContactForm.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { submitContactForm } from '@/app/actions/contact'

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('loading')

    const form = new FormData(e.currentTarget)
    const data = {
      name: form.get('name') as string,
      email: form.get('email') as string,
      subject: form.get('subject') as string,
      message: form.get('message') as string,
    }

    const result = await submitContactForm(data)
    if (result.success) {
      setStatus('success')
    } else {
      setError(result.error || 'Something went wrong')
      setStatus('error')
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-16 h-16 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-4"
          >
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>
          <h3 className="text-xl font-semibold">Message Sent!</h3>
          <p className="mt-2 text-gray-500">We&apos;ll get back to you within 24 hours.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <input name="name" required placeholder="Your Name"
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-gray-50 focus:bg-white" />
            <input name="email" type="email" required placeholder="Email Address"
              className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-gray-50 focus:bg-white" />
          </div>
          <input name="subject" placeholder="Subject (optional)"
            className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-gray-50 focus:bg-white" />
          <textarea name="message" required rows={5} placeholder="Your Message"
            className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-gray-50 focus:bg-white resize-none" />

          {status === 'error' && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={status === 'loading'}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sending...
              </span>
            ) : 'Send Message'}
          </motion.button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
```

---

## Analytics Setup

### Google Analytics 4

```typescript
// components/analytics/GoogleAnalytics.tsx
import Script from 'next/script'

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  if (!measurementId) return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  )
}

// In layout.tsx:
// <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID || ''} />
```

### Plausible Analytics (Privacy-Friendly Alternative)

```typescript
// components/analytics/Plausible.tsx
import Script from 'next/script'

export function PlausibleAnalytics({ domain }: { domain: string }) {
  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  )
}
```

---

## Newsletter Signup

### Form with API Route

```typescript
// app/api/newsletter/route.ts
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { email } = await request.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
  }

  try {
    // Mailchimp example
    // const response = await fetch(`https://us1.api.mailchimp.com/3.0/lists/${LIST_ID}/members`, {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${process.env.MAILCHIMP_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     email_address: email,
    //     status: 'subscribed',
    //   }),
    // })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}
```

---

## Calendar Embed (Cal.com / Calendly)

### Cal.com Embed

```tsx
// components/integrations/CalEmbed.tsx
'use client'

import { useEffect } from 'react'
import Script from 'next/script'

export function CalEmbed({ calLink }: { calLink: string }) {
  return (
    <>
      <Script src="https://app.cal.com/embed/embed.js" strategy="lazyOnload" />
      <div
        data-cal-link={calLink}
        data-cal-config='{"layout":"month_view"}'
        className="w-full min-h-[600px]"
      />
    </>
  )
}
```

### Calendly Embed

```tsx
// components/integrations/CalendlyEmbed.tsx
'use client'

export function CalendlyEmbed({ url }: { url: string }) {
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-200">
      <iframe
        src={url}
        width="100%"
        height="700"
        frameBorder="0"
        title="Schedule a meeting"
        className="w-full"
        loading="lazy"
      />
    </div>
  )
}
```

---

## Social Media Links

### Social Icon Component

```tsx
// components/ui/SocialLinks.tsx
interface SocialLink {
  platform: 'twitter' | 'linkedin' | 'github' | 'instagram' | 'facebook' | 'youtube' | 'tiktok'
  url: string
}

const icons: Record<string, React.ReactNode> = {
  twitter: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  linkedin: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
  github: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>,
  instagram: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>,
  facebook: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>,
  youtube: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>,
  tiktok: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>,
}

export function SocialLinks({ links, size = 'md' }: { links: SocialLink[]; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${sizes[size]} rounded-full bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200`}
          aria-label={`Follow us on ${link.platform}`}
        >
          {icons[link.platform]}
        </a>
      ))}
    </div>
  )
}
```

---

## Cookie Consent Banner

```tsx
// components/ui/CookieConsent.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      setTimeout(() => setShow(true), 2000) // show after 2s
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 lg:p-6"
        >
          <div className="container mx-auto max-w-4xl bg-white rounded-2xl shadow-floating border border-gray-200 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <p className="text-sm text-gray-600 flex-1">
              We use cookies to improve your experience. By continuing, you agree to our{' '}
              <a href="/privacy" className="text-primary-600 hover:underline">Privacy Policy</a>.
            </p>
            <div className="flex gap-3 flex-shrink-0">
              <button onClick={decline}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Decline
              </button>
              <button onClick={accept}
                className="px-5 py-2 text-sm font-semibold bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

---

## Google Maps Embed

```tsx
// components/integrations/GoogleMap.tsx
interface GoogleMapProps {
  address: string
  className?: string
  height?: number
}

export function GoogleMap({ address, className = '', height = 400 }: GoogleMapProps) {
  const encodedAddress = encodeURIComponent(address)

  return (
    <div className={`rounded-2xl overflow-hidden border border-gray-200 ${className}`}>
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}&q=${encodedAddress}`}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing ${address}`}
      />
    </div>
  )
}

// Alternative: No API key needed (embed URL from Google Maps share)
export function GoogleMapEmbed({ embedUrl, height = 400 }: { embedUrl: string; height?: number }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200">
      <iframe
        src={embedUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title="Location map"
      />
    </div>
  )
}
```
