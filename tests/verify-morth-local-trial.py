#!/usr/bin/env python3
"""MoRTH local trial build and privacy/offline asset smoke checks."""
from pathlib import Path
import ast
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable, str(ROOT / "scripts/prepare_morth_local_trial.py")], check=True)
PUBLIC = ROOT / "public-dist"
LOCAL = ROOT / "local-morth-trial-dist"
public_library = (PUBLIC / "library.html").read_text(encoding="utf-8")
local_library = (LOCAL / "library.html").read_text(encoding="utf-8")
public_sw = (PUBLIC / "sw.js").read_text(encoding="utf-8")
local_sw = (LOCAL / "sw.js").read_text(encoding="utf-8")
reader = (LOCAL / "morth_reader.html").read_text(encoding="utf-8")
loader = (LOCAL / "app-shell.js").read_text(encoding="utf-8")

assert "morthLocalReference" in local_library
assert "./morth_reader.html" in local_library
assert "./morth_reader.html" not in public_library, "Public Library exposed private reader"
assert "'./morth_reader.html'" not in public_sw, "Public worker precached private reader"
assert "'./morth_reader.html'" in local_sw
assert "qc.html" not in reader, "Removed QC screen referenced"
assert "The original PDF is not bundled" in reader
assert "Only individually source-checked MoRTH clauses" in reader

modules = re.findall(r"'./(morth-section-[^']+\.js)'", loader)
assert len(modules) == 10 and len(set(modules)) == 10, "Expected 10 reader modules"
for name in modules:
    assert (LOCAL / name).exists(), "Missing reader module: " + name
    assert "'./" + name + "'" in local_sw, "Missing offline preload: " + name
asset_string = local_sw.split("const SHELL=[", 1)[1].split("];", 1)[0]
assets = ast.literal_eval("[" + asset_string + "]")
assert len(assets) == len(set(assets)), "Duplicate offline assets"
for path in assets:
    assert path.startswith("./")
    file = path[2:] or "index.html"
    assert (LOCAL / file).exists(), "Missing offline asset: " + path
assert not list(LOCAL.glob("*.pdf")), "Private original PDF included"
assert not (PUBLIC / "morth_reader.html").exists()
print(f"PASS MoRTH local trial: {len(assets)} cache assets, "
      f"{len(modules)} modules, private source excluded, public site unchanged")
