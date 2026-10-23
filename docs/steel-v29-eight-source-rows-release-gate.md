# Steel Table V29 — small source-audit batch, 23 October 2026

**Project boundary:** PWD Field Engineer Assistant only; no MPR Management, Estimate Creator or separate apps.

## Source authority / source restrictions
Private user-held BIS IS 808:2021 (Fourth Revision), physical 60-page PDF. On 23 October 2026, inspect its original Table 1 on **physical PDF pages 7 and 8** using both extracted text and rendered page images. The authorised original source stays in the user's private Drive; **do not commit, bundle, distribute or share the PDF**.

## Batch 1: eight section records
Audit-only ledger `IS808_V29_SAMPLE_ROWS` in `pwd-steel-catalog.js`:

- MB 175, 225, 350, 400
- WB 175, WB 200 (D=200/B=140), WB 200 (D=203/B=152), WB 225

Compare reported nominal mass, section area, depth/width, web and flange thickness, Izz and Iyy for each, against the private source. Two WB 200 variants **must remain separate** even though their designations coincide. Record original physical PDF page and Table 1. The limited checked status cannot be used as structural capacity, product/MTC or whole-standard certification.

**V29 status:** two independently checked batches of eight Osdag source records (16 total). The original 42 selected-source checks remain historically distinguishable. The extended limited-audit ledger has 58 samples, but a single physical section may appear in both curated and Osdag data. Do not interpret sample count as the count of independent certified material sections.

## Batch 2: eight more section records
Separate audit ledger `IS808_V29B_SAMPLE_ROWS`, checked against original IS 808 Table 1, physical PDF page 8:

- MB 450, 500, 550, 600
- WB 250, 300, 350, 400

Compared each source row's mass, area, depth, width, web, flange, Izz and Iyy. V29B regression deliberately modifies six numeric fields for each of eight rows (48 mismatches total); each must be held, never silently accepted. Full slope and fillet-radius certification remains unclaimed for these incomplete Osdag rows.

## Display corrections
- Restore sourced fillet radii using actual catalogue fields `r1Mm` and `r2Mm`; previous UI mistakenly read `rootRadiusMm`/`toeRadiusMm` and hid available values.
- Show selected row's *checked*, *review* or *hold* state next to the highlighted kg/m. A conflict cannot appear as an unqualified authoritative nominal mass.
- These sixteen Osdag entries have incomplete flange-slope/radius data. Their measured web/flange numeric fields can be compared independently, but **`geometryChecked=false`** until all required geometry is actually present. No radii are inferred.
- A synthetic 0.01 kg/m change to any newly matched source samples must lead to `is808-numeric-conflict` and be held in comparison, not silently overwritten.

## Release gate — test build only
**Do not publish a Steel Table production/release APK while the catalog still contains unresolved numeric holds or unreviewed source rows**, unless a separately authorised limited-scope release explicitly removes them from engineering-reference availability. The main Android workflow builds labelled TEST artifacts for QA, not a signed production release.

Complete before production: source row-by-row coverage of all offered nominal catalog variants, 20 held records resolved or safely excluded with documented reason, source edition/amendment checks, representative mobile-device UI tests, quantity and compare regression tests, no unverified mass presented as certified, and sign-off on release scope. No claim of completion solely from passing automated tests.
