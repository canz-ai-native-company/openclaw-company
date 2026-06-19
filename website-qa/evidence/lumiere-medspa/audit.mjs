import { createRequire } from 'module';
const require = createRequire('/home/raza/.npm/_npx/e41f203b7505f1fb/node_modules/');
const { chromium } = require('playwright');

const URL = 'https://web-paqbwgcv2-rrizwan1998-2036s-projects.vercel.app';
const OUT = '/home/raza/.openclaw/workspace/website-qa/evidence/lumiere-medspa';

const recipes = {
  // 1 above-fold
  aboveFold: () => {
    const vh = window.innerHeight, vw = window.innerWidth;
    const aboveFold = el => { const r = el.getBoundingClientRect(); return r.top < vh && r.bottom > 0 && r.left < vw; };
    const h1 = document.querySelector('h1');
    const ctas = Array.from(document.querySelectorAll('a,button,[role=button],input[type=submit]'))
      .map(e => { const r = e.getBoundingClientRect(); return { text:(e.innerText||e.value||'').trim().slice(0,80), tag:e.tagName, top:Math.round(r.top), w:Math.round(r.width), h:Math.round(r.height), aboveFold:aboveFold(e) }; })
      .filter(c => c.text);
    return { viewport:{vw,vh}, h1:h1?h1.innerText.trim():null, subhead:(document.querySelector('h1 + p, h1 ~ p')||{}).innerText||null, ctasAboveFold:ctas.filter(c=>c.aboveFold), ctaTotal:ctas.length };
  },
  // 2 tap targets
  tapTargets: () => {
    const small = Array.from(document.querySelectorAll('a,button,[role=button],input,select'))
      .map(e => { const r=e.getBoundingClientRect(); return { text:(e.innerText||e.value||e.getAttribute('aria-label')||'').trim().slice(0,40), w:Math.round(r.width), h:Math.round(r.height) }; })
      .filter(e => e.w>0 && e.h>0 && (e.w<44||e.h<44));
    return { failingCount:small.length, items:small.slice(0,30) };
  },
  // 3 contrast
  contrast: () => {
    const lum=c=>{const a=c.map(v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);});return 0.2126*a[0]+0.7152*a[1]+0.0722*a[2];};
    const parse=s=>{const m=s.match(/\d+(\.\d+)?/g);return m?m.slice(0,3).map(Number):null;};
    const ratio=(fg,bg)=>{const L1=lum(fg),L2=lum(bg),hi=Math.max(L1,L2),lo=Math.min(L1,L2);return (hi+0.05)/(lo+0.05);};
    const bgOf=el=>{let n=el;while(n){const c=getComputedStyle(n).backgroundColor;if(c&&c!=='rgba(0, 0, 0, 0)'&&c!=='transparent')return parse(c);n=n.parentElement;}return [255,255,255];};
    const sample=Array.from(document.querySelectorAll('h1,h2,p,a,button,[role=button]')).slice(0,40).map(el=>{
      const cs=getComputedStyle(el),fg=parse(cs.color),bg=bgOf(el);if(!fg||!bg)return null;
      const r=+ratio(fg,bg).toFixed(2),size=parseFloat(cs.fontSize);
      const large=size>=24||(size>=18.66&&+cs.fontWeight>=700);
      return { tag:el.tagName, text:(el.innerText||'').trim().slice(0,40), fontPx:Math.round(size), ratio:r, passAA:large?r>=3:r>=4.5 };
    }).filter(Boolean);
    return { failingAA:sample.filter(s=>!s.passAA).length, samples:sample };
  },
  // 4 perf
  perf: () => {
    const nav=performance.getEntriesByType('navigation')[0]||{};
    const paint={};performance.getEntriesByType('paint').forEach(p=>paint[p.name]=Math.round(p.startTime));
    return { ttfbMs:Math.round(nav.responseStart||0), domContentLoadedMs:Math.round(nav.domContentLoadedEventEnd||0), loadMs:Math.round(nav.loadEventEnd||0), transferKB:Math.round((nav.transferSize||0)/1024), firstContentfulPaintMs:paint['first-contentful-paint']||null };
  },
  // 6 forms
  forms: () => {
    const forms=Array.from(document.querySelectorAll('form')).map(f=>{
      const fields=Array.from(f.querySelectorAll('input,select,textarea')).filter(e=>!['hidden','submit','button'].includes(e.type));
      return { action:f.getAttribute('action')||null, fieldCount:fields.length, fields:fields.map(e=>({type:e.type||e.tagName.toLowerCase(),name:e.name||e.id||null,required:e.required||e.getAttribute('aria-required')==='true',hasLabel:!!(e.labels&&e.labels.length)||!!e.getAttribute('aria-label')||!!e.placeholder,autocomplete:e.getAttribute('autocomplete')||null,inputmode:e.getAttribute('inputmode')||null})) };
    });
    return { formCount:forms.length, forms };
  },
  // 7 trust
  trust: () => {
    const text=document.body.innerText.toLowerCase();
    const imgs=Array.from(document.images).map(i=>(i.alt||i.src||'').toLowerCase());
    const has=re=>re.test(text);
    return { mentionsCustomers:has(/trusted by|join \d|\d[\d,]*\+? (customers|users|teams|companies|patients|clients)/), hasTestimonialWords:has(/testimonial|reviews?|loved|recommend/), hasRating:has(/[0-5]\.\d\s*(\/|out of)\s*5|★|rated/), hasRiskReversal:has(/money-back|guarantee|no credit card|free trial|cancel anytime|refund|consultation/), logoLikeImages:imgs.filter(s=>/logo|client|partner|brand/.test(s)).length, securityBadges:imgs.filter(s=>/secure|ssl|gdpr|soc ?2|hipaa|norton|mcafee|badge/.test(s)).length };
  },
  // 8 headings/alt
  headings: () => {
    const headings=Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h=>({level:+h.tagName[1],text:h.innerText.trim().slice(0,60)}));
    const imgs=Array.from(document.images);
    return { h1Count:headings.filter(h=>h.level===1).length, outline:headings.slice(0,30), imagesMissingAlt:imgs.filter(i=>!i.alt||!i.alt.trim()).length, imageTotal:imgs.length };
  },
  // 9 mobile struct
  mobileStruct: () => {
    const doc=document.documentElement;const meta=document.querySelector('meta[name=viewport]');const bodyFont=parseFloat(getComputedStyle(document.body).fontSize);
    return { hasViewportMeta:!!meta, viewportContent:meta?meta.getAttribute('content'):null, horizontalScroll:doc.scrollWidth>window.innerWidth+2, scrollWidth:doc.scrollWidth, innerWidth:window.innerWidth, bodyFontPx:Math.round(bodyFont), bodyFontTooSmall:bodyFont<16 };
  },
  // 10 killers
  killers: () => {
    const vids=Array.from(document.querySelectorAll('video')).map(v=>({autoplay:v.autoplay,muted:v.muted}));
    const carousels=document.querySelectorAll('[class*=carousel],[class*=slider],[class*=swiper],.slick-slider').length;
    const modals=Array.from(document.querySelectorAll('[role=dialog],[class*=modal],[class*=popup],[class*=interstitial]')).filter(m=>{const s=getComputedStyle(m),r=m.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>window.innerWidth*0.6&&r.height>window.innerHeight*0.5;}).length;
    return { autoplayWithSound:vids.filter(v=>v.autoplay&&!v.muted).length, carousels, intrusiveModalsVisible:modals };
  },
  // 11 message match
  msgMatch: () => ({ title:document.title, metaDescription:(document.querySelector('meta[name=description]')||{}).content||null, h1:(document.querySelector('h1')||{}).innerText||null, firstCtaText:(document.querySelector('a[href],button')||{}).innerText||null }),
  // 12 click-to-call
  clickToCall: () => {
    const tel=document.querySelectorAll('a[href^="tel:"]').length;
    const mapLinks=document.querySelectorAll('a[href*="maps.google"],a[href*="goo.gl/maps"],a[href*="maps.apple"],a[href^="geo:"]').length;
    const body=document.body.innerText;
    const phoneInText=(body.match(/(\+?\d[\d\s().-]{7,}\d)/g)||[]).length;
    const addressLikely=/\b\d{1,5}\s+\w+(\s\w+){0,3}\s+(st|street|ave|avenue|rd|road|blvd|suite|ste)\b/i.test(body);
    return { clickToCallLinks:tel, tapToMapLinks:mapLinks, phoneNumbersInText:phoneInText, addressLikelyPresent:addressLikely, flag_phone_not_tappable:phoneInText>0&&tel===0, flag_address_not_tappable:addressLikely&&mapLinks===0 };
  },
  // 13 hover-only
  hoverOnly: () => {
    let hoverMenus=0;
    document.querySelectorAll('nav, header').forEach(n=>{n.querySelectorAll('li,[class*=dropdown],[class*=submenu],[class*=menu-item]').forEach(li=>{const sub=li.querySelector('ul,[class*=submenu],[class*=dropdown-menu]');if(sub){const t=li.querySelector('a,button');const ca=t&&(t.getAttribute('aria-expanded')!==null||t.getAttribute('aria-haspopup')!==null);if(!ca)hoverMenus++;}});});
    return { hoverRevealMenusWithoutClickAffordance:hoverMenus };
  },
  // 14 sticky cta
  stickyCta: () => {
    const fixed=Array.from(document.querySelectorAll('header,nav,div,section,a,button')).filter(el=>{const p=getComputedStyle(el).position;return p==='fixed'||p==='sticky';});
    const stickyCta=fixed.filter(el=>el.querySelector('a,button,[role=button]')||/book|buy|start|get|sign ?up|call|contact|quote|demo/i.test(el.innerText||'')).slice(0,5).map(el=>({position:getComputedStyle(el).position,text:(el.innerText||'').trim().slice(0,60)}));
    return { stickyOrFixedElements:fixed.length, stickyCtaPresent:stickyCta.length>0, samples:stickyCta };
  },
  // 15 hero spec
  heroSpec: () => {
    const words=s=>(s||'').trim().split(/\s+/).filter(Boolean).length;
    const h1=document.querySelector('h1');
    const sub=document.querySelector('h1 + p, h1 ~ p, h1 + div, [class*=subhead], [class*=subtitle]');
    const eyebrow=document.querySelector('[class*=eyebrow],[class*=overline],[class*=pre-head],[class*=kicker]');
    const cta=document.querySelector('a[class*=btn],a[class*=button],button,[role=button]');
    const hw=words(h1&&h1.innerText),sw=words(sub&&sub.innerText),ew=words(eyebrow&&eyebrow.innerText),cw=words(cta&&(cta.innerText||cta.value));
    return { headlineWords:hw, headlineInSpec:hw>=6&&hw<=12, subheadlineWords:sw, subInSpec:sw>=15&&sw<=30, eyebrowWords:ew, eyebrowInSpec:ew===0||(ew>=2&&ew<=5), ctaWords:cw, ctaInSpec:cw>=2&&cw<=5 };
  },
  // 16 analytics
  analytics: () => {
    const html=document.documentElement.outerHTML;const has=re=>re.test(html);
    const ga=(typeof window.gtag==='function')||has(/googletagmanager\.com\/gtag|google-analytics\.com\/(g|analytics)/);
    const gtm=has(/googletagmanager\.com\/gtm\.js/)||Array.isArray(window.dataLayer);
    const meta=(typeof window.fbq==='function')||has(/connect\.facebook\.net|fbevents\.js/);
    const tiktok=has(/analytics\.tiktok\.com/);
    return { ga4_or_gtag:ga, gtm, metaPixel:meta, tiktokPixel:tiktok, anyTrackingDetected:ga||gtm||meta||tiktok };
  },
  // 17 persuasion
  persuasion: () => {
    const text=document.body.innerText.toLowerCase();const has=re=>re.test(text);
    const faqHeading=Array.from(document.querySelectorAll('h2,h3,h4')).some(h=>/faq|frequently asked|questions/i.test(h.innerText));
    const accordions=document.querySelectorAll('[class*=accordion],[class*=faq],details').length;
    return { hasFAQ:faqHeading||accordions>0, hasPricing:has(/\$\s?\d|\/(mo|month|year|yr)\b|pricing|per month|\bplan\b|starting at/), hasGuaranteeOrRiskReversal:has(/money-back|guarantee|no credit card|free trial|cancel anytime|refund|free consultation/), hasUrgency:has(/limited time|ends (in|soon)|only \d+ (left|spots|seats)|today only|hurry|book now/), hasCountdownTimer:document.querySelectorAll('[class*=countdown],[class*=timer],[data-countdown]').length>0 };
  },
};

const run = async () => {
  const browser = await chromium.launch({ headless: true });
  const results = { url: URL, desktop: {}, mobile: {}, console: [], network: {} };

  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const consoleErrors = [];
  page.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 300)); });
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(String(e).slice(0, 300)));
  const requests = [];
  page.on('response', async r => {
    try { const h = r.headers(); requests.push({ url: r.url().slice(0, 120), status: r.status(), type: r.request().resourceType(), len: parseInt(h['content-length'] || '0', 10) || 0 }); } catch {}
  });

  const resp = await page.goto(URL, { waitUntil: 'load', timeout: 60000 });
  results.httpStatus = resp ? resp.status() : null;
  await page.waitForTimeout(2500);

  // DESKTOP
  await page.screenshot({ path: `${OUT}/desktop-fullpage.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/desktop-abovefold.png`, fullPage: false });
  for (const [k, fn] of Object.entries(recipes)) {
    try { results.desktop[k] = await page.evaluate(fn); } catch (e) { results.desktop[k] = { error: String(e).slice(0,150) }; }
  }
  // web vitals
  try {
    results.desktop.vitals = await page.evaluate(() => new Promise(resolve => {
      const out = { lcp: null, cls: 0 };
      try { new PerformanceObserver(l => { const e = l.getEntries(); out.lcp = Math.round(e[e.length-1].startTime); }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
      try { new PerformanceObserver(l => { for (const e of l.getEntries()) if (!e.hadRecentInput) out.cls += e.value; }).observe({ type: 'layout-shift', buffered: true }); } catch {}
      setTimeout(() => { out.cls = +out.cls.toFixed(3); resolve(out); }, 3000);
    }));
  } catch (e) { results.desktop.vitals = { error: String(e).slice(0,150) }; }

  // MOBILE
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/mobile-fullpage.png`, fullPage: true });
  await page.screenshot({ path: `${OUT}/mobile-abovefold.png`, fullPage: false });
  for (const k of ['aboveFold','tapTargets','mobileStruct','clickToCall','hoverOnly','stickyCta']) {
    try { results.mobile[k] = await page.evaluate(recipes[k]); } catch (e) { results.mobile[k] = { error: String(e).slice(0,150) }; }
  }

  results.console = consoleErrors;
  results.pageErrors = pageErrors;
  const byType = {};
  let totalBytes = 0;
  for (const r of requests) { byType[r.type] = byType[r.type] || { count: 0, bytes: 0 }; byType[r.type].count++; byType[r.type].bytes += r.len; totalBytes += r.len; }
  results.network = { totalRequests: requests.length, totalKB: Math.round(totalBytes/1024), byType, failed: requests.filter(r => r.status >= 400).map(r => ({ url: r.url, status: r.status })).slice(0,20) };

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
};

run().catch(e => { console.error('FATAL', e); process.exit(1); });
