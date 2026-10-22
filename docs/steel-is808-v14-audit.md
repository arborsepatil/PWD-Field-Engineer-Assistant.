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


## V15 — engineering geometry verification (22 October 2026)

**Purpose:** Correct dimensional input used by the app's existing section diagrams, not implement a new UI or perform structural design.

A limited set of **thirteen already-listed hot-rolled samples** were further compared with the owner-held **IS 808:2021 Fourth Revision**; this follows V14's independent nominal-mass spot checks and retains its separate source/variant ledger.

- **Five medium beams**: MB 100, 150, 200, 250, 300 — Table 1, user PDF page 7.
- **Eight medium channels**: MC 75, 100, 125, 150, 200 — Table 6, page 23; MC 250 (B=82 mm, 34.2 kg/m), 300, 400 — Table 6, page 24.

The following properties were individually compared: web thickness **t**, flange thickness **T**, listed flange angle **α** (98° for these MB samples, 96° for these MC samples), fillet/root radii **R1/R2**, cross-sectional area and the listed second moments Izz/Iyy. Previously audited nominal mass and outside dimensions remain checked. No full BIS table is copied into the application.

**Engineering boundaries:**
- The app now stores the five additional sourced geometric parameters and compares *every available* parameter with the corresponding selected IS 808 row. Any stated 0.1 mm / 0.1° corruption in those sources blocks the corresponding numerical catalogue entry.
- Only when all five values are present and agree does the app report **geometryChecked**. Nominal mass/area/inertia checks remain separately identified. Missing geometry is never called verified.
- The existing drawing approximates flange faces using the **listed angle**, but corner fillets remain **schematic**: storing R1/R2 does not imply that the SVG renders a production profile or precise radius curve. Drawing use for fabrication/design requires independently checked CAD geometry.
- **MC 250 B=82 mm / 34.2 kg/m remains distinct from MC 250 B=80 mm / 30.6 kg/m**, including the different web dimensions. No cross-selection or auto-substitution is permitted.
- The 2020 nominal-angle discrepancies flagged in V14 remain blocked, and all uncross-checked Osdag/reference entries remain unverified.
- **No design capacity, actual grade, fabrication tolerance, or MTC certification is asserted.** These are nominal source properties only.
- No change to APK/PWA selection policy: deliverable is a genuine Android test APK. No UI redesign or modifications to other project modules.

Sources: owner-held licensed BIS standard, Tables 1 and 6 as noted (private PDF **not** distributed); [BIS standard directory](https://services.bis.gov.in/tmp/tbl5_2024-11-11-05-24.pdf) documents IS 808:2021 as a current structural section standard.
