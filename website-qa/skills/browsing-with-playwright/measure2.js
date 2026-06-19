() => {
  function parseColor(c){if(!c)return null;const m=c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(s=>parseFloat(s.trim()));return{r:p[0],g:p[1],b:p[2],a:p.length>3?p[3]:1};}
  function lin(v){v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4);}
  function lum(c){return 0.2126*lin(c.r)+0.7152*lin(c.g)+0.0722*lin(c.b);}
  function ratio(f,b){const L1=lum(f),L2=lum(b);const a=Math.max(L1,L2),x=Math.min(L1,L2);return (a+0.05)/(x+0.05);}
  function blend(f,b){const a=f.a;return{r:f.r*a+b.r*(1-a),g:f.g*a+b.g*(1-a),b:f.b*a+b.b*(1-a),a:1};}
  function isVis(el){const s=getComputedStyle(el);if(s.display==='none'||s.visibility==='hidden'||parseFloat(s.opacity)===0)return false;const r=el.getBoundingClientRect();return r.width>1&&r.height>1;}
  function hasText(el){for(const n of el.childNodes)if(n.nodeType===3&&n.textContent.trim().length)return true;return false;}
  function ctx(el){
    // walk up: detect bg-image, gradient, bg-clip text, and first solid bg color
    let node=el, bgImage=false, bgClipText=false, solid=null, depth=0;
    const cs0=getComputedStyle(el);
    if((cs0.webkitBackgroundClip==='text'||cs0.backgroundClip==='text')) bgClipText=true;
    while(node&&node.nodeType===1&&depth<12){
      const cs=getComputedStyle(node);
      if(cs.backgroundImage&&cs.backgroundImage!=='none') bgImage=true;
      const bg=parseColor(cs.backgroundColor);
      if(!solid&&bg&&bg.a>0) solid={r:bg.r,g:bg.g,b:bg.b,a:1};
      node=node.parentElement; depth++;
    }
    if(!solid) solid={r:255,g:255,b:255,a:1};
    return {bgImage,bgClipText,solid};
  }
  const out=[];
  const els=Array.from(document.querySelectorAll('a,button,span,p,h1,h2,h3,h4,h5,h6,li,label,small,strong,em'));
  for(const el of els){
    if(!hasText(el)||!isVis(el))continue;
    const cs=getComputedStyle(el);
    const fg=parseColor(cs.color); if(!fg)continue;
    const c=ctx(el);
    const fgc=fg.a<1?blend(fg,c.solid):fg;
    const cr=Math.round(ratio(fgc,c.solid)*100)/100;
    const fs=parseFloat(cs.fontSize); const fw=parseInt(cs.fontWeight)||400;
    const large=fs>=24||(fs>=18.66&&fw>=700);
    const thr=large?3:4.5;
    if(cr<thr){
      out.push({text:(el.textContent||'').trim().slice(0,42),tag:el.tagName.toLowerCase(),
        color:cs.color,solidBg:`rgb(${Math.round(c.solid.r)},${Math.round(c.solid.g)},${Math.round(c.solid.b)})`,
        fs,large,ratio:cr,overImage:c.bgImage,bgClipText:c.bgClipText});
    }
  }
  // dedupe
  const seen=new Set(),u=[];
  for(const f of out){const k=f.text+'|'+f.color+'|'+f.ratio;if(seen.has(k))continue;seen.add(k);u.push(f);}
  u.sort((a,b)=>a.ratio-b.ratio);
  // split: real (solid bg, not over image, not bg-clip text) vs suspect (over image or bg-clip)
  const real=u.filter(f=>!f.overImage&&!f.bgClipText);
  const suspect=u.filter(f=>f.overImage||f.bgClipText);

  // images detailed
  const imgs=Array.from(document.querySelectorAll('img')).map(im=>({
    src:(im.currentSrc||im.src||'').slice(-60), complete:im.complete, natW:im.naturalWidth, natH:im.naturalHeight,
    loading:im.getAttribute('loading'), alt:(im.alt||'').slice(0,30),
    inView:(()=>{const r=im.getBoundingClientRect();return r.top<window.innerHeight&&r.bottom>0;})()
  }));
  return JSON.stringify({realFails:real, realCount:real.length, suspectCount:suspect.length, suspect:suspect.slice(0,15), images:imgs});
}
