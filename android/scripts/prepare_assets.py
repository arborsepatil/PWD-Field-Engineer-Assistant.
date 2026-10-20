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
# Strip PWA installation help from the Android version (website remains an optional demo).
assert 'id="installHelp"' in page, "Expected web installation copy changed"
page = page.replace('</head>', '<style>#install,#installHelp{display:none!important}</style></head>', 1)
start = page.find("if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register")
end_marker = "else status.textContent='Offline unsupported';"
end = page.find(end_marker, start)
if start < 0 or end < 0:
    raise RuntimeError("Unexpected install/service-worker script; review Android asset packaging.")
page = page[:start] + "status.textContent='✓ Android app assets offline';" + page[end + len(end_marker):]
index_path.write_text(page, encoding="utf-8")
assert "navigator.serviceWorker.register" not in page
assert len(list(OUTPUT.glob("*.html"))) >= 10
assert not any(p.suffix.lower() == ".pdf" for p in OUTPUT.iterdir())
print(f"Android offline APK assets prepared: {count} public files, "
      f"{len(list(OUTPUT.glob('*.html')))} HTML screens, no private PDFs, no PWA registration")
