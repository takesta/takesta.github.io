#!/usr/bin/env python3
"""Reconstruct readable source files from a bundled JS source map.

This is intended for local developer readability only.
It does not modify production bundle files.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path


def should_include(source_path: str) -> bool:
    # Keep app-level files and skip vendor/runtime internals.
    return not source_path.startswith("../")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--map",
        default="static/js/main.7c07dc9d.js.map",
        help="Path to source map JSON",
    )
    parser.add_argument(
        "--out",
        default="reconstructed-src",
        help="Output directory for reconstructed files",
    )
    args = parser.parse_args()

    map_path = Path(args.map)
    out_dir = Path(args.out)

    data = json.loads(map_path.read_text(encoding="utf-8"))
    sources = data.get("sources", [])
    contents = data.get("sourcesContent", [])

    if len(sources) != len(contents):
        raise SystemExit("Invalid sourcemap: sources and sourcesContent length mismatch")

    out_dir.mkdir(parents=True, exist_ok=True)
    count = 0

    for source, content in zip(sources, contents):
        if content is None or not should_include(source):
            continue

        # Normalize path inside output dir.
        rel = Path(source.replace('\\', '/')).name
        destination = out_dir / rel
        destination.write_text(content, encoding="utf-8")
        count += 1

    summary = out_dir / "_reconstruction_summary.txt"
    summary.write_text(
        f"Reconstructed {count} app source files from {map_path}\n",
        encoding="utf-8",
    )

    print(f"Reconstructed {count} files into {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
