# V34 — close remaining private-source links across the shared Android application

**Date:** 23 October 2026. **Project:** PWD Field Engineer Assistant only.

## The distinction that matters

- **Drive permission**: a private/owner-only PDF is not available for all users, even if an equivalent government publisher PDF exists in the public domain of access.
- **Publisher public web viewing**: allow official publisher links only, without a Download, Export or Save button in the Library. The user's browser/publisher may still offer download; this UI is not DRM.
- **Copyright/redistribution**: public website visibility does not confer a right to bundle or redistribute standards, proprietary IRC/IS texts or copies of personally stored PDFs.

The complete V33 Drive metadata audit recorded 73 previous Drive PDF entries: 69 owner-only, four limited sharing, zero anyone/public. They were removed from the shared app's public catalogue. V33 installed APK still had one *additional*, unrelated private GR master **Google Sheet** URL in the GR screen (three link occurrences). This must also be removed.

## V34 correction

1. Replace the GR page's three private master-register Sheet URLs with the official Maharashtra government GR search. Remove the private register name, its internal schema, and its visible "Drive available" status, while retaining public GR summaries with limitations.
2. Retain the 12 verified publisher/copyright-aware entries in the public Library; qualify publisher access difficulties for the CPWD direct PDF entry rather than claiming all requests will work.
3. Exclude the retired `library-offline.js` private-book importer/exporter from distributed APK assets. Personal local-file selection for bridge plans is not a remotely shared private PDF and is retained for lawful private documents. Private PDF originals and restricted Drive IDs are not bundled.
4. `android/scripts/prepare_assets.py` must scan **every** shipped root HTML/JS/JSON file for private Google Drive and Docs origin links, not only the public Library or PDF viewer. Fail the APK build on any leaked private links.
5. Run the additional V34 regression as a release smoke check and as a native Android build gate. Repair the Android workflow's YAML run block so V26, V33 and V34 library tests all execute separately.

## Classification

- **73 private/restricted** original Drive PDFs: excluded from shared app (17 IS, 41 IRC, 15 manuals/SSR/specifications/bridge/reference copies). No files deleted from Google Drive and no sharing permissions changed.
- **12 official web viewing links**: public publisher pages or portals, not private Drive files and not all full-text free book contents.
- **IS/IRC**: official BIS viewer and IRC publisher sale/catalogue only; no claim of free unrestricted downloads or licensed redistribution.
- **Original PDFs inside APK**: zero; official public PDFs are linked for online viewing from publisher.

## Outstanding limits

- Cannot remotely remove private references from old APKs already distributed; users must install the new APK.
- Git history may retain earlier obsolete link references; this patch cleans current source code/assets and does not rewrite immutable published history.
- Free access is publisher-defined and subject to website availability; CPWD publisher sometimes rejects requests.
- Real Android devices still need human inspection for external-viewer launch and successful opening of publisher sites.
- No production-signed, rights-cleared offline PDF redistribution package has been approved.
