# PWD Field Engineer Assistant — Android APK development

Maharashtra PWD field engineering application under development as an **installable Android APK**, with its previous browser edition retained only as a development preview: practical calculations, site tools, standard bridge drawing indexes, and a source-linked engineering PDF Library.

## Final delivery decision (19 October 2026)

**Android APK is the required end product.** The Chrome installable PWA is **not** the final release. The new `android/` project bundles existing tested civil-engineering screens into an actual Android app, with Android launcher, private local-file picker, and system print integration. This is initially a **Java Android shell containing WebView-based engineering screens**, not yet a fully rewritten native UI. See [Android build and limitations](android/README.md).

A debug-signed test APK must be **built by GitHub Actions and tested on Android** before anyone can claim an installable trial is ready. Production release signing and Android acceptance remain separate, pending milestones. The web preview remains for regression testing only.

**Retaining Wall:** the weep-hole concept, inputs, counts, cautions, calculated output and CSV columns have been removed from the current feature and guarded by release tests.

**Retaining Walls (2023 RCC reference):** two top-level choices only: the existing **PCC** retaining-wall section/quantity calculator (core arithmetic unchanged) and **RCC 2023** from the original PWD bridge type-plan Part 2 Section G. The RCC screen supports the exact 27 SBC/height columns from PDF sheets 210–212, displaying dimensions A–I, printed steel/concrete quantities and **MK1–MK11** bar diameters (mm) and centre-to-centre spacings (mm). The original dashes are preserved as absent table entries. Drawing 151-1/4 on PDF page 209 is linked to identify marks. Reinforcement tables are source lookups **not** a computed bar-bending schedule, a stability check, steel-cutting calculation or site approval. Type plans explicitly state minor bridges/culverts with raft foundations; other wall scenarios require engineering review. The source's 25 t/m², 4.5 m printed steel-per-m³ inconsistency remains flagged. Private PDF bytes stay out of the APK.


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

## Retaining Wall — two engineering drawings and bottom-up setting-out

- **Diagram 1, dimensioned section:** on the existing section model, mark wall height, top width, bottom width, PCC/soling common width and their individual thicknesses. For heights above 2.50 m identify the independently computed left/back and right/front batter-change junctions at their heights **above top of PCC**. Keep this diagram clear; do not overcrowd it with 1 m station offsets.
- **Diagram 2, field setting-out:** **0.00 is at PCC top**, not excavation bottom. A single fixed vertical centreline passes through the **midpoint of the TOP width**. At every control level independently compute LEFT/back and RIGHT/front distances from this unchanged C/L; they are equal at the top only. This drawing excludes PCC/soling offsets.
- **Construction-level algorithm:** start at 0.00 and attempt the next +1.00 m. If any batter change occurs sooner, mark that exact change instead and restart the next 1.00 m from that junction. Always include the wall top, including partial last lift. Example H=4.00, junctions 1.20/2.05 -> 0, 1.00, 1.20, 2.05, 3.05, 4.00. Example H=4.00, junctions 0.80/2.05 -> 0, 0.80, 1.80, 2.05, 3.05, 4.00.
- **Field table and export:** station height upward from PCC top, left/right offsets, total width, batter-change marker, same sequence in working CSV. Drawing labels have independent anti-overlap rails and both diagrams support finger pinch zoom. Printable output includes both drawings.
- The two existing section profiles, quantities, safety cautions and unapproved-drawing limitations are preserved. Batter-change heights in actual sections come from the original wall geometry; the examples illustrate the construction-level algorithm rather than inventing new batter geometry.

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
