# V34 — Public-only engineering Library and private-book distribution audit

**Project**: PWD Field Engineer Assistant (native Android and public GitHub Pages). **23 October 2026.**

## Classification and evidence
- The earlier Drive-linked catalogue contained **73 owner-linked file records**: 59 IS/IRC/PWD codes; 4 specifications; 4 SSR entries; 2 rules/manuals; 2 design guideline books; and 2 standard bridge-plan book entries (note: PWD Code belongs to the 59). Being linked from a user-specific Google Drive does NOT establish legal public availability; some have official publisher equivalents.
- Owner-only permissions were established on checked representative original Drive files, including IS, IRC, SSR and PWD rule documents. This is **not** a documented review of every one of the 73 items' permission settings.
- Those 73 Drive reference IDs and links were already retired from the shared Library in V33. V34 preserves that exclusion and removes remaining private-book PDF viewer links from the bridge screens.
- The official public publisher catalogue now has **15 view links**: 12 previously checked V33 entries and three additional official Maharashtra PWD publications (Bridge Design Guidelines, Designs Circle procedure, and Civil Design circular index). These are *public webpage links*, not 15 redistributable PDF licenses or a complete collection of current standards.
- Official portals for BIS standards and IRC are clearly labelled `portal`/`catalogue`, not a claim of free full-standard books. IRC's public sales catalogue is not a free-reading license.
- CPWD and Maharashtra PWD publisher pages contain accessible material, but their public presentation is not automatically a blanket distribution licence.
- Source publication date, document edition, amendments and exact applicability must be reviewed individually before any engineering conclusion; public access is a different test from current validity.

## User-visible shared app
1. Library category **Design / Bridges** opens three confirmed official PWD pages. All entries offer only **View on publisher ↗**, with no local PDF download/export button in the shared Library. Publishers may offer downloads externally; the app cannot prevent that.
2. Bridge Plans menu no longer links to owner-derived 2002/2023 book pages. It directs to the official public design references. Exact standard plan originals are *not* publicly verified for those editions.
3. Private or source-license-unresolved PDFs and original-derived book index/digitisation screens are **not bundled in the shared APK or public Pages deployment**. The development repository retains original source code and historical commits; those public repository records are not retroactively erased by asset-package exclusions.
4. All local user-import PDF pages, the old owner-Drive book catalogue and old PDF renderer modules are excluded from the public app. This is an app-distribution decision, not a deletion of files from the user's personal Google Drive or phone.
5. The native app is an **installable test APK**, not a signed production release. Existing installs may have older app-private IndexedDB stored PDF bytes. Installing a new APK does not automatically delete those; clear old app data only with the user's deliberate consent and a backup of other desired settings.

## Enforcement
- Android packager uses a fail-closed `EXCLUDED` set, removes stale private-viewer files from prior local builds, rejects the same filenames post-staging, and blocks private Google Drive document/folder URLs.
- GitHub Pages no longer uses `path: .` (whole Git repository). `scripts/prepare_public_site.py` reads the exact Android `EXCLUDED` set and uploads only a clean list of root web assets. Neither original PDF bytes nor the retired private pages should be deployed.
- Public PWA service-worker shell drops the same retired viewer/drawing-reader assets and no longer fetches third-party PDF.js for a private reader.
- `tests/verify-v34-public-privacy.mjs` and the packaging/deployment jobs enforce this policy and verify 15 official publisher-linked records. Older viewer technical regression tests may be retained in the development repo but **must not be treated as proof that the private viewer is included in the public app**.

## Not yet established
- These 15 sources are not a complete legal/copyright clearance review for redistributing their PDFs. No publisher-original PDF was copied into the APK.
- A public-website or Android package rule cannot revoke GitHub history, previously cloned files or APKs already installed by other users. If historical repository material must also be made non-public, it requires separate source-control/historical-remediation steps, not merely deleting browser links.
- Full-text search of all public books, publisher-provided offline usage, and a complete up-to-date BIS/IRC/PWD document-register audit remain future phases.
