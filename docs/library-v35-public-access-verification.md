# V35 — public publisher access vs private ownership and redistribution audit

Date: 23 October 2026. Project: **PWD Field Engineer Assistant** only.

## Why this distinction matters

**Three independent questions** must never be collapsed:
1. Is the specific file in the user's Drive shared publicly? **No** for the seven sampled originals checked here (owner-only).
2. Does an official government publisher have a publicly reachable reference page? **Yes** for twelve of the fifteen publisher links in the shared Library, as checked 2026-10-23.
3. Is downloading, repackaging or redistributing the publication inside a public APK authorized? **Not established** by website access, so **no original PDF bytes are bundled**.

The original full Drive-linked library held 73 owner-linked book records. Those IDs and links were retired from the shared Library in V33. The V34 Android/Pages packaging excludes private PDF import/viewer modules, old bridge-plan indexes and unapproved book digitisations. User Drive permissions were **not changed**.

## Source audit — actual accessibility check

The following 12 official **publisher pages** were accessible in the 23 October 2026 audit:
- Maharashtra PWD Rules Manual publication page
- Maharashtra PWD Accounts Manual publication page
- Maharashtra SSR 2022–23 publication page (**historical**, not automatically current SSR)
- Maharashtra PWD SSR publications index
- Maharashtra PWD Bridges Design guideline publication page
- Maharashtra PWD Designs Circle procedure publication page
- Maharashtra PWD Civil Designs circular index
- Maharashtra PWD E-books index
- Maharashtra PWD Reference Books index
- BIS Know Your Standard portal (**not a free complete IS book**)
- Maharashtra Government Resolutions portal
- Maharashtra PWD documents index

Three **official publisher references** could not be confirmed accessible in this environment:
- CPWD Specifications Civil Vol I PDF: official endpoint rejected the request.
- CPWD Publications listing: official site timed out.
- IRC official Publications Catalogue: publisher site returned gateway error.

The shared UI now distinguishes `public-page` vs `publisher-access-unconfirmed` for each entry. It says **View on publisher** for audited reachable pages and **Check publisher availability** for three inaccessible/unconfirmed links. The app does not pretend the latter three offer free book viewing. Verified **page** availability still does *not* certify that any linked PDF is freely readable, current, or redistributable.

## Private Drive file samples (owner-only)

Checked Google Drive file permissions on representative originals. Each reported `shared=false` and owner-only permission:
- PWD Rule Book Marathi, 6th edition (1984)
- Maharashtra Public Works Code (user's copy)
- IS 808:2021 Fourth Revision (user's copy)
- IS 4923:2017 consolidated amended copy
- IRC 67:2022 (user's copy)
- SSR 2022–23 original PDF
- Red Book folder (its descendants were not all checked in this audit)

This does **not** claim a permissions read of every item in the 73-record former Drive catalogue, nor does private Drive status imply a publisher cannot separately provide a public counterpart.

## Distribution controls

- No owner Drive IDs, files, private-asset links or original PDFs in the shared Library.
- No in-app private PDF import, export, PDF viewer, or private historical book indexes shipped in public Android or Pages distribution.
- New V35 access-status UI warns about unconfirmed publisher sites.
- Existing Android asset packager scans every shipped HTML, JS and JSON file for private provider URLs, excludes legacy viewers and source material and refuses PDF bytes.
- The native app is still a **debug-signed TEST APK**, and old installed versions may retain user-imported private blobs in app storage. Users should retain originals in Drive before clearing an older installation.
- No changes to original Google Drive permissions or contents. Source/release checks cannot establish 100% absence of arbitrary private data outside known scope.

## Scope and future release policy

Private files remain protected; public sources are linked only to their official publisher pages. Link-only viewing cannot technically disable the publisher's own download function. A standalone offline PDF may be bundled only with explicit publication-specific redistribution authority and subsequent engineering edition checks.
