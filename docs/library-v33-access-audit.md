# V33 — PWD Field Engineer Assistant public Library access audit
Checked on 23 October 2026.

## Actual Drive permissions
The previous shared app indexed **73 user Drive PDF links**. Each file's Google Drive metadata and permissions were checked.

| Source family | Previously indexed | Owner-only | Restricted sharing | Anyone/public |
|---|---:|---:|---:|---:|
| IS copies | 17 | 17 | 0 | 0 |
| IRC copies | 41 | 39 | 2 | 0 |
| PWD/MoRTH/CPWD, SSR, bridge and other references | 15 | 13 | 2 | 0 |
| **Total** | **73** | **69** | **4** | **0** |

The four restricted-shared Drive entries (not available to "anyone") were the 2022–23 SSR copy, Red Book Volume II, IRC 3 (1983), and IRC 2 (1968). All other entries were owner-only. No Drive file sharing permissions have been changed.

**A public equivalent on an official website does not make a private Drive copy public.**

## User's new shared-app policy

1. **Publicly available on an official publisher website:** list the title with publisher, category, context/edition warning and the single **View on publisher** link. No copies of published PDFs go into the public APK.
2. **Owner-only, restricted-shared, or rights uncertain:** never show the owner's Google Drive file IDs, links or original PDF in the shared Library.
3. **BIS and IRC:** link only to the official viewing portal or publications catalogue. Neither is represented as a freely redistributable PDF book, even if some standards can be read online free or obtained elsewhere.
4. **Publisher PDFs:** a single link opens the official website in the browser (internet required). This UI hides download/export buttons, but cannot prevent actions the external website/browser itself offers. It is **not DRM**.
5. **Previously installed APKs:** cannot be remotely updated or scrubbed. The revised APK must be installed to stop showing the old catalogue. Saved local PDFs in a user's app data are not modified by this release.
6. **SSR item importer:** retains a distinct *local, user-selected Excel only* tool; no private source workbook is bundled and its contents are not published.
7. **Bridge index:** retains the technical navigation. Where a user personally supplies their own PDF, the local reader can open that file; no hardcoded private Drive source IDs remain in its viewer.

## Verified public publisher destinations

- Maharashtra PWD official publications: Rules Manual, Accounts Manual, Civil SSR 2022–23, SSR index, E-books index and reference books
- Maharashtra GR official search and departmental documents page
- CPWD public Specifications Vol I (2009) and CPWD publications directory
- BIS *Know Your Standard* portal, subject to published viewing/copyright conditions
- IRC sale/catalogue page, without claiming free access to IRC code text

Access verified by visiting official websites in this audit. Public availability of the publishing *page* is different from legal permission to copy the PDF. Editions and active amendments remain subject to separate engineering review.

## Implemented in v33 branch

- Replaced 73 private Drive links with an empty legacy compatibility catalogue and introduced `library-public-catalog.js` (12 independently grounded public publisher destinations).
- Reworked `library.html` as simple public-reference search and five filters with a single publisher View action.
- Removed hardcoded private Drive file identifiers and disabled private Drive browser links in the existing PDF viewer.
- Invalidated the offline shell cache, protected Android packaging, and gated smoke/APK builds with public-only library regressions.
- Did not alter the original Google Drive documents, permissions, or storage.

**Not delivered:** a universal offline bundle of IS/IRC/PWD PDFs, comprehensive PDF text search, authorisation to redistribute copyrighted standards, or a production-signed release APK.
