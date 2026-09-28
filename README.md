# PWD Field Engineer Assistant V2

Mobile-first Maharashtra PWD field engineering **public tools release**. Source code is versioned in GitHub, published for free with GitHub Pages, and installable as an Android PWA when Pages is enabled.

## Existing V2 field modules
- Calculators and converters
- Retaining wall section quantity
- Route distance and chainage
- Bridge hydraulic calculator
- GPS engineering camera
- Concrete mix and batch assistant
- Concrete mix design

The existing modules above were brought forward from the V2 project, not regenerated as a different app. The new home, manifest, PNG/SVG icons and service worker form the public installation shell. Actual browser/phone testing is still required.

## Publish once, then automatic deployment
The repository owner must perform the **one-time GitHub Pages activation**:
1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Save if GitHub displays a Save button.

The `.github/workflows/deploy-pages.yml` workflow publishes automatically from `main` after that. GitHub's workflow token cannot create the initial Pages site for this account. It failed with `Resource not accessible by integration` before the first deployment.

## Public/private boundary
This is a public repository. Original PWD Rule Book scans, standards, SSR source files, drawings and licensed reference documents are **not published** here. They remain in the project owner's private Google Drive reference library and existing offline release archive. Source-gated modules are not presented as part of this public subset.

Do not use preliminary engineering calculations as final approval, testing results, or a substitute for project specifications, applicable codes, and approved drawings.

## Project checkpoint
Rule Book source digitization remains paused at Appendix 2, original PDF page 251. Resume at PDF page 252 after the app-test milestone. First-pass transcription is not independently verified source text.
