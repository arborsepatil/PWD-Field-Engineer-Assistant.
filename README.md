# PWD Field Engineer Assistant — Android PWA

A focused, installable Maharashtra PWD field engineering web app: practical calculations, site tools, standard bridge drawing indexes, and a source-linked engineering PDF Library.

## Keep — active modules
- **Calculators** — geometry, survey and source-controlled civil unit conversions. Covers international length/area/volume including **square mile (mi²)**, Indian Maharashtra units (**guntha, hectare, are, acre, gaj/var, cent/decimal/dismil, brass and quintal**), US/Imperial measures, flows, structural loads and temperature. From/To, swap and unit search are available offline; bigha/biswa/katha are deliberately not assigned universal conversion factors.
- **Site Tools** — focused three-workflow Concrete Batch Assistant (material order, AJAX batching, nominal mix), retaining wall section quantities, concrete mix design
- **Bridge Plans** — independent 2002 and 2023 drawing indexes, each linked to the respective original private PDF
- **Library** — curated links for Maharashtra Public Works Code, 17 IS and 41 IRC PDFs, MoRTH and building specifications, historical SSR, PWD Rule Book, guidelines, original bridge books, office manual and the technical GR index
- **SSR Master** — retained project module: SSR source navigation currently available; rate engine not yet ready
- **Settings** — working device theme, font and floating-calculator controls; **Profile** and recent tools for navigation

**Removed from the public app:** GPS Cam, Route, Structure, the retired bridge hydraulic calculator, QC module and Guide. **SSR Master is a kept feature.** Its source-edition selection is currently linked through **Library > SSR**; item-level extraction, rate/analysis engine and engineering validation are pending. Do not treat a historical PDF as the current approved schedule.

## Retaining Wall — Section Quantities review

- **Purpose:** quantities, schematic section, foundation/soling/filter allowances, approximate weep-hole spacing and field width checks. **Not** a structural design or permission to construct.
- **Existing section-template assumptions preserved:** for height up to 2.50 m, editable top width, vertical back, 1:4 front batter, footing projections and thickness; above 2.50 m up to 10.00 m, template top width 0.60 m, back vertical for 2.50 m then 1:6, front 1:4 then 1:1 in last H/5, M15, 0.30 m footing thickness and front offset 0.30 m through H=5.00 m / 0.40 m above that. These are inherited working rules from the existing calculator, **not independently verified approvals**. The engineer must confirm the correct original standard drawing and site scope.
- **Corrected computational defect:** for H just above 2.50 m, the H/5 front toe can begin *before* the 2.50 m back batter. The previous formula assumed one ordering and could use a negative section height. The revised geometry sorts the two independent depth transitions, integrates each non-overlapping trapezoid and constructs the drawn profile from the same data as the quantity output.
- **Validation and UX:** refuse empty/invalid/out-of-template inputs instead of displaying stale quantities; calculate live after initial button press, display all intermediate trapezoid areas, use an editable field-check interval while always including exact transition depths, display quantities in m³ and brass, copy/print the result and save a schematic SVG to device Files/Downloads. Cache the core module for offline mobile use.
- **Quantities are gross planning quantities:** excavation assumes constant foundation width and depth without working space or side slopes; filter filling assumes a rectangular strip; weep-hole counts are approximate spacing grids, **not** an approved drainage pattern. No automatic structural verification of earth pressure, sliding, overturning, bearing, reinforcement, settlement or drainage.
- **Pending customization:** user will supply **two additional conditions** after this geometry/UX review. No unknown conditions have been presumed, and the profile rules are isolated in `pwd-retaining-wall-core.js` to make later changes reviewable.
- Regression tests cover analytical area and rendered polygon agreement at 13 wall heights (including both slope transitions swapping order), gross quantities, false/negative input rejection and preservation of inherited section-template values. A phone field test and comparison with an approved source drawing are still required before treating this as approved engineering output.

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

## Converter factor governance

- International foot/yard/mile, square mile and acre relationships follow the international-foot conventions summarized by NIST: https://www.nist.gov/pml/us-surveyfoot/revised-unit-conversion-factors
- Other unit factors are based on SI and explicit US/Imperial definitions; see NIST Appendix B.9: https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9
- Maharashtra working convention: 1 acre = 40 guntha = 43,560 ft², 1 guntha = 1,089 ft². Are and hectare use exact SI area; a cent/decimal/dismil is 1/100 acre.
- Guntha, gaj/var and brass are provided with their chosen Maharashtra conventions. **Bigha, biswa, katha and district-dependent land measures are excluded rather than inventing an all-India factor.**
- Pressure/head conventions use standard gravity and assumed water density. Temperature below absolute zero is rejected. Numeric precision is displayed in engineering-friendly scientific notation for tiny results.
- The release test runs all-pairs dimensional round trips, key known exact constants, temperature boundaries, factor positivity and public offline asset integrity. This is computational QA, not third-party certification of all material/land measurement conventions.
  
## Install on Android
Open https://arborsepatil.github.io/PWD-Field-Engineer-Assistant./ in **Chrome**, choose **⋮ > Install app** (or **Add to Home screen**). A supported Chrome install prompt also appears on the homepage. This is a **PWA**, not a signed APK; no Play Store listing or APK build is claimed.

The service worker caches public app pages and scripts only. Private Drive originals are **not** bundled or cached by it. The installed interface and eligible local tools can operate offline after first load; network-based Drive previews cannot.

## Publication and checks
- Source repository: https://github.com/arborsepatil/PWD-Field-Engineer-Assistant.
- GitHub Pages deploys from main, release smoke checks run via `node tests/verify-release.mjs`.
- Physical Samsung Chrome installation, offline PDF storage, device-specific gestures, permissions and engineering field acceptance **must be tested on the device** before treating the PWA as final field-verified software.
- Always verify adopted specifications, amendments, source editions, calculations and approved plans before engineering decisions.

**Source boundary:** public code does not include copyrighted PWD source PDF bytes or original DWGs. A Drive link may be accessible only to the signed-in owner.
