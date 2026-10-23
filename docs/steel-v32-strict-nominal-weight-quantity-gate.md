# Steel V32 — source-mass qualification gate before quantity calculation

**Project:** PWD Field Engineer Assistant — Steel Table only. No changes to MPR Management, Estimate Creator, or other products. No final production APK release authorised.

## Identified defect

Before V32, the Steel Table's optional quantity calculator blocked *known conflicting* BIS values but could still calculate a weight from a catalogue row with **no independent comparison to the applicable BIS nominal-mass table**. The text disclosure was technically cautious, but the app was still generating numerical site quantities from an unverified row. This conflicts with the project's accuracy-first policy.

## Small-batch remedy

1. Introduce `PWDSteelCompare.quantityEligibility(catalog,row)`. Only statuses with an affirmative **limited check of nominal mass against a source standard** are quantity-eligible: `is808-mass-checked`, `is808-mass-area-inertia-checked`, `rhs-weight-checked`, `shs-row-checked`, or `spot-checked-match`, provided internal row audit also passes.
2. All other rows remain visible to **inspect original reference information** with an honest status, but cannot produce an app-generated quantity. No rows or source numerical values removed or silently corrected.
3. Existing detailed conflict errors for RHS/SHS/CHS/IS 808 remain intact; the new eligibility check is an additional final barrier.
4. The optional calculator displays a plain-language verification message and disables its calculate button for pending or conflicting rows. For theoretical user-entered geometry, a separate explicit **not BIS nominal mass** caution remains and the legacy approximate calculation works.
5. Size-list subtitles now say `Limited BIS check`, `Source only · not verified`, or `HOLD · no quantity`; comparison unit-mass cells explicitly mark `limited check`, `UNVERIFIED`, or `HOLD`. Visual weight values remain clearly sourced reference data, not automatically valid takeoff input.
6. Automated test `tests/verify-steel-v32-quantity-gate.mjs` scans all **757** catalogue records and asserts only independently checked mass rows can enter quantities, including synthetic source conflicts/missing sources. Existing real calculator control-flow regression (V12) now also rejects a real pending section.
7. Full release and Android **TEST** workflows require both new tests. Offline cache version updated so no older unchecked calculator remains cached after deployment.

## Unchanged engineering restrictions

- A selected BIS nominal mass is not delivered material certification. Actual material grade, dimensions, MTC, procurement tolerance, applicable project specification, and current amendments still require independent checks.
- `PWDSteelMath.quantity()` remains a generic arithmetic utility for unit testing and theoretical inputs. The **Steel Table's user-facing calculator** imposes the strict source-qualification gate.
- Historical and secondary rows remain visible for comparison and research, not accepted as current authority.
- Previous audit: 757 total, 149 with limited source checks, 20 holds, 588 under review (counts may evolve as sources are verified).
- Steel Table production release remains **blocked** until source reconciliation, held-row resolutions or justified exclusions, and actual Android device QA are finished.

## Follow-on source audit

Continue original BIS/table/amendment checks in small traceable batches without copying restricted BIS raw tables into public source; do not invent missing numbers or infer authoritative corrections from density. A checked row's actual mass is used only as a table value, never a manually corrected substitute.
