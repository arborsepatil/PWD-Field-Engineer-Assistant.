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
