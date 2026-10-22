# V23 — Simplify PDF opening and bridge return-wall references

**Scope:** continuation of the compact UI requested from the marked screen recording. No engineering source numbers or calculation algorithms changed.

## PDF Viewer
- When an original source PDF is not on this phone, one prominent **Choose PDF** button remains. The secondary top-file-picker strip is hidden in that empty state, avoiding redundant actions.
- When the source is loaded, the existing private PDF management strip remains, now labeled **Change PDF**.
- Exact source routing, page indicator, local file reading, native Android picker, page gestures, private Drive button and fallback remain.
- CSS `:has(.source-chooser:not([hidden]))` targets only the empty-source state; the underlying file input and actual event listener are untouched. Older unsupported browsers may show the extra strip, but retain all functionality.

## PCC bridge return-wall reference
- Show the **2023** and **2002** original sheets as the primary choices.
- Keep exactly one prominent original-sheet action per record: `bridge2023&page=218` and `bridge2002&page=69`.
- Move additional book-index links and known title-block/index mismatch explanations into a named disclosure.
- **Keep visible:** these bridge return-wall sections are different from the PCC section quantity calculator and its quantities may **not** be applied to the source plans without a separate geometry check.
- Preserve legacy 2002 material/classification review and 2023 source discrepancy details.

## QA
- `tests/verify-v23-reference-entry-ux.mjs` tests source access controls, actual primary picker linkage, both exact original-sheet routes, verified index links, persistent safety note and no loss of offline caching.
- Existing engineering, Android package, source-audit and offline tests remain mandatory.
- Web app cache bumped so installed web clients load the new screens.
- Native installable APK to be validated through GitHub Actions after merge.

**Non-goals:** removing safety notes, altering copyrighted PDFs, retouching any scan, rebuilding existing calculators or merging unrelated apps.
