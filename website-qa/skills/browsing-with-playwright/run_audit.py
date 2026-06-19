#!/usr/bin/env python3
import json, subprocess, sys, os

URL = "https://web-ipvh92p73-rrizwan1998-2036s-projects.vercel.app"
HERE = os.path.dirname(os.path.abspath(__file__))
measure = open(os.path.join(HERE, "measure.js")).read().strip()

# args: viewport width, height, fold_name, full_name, out_json
W = int(sys.argv[1]); H = int(sys.argv[2])
fold = sys.argv[3]; full = sys.argv[4]; outjson = sys.argv[5]
wait_ms = 2800

# Build an atomic node-side run_code that does everything on ONE page object.
code = f"""async (page) => {{
  await page.setViewportSize({{ width: {W}, height: {H} }});
  await page.goto('{URL}', {{ waitUntil: 'networkidle', timeout: 60000 }}).catch(()=>{{}});
  await page.waitForTimeout({wait_ms});
  // scroll through to trigger lazy loads
  await page.evaluate(async () => {{
    await new Promise(res => {{ let y=0; const t=setInterval(()=>{{ window.scrollBy(0,600); y+=600; if(y>document.body.scrollHeight){{clearInterval(t);res();}} }},80); }});
  }});
  await page.waitForTimeout(800);
  await page.evaluate(() => window.scrollTo(0,0));
  await page.waitForTimeout(400);
  const consoleErrors = [];
  page.on('console', m => {{ if (m.type()==='error') consoleErrors.push(m.text()); }});
  await page.screenshot({{ path: './{fold}', fullPage: false, type: 'png' }});
  await page.screenshot({{ path: './{full}', fullPage: true, type: 'png' }});
  // web vitals
  const vitals = await page.evaluate(() => {{
    const nav = performance.getEntriesByType('navigation')[0] || {{}};
    const paints = performance.getEntriesByType('paint');
    const fcp = (paints.find(p=>p.name==='first-contentful-paint')||{{}}).startTime;
    let lcp = 0;
    const lcpE = performance.getEntriesByType('largest-contentful-paint');
    if (lcpE.length) lcp = lcpE[lcpE.length-1].startTime;
    return {{ ttfb_ms: Math.round(nav.responseStart||0), fcp_ms: Math.round(fcp||0),
      lcp_ms: Math.round(lcp||0), load_ms: Math.round(nav.loadEventEnd||0),
      domContentLoaded_ms: Math.round(nav.domContentLoadedEventEnd||0) }};
  }});
  const data = await page.evaluate({json.dumps(measure)});
  data.vitals = vitals;
  data.consoleErrors = consoleErrors;
  return JSON.stringify(data);
}}"""

params = json.dumps({"code": code})
p = subprocess.run(
    ["python3", os.path.join(HERE, "scripts", "mcp-client.py"), "call",
     "-u", "http://localhost:8808", "-t", "browser_run_code_unsafe", "-p", params],
    capture_output=True, text=True)
out = p.stdout + p.stderr
# extract the JSON the tool returned (it's embedded in markdown "### Result")
# Find the JSON.stringify payload
import re
# The result text contains \n-escaped; find first '{' that starts our data after "Result"
idx = out.find('"### Result')
chunk = out[idx:] if idx >= 0 else out
# The payload is a JSON string within the text field. Try to locate the {\"viewport\" ...}
m = re.search(r'\{\\"viewport\\".*?\\"consoleErrors\\":\s*\[[^\]]*\]\}', chunk)
if not m:
    # fallback: dump raw for debugging
    open(outjson + ".raw", "w").write(out)
    print("PARSE_FAIL — raw saved to", outjson + ".raw")
    print(out[:1500])
    sys.exit(1)
payload = m.group(0).replace('\\"', '"').replace('\\n', ' ').replace('\\\\', '\\')
try:
    data = json.loads(payload)
except Exception as e:
    open(outjson + ".raw", "w").write(out)
    print("JSON load fail:", e, "raw saved"); sys.exit(1)
json.dump(data, open(outjson, "w"), indent=2)
print("OK saved", outjson)
# brief summary
print("viewport", data.get("viewport"))
print("contrast failCount", data["contrast"]["failCount"], "checked", data["contrast"]["checked"])
print("tapTargets subMin", data["tapTargets"]["subMin"], "/", data["tapTargets"]["totalVisibleInteractive"])
print("ga", json.dumps(data["ga"]))
print("trust", json.dumps(data["trust"]))
print("overflow", json.dumps(data["overflow"]))
print("vitals", json.dumps(data["vitals"]))
print("consoleErrors", len(data["consoleErrors"]))
