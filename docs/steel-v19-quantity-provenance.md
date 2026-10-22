# Steel V19 — Nominal quantity Method provenance correction

Audit date: 23 October 2026. This is a source-label and field-export integrity fix, **not** an alteration of steel masses, BIS geometry, member quantities, material grades or BIS numeric comparison ledgers.

## Finding

The existing `pwd-steel-core.js` quantity function used the fixed report Method phrase
`Manufacturer published kg/m × length × count` for **every** listed section.
That is false for some catalogue entries: the records include independently
spot-checked IS 808/IS 4923 nominal examples, historical manufacturer
values, secondary index records and Osdag open database values whose current
BIS conformity has not been established. Even though the CSV has a separate
source status, the mismatched Method line could be misleading in a PWD
field engineer's takeoff.

## Correction

Quantity and CSV Method use the catalogue row's recorded `basis` and
describe it explicitly. Seven supported evidence classes have distinct
labels:
- Limited BIS table source spot-check (not product/MTC certification)
- Nominal kg/m-only BIS spot-check
- Manufacturer-published nominal mass
- Historical manufacturer nominal mass
- Unverified secondary publication
- Unverified secondary amendment index
- Osdag open data (current BIS row unverified)

An omitted/unrecognized source `basis` receives a neutral
`Provided reference nominal mass (source verification not established)`
label, never a fabricated manufacturer/BIS claim.

Custom shape input retains its independent
`Theoretical geometric mass` / `Approximate sharp-corner` warnings. **BIS
certification, mass tolerance acceptance and structural design checks remain
outside this quantity helper.**

Regression test: `tests/verify-steel-v19-provenance.mjs` exercises all seven
classifications, the source-neutral fallback, the exact CSV Method row,
unchanged 6 m × 3 piece × 24.17 kg/m arithmetic, zero rate, and custom
plate/RHS warnings. All test cases run before Android APK packaging.

No UI redesign; no licensed BIS PDFs, copyrighted standard tables or private
Drive links are added to the APK or public repository.
