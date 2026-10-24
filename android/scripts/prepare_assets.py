#!/usr/bin/env python3
"""Package the existing verified civil-engineering screens INSIDE a real Android APK.

Only public application assets are copied. Private PDF originals must remain private
and are imported by the user through the Android file picker after installation.
"""
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[2]
OUTPUT = ROOT / "android/app/src/main/assets/www"
EXTENSIONS = {".html", ".js", ".css", ".json", ".svg", ".png", ".webp", ".jpg", ".jpeg"}
# Exclude retired book-import/viewer code: public distribution must never grant
# user-private Drive or downloaded licensed-PDF access through bundled controls.
# Bridge index metadata remains available, but original private PDFs do not.
EXCLUDED = {
    "sw.js", "rcc-wall-2023-bbs.js",
    "library-offline.js", "library-drive-catalog.js", "library-private-pdf.js",
    "pdf_viewer.html", "bridge-local-source.js", "bridge-pdf-canvas.js",
    "bridge_book_2002.html", "bridge_book_2023.html",
    "bridge-2002-drawing-audit.js", "bridge-2023-drawing-audit.js",
    "pwd_rule_book.html", "red_book_reader.html", "morth_reader.html",
}
OUTPUT.mkdir(parents=True, exist_ok=True)
# A previous local build may have copied these files before V34; remove stale
# assets before packaging rather than trusting exclusions on a clean runner.
for retired in EXCLUDED:
    (OUTPUT / retired).unlink(missing_ok=True)
for retired in OUTPUT.glob("morth-*"):
    retired.unlink(missing_ok=True)
count = 0
for file in ROOT.iterdir():
    if (not file.is_file() or file.suffix.lower() not in EXTENSIONS or
            file.name in EXCLUDED or file.name.startswith("morth-")):
        continue
    shutil.copy2(file, OUTPUT / file.name)
    count += 1

import subprocess
import sys
subprocess.run([sys.executable, str(ROOT / "scripts/generate_civilbandhu_icons.py"), str(OUTPUT)], check=True)

index_path = OUTPUT / "index.html"
page = index_path.read_text(encoding="utf-8")
# Android bundles public assets within the APK: no browser installation prompt
# or service worker should run inside native WebView.
assert 'id="installHelp"' not in page, "V20 Home must not show PWA/browser install copy"
start = page.find("if('serviceWorker' in navigator){")
end_marker = "}else offlineStatus.textContent='Online only';"
end = page.find(end_marker, start)
if start < 0 or end < 0:
    raise RuntimeError("Unexpected V20 Home service-worker script; inspect before Android packaging.")
page = page[:start] + "offlineStatus.textContent='● Ready offline';" + page[end + len(end_marker):]
index_path.write_text(page, encoding="utf-8")
assert "navigator.serviceWorker.register" not in page
assert len(list(OUTPUT.glob("*.html"))) >= 10
assert not any(p.suffix.lower() == ".pdf" for p in OUTPUT.iterdir())
# All legacy Drive private/publication IDs have been withdrawn from the distributed
# catalogue and legacy PDF viewer. A public publisher link is not a redistributed book.
assert (OUTPUT / "library-public-catalog.js").exists(), "Public publisher catalogue not packaged"
assert not (OUTPUT / "library-drive-catalog.js").exists(), "No retired Drive catalogue in shared APK"
assert not (OUTPUT / "pdf_viewer.html").exists(), "No retired private viewer in shared APK"
assert "drive.google.com/file/d/" not in (OUTPUT / "library.html").read_text(encoding="utf-8")
# All exported HTML/JS is scanned, not just the Library and PDF viewer. This
# also catches accidental private work-register URLs in other modules.
PRIVATE_PROVIDER_URLS = (
    "drive.google.com/file/d/", "drive.google.com/drive/folders/",
    "docs.google.com/spreadsheets/d/", "docs.google.com/document/d/",
)
for bundled in OUTPUT.iterdir():
    if bundled.is_file() and bundled.suffix.lower() in {".html", ".js", ".json"}:
        data = bundled.read_text(encoding="utf-8")
        assert not any(link in data for link in PRIVATE_PROVIDER_URLS), (
            f"Private Google Drive/Docs link must not ship inside shared app: {bundled.name}"
        )
for retired in EXCLUDED:
    assert not (OUTPUT / retired).exists(), f"Retired or private PDF component must not ship: {retired}"
assert not list(OUTPUT.glob("morth-*")), "Unapproved MoRTH-derived publication content must not ship"
assert "bridge_book_2002.html" not in (OUTPUT / "pwd_bridge_plans.html").read_text(encoding="utf-8")
assert "bridge_book_2023.html" not in (OUTPUT / "pwd_bridge_plans.html").read_text(encoding="utf-8")
assert (OUTPUT / "library-public-catalog.js").exists()


print(f"Android offline APK assets prepared: {count} public files, "
      f"{len(list(OUTPUT.glob('*.html')))} HTML screens, no private PDFs, no PWA registration")
