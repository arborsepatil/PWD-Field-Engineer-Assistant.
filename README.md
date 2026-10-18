# PWD Field Engineer Assistant V2

Mobile-first Maharashtra PWD field engineering **public tools release**. Source code is versioned in GitHub, published for free with GitHub Pages, and installable as an Android PWA when Pages is enabled.

## Existing V2 field modules
- Calculators and converters
- Retaining wall section quantity
- Route distance and chainage
- GPS engineering camera
- Concrete mix and batch assistant
- Concrete mix design

The existing modules above were brought forward from the V2 project, not regenerated as a different app. The new home, manifest, PNG/SVG icons and service worker form the public installation shell. Actual browser/phone testing is still required.

## Published PWA and Android installation

Verified GitHub Pages deployment URL (from the successful GitHub Actions deployment log):

https://arborsepatil.github.io/PWD-Field-Engineer-Assistant./

On Android, open this address in Chrome, use the browser menu (⋮) and select **Install app** or **Add to Home screen**. If Chrome offers an install prompt, the homepage also shows an **Install PWD Tools** button. This is an installable Progressive Web App (PWA), **not** a signed Android APK.

The `.github/workflows/deploy-pages.yml` workflow publishes automatically from `main`. The Pages configuration is already activated and recent GitHub Pages deployments have succeeded. The `.github/workflows/qa-smoke.yml` workflow checks static assets, manifest, JavaScript syntax and MoRTH reader/QC references before release. The publishing workflow includes a live HTTP smoke check for the homepage, manifest and service worker.

**Testing still required:** actual Android installation, permissions for camera/GPS features, offline behavior after installation, and a field engineering acceptance review. Network-backed/private source documents may require a connected account and are not included in the public offline cache.

## Public/private boundary
This is a public repository. Original PWD Rule Book scans, standards, SSR source files, drawings and licensed reference documents are **not published** here. They remain in the project owner's private Google Drive reference library and existing offline release archive. Source-gated modules are not presented as part of this public subset.

Do not use preliminary engineering calculations as final approval, testing results, or a substitute for project specifications, applicable codes, and approved drawings.

## Project checkpoint
Rule Book source digitization remains paused at Appendix 2, original PDF page 251. Resume at PDF page 252 after the app-test milestone. First-pass transcription is not independently verified source text.
