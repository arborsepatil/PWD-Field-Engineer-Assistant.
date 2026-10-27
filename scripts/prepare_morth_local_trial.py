#!/usr/bin/env python3
"""Generate a local-only MoRTH reference trial. Do NOT publish the output.

Run: python3 scripts/prepare_morth_local_trial.py
Output: local-morth-trial-dist/
Original MoRTH PDF and private Drive URLs are never bundled.
"""
from pathlib import Path
import re
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public-dist"
OUT = ROOT / "local-morth-trial-dist"
MODULES = [
    "morth-section-2500.js", "morth-section-2600.js",
    "morth-section-2611-2612.js", "morth-section-2613-2615.js",
    "morth-section-2700.js", "morth-section-2800.js",
    "morth-section-2900.js", "morth-section-3000.js",
    "morth-section-3100.js", "morth-section-100-300.js"
]
ADDITIONS = ["morth_reader.html", "pdf_viewer.html", *MODULES]
PRIVATE_ORIGINS = (
    "drive.google.com/file/d/", "drive.google.com/drive/folders/",
    "docs.google.com/document/d/", "docs.google.com/spreadsheets/d/"
)

# Start with the same allowlisted public assets, not the entire repository.
subprocess.run([sys.executable, str(ROOT / "scripts/prepare_public_site.py")], check=True)
if OUT.exists():
    shutil.rmtree(OUT)
shutil.copytree(PUBLIC, OUT)
for asset in ADDITIONS:
    source = ROOT / asset
    if not source.is_file():
        raise FileNotFoundError("Missing MoRTH module: " + asset)
    body = source.read_text(encoding="utf-8")
    if any(origin in body for origin in PRIVATE_ORIGINS):
        raise ValueError("Private source URL in: " + asset)
    shutil.copy2(source, OUT / asset)

library = OUT / "library.html"
page = library.read_text(encoding="utf-8")
marker = ' <div class="lib-search"><label for="libSearch">'
assert page.count(marker) == 1
page = page.replace(marker, ''' <section class="ssr-entry" id="morthLocalReference" aria-label="Local MoRTH reference">
  <a href="./morth_reader.html">MoRTH 2013 · Search clause reference</a>
  <p>Offline JE Quick View, selected source-checked tables and printed page references. Partial reference only; confirm the original specification and applicable contract. PDF not bundled.</p>
 </section>
''' + marker)
render_marker = "  get('digitalSSR').hidden=section!=='ssr';"
assert page.count(render_marker) == 1
page = page.replace(render_marker, render_marker + '''
  const localTerms='morth road bridge specifications 2013 fifth revision clauses qc engineering';
  get('morthLocalReference').hidden=!((section==='all'||section==='spec')&&(!q||localTerms.includes(q)));''')
library.write_text(page, encoding="utf-8")

swfile = OUT / "sw.js"
sw = swfile.read_text(encoding="utf-8")
version = re.search(r"const CACHE='([^']+)'", sw)
assert version
sw = sw.replace(version.group(0), "const CACHE='pwd-tools-local-morth-2013-v1-2026-10-27'")
end = "'./gr_library.html'];"
assert sw.count(end) == 1
sw = sw.replace(end, "'./gr_library.html'," +
                ",".join("'./" + file + "'" for file in ADDITIONS) + "];")
swfile.write_text(sw, encoding="utf-8")

assert not list(OUT.glob("*.pdf")), "Original publication PDF must remain private"
for file in ADDITIONS:
    assert (OUT / file).is_file(), "Trial asset missing: " + file
for forbidden in ("library-drive-catalog.js", "library-offline.js",
                  "bridge_book_2002.html", "bridge_book_2023.html"):
    assert not (OUT / forbidden).exists(), "Unapproved reference: " + forbidden
(OUT / "LOCAL_TRIAL_README.txt").write_text(
    "CIVIL BANDHU MoRTH 2013 LOCAL TRIAL ONLY\n"
    "Partial source-checked clause reference; not the full specification.\n"
    "The original MoRTH PDF is not bundled. The PDF viewer imports only your own copy.\n"
    "Use HTTPS or localhost for the PWA. Check airplane-mode offline use after first load.\n"
    "Do not deploy this local package to public GitHub Pages or an app store.\n",
    encoding="utf-8")
print(f"MoRTH local trial prepared: {len(list(OUT.iterdir()))} assets, "
      f"{len(MODULES)} extension modules, no private PDFs.")
