#!/usr/bin/env python3
"""Build a public-only static website for GitHub Pages.

Never upload the whole repository. Reuse the Android exclusion policy, retain
only root-level web assets, and fail closed for private Drive links or PDF bytes.
This is a packaging safeguard, not a copyright clearance for any document.
"""
from pathlib import Path
import ast
import shutil

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "public-dist"
PACKAGER = ROOT / "android/scripts/prepare_assets.py"
EXTENSIONS = {".html", ".js", ".css", ".json", ".svg", ".png", ".webp", ".jpg", ".jpeg"}
PRIVATE_ORIGINS = (
    "drive.google.com/file/d/",
    "drive.google.com/drive/folders/",
    "docs.google.com/spreadsheets/d/",
    "docs.google.com/document/d/",
)

package_ast = ast.parse(PACKAGER.read_text(encoding="utf-8"))
exclude_nodes = [
    n.value for n in package_ast.body if isinstance(n, ast.Assign)
    and any(isinstance(t, ast.Name) and t.id == "EXCLUDED" for t in n.targets)
]
assert len(exclude_nodes) == 1, "Android exclusion list not unambiguous"
EXCLUDED = set(ast.literal_eval(exclude_nodes[0]))
# Service worker is required for the web edition, not the native APK.
EXCLUDED.discard("sw.js")

if SITE.exists():
    shutil.rmtree(SITE)
SITE.mkdir(parents=True)
for file in ROOT.iterdir():
    if not file.is_file() or file.suffix.lower() not in EXTENSIONS:
        continue
    if file.name in EXCLUDED or file.name.startswith("morth-"):
        continue
    if file.suffix.lower() in {".html", ".js", ".json"}:
        body = file.read_text(encoding="utf-8")
        assert not any(origin in body for origin in PRIVATE_ORIGINS), (
            f"Private Drive source found in public site: {file.name}"
        )
    shutil.copy2(file, SITE / file.name)

import subprocess
import sys
subprocess.run([sys.executable, str(ROOT / "scripts/generate_civilbandhu_icons.py"), str(SITE)], check=True)

for required in ("index.html", "sw.js", "library.html", "library-public-catalog.js",
                 "pwd_bridge_plans.html"):
    assert (SITE / required).is_file(), f"Missing public asset: {required}"
for forbidden in ("pdf_viewer.html", "library-offline.js", "library-drive-catalog.js",
                  "library-private-pdf.js", "bridge-local-source.js",
                  "bridge_book_2002.html", "bridge_book_2023.html",
                  "morth_reader.html", "pwd_rule_book.html", "red_book_reader.html"):
    assert not (SITE / forbidden).exists(), f"Private-reference asset published: {forbidden}"
assert not list(SITE.glob("*.pdf")), "Public website must not upload original PDFs"
assert not list(SITE.glob("morth-*")), "Unapproved MoRTH-derived modules still present"
print(f"Public GitHub Pages build passed: {len(list(SITE.iterdir()))} allowlisted web assets.")
