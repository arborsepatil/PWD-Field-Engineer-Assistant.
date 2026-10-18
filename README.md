# PWD Field Engineer Assistant — Android PWA

A focused, installable Maharashtra PWD field engineering web app: practical calculations, site tools, standard bridge drawing indexes, and a source-linked engineering PDF Library.

## Keep — active modules
- **Calculators** — units, survey and civil quick calculations
- **Site Tools** — concrete batch assistant, retaining wall section quantities, concrete mix design
- **Bridge Plans** — independent 2002 and 2023 drawing indexes, each linked to the respective original private PDF
- **Library** — curated links for Maharashtra Public Works Code, 17 IS and 41 IRC PDFs, MoRTH and building specifications, historical SSR, PWD Rule Book, guidelines, original bridge books, office manual and the technical GR index
- **Settings** — device theme and accessibility preferences; **Profile** and recent tools for navigation

**Removed from the public app:** GPS Cam, Route, Structure, Bridge Hydro, QC module and Guide. The unfinished SSR Master placeholder is removed; use **Library > SSR** for the existing source PDFs.

## Where the PDFs live
- The 73-document catalogue contains **Drive file IDs and titles**, not PDF contents. The originals remain in the user's Google Drive under their current permissions.
- From Library, **Read PDF in app** opens the authenticated Google Drive preview inside the viewer. If Drive blocks embedded access, **Google Drive** opens the original in Drive separately. Internet and permission may be required.
- **Use PDF on this device** accepts a PDF selected by the engineer from the Android Files app. On-device IndexedDB can retain the chosen PDF per publication, for offline viewing where browser support allows it; **Forget PDF** clears that publication's on-device copy. Local storage may be evicted by Chrome or removed when clearing site data.
- For the 2002/2023 bridge books, exact-page canvas rendering requires the expected 91/221 page count and renders the mapped drawing page. Other books do **not** have automated document-identity verification. A matching page count is not verification of title blocks, approval or edition.
- Mozilla PDF.js is loaded from a version-pinned external CDN for local canvas rendering; on first load it **requires Internet** and no original PDF bytes are sent to that CDN. A native PDF fallback remains, but some Android browsers may not support embedded native viewing or deep-page fragments.
- There is **no live Google Drive synchronization** in this public static app. The catalogue is a snapshot curated from connected Drive on 18 October 2026. Automatically listing private Drive contents would require a separately configured, authorized Google sign-in/API flow. Do not make the public site or PDFs openly shared.

## Install on Android
Open https://arborsepatil.github.io/PWD-Field-Engineer-Assistant./ in **Chrome**, choose **⋮ > Install app** (or **Add to Home screen**). A supported Chrome install prompt also appears on the homepage. This is a **PWA**, not a signed APK; no Play Store listing or APK build is claimed.

The service worker caches public app pages and scripts only. Private Drive originals are **not** bundled or cached by it. The installed interface and eligible local tools can operate offline after first load; network-based Drive previews cannot.

## Publication and checks
- Source repository: https://github.com/arborsepatil/PWD-Field-Engineer-Assistant.
- GitHub Pages deploys from main, release smoke checks run via `node tests/verify-release.mjs`.
- Physical Samsung Chrome installation, offline PDF storage, device-specific gestures, permissions and engineering field acceptance **must be tested on the device** before treating the PWA as final field-verified software.
- Always verify adopted specifications, amendments, source editions, calculations and approved plans before engineering decisions.

**Source boundary:** public code does not include copyrighted PWD source PDF bytes or original DWGs. A Drive link may be accessible only to the signed-in owner.
