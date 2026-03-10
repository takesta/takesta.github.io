#!/usr/bin/env python3
"""Apply content from reconstructed-src/Prospective.js into production bundle.

Use this only in this static-artifact repository where source code is unavailable.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path


def extract_text(jsx_text: str) -> tuple[str, str]:
    h2 = re.search(r"<h2>(.*?)</h2>", jsx_text, re.DOTALL)
    p = re.search(r"<p>(.*?)</p>", jsx_text, re.DOTALL)
    if not h2 or not p:
        raise SystemExit("Could not find <h2> and <p> in Prospective.js")
    return h2.group(1).strip(), p.group(1).strip()


def to_bundle_string(value: str) -> str:
    escaped = value.encode("unicode_escape").decode("ascii")
    escaped = escaped.replace('"', r'\"')
    return escaped


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", default="reconstructed-src/Prospective.js")
    parser.add_argument("--bundle", default="static/js/main.7c07dc9d.js")
    parser.add_argument("--map", default="static/js/main.7c07dc9d.js.map")
    args = parser.parse_args()

    source_path = Path(args.source)
    bundle_path = Path(args.bundle)
    map_path = Path(args.map)

    h2_text, p_text = extract_text(source_path.read_text(encoding="utf-8"))
    h2_bundle = to_bundle_string(h2_text)
    p_bundle = to_bundle_string(p_text)

    bundle = bundle_path.read_text(encoding="utf-8")
    pattern = re.compile(
        r'\(0,xt\.jsx\)\("h2",\{children:"(?P<h2>.*?)"\}\),\(0,xt\.jsx\)\("p",\{children:"(?P<p>.*?)"\}\)',
        re.DOTALL,
    )

    match = pattern.search(bundle)
    if not match:
        raise SystemExit("Could not locate Prospective component text in bundle")

    replacement = (
        f'(0,xt.jsx)("h2",{{children:"{h2_bundle}"}}),(0,xt.jsx)("p",{{children:"{p_bundle}"}})'
    )
    updated_bundle = pattern.sub(lambda _m: replacement, bundle, count=1)
    bundle_path.write_text(updated_bundle, encoding="utf-8")

    # Keep sourcemap's Prospective.js source in sync for easier future editing.
    data = json.loads(map_path.read_text(encoding="utf-8"))
    if "Prospective.js" in data.get("sources", []):
        idx = data["sources"].index("Prospective.js")
        data["sourcesContent"][idx] = source_path.read_text(encoding="utf-8")
        map_path.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")

    print("Applied Prospective content to bundle and updated sourcemap entry")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
