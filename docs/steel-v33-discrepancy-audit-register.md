# Steel V33 — exact source-discrepancy audit register

**Scope:** PWD Field Engineer Assistant Steel Table only. No source mass or dimensional figure is altered, no BIS text is redistributed, and no production APK is authorised.

## Why this exists

The Steel Table contains **757** catalogue records. The latest test output reports **149 with limited selected-source checks**, **588 reference-only/pending**, and **20 on hold**. A count alone cannot tell the engineer which particular items, standard family, edition or source problem still needs attention.

## V33 audit artifact

`tests/verify-steel-v33-audit-register.mjs` rebuilds a **deterministic inventory from the actual current source code**, using the already tested `PWDSteelCatalog`, `PWDSteelCompare.audit()` and `PWDSteelCompare.quantityGate()`. It prints these fields for each held record to the release-test logs:

- Exact stable row ID and designation, including series and section family.
- Source name and date, original app mass and identifying nominal dimensions.
- Source audit status, BIS review note and internal integrity issues.
- Explicit confirmation that quantity calculation is not allowed.
- Totals by source and status for all pending and held entries, so audit priorities can be allocated without guessing.

No source value is automatically corrected based on geometry/density, and no original private BIS PDF is ever uploaded or packaged with the app. The report describes **the current dataset**, not an independently certified current standard edition.

## Next engineering audit steps

1. Inspect every held entry and assign the relevant **official BIS amendment or manufacturer-issued erratum** as its resolution evidence.
2. Keep the entry locked if documentary evidence is absent; do not replace a disputed mass with the mass inferred from 0.785 × area.
3. Resolve designation ambiguities using complete D/B/t and edition, not just a prefix and approximate height.
4. Independently verify the 588 pending rows against the authoritative publication as separate batches.
5. Re-run the inventory and the existing full engineering tests after each source revision.

## Release gate

The tests are included in both release smoke and **Android TEST build** CI. A passing test means the inventory is complete and reproducible, not that its 20 holds are resolved. **Final app release stays blocked** until authorised source evidence and device QA support it.
