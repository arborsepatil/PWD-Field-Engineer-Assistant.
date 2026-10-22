# PWD Field Engineer Assistant — Android APK development

Maharashtra PWD field engineering application under development as an **installable Android APK**, with its previous browser edition retained only as a development preview: practical calculations, site tools, standard bridge drawing indexes, and a source-linked engineering PDF Library.

## Steel Table V6 — private IS 1161 Amendment 2 cross-check (22 October 2026)

After receiving the authorized **IS 1161:2014 base, Amendment 1 (March 2019),
and Amendment 2 (August 2023)**, the CHS catalogue gained a limited, explicit
source-level BIS spot-check. Amendment 2 **replaces Table 1**; an older 2014
row must not automatically be called a current listed size.

- Verified spot samples of **OD/thickness, mass and published area** only:
  21.3 OD × 2.0 wall, 33.7 × 2.0, 42.4 × 4.0, 114.3 × 4.0.
  All match the 2023 replacement Table 1 to published rounding in the
  regression fixture. Source: private user-provided amended BIS copy.
  A sample match is not certification of all the section properties,
  vendor stock, tolerances, quality tests or MTC.
- Historical **21.3 × 2.6** and **33.7 × 2.6** CHS are **not listed** at
  those thicknesses in the replacement table. These two checked sizes
  cannot be used by the built-in source-based quantity calculator and carry
  an explicit warning; all other UNCHECKED CHS sizes remain *not checked*,
  not automatically unlisted.
- A mismatch to a sample mass or cross-sectional area is marked
  `spot-checked-conflict` and blocked from source-based quantity/cost
  calculations, rather than silently substituted.
- Maintains **74 manufacturer/secondary records**, **640 attributed open
  Osdag rows**, and all prior lightweight UI/Android features. Existing
  section status and source provenance remain separate from material-grade
  acceptance, inspection and MTC.
- The private, noncommercial copyrighted BIS PDF was **not committed or
  embedded in the APK**, nor was the complete numerical BIS table copied.
  Only these small, individually checked comparison facts and metadata
  are used to flag already-available values.
- The full **IS 1161 current-amendment row-by-row CHS audit**, complete
  IS 4923:2017+Amd.3 SHS/RHS check, and full IS 808:2021
  hot-rolled audit remain distinct work; this patch does not claim
  those are finished.

## Steel Table V5 — 2023 SAIL manufacturer angle range + full browse (21 October 2026)

- Adds **17 individually listed SAIL 2023 nominal equal-angle size/mass pairs** to
  the previous 57 curated entries, giving **74 curated source-attributed rows**
  and **33 unambiguous SAIL 2023 ISA pairs** covering 50, 60, 65, 70, 75,
  80, 90, 100, 150 and 200 mm equal-leg angles in the gauge combinations
  actually documented by the SAIL product-range brochure.
  Source: https://www.sail.co.in/sites/default/files/product-brochure/2023-10/PFS-Brochure_New-2023.pdf
- The ambiguous fourth listed 80×80 weight with no clear corresponding gauge
  is intentionally **NOT imported**. All rows have their original mass retained,
  are marked *manufacturer-published*, and are **NOT certified** against each
  current BIS IS 808:2021 table row.
- The existing **640 LGPL-3.0 open-source Osdag records** stay separately
  attributed, with source-area contradictions blocked and the source license
  bundled. Some Osdag records duplicate curated sizes; therefore the user
  screen can show different source vintages for a nominal designation.
- Previously the UI silently limited each browse to the first 60 entries.
  Now the first 60 are shown, then a **Show next 60 sizes** control continues
  through the full selected family/series. Filtering resets pagination, full
  offline search operates across all rows, and the clean mobile UI is retained.
- Engineering smoke tests now check **all 33 clear SAIL angle masses** against a
  separate, manually transcribed SAIL product-range fixture, check the published
  five medium beams and eight medium channels, and guard historical conflicts,
  blocked missing gauges and the full offline browse.

**Not complete/approved:** The current BIS IS 808:2021 tables, IS 4923:2017
(with Amendment 3, June 2024) SHS/RHS numeric entries and IS 1161 CHS numeric
entries have **not** been wholly independently certified row-by-row against
authorized standard copies. Missing/ambiguous nominal BIS data are not
manufactured. The manufacturer and Osdag tables are planning references only;
check current drawings, source edition, MTC and applicable official BIS
standards for design, procurement and acceptance.

## Steel Table V4 — SAIL angle edition audit and dimensioned diagrams (21 October 2026)

- The curated test dataset expands from 49 to **57** source-attributed examples (not including 640 additional Osdag licensed-open rows loaded into the offline Android app).
- Eight more **SAIL October 2023 equal-leg angle** masses are recorded individually: 90×90×8/10/12, 100×100×8/10/12, 150×150×10 and 200×200×12. Source: https://www.sail.co.in/sites/default/files/product-brochure/2023-10/PFS-Brochure_New-2023.pdf
- Older 2020 same-dimension values are preserved as historical duplicates. Search results place the dated SAIL 2023 manufacturer rows before historical/secondary rows; source disagreements remain visible.
- Beam, channel, column, bearing-pile and equal/unequal-angle diagram outlines respond to each entry's nominal D and B; thickness t or t/T is drawn using published fields when supplied. **Unknown gauges, flange slopes, corner radii and centroid axes are not invented.** All diagrams remain schematic, not fabrication drawings.
- No BIS edition is reproduced. SAIL manufacturer range values are **not** row-by-row certified against an authorized current BIS IS 808:2021 copy. Source date, MTC and approved project specification must still be reviewed. The extensive Osdag rows remain individually attributed and their mass/area quality gates stay in place.
- Existing tests updated to require 57 curated records, source-priority sorting and preserved historical conflicts; Android debug APK device acceptance remains separate.

## Steel Table V3 — licensed broad sections with mass/area quality controls

Adds 640 open-source [Osdag](https://github.com/osdag-admin/Osdag) section
records as a separately attributed offline catalogue. Original SAIL and
updated secondary SHS/RHS/CHS entries remain intact. The original Osdag database
uses `IS808_Rev`, which Osdag previously described as an upcoming revision:
**that tag is not proof of current BIS IS 808:2021 equivalence**.
Open records are labelled as reference-only; authoritative numeric row checking
is still required. CHS entries cite IS 1161:2014. Obsolete Osdag SHS/RHS
`IS 4923:1997` rows are excluded (newer independent SHS/RHS entries from
the earlier V3 release remain). BIS confirms IS 4923:2017 Amendment 3 (2024)
corrected some RHS masses and must be checked before declaring those current.

The adapted `pwd-steel-osdag.js` is provided under original Osdag GNU LGPL v3,
with upstream attribution and source text in
`pwd-steel-osdag-license.html`. Published mass-vs-sectional-area conflicts
are **flagged and cannot produce a quantity or price** until checked; the
2.5% preflag threshold is purely a software-data-screen, not an IS tolerance.
Steel Table lists up to 60 sizes at a time, with full offline search across
its data. No structural-member design approval or RCC BBS has been introduced.

**Outstanding:** licensed/current BIS IS 808:2021 complete table verification,
IS 1161 checked publication/amendment parity and complete source-audited
IS 4923:2017 Amendment 3 SHS/RHS catalogue. The app intentionally does not
claim every currently standardized numerical value is certified.

## Steel Table V3 — additional manufacturer examples + hollow geometry (21 October 2026)

**Expanded developer test build, NOT an exhaustive BIS catalogue.** V3 adds
10 selected 2023 SAIL manufacturer records (two MC channels and eight ISA
angles) and six hollow-section sample rows: SHS (2), RHS (2), CHS (2).
There are **49 source-attributed section examples** total, searchable offline
over the 15 hot-rolled families plus SHS/RHS/CHS. Current IS 808 numeric
coverage and complete IS 4923/IS 1161 current-amendment coverage are **NOT
finished** because a licensed authoritative numeric dataset is not available.

Source governance:
- SAIL 2023 product range:
  https://www.sail.co.in/sites/default/files/product-brochure/2023-10/PFS-Brochure_New-2023.pdf
  is **manufacturer-published**. Historical SAIL 2020 angle differences are
  retained alongside later 2023 figures, with a visible disagreement notice.
- Historical manufacturer SHS/RHS/CHS entries use a dated Tata Steel Structura
  brochure: https://www.tatasteel.com/media/23759/tata-steel-structura-brochure.pdf
  and remain flagged **historical**. Do not treat any old RHS unit mass as
  automatically compliant with IS 4923:2017 Amendment 3.
- One separately sourced small RHS example from
  https://quickboq.in/steel/tables/rectangular-hollow-sections/ is marked
  **secondary-amendment-unverified**, NOT a BIS-certified row.
- BIS Amendment 3 implementation guidance:
  https://services.bis.gov.in/tmp/Circular_vpMS_2024-08-06.pdf
  confirms correction of selected RHS weights. The app does not claim to
  know which historical rows changed until each original standard row is
  reviewed. Absent sizes must not be invented.
- The optional **custom SHS/RHS/CHS quantity** mode is computed using an
  assumed 7850 kg/m³. SHS/RHS sharp-corner geometry omits corner radii,
  production tolerances and weld effects; CHS uses ideal annulus geometry.
  These are theoretical estimates, **NOT nominal current BIS table masses**.
  Hollow field thickness is constrained to less than half the minimum outer
  dimension; invalid inputs are blocked.

Regression checks cover source provenance, search aliases, historical vs
newer duplicates, unit mass vs given area, theoretical geometry bounds,
light/dark UX, offline pack, native Android CSV/print, existing RCC/PCC
tools and exclusion of RCC BBS.

**Next dataset task:** obtain authorized current IS 808:2021,
IS 4923:2017+Amd.3 and IS 1161:2014 standard numeric tables or properly
licensed publisher data; audit each row and record verified edition/amendment
before marking it as compliant or releasing a complete standards table.
Do not scrape and embed hundreds of rows from a paid BIS publication.

## Steel Table V2 — all IS 808 profile series indexed (21 October 2026)

V2 adds **all fifteen hot-rolled IS 808:2021 profile classifications** to the
simple Steel Table UI with a series picker: beams JB/LB/MB/WB/NPB/WPB; columns
SC/HB; channels JC/LC/MC/MPC; equal and unequal angles; parallel flange bearing
piles PBP. Legacy aliases ISJB/ISLB/ISMB/ISWB/ISNPB/ISWPB/ISSC/ISHB/
ISJC/ISLC/ISMC/ISMPC or ISMCP/ISA/ISPBP are searchable. The 2021 abbreviated
designations are displayed for newly selected reference entries. Duplicate
parallel-flange nominal sizes must be distinguished by weight/real dimensions,
not automatically collapsed into one name.

**Truth-in-data boundary:** There are 33 recorded numerical examples (19
preserved previously source-linked SAIL manufacturer records + 14 small
individually sourced secondary-reference examples distributed across the
remaining section classifications). The additional examples have direct
[QuickBOQ steel table](https://quickboq.in/steel/) category source pages and
are all explicitly labelled **Secondary · needs BIS audit**. They are NOT a
complete import of all IS 808 sizes, a BIS certified numeric dataset, or
confirmation of procurement availability. The legacy 2020 SAIL angles retain
their historical warning. Missing sizes deliberately produce no calculated
weight. Completing all nominal sizes, publication/amendment review and source
numerical cross-checks remains the next dataset phase. The IS 808:2021
classification is corroborated against the BIS fourth revision description
and the Osdag documentation. The reference webpage is not treated as BIS.

The UI/UX retains tabs, live quantities, rate and CSV/PDF, source drawer,
theme-aware section sketches and the Android offline build. RCC BBS remains
deferred. Tests guard required profile families, old/new alias search,
source statuses and 0 fabricated missing dimensions.

## Steel Table test UX polish (20 October 2026)

The installed Android steel screen now follows **Select → Length/Pieces → Total kg**. Selected manufacturer row defaults to the first available value; live changes recalculate instantly. Optional price appears only after rate entry. Long section drawings, dimensions, source statements and BIS caution details are behind two accessible collapsible sections. Uses system fonts, current app font scale/theme setting, and dynamic SVG colors in light/dark mode (contrast tests for readable text and buttons). The Steel Table's floating quick-calculator shortcut is suppressed only on this screen to keep the input/output clear. No engineering data or RCC BBS changes.

## Steel Table V1 — offline, source-attributed manufacturer data

**Navigation:** Home → Site Tools → Steel Table. Included as local HTML/JavaScript
assets inside the installable Android APK; also cached for the optional browser demo.

**Released V1 scope**
- Search/filter **5 SAIL medium beams**, **6 SAIL medium channels** (source:
  [SAIL Product Range, 2023-09](https://sail.co.in/sites/default/files/product-brochure/2023-09/PFS-Brochure.pdf)).
- Display published mass (kg/m) and overall dimensions. Four medium beam rows
  additionally have source-reported area, Izz, Iyy, Zzz and Zyy from the
  [SAIL 2023 tapered flange brochure](https://www.sail.co.in/sites/default/files/product-brochure/2023-10/PFS-Brochure_New-2023.pdf).
- **Eight equal-angle records are strictly marked ARCHIVED (SAIL 2020)**, not
  current-edition verified tables; do not use them as current BIS/availability
  claims. [Original SAIL archived source](https://www.sail.co.in/sites/default/files/product-brochure/2020-03/Structurals.pdf).
- Calculate quantity from published kg/m × entered length × integer number of
  pieces, with an optional user-entered ₹/kg rate.
- Separate **theoretical geometry** for plate/flat/round/square solid bar:
  cross-section area × length × **assumed steel density 7850 kg/m³**. These
  outputs never masquerade as BIS nominal masses. No fabricated hollow-profile
  gauges or current tubular section masses are in the V1 dataset.
- Export a source-labelled **draft material quantity CSV** (Android native
  document picker supported), and print using Android print/PDF.
- Every published catalogue entry stores manufacturer, URL, publication month,
  applicable type standard and status. The applicability of **IS 808:2021**
  and the existence of **IS 2062 (Part 1):2025** were checked via BIS; **this is
  NOT a licensed reproduction or row-by-row official BIS table verification**.
  Do not infer suitability, design strength, present rolling availability or
  field acceptance from catalogue values. Use current approved drawings/MTC.
- Strictly separated from RCC retaining-wall MK source references and the
  postponed bar-bending/cutting-length module.

**Remaining**: licensed/current BIS numeric row verification for full IS 808
catalogue; new verified hollow sections under applicable amended standards;
more section properties and manufacturer source updates. No online background
update occurs in the V1 APK: source dates remain visible until a reviewed build
replaces the versioned dataset.

## Final delivery decision (19 October 2026)

**Android APK is the required end product.** The Chrome installable PWA is **not** the final release. The new `android/` project bundles existing tested civil-engineering screens into an actual Android app, with Android launcher, private local-file picker, and system print integration. This is initially a **Java Android shell containing WebView-based engineering screens**, not yet a fully rewritten native UI. See [Android build and limitations](android/README.md).

A debug-signed test APK must be **built by GitHub Actions and tested on Android** before anyone can claim an installable trial is ready. Production release signing and Android acceptance remain separate, pending milestones. The web preview remains for regression testing only.

**Retaining Wall:** the weep-hole concept, inputs, counts, cautions, calculated output and CSV columns have been removed from the current feature and guarded by release tests.

**Retaining Walls (2023 RCC reference):** two top-level choices only: the existing **PCC** retaining-wall section/quantity calculator (core arithmetic unchanged) and **RCC 2023** from the original PWD bridge type-plan Part 2 Section G. The RCC screen supports the exact 27 SBC/height columns from PDF sheets 210–212, displaying dimensions A–I, printed steel/concrete quantities and **MK1–MK11** bar diameters (mm) and centre-to-centre spacings (mm). The original dashes are preserved as absent table entries. Drawing 151-1/4 on PDF page 209 is linked to identify marks. Reinforcement tables are source lookups **not** a computed bar-bending schedule, a stability check, steel-cutting calculation or site approval. Type plans explicitly state minor bridges/culverts with raft foundations; other wall scenarios require engineering review. The source's 25 t/m², 4.5 m printed steel-per-m³ inconsistency remains flagged. Private PDF bytes stay out of the APK. Stage 4 adds an optional project name, proportionally drawn A–I dimensioned SVG section with finger pan/pinch, visible original table concrete/steel quantities, print/PDF, and an explicitly **draft** BBS worksheet with engineer-entered count and verified cutting length per MK mark. Theoretical weight uses 7,850 kg/m³ steel density. Partial draft BBS entries are stored locally by project name and exact SBC/height with no cloud sync. No automatic cut length, reinforcement stability/design, per-running-metre extrapolation or approved BBS is claimed. Source PDFs remain private.

**Current delivery boundary (20 October 2026):** User explicitly deferred BBS cutting. The Android RCC wall screen provides source-selected A–I dimensions, section sketch, original concrete/steel quantities, geometry-based raft/stem/PCC planning takeoff, source-only MK1–MK11 bar locations/diameter/spacing, and a quantity statement CSV. **It does not show or request bar counts or cut lengths, or calculate bar cutting/BBS weights.** Earlier draft BBS calculation code is retained in source control for possible future use but not linked to the active RCC screen. Preserve the working PCC calculator. Bridge books 2002/2023 and private source PDFs remain separate.


## Keep — active modules
- **Calculators** — geometry, survey and source-controlled civil unit conversions. Covers international length/area/volume including **square mile (mi²)**, Indian Maharashtra units (**guntha, hectare, are, acre, gaj/var, cent/decimal/dismil, brass and quintal**), US/Imperial measures, flows, structural loads and temperature. From/To, swap and unit search are available offline; bigha/biswa/katha are deliberately not assigned universal conversion factors.
- **Site Tools** — focused three-workflow Concrete Batch Assistant (material order, AJAX batching, nominal mix), retaining wall section quantities, concrete mix design
- **Bridge Plans** — independent 2002 and 2023 drawing indexes, each linked to the respective original private PDF
- **Library** — curated links for Maharashtra Public Works Code, 17 IS and 41 IRC PDFs, MoRTH and building specifications, historical SSR, PWD Rule Book, guidelines, original bridge books, office manual and the technical GR index
- **SSR Master** — retained project module: SSR source navigation currently available; rate engine not yet ready
- **Settings** — working device theme, font and floating-calculator controls; **Profile** and recent tools for navigation

**Removed from the public app:** GPS Cam, Route, Structure, the retired bridge hydraulic calculator, QC module and Guide. **SSR Master is a kept feature.** Its source-edition selection is currently linked through **Library > SSR**; item-level extraction, rate/analysis engine and engineering validation are pending. Do not treat a historical PDF as the current approved schedule.

## Batch Assistant — three workflows only

- **Material Calculation / Place Order:** choose a source family and concrete item from the original preserved PWD consumption tables. Enter required concrete in m³, brass or ft³. Outputs sand, size-wise aggregate and cement in appropriate units. Copy, share, or print a *planning* order, with theoretical bags distinguished from a rounded-up whole-bag suggestion. AJAX density assumptions do not affect this screen.
- **AJAX Batching:** choose the same source row and enter actual usable volume per batch **or** cement bags per batch. See material quantities and approximate weights using **editable bulk densities**, and optional total-volume/equivalent batch count. The final partial batch and aggregate moisture/water require engineer review. Copy or print an operator sheet.
- **Nominal Mix:** select one of the five source-listed nominal grades (M5, M7.5, M10, M15, M20), plus a number of cement measuring units. The app shows matching sand and coarse-aggregate volume parts. It does **not** claim a final concrete yield or substitute for an approved mix.
- **Engineering Notes & Code Checks** remain available from each workflow as a *supporting screen*, not an additional top-level tab. **RMC** planning screen and its related controls/calculation code have been removed.
- All PWD source consumption rows, missing-source null values and separate building / bridge / pile families remain intact. Engineering assumptions are labeled rather than misrepresented as verified rules.
- Release tests validate pure batch arithmetic, invalid input handling, original source data retention, and exactly three accessible workflow tabs. Samsung/Android phone interactions still need field verification.

## Offline PDF Library: per-device setup

The Library contains 73 catalogued **Drive links and titles**, not book PDFs. Originals stay under their existing permissions in Google Drive; no private book is uploaded to GitHub.

**First setup while online:**
1. Open **Library**, tap **Prepare offline reader**, and confirm the reader reports ready. The PWA also attempts a best-effort first-install prefetch of the public PDF.js engine.
2. In Google Drive, save the original PDF(s) to your phone using the Google Drive app/Files. Merely viewing Drive preview does **not** create an offline PWA copy.
3. Use **Save PDF on device** for one book, or **Save multiple PDFs** to import a folder selection. Multi-import only pairs exact title/edition filenames (case, spacing, underscores and leading numbers are normalized); unknown or already-saved files are skipped. Deliberately overriding a mismatched filename for a single book requires explicit confirmation.
4. Verify that individual cards say **Saved offline**; optionally enable **Offline books only** to see saved copies.
5. Test with airplane mode. A local file opens through the shared in-app canvas renderer (pinch/swipe) when supported; the private browser native PDF fallback may work on some devices.
6. **Export copy** preserves a PDF in your phone's Files/Downloads, useful for backups and transferring to another phone. **Remove offline** deletes the PWA's private copy; the original Drive file is untouched.

**Important limits:**
- Browser IndexedDB storage is **per phone, browser profile and app origin**. A new phone needs its own import. Uninstalling the PWA, clearing site data or browser storage eviction may delete copies. The app requests persistent storage when allowed, but cannot guarantee permanent retention.
- The app cannot automatically download or synchronize 73 private PDFs via Drive without a separately authorized Google Drive API connection. Do not make private documents publicly shareable as a workaround.
- The PDF.js engine and worker are freely distributable public scripts, cached apart from PDF books; first preparation needs Internet. On iOS/Safari and some Android browser versions, browser restrictions, storage limits or native PDF support can still cause problems. Keep exported PDFs in Files and test the offline mode on each device. **"Any mobile" is a compatibility goal, not a claim tested across all devices.**
- Bridge books (2002: 91 pages, 2023 Part 2: 221 pages) now use the same offline PDF storage keys as the Library. Previously saved bridge PDFs are migrated where supported. Page counts are preliminary checks, never proof of approved drawing identity.
- Offline status means the browser retained a PDF file, **not** that its contents, edition, title block, revision or engineering applicability have been verified.
- **Read PDF in app** may display Google Drive preview when a local PDF is absent. If Google blocks embedded preview, **Google Drive** remains the online fallback.

## RCC 2023 source quantity verification and optional length (Phase 5)

- The book's 27 standard cross-sections were independently reconstructed as polygons from dimensions A–I. Their computed areas (m²) agree with original printed concrete volumes (m³) for a 1 m section to within 0.0075 m³ (rounding). This is a **geometrical engineering inference**, NOT an explicit published statement that all source material entries are per-running-metre.
- The RCC screen now optionally accepts project wall length L (m). If entered, it displays **planning-only** structural RCC = unrounded polygonal cross-section area × L and **separate** levelling PCC M15 = B footing width × 0.100 m (from GAD) × L, with checked unit dimensions.
- Original source-table RCC and steel quantities remain unchanged and separately labelled. Source steel mass is **not multiplied** by entered length; all BBS bars require engineering-verified counts and cutting lengths, and source notes must be checked for changes to site geometry, levels and applicability.
- Both planning quantities can be exported in the BBS CSV under their own **GEOMETRY-BASED PLANNING QUANTITY** heading. A drawing view or geometrical agreement is not a stability check, site measurement, approval or quantity-certification.

## Retaining Wall — two engineering drawings and bottom-up setting-out

- **Diagram 1, dimensioned section:** on the existing section model, mark wall height, top width, bottom width, PCC/soling common width and their individual thicknesses. For heights above 2.50 m identify the independently computed left/back and right/front batter-change junctions at their heights **above top of PCC**. Keep this diagram clear; do not overcrowd it with 1 m station offsets.
- **Diagram 2, field setting-out:** **0.00 is at PCC top**, not excavation bottom. A single fixed vertical centreline passes through the **midpoint of the TOP width**. At every control level independently compute LEFT/back and RIGHT/front distances from this unchanged C/L; they are equal at the top only. This drawing excludes PCC/soling offsets.
- **Construction-level algorithm:** start at 0.00 and attempt the next +1.00 m. If any batter change occurs sooner, mark that exact change instead and restart the next 1.00 m from that junction. Always include the wall top, including partial last lift. Example H=4.00, junctions 1.20/2.05 -> 0, 1.00, 1.20, 2.05, 3.05, 4.00. Example H=4.00, junctions 0.80/2.05 -> 0, 0.80, 1.80, 2.05, 3.05, 4.00.
- **Field table and export:** station height upward from PCC top, left/right offsets, total width, batter-change marker, same sequence in working CSV. Drawing labels have independent anti-overlap rails and both diagrams support finger pinch zoom. Printable output includes both drawings.
- The two existing section profiles, quantities, safety cautions and unapproved-drawing limitations are preserved. Batter-change heights in actual sections come from the original wall geometry; the examples illustrate the construction-level algorithm rather than inventing new batter geometry.

## RCC Retaining Wall 2023 — component quantity breakdown

After selecting exactly one of the 27 source SBC/height cases and optionally entering wall length, the app calculates **non-overlapping RCC raft and RCC stem quantities** independently from the *existing verified* A–I geometry, as a **geometry-based planning takeoff**:
- **Raft area**: `[B×H + (G−H)×(F+D)/2 + E×(G−H)] / 1,000,000` m² (source dimensions in mm).
- **Stem area**: `[(E+I)×(A−G)/2] / 1,000,000` m².
- **RCC volume**: (raft area + stem area) × wall length. The same source-derived total area matches the printed 2023 table within 0.0075 m² for all 27 rows. No source table value is altered.
- **M15 levelling PCC**: B × 0.100 m × wall length, separately sourced from GAD PDF page 209.
- Raft + stem quantity lines appear in the Android screen and draft BBS CSV, with regression checks that **their sum exactly matches the original calculated structural RCC** for all 27 cases.

This is **not** a checked structural design, a PWD type-plan per-metre statement, or a certified field measurement. No extrapolated site steel quantity, end-wall return, transitions, excavation, variations, wastage or bar cut length is included. PCC wall calculator's separate source/quantity engine is unchanged.

## Retaining Wall — section/quantity polish

- The tool **retains the existing project's two geometric profiles**: lower (H ≤ 2.50 m) and the fixed piecewise section (2.50 m < H ≤ 10.00 m). It does not infer new wall types, design dimensions or stability criteria.
- The front and back faces change slope at independent depths. The geometry engine orders those breakpoint stations and integrates the trapezoidal cross-sectional segments. This also fixes the schematic breakpoint drawing immediately above 2.50 m; the original *total* mathematical area is unchanged for the existing profile.
- Field width controls include all exact profile breakpoints, with independent back/front widths from the top centreline. Wall/PCC/soling/excavation/backing quantities are distinct, with visible units and rounded display values.
- Quantity inputs are range-checked, invalid or missing values are rejected, and outputs update in place. The diagram fits the phone width, supports pinch-to-zoom and touch dragging without zoom buttons, and its computed quantity summary can be copied or printed.
- Excavation assumes a rectangular footing-width trench and user-entered depth; filter backing assumes a rectangular strip. A shallow excavation depth relative to footing + soling displays a review warning. The retaining-wall module is restricted to wall geometry, section setting-out and five geometric quantity rows; unrelated drainage detailing is excluded.
- A mobile-friendly **geometric measurement sheet** now lists each section area **per running metre**, quantity for the adopted length, measurement basis and limitation. Print/Save PDF includes the entered dimensions and centreline width-control stations.
- **Export measurement CSV** saves a UTF-8, spreadsheet-friendly, offline working sheet with wall dimensions, separate quantities, field width control and cautions. The CSV is explicitly **not** a sanctioned PWD estimate, tender abstract or approved design.
- **Not implemented:** retaining-wall stability, soil pressure, bearing capacity, overturning/sliding, detailed reinforcement, approval of plans, founding levels or project-specific conditions. All dimensions and assumptions require engineer review against the actual approved drawing and applicable project specifications.
- **Next refinement:** two project-specific conditions are expected from the user. Do not infer or implement either condition without its actual definition; retain existing verified geometry and the ability to extend it afterward.
- Two additional engineering conditions are intentionally reserved for later when the engineer supplies their exact requirements. They have **not** been invented or silently inserted.
- Release smoke tests cover 14 heights around 2.50 m, 3.125 m and 5.00 m transitions, positive segment heights, independent polygon area, quantities, input validation and offline files. Physical mobile acceptance and project-source checking remain pending.

## Converter factor governance

- International foot/yard/mile, square mile and acre relationships follow the international-foot conventions summarized by NIST: https://www.nist.gov/pml/us-surveyfoot/revised-unit-conversion-factors
- Other unit factors are based on SI and explicit US/Imperial definitions; see NIST Appendix B.9: https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9
- Maharashtra working convention: 1 acre = 40 guntha = 43,560 ft², 1 guntha = 1,089 ft². Are and hectare use exact SI area; a cent/decimal/dismil is 1/100 acre.
- Guntha, gaj/var and brass are provided with their chosen Maharashtra conventions. **Bigha, biswa, katha and district-dependent land measures are excluded rather than inventing an all-India factor.**
- Pressure/head conventions use standard gravity and assumed water density. Temperature below absolute zero is rejected. Numeric precision is displayed in engineering-friendly scientific notation for tiny results.
- The release test runs all-pairs dimensional round trips, key known exact constants, temperature boundaries, factor positivity and public offline asset integrity. This is computational QA, not third-party certification of all material/land measurement conventions.
  
## Installable Android application (final target)

The new **Android APK** source and build instructions are in [android/README.md](android/README.md). After a successful GitHub Actions **Android installable APK** build, download and extract its `PWD-Field-Assistant-Android-TEST-APK` artifact to obtain an installable `app-debug.apk`. This is a *trial APK*; production signing, on-device acceptance and update distribution are pending.

The old GitHub Pages site is **only a web development preview**. Installing that preview using Chrome creates a PWA, which the user has explicitly rejected as the final deliverable. Do not recommend the PWA as the final app.

## Publication and checks
- Source repository: https://github.com/arborsepatil/PWD-Field-Engineer-Assistant.
- GitHub Pages deploys from main, release smoke checks run via `node tests/verify-release.mjs`.
- Physical Android APK installation, offline PDF storage, device-specific gestures, permissions and engineering field acceptance **must be tested on the device** before treating the Android app as field-verified software.
- Always verify adopted specifications, amendments, source editions, calculations and approved plans before engineering decisions.

**Source boundary:** public code does not include copyrighted PWD source PDF bytes or original DWGs. A Drive link may be accessible only to the signed-in owner.
