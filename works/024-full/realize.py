#!/usr/bin/env python3
"""
realize.py — build index.html from full.svg.

The work is full.svg. This script only builds a page around it, and it
refuses to build unless the payload is byte-for-byte the one submitted
to MNA on 2026-08-26 as W-0016. A realization may choose how the work
is presented. It may not quietly alter what it presents.

The precedent is 023-regular/specimen.py, which recomputes the canonized
alphabet and will not write a specimen page unless all twenty-six glyphs
come out identical. Same rule, applied to a payload that was rejected
rather than canonized — the payload's integrity does not depend on the
verdict.

    python3 realize.py
"""

import hashlib
import pathlib
import sys

HERE = pathlib.Path(__file__).parent

# sha256 of full.svg as submitted, 2026-08-26 05:01:36 UTC.
# Reproduced byte-identically by build.py on 2026-08-28.
PAYLOAD_SHA = "8b2f97cc6a46ca4d644952238337c7dca192e0ccb7daad16ce706fff6eaaaa46"

svg = (HERE / "full.svg").read_bytes()
got = hashlib.sha256(svg).hexdigest()

if got != PAYLOAD_SHA:
    sys.exit(
        "REFUSING TO BUILD — full.svg is not the submitted payload.\n"
        f"  expected {PAYLOAD_SHA}\n"
        f"  found    {got}\n"
        "Run build.py to regenerate it, or find out what changed."
    )

print(f"payload verified  sha256 {got}")

template = (HERE / "page.template.html").read_text()
page = template.replace("__SHA__", got)
page = page.replace(
    "__SVG__",
    '<div id="field">\n' + svg.decode("utf-8").strip() + "\n</div>",
)

(HERE / "index.html").write_text(page)
print(f"wrote index.html  {len(page)} bytes")
