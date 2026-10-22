# V25 — Search-first reference readers, on-demand filters

Date: 23 October 2026. Continued user-marked **remove duplicated/unnecessary elements** UX cleanup. This version builds on the merged V24 reference selection and V22/V23 compact source-navigation design.

## Problem and user workflow

The three source readers each displayed a search field plus **two filtering select boxes** on their opening toolbar. On a phone the toolbar frequently occupied several rows before the actual engineering index. One of those controls primarily exposes source-audit/development states rather than the clauses/specifications the engineer wants to read.

## Delivered

- **MoRTH:** show **Search** first; place `Section` and `Verification` under a native, collapsed **Filters** disclosure.
- **1984 PWD Rule Book:** show **Search** first; place `Chapter` and `Verification` in the same on-demand disclosure.
- **2012 PWD Red Book:** show **Search** first; place `Part` and `Verification` in the disclosure.
- Preserve the original select ids, options, search/index targets, source status and selection JavaScript. All six controls remain available, without replacing engineering-specific behavior or using a new data store.
- Display **Filters active** after the user changes a setting away from the screen's default, even if the disclosure is closed. This avoids a misleading empty result page after filters are applied.
- Keep mobile stacked, 44px-touchable inputs, reader-detail scroll behavior from V24, original publication links, all source/edition warnings and current-applicability limitations.
- The separate GR reader continues with its existing Current Rules, Civil Interface and Source Control views. Its source/audit scope remains available.
- Regression test `tests/verify-v25-reader-filters.mjs` executes the on-page client-side filter listener with mocked DOM and checks neutral/active/reset paths for all three readers, plus preserved source records and mobile scrolling.
- QA and Android APK workflows both gate on the new tests. Offline cache version bumped to force users' existing cached readers to refresh.

This is **layout only**. There is no change to numerical engineering values, MoRTH text, Rule Book references, historical applicability, the 2023 bridge or steel-table calculations, Android app identity, or protected source documents. It does not certify that source rows are current or project-approved.
