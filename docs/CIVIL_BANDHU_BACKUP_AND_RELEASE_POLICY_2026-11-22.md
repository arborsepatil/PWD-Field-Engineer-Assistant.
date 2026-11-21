# Civil Bandhu — protected backups and Android release gate (22 Nov 2026)

## Source of truth
- Public Android project: `arborsepatil/PWD-Field-Engineer-Assistant.` (development baseline; not guaranteed current with Owner10).
- Owner10 is the last documented Android test build, package `in.pwdtools.fieldassistant.owner10` (15 Nov 2026). Its APK has not been obtained as verified raw bytes in the current build session.
- Older V09R1 private engineering source and SSR files are backed up to a **private Google Drive folder**: https://drive.google.com/drive/folders/1ssp4iAp9WIFFupG68TEepqwE7ZPViLOg
- Prior Android Owner07–Owner10 installs, user app data and signed packages must not be silently replaced by builds based on this older baseline.

## Release requirements
1. Preserve timestamped and checksum-verified immutable source/APK snapshots before edits, and retain the last known-working APK and source.
2. Keep private SSR packs, unlicensed PDFs, signing keys, local user data and credentials out of public GitHub. Store private recovery files only in access-controlled storage.
3. Compare the newest Android APK web assets with the newest engineering source and verify the material count (SSR, consumptions, notes) before merging.
4. Apply the approved Civil Bandhu logo and polished UI, collapsed contextual notes, retaining-wall inputs → drawing → quantity order, and safe last-screen return logic to the **newest** source only.
5. Preserve original engineering calculation scripts and source coefficients unless separately verified.
6. Execute browser/mobile UI and regression tests plus independent APK signature verification. Perform real Android device installation, background-return and upgrade tests before declaring production-ready.
7. Publish any test APK with a new package ID/signature or a verified same-signer upgrade. Never promise in-place upgrade across mismatched signing certificates.
8. Publish GitHub source revisions on a review branch, preserve working main; store recoverable binary releases in protected Drive.

## 22 Nov 2026 status
- A protected copy of the older V09R1 private source ZIP was saved to Drive.
- Private SSR import JSON and bridge addon ZIP were also copied into that same Drive folder.
- A v11 browser test/source ZIP and a separate Owner10-targeted UI changes patch exist in the ChatGPT workspace; **neither is an Android-installable APK**.
- No latest Owner10 APK raw-byte artifact has been recovered from GitHub or Drive. Do not claim an APK is delivered.
- The repository's Android APK GitHub Actions build workflow exists, but inspected recent runs were unsuccessful; therefore no successful updated Android APK is claimed.
