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
EXCLUDED = {"sw.js", "rcc-wall-2023-bbs.js"}  # Defer BBS cutting; do not ship future-only calculation code in APK.
OUTPUT.mkdir(parents=True, exist_ok=True)
count = 0
for file in ROOT.iterdir():
    if not file.is_file() or file.suffix.lower() not in EXTENSIONS or file.name in EXCLUDED:
        continue
    shutil.copy2(file, OUTPUT / file.name)
    count += 1

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
assert "window.PWDDrivePDFCatalog=[]" in (OUTPUT / "library-drive-catalog.js").read_text(encoding="utf-8")
assert "drive.google.com/file/d/" not in (OUTPUT / "library.html").read_text(encoding="utf-8")
assert "drive.google.com/file/d/" not in (OUTPUT / "pdf_viewer.html").read_text(encoding="utf-8")

print(f"Android offline APK assets prepared: {count} public files, "
      f"{len(list(OUTPUT.glob('*.html')))} HTML screens, no private PDFs, no PWA registration")
