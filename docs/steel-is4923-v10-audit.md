# IS 4923:2017 V10 — independent amended-section spot-check

Audit date: 22 October 2026. Scope: **nominal catalogue verification only**, not structural design, manufacture acceptance, or BIS licensing.

## Source chain

- Owner-held BIS **IS 4923:2017** (reaffirmed 2023), consolidated with Amendment 2 (August 2022) and Amendment 3 (June 2024).
- Amendment 2, Table 1 (square hollow sections), document pages 21–25; Table 2 (rectangular hollow sections), document pages 26–30.
- Amendment 3, document page 33 corrects **12 specific RHS masses**; it states other values of Table 2 remain unchanged.
- [BIS Amendment 2 publication](https://www.services.bis.gov.in/tmp/MTD4013093_26082022_1.pdf).
- [BIS Amendment 3 implementation circular](https://services.bis.gov.in/tmp/Circular_vpMS_2024-08-06.pdf). For legal establishment see the July 2024 Gazette, and 27 December 2024 replacement date.
- The full source PDF is private; it is neither committed to this repository nor bundled in an app.

## V9 carryover

The amendment-corrected RHS masses are checked **12/12**. Plus two original RHS records agree with Amendment 2 Table 2: 40×20×2 and 50×25×2.

## V10 additional comparison

Six SHS records checked: existing 25×25×2 and 32×32×2; added 40×40×2, 50×50×2, 60×60×3, and 100×100×4.

Five unchanged RHS Table 2 records checked: 40×20×2.5, 50×25×2.5, 80×40×3, 100×50×4 and 200×100×6.

Numerical comparison includes each sampled row's nominal mass, available cross-sectional area, and second moments of area; RHS X and Y separately, SHS equal X and Y. A one-hundredth mismatch in recorded nominal mass or geometry is flagged.

### Audit status

- **19 selected RHS records** compared (12 amendment corrections + 7 unchanged).
- **6 selected SHS records** compared.
- Other sizes remain unverified. Amended BIS Table 1 and Table 2 contain many more sections than these curated app rows.
- Amendments do **not** prove supplied material grade, wall tolerance, coating, actual meter weight, straightness, MTC authenticity, structural capacity or suitability. Those require separate specification and project review.
- Values not independently checked are not labelled checked. Calculation from a known inconsistent source row is blocked.
- Existing 640 Osdag supplementary rows are untouched and are not BIS-certified.

UI/UX redesign is deferred; these changes update only engineering data, verification text and release tests.


## V11 follow-up — 20 newly checked section rows (22 October 2026)

Ten new **SHS** Amendment 2 Table 1 source samples: 30×30×2, 40×40×3, 50×50×2.5, 50×50×4, 60×60×4, 70×70×3, 75×75×4.5, 80×80×4, 90×90×5, and 100×100×6.

Ten new **RHS** Amendment 2 Table 2 source samples: 40×20×3, 50×25×2.9, 50×30×3, 60×40×2.5, 60×40×4, 70×30×4, 80×40×4, 90×50×3, 100×60×4, and 120×80×4.

Each was independently compared for nominal unit mass (kg/m), area (cm²) and moments of inertia (cm⁴) in the private BIS consolidated Amendment 2 tables. All 20 rows passed the mass/area engineering plausibility check using **density 7 850 kg/m³**. The app exposes only these selected reference figures, not the full BIS table.

**Current limited numeric comparison:** 16 selected SHS rows, 29 selected RHS rows (including the twelve Amendment 3 mass corrections). The other BIS standard rows remain unverified. The Osdag data is not BIS-certified.

**Source discrepancy, hold pending further evidence:** Owner-held PDF, Amendment 2 Table 2, document page 28, shows **RHS 120×80×6.0** with 16.98 kg/m and **2.63 cm²**. Those printed values are inconsistent: at 7 850 kg/m³, a mass of 16.98 kg/m implies **approximately 21.63 cm²**. A printing error appears likely, but **do not silently replace BIS text, treat a mathematical inference as a BIS-approved corrigendum or label this row verified.** We intentionally excluded that size from the checked app catalogue and left it for authoritative confirmation.

**Software assurance improvement:** For sampled SHS and unchanged RHS rows with source-published section properties, an omitted area or moment of inertia can no longer produce a full-row verified status. The Amendment 3 corrected RHS entries remain **mass-only comparisons** with no invented geometry. No drawing or UI/UX changes were made.

Reference context:
- [BIS Amd 2 circular](https://www.services.bis.gov.in/tmp/Circular_slZj_2024-06-05.pdf)
- [BIS Amd 3 implementation](https://services.bis.gov.in/tmp/Circular_vpMS_2024-08-06.pdf)
- [Government Gazette establishing Amendment 3](https://egazette.gov.in/WriteReadData/2024/255500.pdf)
