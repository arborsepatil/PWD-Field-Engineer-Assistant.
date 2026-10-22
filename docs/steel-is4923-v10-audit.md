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


## V12 — Whole-table *internal* numerical consistency review and calculator fix

Scope of the internal PDF-text audit: **190 square** + **216 rectangular** = **406 Amendment 2 size rows** in the owner-held consolidated IS 4923:2017 PDF. For each row, compare nominal weight (kg/m) against the expected value from area (cm²) using 7 850 kg/m³ or **0.785 kg/m per cm²**.

Two original Table 2 rows exceeded an exploratory 2% internal mass/area alarm: **120×60×5**, original mass 12.48 kg/m against 16.36 cm², for which Amendment 3 corrects the mass to **12.84 kg/m**; and **120×80×6**, printed mass 16.98 kg/m against printed area 2.63 cm², which implies ~21.63 cm² at nominal density. The inferred area is **NOT an authoritative BIS corrigendum**; the size remains quarantined. The 2% alarm is **software QA, NOT an IS code limit or acceptance criterion**. Source rounding is permitted.

All **45 curated SHS/RHS rows** already in the app were checked for available area: the **33 with sourced area** passed this 2% internal alarm. The 12 Amendment 3 corrected-weight records intentionally have no invented area/inertia, so are excluded from this specific calculation.

**Software correction:** The app's selected-section calculator contained an erroneous assignment to the outside-current-scope status where strict equality comparison was required. This could erroneously block otherwise valid selected steel-section weight calculations. V12 corrects it and adds an executable calculator regression for beam, SHS, RHS, sub-2-mm current structural scope, 120×80×6 source quarantine and mass/area conflicts.

The private BIS PDF remains out of GitHub and the APK. The 406 source rows were analyzed, NOT republished as a comprehensive app catalogue. UI/UX redesign remains out of scope.


## V13 — Source sample expansion and compliance reference review

Audit date: 22 October 2026. Independently compared **twelve additional rows** from the owner's private IS 4923:2017 consolidated PDF, **Amendment 2 Tables 1/2** (unchanged where not corrected by Amendment 3). Measurements reviewed per row: nominal dimension, thickness, mass (kg/m), cross-sectional area (cm²), Ix and Iy (cm⁴). Internal mass/area plausibility at 7,850 kg/m³ is **software QA only**, not an IS steel acceptance limit.

**Added six SHS:**
- 20×20×2, 25×25×2.5 and 45×45×4 (PDF p.21).
- 150×150×6 (PDF p.24).
- 250×250×12 and 400×400×16 (PDF p.25).

**Added six RHS:**
- 80×50×2 (PDF p.27); 120×80×3 (PDF p.28).
- 180×100×6, 300×100×6 (PDF p.29).
- 500×300×10 and 500×300×12 (PDF p.30).

**Current limited reference coverage: 22 SHS and 35 RHS** sampled app entries. Included among the 35 RHS are the **12 corrected masses** individually listed in Amendment 3; their independent verification is **nominal kg/m only**, unlike the additional unchanged rows with area and inertia comparisons. Unsampled BIS table rows and separate Osdag historical data remain unverified.

### Separate material-compliance boundary

BIS August 2024 [product manual for IS 4923:2017](https://www.bis.gov.in/wp-content/uploads/2024/08/Revised-PM-template-4923.pdf) records three amendments, material/manufacturing references, inspection and testing/certification requirements. Section weight and geometry **never alone prove grade, weld quality, a BIS licence, material traceability, load capacity, or project acceptance**. Supplier MTC, product marking and the current approved project specification remain distinct engineering checks.

BIS [June 2024 circular](https://www.services.bis.gov.in/tmp/Circular_slZj_2024-06-05.pdf) identifies **IS 18573:2024** as a separate reference for cold-formed welded hollow sections intended for general engineering/decorative applications, including thin products outside amended IS 4923 structural section licensing scope. A matching dimension/weight **does not convert** such a product into IS 4923 structural material. The main app retains this boundary in its reference information.

No licensed full standard PDF or replicated whole BIS table is distributed. No new UI layout or changes to unrelated PWD modules.
