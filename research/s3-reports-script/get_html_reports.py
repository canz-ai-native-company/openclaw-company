#!/usr/bin/env python3
"""
get_html_reports.py — fetch verified HTML report URLs from S3 for a given client_id.

Behavior:
  1. Auto-loads .env from script's own directory (overrides any stale shell env).
  2. Reads all 8 report URL columns from public.super_app for the given client_id.
  3. For each URL, generates candidate HTML variants (as-is, swap .pdf→.html, append .html).
  4. HEAD-verifies every candidate against S3 (only 200 + text/html kept).
  5. Returns unique verified HTML URLs.

Handles both URL patterns seen in the DB:
  - Standard:  .../radar/<client>/<timestamp>/feature_gap.pdf  → swaps to .html
  - Legacy:    .../natik+ameen+-+%2FFeature-Gap (no extension) → appends .html
  - Already-html URLs pass through unchanged.

Usage:
    python3 get_html_reports.py <client_id>

    # or as module:
    import asyncio
    from get_html_reports import get_html_report_urls
    urls = asyncio.run(get_html_report_urls("53ed3463-..."))

Output: one verified HTML URL per line; exit code 0 success, 2 if none found.
"""
import asyncio
import os
import sys
from pathlib import Path
from typing import List
from urllib import error as urlerr
from urllib import request as urlreq

import asyncpg

# --- Auto-load .env from script directory (overrides shell env) ---
SCRIPT_DIR = Path(__file__).resolve().parent
_env_path = SCRIPT_DIR / ".env"
if _env_path.exists():
    for _line in _env_path.read_text().splitlines():
        _line = _line.strip()
        if not _line or _line.startswith("#") or "=" not in _line:
            continue
        _k, _, _v = _line.partition("=")
        os.environ[_k.strip()] = _v.strip().strip('"').strip("'")

# --- Defaults ---
DEFAULT_DB_URL = (
    "postgresql://lma-marketing-flows-api-user:lma_marketingflows_canzmarketing_api"
    "@ep-long-paper-ad4708mf.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
)

REPORT_COLS = [
    "ra_feature_gap_url",
    "ra_competitor_landscape_url",
    "ra_market_trends_url",
    "ra_pricing_benchmark_url",
    "ra_detailed_competitor_url",
    "ra_cro_url",
    "ra_dro_url",
    "ra_spd_url",
]


def html_candidates(url: str) -> List[str]:
    """Return possible HTML URL variants for a DB-stored URL."""
    if not url:
        return []
    lower = url.lower()
    cands = []
    if lower.endswith(".html"):
        cands.append(url)
    elif lower.endswith(".pdf"):
        cands.append(url[:-4] + ".html")
        cands.append(url)  # also try as-is in case content-type happens to be html
    elif lower.endswith(".htm"):
        cands.append(url[:-4] + ".html")
    else:
        # No file extension — try as-is and with .html appended
        cands.append(url + ".html")
        cands.append(url)
    # Dedupe preserve order
    seen = set()
    out = []
    for c in cands:
        if c not in seen:
            seen.add(c)
            out.append(c)
    return out


def head_html(url: str, timeout: int = 10) -> bool:
    """HEAD request — True only if status 200 and Content-Type contains text/html."""
    try:
        req = urlreq.Request(url, method="HEAD")
        with urlreq.urlopen(req, timeout=timeout) as resp:
            ctype = (resp.headers.get("Content-Type") or "").lower()
            return resp.status == 200 and "text/html" in ctype
    except (urlerr.HTTPError, urlerr.URLError, TimeoutError, OSError):
        return False


async def get_html_report_urls(client_id: str, db_url: str = None) -> List[str]:
    """Return list of S3-verified HTML report URLs for the given client_id."""
    db_url = db_url or os.getenv("DATABASE_URL", DEFAULT_DB_URL)
    conn = await asyncpg.connect(db_url)
    try:
        col_list = ", ".join(f'"{c}"' for c in REPORT_COLS)
        row = await conn.fetchrow(
            f"SELECT {col_list} FROM public.super_app WHERE client_id = $1",
            client_id,
        )
        if not row:
            return []
        raw_urls = [row[c] for c in REPORT_COLS if row[c]]
    finally:
        await conn.close()

    if not raw_urls:
        return []

    all_candidates = []
    for raw in raw_urls:
        all_candidates.extend(html_candidates(raw))

    # Parallel HEAD checks
    loop = asyncio.get_event_loop()
    results = await asyncio.gather(
        *(loop.run_in_executor(None, head_html, url) for url in all_candidates)
    )

    # Keep first verified candidate per unique URL
    seen = set()
    verified = []
    for url, ok in zip(all_candidates, results):
        if ok and url not in seen:
            seen.add(url)
            verified.append(url)
    return verified


async def main():
    if len(sys.argv) != 2:
        print("Usage: python3 get_html_reports.py <client_id>", file=sys.stderr)
        sys.exit(1)
    client_id = sys.argv[1].strip()
    urls = await get_html_report_urls(client_id)
    if not urls:
        print(
            f"(no S3-verified HTML reports found for client_id={client_id})",
            file=sys.stderr,
        )
        sys.exit(2)
    for url in urls:
        print(url)


if __name__ == "__main__":
    asyncio.run(main())
