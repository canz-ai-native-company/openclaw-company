// Browser-side measurement function. Returns a JSON-serializable audit object.
() => {
  // ---- contrast helpers ----
  function parseColor(c) {
    if (!c) return null;
    const m = c.match(/rgba?\(([^)]+)\)/);
    if (!m) return null;
    const p = m[1].split(',').map(s => parseFloat(s.trim()));
    return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 };
  }
  function lin(v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }
  function lum(c) { return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b); }
  function ratio(fg, bg) {
    const L1 = lum(fg), L2 = lum(bg);
    const a = Math.max(L1, L2), b = Math.min(L1, L2);
    return (a + 0.05) / (b + 0.05);
  }
  function blend(fg, bg) {
    const a = fg.a;
    return { r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a), a: 1 };
  }
  function effectiveBg(el) {
    let node = el;
    let acc = { r: 255, g: 255, b: 255, a: 1 }; // assume white page base
    const stack = [];
    while (node && node.nodeType === 1) {
      const bg = parseColor(getComputedStyle(node).backgroundColor);
      if (bg && bg.a > 0) stack.push(bg);
      node = node.parentElement;
    }
    // composite from bottom (page) up
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = stack.length - 1; i >= 0; i--) base = blend(stack[i], base);
    return base;
  }
  function isVisible(el) {
    const s = getComputedStyle(el);
    if (s.display === 'none' || s.visibility === 'hidden' || parseFloat(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  }
  function hasText(el) {
    for (const n of el.childNodes) if (n.nodeType === 3 && n.textContent.trim().length) return true;
    return false;
  }

  // ---- contrast sweep over text-bearing elements ----
  const failures = [];
  const samples = [];
  const els = Array.from(document.querySelectorAll('a,button,span,p,h1,h2,h3,h4,h5,h6,li,label,small,div,strong,em'));
  let checked = 0;
  for (const el of els) {
    if (!hasText(el) || !isVisible(el)) continue;
    const cs = getComputedStyle(el);
    const fg = parseColor(cs.color);
    if (!fg) continue;
    const bg = effectiveBg(el);
    const fgc = fg.a < 1 ? blend(fg, bg) : fg;
    const fs = parseFloat(cs.fontSize);
    const fw = parseInt(cs.fontWeight) || 400;
    const large = fs >= 24 || (fs >= 18.66 && fw >= 700);
    const threshold = large ? 3.0 : 4.5;
    const cr = ratio(fgc, bg);
    checked++;
    const txt = (el.textContent || '').trim().slice(0, 40);
    const rec = {
      text: txt,
      tag: el.tagName.toLowerCase(),
      color: cs.color,
      bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`,
      fontSize: fs, weight: fw, large,
      ratio: Math.round(cr * 100) / 100, threshold
    };
    if (cr < threshold) failures.push(rec);
  }
  // dedupe failures by text+color
  const seen = new Set();
  const uniqFail = [];
  for (const f of failures) {
    const k = f.text + '|' + f.color + '|' + f.ratio;
    if (seen.has(k)) continue; seen.add(k); uniqFail.push(f);
  }
  uniqFail.sort((a, b) => a.ratio - b.ratio);

  // ---- targeted sampling: eyebrow labels, nav links, text-links, gold accents ----
  function sampleSel(sel, labelName) {
    const out = [];
    document.querySelectorAll(sel).forEach(el => {
      if (!isVisible(el) || !hasText(el)) return;
      const cs = getComputedStyle(el);
      const fg = parseColor(cs.color); if (!fg) return;
      const bg = effectiveBg(el);
      const fgc = fg.a < 1 ? blend(fg, bg) : fg;
      out.push({ where: labelName, text: (el.textContent||'').trim().slice(0,40),
        color: cs.color, bg: `rgb(${Math.round(bg.r)},${Math.round(bg.g)},${Math.round(bg.b)})`,
        fontSize: parseFloat(cs.fontSize), ratio: Math.round(ratio(fgc,bg)*100)/100 });
    });
    return out;
  }
  const targeted = []
    .concat(sampleSel('nav a', 'nav-link'))
    .concat(sampleSel('a', 'all-links').filter((_,i)=>i<60));

  // ---- tap targets ----
  const interactive = Array.from(document.querySelectorAll('a,button,input,select,textarea,[role=button]'));
  const small = [];
  let interVisible = 0;
  interactive.forEach(el => {
    if (!isVisible(el)) return;
    interVisible++;
    const r = el.getBoundingClientRect();
    const w = r.width, h = r.height;
    if (Math.min(w, h) < 44) {
      small.push({ tag: el.tagName.toLowerCase(), text: (el.textContent||el.value||el.getAttribute('aria-label')||'').trim().slice(0,30),
        w: Math.round(w), h: Math.round(h) });
    }
  });

  // ---- forms ----
  const forms = Array.from(document.querySelectorAll('form')).map(f => {
    const fields = Array.from(f.querySelectorAll('input,select,textarea')).map(el => {
      const id = el.id;
      let labelled = false, labelText = '';
      if (id) { const l = document.querySelector(`label[for="${id}"]`); if (l) { labelled = true; labelText = l.textContent.trim(); } }
      if (!labelled && el.closest('label')) { labelled = true; labelText = el.closest('label').textContent.trim(); }
      if (!labelled && (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby'))) labelled = true;
      return {
        tag: el.tagName.toLowerCase(), type: el.type || null, name: el.name || el.id || null,
        required: el.required || false,
        autocomplete: el.getAttribute('autocomplete'),
        inputmode: el.getAttribute('inputmode'),
        placeholder: el.getAttribute('placeholder') || null,
        labelled, labelText: labelText.slice(0,30)
      };
    });
    return { action: f.getAttribute('action'), fieldCount: fields.length, fields };
  });

  // ---- trust badges (Google / Yelp) ----
  const bodyText = document.body.innerText;
  const html = document.documentElement.outerHTML;
  const trust = {
    googleMention: /google\s*review|google\b.{0,20}(star|rating|review)/i.test(bodyText),
    yelpMention: /yelp/i.test(bodyText),
    googleInImgAlt: !!Array.from(document.querySelectorAll('img,svg')).find(e => /google/i.test(e.getAttribute('alt')||e.getAttribute('aria-label')||'')),
    yelpInImgAlt: !!Array.from(document.querySelectorAll('img,svg')).find(e => /yelp/i.test(e.getAttribute('alt')||e.getAttribute('aria-label')||'')),
    googleInHtml: /google/i.test(html),
    yelpInHtml: /yelp/i.test(html),
    fiveStarMention: /500\+?\s*(five|5)[\s-]*star|500\+\s*reviews/i.test(bodyText),
    starGlyphs: (bodyText.match(/★/g)||[]).length
  };

  // ---- GA4 / analytics ----
  const scripts = Array.from(document.querySelectorAll('script'));
  const ga = {
    gtagSrc: scripts.some(s => /googletagmanager\.com\/gtag\/js/.test(s.src)),
    gtmSrc: scripts.some(s => /googletagmanager\.com\/gtm\.js/.test(s.src)),
    dataLayer: Array.isArray(window.dataLayer),
    gtagFn: typeof window.gtag === 'function',
    measurementIdInHtml: (html.match(/G-[A-Z0-9]{6,}/g) || []),
    placeholderId: /G-PLACEHOLDER/.test(html),
    eventBookConsult: /book_consultation_click/.test(html),
    eventFormSubmit: /form_submit/.test(html),
    eventClickToCall: /click_to_call/.test(html)
  };

  // ---- images ----
  const imgs = Array.from(document.querySelectorAll('img'));
  const imgData = imgs.map(im => ({
    src: (im.currentSrc || im.src || '').split('/').pop().slice(0,40),
    natW: im.naturalWidth, natH: im.naturalHeight,
    rendered: im.naturalWidth > 0,
    alt: im.alt, hasAlt: !!(im.alt && im.alt.trim().length)
  }));
  const imgMissingAlt = imgData.filter(i => !i.hasAlt).length;
  const imgBroken = imgData.filter(i => !i.rendered).length;

  // ---- click to call ----
  const telLinks = Array.from(document.querySelectorAll('a[href^="tel:"]')).map(a => a.getAttribute('href'));
  const phoneVisible = /619[\s.\-)]*614[\s.\-]*7810|\(619\)\s*614-7810/.test(bodyText);
  const fakePhone = /555-0000|480.?555/.test(bodyText);

  // ---- headings ----
  const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map(h => ({ tag: h.tagName, text: h.textContent.trim().slice(0,50) }));
  const h1count = document.querySelectorAll('h1').length;

  // ---- overflow / layout ----
  const overflow = {
    docScrollW: document.documentElement.scrollWidth,
    innerW: window.innerWidth,
    horizontalOverflow: document.documentElement.scrollWidth > window.innerWidth + 2,
    viewportMeta: !!document.querySelector('meta[name="viewport"]')
  };

  // ---- CTAs ----
  const ctaCandidates = Array.from(document.querySelectorAll('a,button')).filter(isVisible).filter(el => /book|consult|schedule|appointment|get started|contact/i.test(el.textContent||'')).map(el => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const fg = parseColor(cs.color); const bg0 = parseColor(cs.backgroundColor);
    let cr = null;
    if (fg && bg0 && bg0.a > 0) { const bgc = bg0.a<1?blend(bg0,effectiveBg(el)):bg0; cr = Math.round(ratio(fg.a<1?blend(fg,bgc):fg, bgc)*100)/100; }
    return { text: (el.textContent||'').trim().slice(0,40), tag: el.tagName.toLowerCase(),
      top: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height),
      bg: cs.backgroundColor, color: cs.color, contrast: cr };
  });

  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    contrast: { checked, failCount: uniqFail.length, worstFailures: uniqFail.slice(0, 25) },
    targetedSamples: targeted.slice(0, 50),
    tapTargets: { totalVisibleInteractive: interVisible, subMin: small.length, items: small.slice(0, 40) },
    forms,
    trust,
    ga,
    images: { count: imgData.length, missingAlt: imgMissingAlt, broken: imgBroken, items: imgData },
    clickToCall: { telLinks, count: telLinks.length, phoneVisible, fakePhone },
    headings: { h1count, list: headings },
    overflow,
    ctas: ctaCandidates
  };
}
