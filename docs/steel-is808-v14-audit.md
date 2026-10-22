# Steel V14 — Selected IS 808:2021 Hot-Rolled Section Audit

Audit performed 22 October 2026 against the **user-held IS 808:2021 Fourth Revision** PDF (60 pages), also available in their private Drive. The original copyrighted BIS file is **not** copied into this GitHub repository or Android APK.

## Source identity and coverage

**IS 808:2021**, amalgamates IS 12778:2004; source pages referenced are the PDF's 1-indexed page numbers (not necessarily the internal printed BIS page numbers). Source table titles:

- Table 1: Indian Standard medium and wide flange beams — PDF pp. 7–8
- Table 2: junior and light beams — PDF pp. 9–10
- Table 5: columns/heavy sections — PDF pp. 20–21
- Table 6: sloping flange medium channels — PDF pp. 23–24
- Table 9: equal angles — PDF pp. 28–31

The audit ledger contains **23 specific standard variants**. Exactly **22 match curated app section entries**. The extra row is the **MC 250 normal variant**, needed to distinguish the starred section. Matching here means matching the selected nominal **kg/m** and outside nominal dimensions; where the app also has area / Izz / Iyy, compare each present value independently. **Only four MB records** in this sample contain all three app properties (mass, area, Izz and Iyy), and the app reports their stronger check separately.

**Explicitly checked series represented in this update:** MB 100, 125, 150, 200, 250, 300; MC 75, 100, 125, 150, 200, 250, 300, 400; WB 150; HB 200; LB 200; equal angles 90×90×6, 90×90×8, 100×100×8, 150×150×10 and 200×200×12.

## Confirmed archive-versus-current disparities

| Selected angle size | Legacy 2020 app nominal weight (kg/m) | IS 808:2021 (kg/m) |
|---|---:|---:|
| ISA 90×90×6 | 8.20 | 8.32 |
| ISA 90×90×8 | 10.80 | 10.92 |
| ISA 100×100×8 | 12.10 | 12.18 |
| ISA 150×150×10 | 22.90 | 22.93 |
| ISA 200×200×12 | 36.80 | 36.85 |

These older records are **preserved**, labelled **source numeric conflict** and **blocked from quantity calculation**. The newer SAIL samples matching the checked BIS values remain available. No historical data is deleted.

## Crucial MC 250 variant protection

IS 808:2021 Table 6 separately records **MC 250, B = 80 mm, 30.6 kg/m** and a **starred MC 250, B = 82 mm, 34.2 kg/m**. The app's existing ISMC250 has B = 82 mm and 34.2 kg/m and matches the starred variant. The B = 80 mm variant is recorded **in audit comparisons only**, not as a duplicate manufactured size in the picker. Checks match series, depth, flange width and angle thickness (when relevant), not a designation alone.

## Limitations and safeguards

- Audit reports exactly what was checked. It **does not** establish product grade, nominal-section availability, load resistance, flange fillet correctness, weld quality, material test certificate authenticity, or suitability for a structural design.
- No other IS 808 table row (including Osdag historical overlays) becomes BIS-verified by association. The full standard contains more sections than the audited subset.
- Only the source's selected nominal mass, dimension and individually present app properties were compared. We avoid fake geometry or full properties claims.
- The Android catalogue and CSV weight calculations block known conflicting historic masses while allowing matching nominal records.
- Engineering CI now invokes the V14 independent source ledger and **actual** app calculation path. Earlier V12 calculator fix and V13 hollow tables stay isolated.
- No UI/UX redesign. This is an engineering data, verification and audit provenance update only.


## Steel V15 follow-on: previously unverified IS 808 families

User-held IS 808:2021 Fourth Revision, PDF source tables independently reviewed (not republished). **Seven additional selected catalogued sizes** now have nominal mass, area, Izz and Iyy checked, plus sourced web/flange thickness where applicable. Current total **30 independently sampled source variants**, of which **29 are represented as curated app entries**; the separate MC 250 B=80 sample remains an audit-only variant.

| Sample group | Nominal designation (physical D x B mm) | Table | PDF page | Checked nominal mass |
|---|---|---|---|---|
| Narrow parallel beam | NPB 100 × 55 | 3 | 11 | 8.10 kg/m |
| Wide parallel beam | WPB 100 × 100, physical D=91 × B=100 | 4 | 15 | 12.24 kg/m |
| Junior channel | JC 100 × 45 | 7 | 25 | 5.80 kg/m |
| Light channel | LC 150 × 75 | 7 | 26 | 14.40 kg/m |
| Parallel channel | MPC 150 × 75 | 8 | 27 | 16.80 kg/m |
| Supplementary unequal angle | 100 × 50 × 8 | **12** | **39** | 9.05 kg/m |
| Parallel bearing pile | PBP 200 variant, physical D=200 × B=205 | 13 | 40 | 43.85 kg/m |

**Engineering critical:** MC 150 (sloping flange) and MPC 150 (parallel flange) can have the **same** nominal 16.80 kg/m but different published moments of inertia; a weight-only lookup must not combine them. Also WPB 100×100 at 12.24 kg/m has physical depth **91 mm**, not 100 mm. Supplementary unequal 100×50×8 belongs to **Table 12**, not Table 11, and is explicitly checked under its correct table.

These seven rows retain their previous secondary-index URLs for audit trace, but app source labels now point to the direct owner-held BIS sample comparison. The public BIS informational link establishes the standard identity, **not an unauthorised re-publication of the private table**. Original copyrighted PDF and personal source-watermark information are excluded from GitHub and APK.

An exact 0.01 kg/m or 0.01 cm⁴ source discrepancy triggers a numeric conflict. When source-published web/flange thickness is present in the app, it is also checked for these samples. This is reference-data checking, not a manufacturing acceptance tolerance. Material grade, MTC, supply, member strength and full structural suitability require project-specific engineering review.

BIS currently lists [IS 808:2021](https://standards.bis.gov.in/) as the hot-rolled section dimensions/properties reference. No UI/UX redesign; the previous hollow-section and calculator safeguards remain in place.
