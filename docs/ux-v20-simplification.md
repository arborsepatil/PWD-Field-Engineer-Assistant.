# V20 — PWD Field Assistant screen-recording UX cleanup
_Date: 23 October 2026 • Scope: Field Engineer Assistant only_

## Principle

The user's marked screen recording uses **X = remove** and **✓ = keep**. Preserve the compact eight-tool list and remove duplicate landing-page furniture. **Keep calculations, actual technical source information, standards, drawings and necessary approval warnings.** Do not merge with MPR, Estimate Creator, document scanner or other products.

## Implemented

| Screen | Kept in primary workflow | Removed or moved out of the way |
|---|---|---|
| Home | Batch Assistant, Retaining Walls, Steel Table, Units & Civil Quick, Mix Design, Bridge Plans, SSR Master, Library | Greeting hero, decorative introduction, Home search, recents, duplicate Main module cards, home development notes, PWA install call-to-action, intrusive global calculator |
| Shared app shell | Theme, user font size, source-specific MoRTH loader | Global floating quick calculator, redundant recent-tracking code and floating calculator toggle |
| Concrete Batch Assistant | Three workflows, material inputs, batch controls, output and engineering checks | Repeated input explanatory notes hidden until Show input guidance |
| Concrete Mix Design | IS 10262/IS 456 input, result, limits and trial-strength workflow | Version badge and long repetitive effect explanations hidden until Show input guidance |
| Units & Civil Quick | Conversion, geometry, earthwork, chainage and survey calculators | Decorative intro; optional all-unit grid collapsed |
| Retaining Walls | PCC and RCC options, visible site-check boundary | Duplicate landing hero and speculative future-feature prose |
| PCC calculator | Foundation and section inputs, diagrams, result | Related bridge return-wall guidance moved after calculations into expandable section |
| RCC 2023 retaining wall | Source SBC/height selector and original plan schedules | Duplicate heading and internal record-count badge |
| Bridge Plans 2002 and 2023 | Two books only, direct PDF links, drawing search/index, applicability tool | Development-status badges and duplicate heroes; detailed verification notes in expandable disclosure |
| Steel Table | Nominal section selector, quantity, warnings, data sources and export | Duplicate Steel Table heading, duplicate offline badge and development-style footer |
| Library | Search, publication filters, original reference links, offline PDF saving | Long introductory instructions; private-storage and edition cautions in expandable disclosures |
| Settings/Profile | Themes, offline management, reset and navigation | Obsolete FAB toggle, unavailable language feature, duplicate bottom Tools shortcut |

## Engineering and data preservation

- Standard audit, structural-value review statuses, arithmetic, tests and product source ledgers are **unchanged**.
- Design limitations and minimum grade/approval checks remain in the relevant engineering screens; do not quietly assert unverified designs.
- **SSR Master remains a collection of original SSR reference PDFs.** This UX change must not claim an item/rate engine is implemented.
- Separate 2002/2023 bridge books remain separate. Removing QA badges **does not mark sheets verified**.
- Exact BIS source documents and private Drive PDF bytes remain outside the public repository/APK.
- The Android build remains native installable APK (not merely an installable website).
- Regression: `tests/verify-v20-simple-ux.mjs` plus all earlier engineering, source and packaging tests, integrated into CI and Android workflow.

## Test instruction for phone

Open V20 on Android. Confirm eight Home rows are directly tappable; no float obstructs an input; Batch Assistant inputs appear first and Show input guidance works; Mix Design retains visible concrete scope and revealable help; Civil Quick all-unit results expand; retaining wall reference links stay reachable; both bridge books show original PDF links and filters; Steel Table still blocks reviewed numeric conflicts; Library can search and choose private saved PDFs.

Use the old screen recording as the baseline for further marks. Differences involving incomplete source data should be **verified**, not simply hidden.
