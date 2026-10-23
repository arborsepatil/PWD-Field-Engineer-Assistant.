# PWD Field Assistant — installable Android APK

## PUBLIC LIBRARY POLICY (V34, 23 October 2026)
- The shared test APK includes **official public publisher links only**, which open in the device browser. Download/redistribution permission is NOT inferred from public view access.
- The former 73-entry owner-Drive catalogue, original PDFs, device-owned private book viewer/importer, unapproved original-derived bridge book indexes, historical manual readers and MoRTH digitised reference copies are excluded from the shared package.
- The Bridge Plans menu opens a public reference gateway. The 2002 and 2023 original type-plan PDFs are **not included**; no design approval should be inferred from stored index metadata.
- Public references require internet unless separately accessed through the publisher's lawful offline provisions. The Library does not bundle offline publisher PDFs, private Drive IDs, a downloader, or a PDF export action.
- Previous test APKs may have provided local private PDFs. Updating the APK changes bundled pages but may preserve old local app data; users can clear app storage if they explicitly want that data erased (this also removes app preferences and personal imports).
- Do not confuse an Android debug test APK with a signed production release. Civil engineering source QA is separately pending.



This is a normal Android application with a launcher icon, package ID
`in.pwdtools.fieldassistant`, bundled public engineering screens, Java-based
Android Activity, Android file picker and Android print-service integration.
It is **not** a Chrome PWA, home-screen shortcut, or Trusted Web Activity.

## Current technical choice

The first APK retains the existing tested HTML/CSS/JavaScript engineering UI
inside a secure Android WebView, using AndroidX WebViewAssetLoader and app
assets under `https://appassets.androidplatform.net/assets/www/`.
The native shell hosts the engineering UI. It is NOT a completely rewritten
native Compose/XML interface. Retaining the existing verified engineering
formulas avoids silently changing them during platform migration.

The Android app does not register a PWA service worker and does not present
the browser 'Install app' prompt. New versions of public screens ship in the
APK. Original private Drive PDFs are not committed to GitHub or bundled.

## Build / obtain TEST APK

Open repository Actions → **Android installable APK** → successful build →
artifact **PWD-Field-Assistant-Android-TEST-APK** → download ZIP → extract
`app-debug.apk` → install it using Android's normal APK installer.

This is a **DEBUG-SIGNED TEST APK**, not a Play Store release or independently
signed production build. Final distribution requires a protected release
keystore, real-device acceptance, versioning and update plan.

From a configured Android build computer:
```bash
python3 android/scripts/prepare_assets.py
cd android
gradle :app:assembleDebug
```

## Compatibility and engineering limitations

- Android 7.0+ (SDK 24+) with an installed Android System WebView.
- Android file picker is connected to HTML file inputs, so the existing
  private-PDF import UI can request user-selected local documents.
- `window.print()` calls Android's print service, including Save as PDF
  when offered by the system. This flow requires Android device testing.
- Links to external sites open via Android's browser. An active network
  connection is still necessary for external resources and private Drive
  originals not imported onto the phone.
- Clipboard, the full PDF.js offline-reader flow, exported blob-file
  downloads, Android-specific sharing, scoped-storage data persistence,
  gestures, dark mode, external PDF launch and low-end-device performance
  require device verification. Do NOT mark those as complete until tested.
- No structural design or government-source verification is added by the
  Android packaging itself; the existing engineering safeguards still apply.
- The browser-hosted GitHub Pages version may remain accessible as a
  development preview but **is not the final delivery platform**.
