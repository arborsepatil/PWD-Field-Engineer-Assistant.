# PWD Field Engineer Assistant — Installable Web App

**Live PWA:** https://arborsepatil.github.io/PWD-Field-Engineer-Assistant./

This is the simplified Maharashtra PWD JE field companion. Published from GitHub Pages and installable using Chrome on Android. It is a **Progressive Web App (PWA)**, **not a signed .apk file**.

## Kept modules
- Home, recent tools, and optional local JE profile
- Units, civil calculations and retaining-wall section quantities
- Concrete batch assistant and concrete mix design
- Bridge Plans: **2002 and 2023 Part 2 are independent source books**
- Library: **73 indexed Google Drive PDFs** (PWD Code, IS, IRC, MoRTH, Red Book, SSR, rules, design guidelines and bridge publications)
- Technical GR reader
- Appearance, quick-calculator preference and offline-cache management

GPS Cam, Route, Structure, Bridge Hydro, QC and Guide were removed on user request. The unused SSR Master placeholder is not shown; actual historical SSR PDFs remain available under Library.

## PDF access and privacy
Tap **View PDF in app** in the Library to open `pdf_viewer.html?drive=<catalogued-file-id>`. The page embeds Google's PDF **preview** for an ID checked against the current catalog. If Google Drive does not permit an embedded preview or the user must sign in, choose **Open in Drive** to view the same source in Drive. No login credentials or Drive tokens are stored in this PWA.

**No standards PDF is bundled with, hosted by, or uploaded to the public GitHub app.** Installing the app caches the app shell, public scripts and calculators, but **does not download all Drive PDFs**. The curated 73-file catalog is a point-in-time snapshot, not a Google Drive synchronization or version-control service. Changing or adding a file on Drive will not automatically change the GitHub Pages catalog. That would require an authenticated Drive API/OAuth integration with proper security design.

For bridge books only, the engineer may explicitly select a PDF stored on the phone. It is checked for expected page count (2002 = 91 pages; 2023 = 221 pages); an accepted PDF may be saved in on-device IndexedDB to view from the same browser later. This is not proof of official drawing identity, revision, or suitability for construction. PDF.js first-load canvas rendering uses a version-pinned CDN dependency, so a fresh offline installation may fall back to the browser viewer.

Drive share settings and copyright restrictions remain untouched. Public app users can see a file title/ID and attempt to open its link but must have their own authorized Drive access. Do not treat the mere presence of a Drive link as public permission to read/download its PDF.

## Install on Samsung/Android
1. Open the live URL in **Google Chrome** (not the in-app ChatGPT browser).
2. Open Chrome menu **⋮ → Install app** or **Add to Home screen**, if offered.
3. Launch the installed **PWD Tools** icon. Connect once while online to populate the public offline app cache.
4. Confirm calculator navigation, Library Code → IS/IRC, Bridge Plans, PDF in-app preview or Drive fallback, and airplane-mode access to cached public tools.

**Manual Samsung phone testing is still required.** GitHub Actions tests static assets, source-link catalog validation, page renderer logic, removed-module coverage and offline-resource integrity; CI cannot prove the embedded Drive preview or Android pinch gestures work on your device. No signed APK was generated.

## Engineering-use boundary
This app is a reference and calculation aid. Applicable published editions, amendments, project specifications, approved drawings, site verification and departmental procedures are controlling. Historical IS/IRC and SSR PDFs in the Library are not automatically the current versions.

## Development and checkpoint
- Branch merge and CI: `.github/workflows/qa-smoke.yml`
- GitHub Pages deployment: `.github/workflows/deploy-pages.yml`
- Local release check: `node tests/verify-release.mjs`
- PWD Rule Book source digitization remained at Appendix 2, source PDF p.251; unverified transcription is not official code text.

Original documents and copyright-controlled standards must not be committed to this public repository.
