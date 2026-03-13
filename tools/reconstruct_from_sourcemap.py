#!/usr/bin/env python3
"""Reconstruct readable source files from a bundled JS source map.

This is intended for local developer readability only.
It does not modify production bundle files.
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Iterable


DEFAULT_MAP_PATH = "static/js/main.7c07dc9d.js.map"
DEFAULT_OUTPUT_DIR = "reconstructed-src"
SUMMARY_FILE_NAME = "_reconstruction_summary.txt"


def should_include(source_path: str) -> bool:
    """Keep app-level files and skip vendor/runtime internals."""
    return not source_path.startswith("../")


def normalize_relative_source_path(source_path: str) -> Path:
    """Normalize source-map entries into a stable relative filesystem path."""
    normalized = source_path.replace("\\", "/")
    while normalized.startswith("./"):
        normalized = normalized[2:]
    return Path(normalized)


def build_destination_path(source_path: str, output_dir: Path) -> Path:
    """Build the full destination path for one source file."""
    relative_path = normalize_relative_source_path(source_path)
    return output_dir / relative_path


def iter_reconstructable_sources(
    sources: list[str],
    contents: list[str | None],
) -> Iterable[tuple[str, str]]:
    """Yield source-path/content pairs that should be reconstructed."""
    for source_path, content in zip(sources, contents):
        if content is None or not should_include(source_path):
            continue
        yield source_path, content


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--map",
        default=DEFAULT_MAP_PATH,
        help="Path to source map JSON",
    )
    parser.add_argument(
        "--out",
        default=DEFAULT_OUTPUT_DIR,
        help="Output directory for reconstructed files",
    )
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    map_path = Path(args.map)
    output_dir = Path(args.out)

    source_map = json.loads(map_path.read_text(encoding="utf-8"))
    sources: list[str] = source_map.get("sources", [])
    contents: list[str | None] = source_map.get("sourcesContent", [])

    if len(sources) != len(contents):
        raise SystemExit("Invalid sourcemap: sources and sourcesContent length mismatch")

    output_dir.mkdir(parents=True, exist_ok=True)
    reconstructed_count = 0

    for source_path, content in iter_reconstructable_sources(sources, contents):
        destination = build_destination_path(source_path, output_dir)
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_text(content, encoding="utf-8")
        reconstructed_count += 1

    summary_path = output_dir / SUMMARY_FILE_NAME
    summary_path.write_text(
        f"Reconstructed {reconstructed_count} app source files from {map_path}\n",
        encoding="utf-8",
    )

    print(f"Reconstructed {reconstructed_count} files into {output_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
