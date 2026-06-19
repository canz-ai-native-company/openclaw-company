() => {
  function pc(c){if(!c)return null;const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(s=>parseFloat(s.trim()));return{r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1};}
  function isVis(el){const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity)===0)return false;const r=el.getBoundingClientRect();return r.width>1&&r.height>1;}
  const inter=Array.from(document.querySelectorAll('a,button,input,select,textarea,[role=button]'));
  let vis=0; const small=[];
  inter.forEach(el=>{if(!isVis(el))return;vis++;const r=el.getBoundingClientRect();if(Math.min(r.width,r.height)<44)small.push({tag:el.tagName.toLowerCase(),t:(el.textContent||el.value||el.getAttribute('aria-label')||'').trim().slice(0,24),w:Math.round(r.width),h:Math.round(r.height)});});
  const ctas=Array.from(document.querySelectorAll('a,button')).filter(isVis).filter(el=>/book|consult|free call/i.test(el.textContent||'')).map(el=>{const r=el.getBoundingClientRect();return{t:(el.textContent||'').trim().slice(0,30),top:Math.round(r.top+window.scrollY),w:Math.round(r.width),h:Math.round(r.height)};}).slice(0,6);
  return JSON.stringify({
    vw:window.innerWidth,
    overflow:document.documentElement.scrollWidth>window.innerWidth+2,
    docW:document.documentElement.scrollWidth, innerW:window.innerWidth,
    viewportMeta:!!document.querySelector('meta[name=viewport]'),
    visInteractive:vis, sub44:small.length, smallItems:small.slice(0,24),
    aboveFoldCTAs:ctas, h1:document.querySelectorAll('h1').length,
    fontBody:getComputedStyle(document.body).fontSize
  });
}
