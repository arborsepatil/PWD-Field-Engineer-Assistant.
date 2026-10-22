# V21 — Compact reference readers (23 October 2026)

Continuation of V20 marked-recording UX cleanup. Four remaining reference tools
still placed internal digitisation statistics, licensing/index implementation
notes or very long verified-clause inventories before the normal reader.

## Changes

| Screen | Immediately visible | Folded behind an optional details control |
|---|---|---|
| MoRTH Specifications | Clause search, section/status filters, reader, concise source-verification caution | Source-introduction prose and full checked-clause inventory |
| Maharashtra PWD Rule Book | Search, chapter/status filters, source-index reader, present-day applicability warning | Private source-package fingerprint, review counts and transcription progress |
| Red Book 2012 | Search, part/status filters, source index, current-contract applicability warning | Edition/coverage cards, source status badges and digitisation statistics |
| GR Library | Search, Current/Civil/Source Control navigation, direct current-status caution | GR project-master description and lengthy source-scan boundary explanation |

## Engineering and data boundaries

- **No source row, calculated result, classification, code requirement, PDF source link, search filter, or verification rule is removed**. Existing JavaScript data and calculations are unchanged.
- Collapsing large records does not turn pending, historical or source-indexed material into current verified rules. The short source or applicability warning stays visible.
- Proprietary/private PDFs and user credentials are **not bundled**.
- This is a UI accessibility/clarity pass; the meanings and validity of 1984/2012 source material or MoRTH 2013 depend on the applicable project contract, amendments and current instructions.
- V20 home/engineering tools remain intact.

Automated guard `tests/verify-v21-reader-ux.mjs` verifies key searches and reader targets, original source-status data, optional disclosures and visible warnings. It is included in native Android APK and QA smoke workflows.
