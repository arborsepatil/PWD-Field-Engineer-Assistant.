# MoRTH Fifth Revision (2013) — selected road-table source audit
**Audit date:** 2026-10-27
**Build:** CIVIL BANDHU V66 development branch `morth-reader-finalization-2026-10-27`
**Verification scope:** selected field-use tables only; **not full-book certification**.

## Source and method
Compared the application's structured rows in `morth_reader.html` to the extracted text layer of the user's privately held original `MoRTH_Specifications_Road_Bridge_Works_5th_Rev_2013.pdf`. The original source is retained in the owner's Drive and is **not** copied into this repository.

Comparisons cover **62 rows in 8 tables**:

| Clause | Source table | Rows | Result |
| --- | --- | ---: | --- |
| 401 GSB | 400-1 grading | 9 | Match in text-layer cross-check |
| 401 GSB | 400-2 physical requirements | 4 | Numeric limits match; CBR method label retained under source ambiguity |
| 406 WMM | 400-12 aggregate physical requirements | 3 | Match |
| 406 WMM | 400-13 grading | 9 | Match |
| 507 BC | 500-16 aggregate physical requirements | 10 | Match |
| 507 BC | 500-17 pavement composition | 14 | Match |
| 507 BC | 500-18 JMF permissible variation | 8 | Match |
| 508 premix | 500-19 gradation | 5 | Match |
| **Total** | **8 tables** | **62** | **0 discrepancies identified in compared rows** |

Additional selected QC limits are regression guarded: GSB AIV/LL/PI/CBR; WMM LA/AIV/shape/PI/compaction; BC density (92% of Gmm), binder tolerance, 0.075 mm sieve tolerance and ASTM D2041 reference.

## Editorial and engineering holds
1. **Clause 508.2.5**: Source prints total aggregate quantity of **0.27 cubic metre per square metre area**; this requires independent reconciliation with publication errata, amendments and project specifications. The application preserves an explicit **RECONCILIATION REQUIRED** label. Its automatic aggregate-quantity calculator remains **disabled**. Source states binder 22.0 kg / 10 m² (Type A) and 19.0 kg / 10 m² (Type B).
2. **Table 400-2 CBR test method**: Extracted source text has a potentially anomalous CBR test-method cell. The application's CBR row deliberately gives the MDD basis but does not assert an unverified exact CBR testing-standard citation. Check PDF page image / applicable test specification before publishing an authoritative method.
3. This pass verified values against the PDF **extracted text layer**, not fresh independent visual inspection of every table page. Image-layer confirmation and contract/amendment checks remain to be done.
4. The reference reader's wider set of 372 main-clause records is **index coverage**, not 372 completely verified clauses. Existing calculators are reference/planning tools, not automatic engineer approval.

## Code regression guard
- New test `tests/verify-morth-selected-source.mjs` checks the **62 table rows**, selected QC constants and the Clause 508.2.5 no-calculator hold against the current reader.
- Workflow `.github/workflows/morth-private-smoke.yml` now executes this test after `tests/verify-morth-offline.mjs`.
- A connector readback comparison checked all 62 expected table rows and selected warning/QC anchors in the branch, with **zero mismatches**. This is not a substitute for a new GitHub CI log or Android-device check.

## Remaining release gates
- Independently inspect numerical source page images (especially Table 400-2) and extend verification across remaining MoRTH tables and Section 900 sampling frequencies.
- Android phone acceptance: install and launch; clause navigation; search; tables; QC links; airplane mode; font/display size; gesture usability; existing Steel and Bridge screens.
- Do **not** merge to public release or redistribute original copyrighted book/drawing images without rights review.


## Continuation: Section 900 field QC (27 October 2026)
- The source's **Table 900-3** (printed pp. 422–423) and **Table 900-4** (printed pp. 423–427) were inspected in the user's original PDF text layer for selected high-use JE frequencies.
- Added **24 read-only, source-linked minimum-frequency entries** in `qc.html`: 12 GSB/WBM/WMM entries and 12 prime/tack, premix, BM, DBM/BC and SMA entries.
- Included the distinctions between **m³ of aggregate**, **m² of compacted area**, **tonnes of mix**, **sets of tests**, **source changes**, and **per-day/per-plant minima**; these cannot safely be treated as interchangeable.
- Added `tests/verify-morth-qc-frequency.mjs`, preserving all 24 recorded frequencies, warnings, mobile scrolling, existing seven QC modules and offline shell linkage.
- Bumped the PWA service-worker cache key so revised QC content can replace a previous offline version.
- These 24 are deliberately a *selected list*: specialized tests, stabilization rows, variable-source approvals and contractual amendments still require original-source review. Do not calculate universal test counts or give automatic pass/fail from this subset.

## Android packaging issue discovered and mitigated
- The standard **public APK** preparation excluded `morth_reader.html` and `morth-*.js` but left a dead Library link plus orphaned `qc.html`. The owner-development branch now removes both the dead link and `qc.html` from the public-mode Android package.
- Owner-local opt-in preparation uses `CIVILBANDHU_PRIVATE_MORTH_LOCAL=1 python3 android/scripts/prepare_assets.py`. This includes the MoRTH reference reader and 17 section/QC scripts for **controlled local testing only**; it does not change the default/public package. It still rejects original PDF bytes and private Drive/document URLs.
- The isolated MoRTH CI workflow now checks both packaging modes **without publishing a private APK** from the public GitHub repository. Physical installation, signature upgrade path, permissions, screen navigation and airplane-mode acceptance remain unverified.
- No change has been merged into public `main`. New CI execution success and actual Android APK device acceptance must be verified separately.


## Further Section 900 source-page audit — 27 October 2026

The owner's original Fifth Revision (2013) PDF was compared at printed pages 110, 193, 422–428 and 435–436 (PDF viewer pages 129, 212, 441–447 and 454–455). The versioned mobile QC page now contains **50 selected reference entries**: all **23 rows of Table 900-3** (granular, lime/cement stabilised sub-base, WBM and WMM) and **27 selected rows from Table 900-4** (bituminous works). These are selected factual test frequencies and conditions, not a replacement for the full licensed book.

Source discrepancies and restrictions remain:
- Table 400-2 prints IS 2720 (Part 5) in the CBR test-method cell, whereas Clause 903.2.1 cites IS 2720 (Part 16). Both were checked from the PDF pages. A visible source-conflict warning is now in qc.html, guarded by a regression test. Do not silently rewrite the printed record or accept an unverified test procedure.
- Clause 508.2.5 prints the unusual 0.27 cubic metre per square metre aggregate quantity; existing material-quantity calculator HOLD remains.
- Clause 903.5.2.1 and Table 900-6 differ in their PQC beam/cube sampling statements. No combined automated acceptance/sampling decision is authorised.
- Table 900-4 contains additional tests and conditional references beyond the 27 selected entries. Its summary **must not be marked complete**.

Testing: regression fixtures now check 50 distinct IDs and exact displayed reference frequencies, preserve field-use cautions and the CBR conflict, and are executed in the development branch's MoRTH private QA workflow. This is a document/CI check only; physical Android installation, offline UI usability and engineering source sign-off remain pending.
