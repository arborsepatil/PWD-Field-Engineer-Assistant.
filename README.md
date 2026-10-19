# PWD Field Engineer Assistant — Android PWA

A focused, installable Maharashtra PWD field engineering web app: practical calculations, site tools, standard bridge drawing indexes, and a source-linked engineering PDF Library.

## Keep — active modules
- **Calculators** — geometry, survey and source-controlled civil unit conversions. Covers international length/area/volume including **square mile (mi²)**, Indian Maharashtra units (**guntha, hectare, are, acre, gaj/var, cent/decimal/dismil, brass and quintal**), US/Imperial measures, flows, structural loads and temperature. From/To, swap and unit search are available offline; bigha/biswa/katha are deliberately not assigned universal conversion factors.
- **Site Tools** — concrete batch assistant, retaining wall section quantities, concrete mix design
- **Bridge Plans** — independent 2002 and 2023 drawing indexes, each linked to the respective original private PDF
- **Library** — curated links for Maharashtra Public Works Code, 17 IS and 41 IRC PDFs, MoRTH and building specifications, historical SSR, PWD Rule Book, guidelines, original bridge books, office manual and the technical GR index
- **SSR Master** — retained project module: SSR source navigation currently available; rate engine not yet ready
- **Settings** — working device theme, font and floating-calculator controls; **Profile** and recent tools for navigation

**Removed from the public app:** GPS Cam, Route, Structure, the retired bridge hydraulic calculator, QC module and Guide. **SSR Master is a kept feature.** Its source-edition selection is currently linked through **Library > SSR**; item-level extraction, rate/analysis engine and engineering validation are pending. Do not treat a historical PDF as the current approved schedule.

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
