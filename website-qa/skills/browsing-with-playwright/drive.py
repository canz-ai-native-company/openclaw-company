#!/usr/bin/env python3
import json, sys, os, re, importlib.util
spec = importlib.util.spec_from_file_location("mc", "scripts/mcp-client.py")
mc = importlib.util.module_from_spec(spec); spec.loader.exec_module(mc)
URL = "https://web-ipvh92p73-rrizwan1998-2036s-projects.vercel.app"

def run(code, timeout=110):
    client = mc.MCPClient(mc.HTTPTransport("http://localhost:8808"))
    # bump transport timeout if supported
    res = client.call_tool("browser_run_code_unsafe", {"code": code})
    return res["content"][0]["text"]

def extract_json(txt):
    m = re.search(r'### Result\n"(.*)"\n### Ran', txt, re.S)
    if not m:
        m = re.search(r'### Result\n(.*)\n### Ran', txt, re.S)
        if not m: return None, txt[:800]
        return json.loads(m.group(1)), None
    return json.loads(json.loads('"' + m.group(1) + '"')), None

mode = sys.argv[1]
W = int(sys.argv[2]); H = int(sys.argv[3])

prep = f"""
  await page.setViewportSize({{ width: {W}, height: {H} }});
  await page.goto('{URL}', {{ waitUntil: 'load', timeout: 50000 }}).catch(()=>{{}});
  await page.waitForTimeout(1800);
  await page.evaluate(async () => {{ await new Promise(res => {{ let y=0; const t=setInterval(()=>{{ window.scrollBy(0,800); y+=800; if(y>document.body.scrollHeight){{clearInterval(t);res();}} }},60); }}); }});
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0,0));
  await page.waitForTimeout(300);
"""

if mode == "measure":
    measure = open("measure.js").read().strip()
    expr = "(" + measure + ")()"
    code = f"async (page) => {{{prep}  const data = await page.evaluate({json.dumps(expr)});\n  return JSON.stringify(data);\n}}"
    txt = run(code)
    data, err = extract_json(txt)
    if data is None:
        print("ERR:", err); sys.exit(1)
    out = sys.argv[4]
    json.dump(data, open(out, "w"), indent=2)
    print("OK", out)
elif mode == "shot":
    fold = sys.argv[4]; full = sys.argv[5]
    code = f"async (page) => {{{prep}  await page.screenshot({{path:'./{fold}',fullPage:false,type:'png'}});\n  await page.screenshot({{path:'./{full}',fullPage:true,type:'png'}});\n  return JSON.stringify({{ok:true, url: page.url()}});\n}}"
    txt = run(code)
    print(txt[:400])
