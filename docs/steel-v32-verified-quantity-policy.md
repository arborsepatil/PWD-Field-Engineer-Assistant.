# Steel V32 — stop calculation using unverified published section weight

**Project:** PWD Field Engineer Assistant, Steel Table only. Separate MPR Management, Estimate Creator, SSR, scanner and Library modules untouched.

## Engineering issue found
The previous calculator blocked several known BIS numeric conflicts, but could still multiply **any other catalogue kg/m**, including a historical manufacturer value, secondary index value, or untouched Osdag record, into a weight without confirming that the selected numerical nominal mass had an authoritative source check.

That produced mathematically consistent arithmetic but a potentially unverified engineering input.

## Implemented policy (safe and explicit)
- Existing catalog and open-source row values remain preserved, without silent correction or source substitution.
- New pure `PWDSteelCompare.quantityGate(catalog,row)` classifies each record independently:
  - `limited-check`: nominal mass has a **selected source-row BIS check** and no conflicting quality flags. Permits **provisional arithmetic** only. No product/MTC, complete-table, edition-completeness, structural, purchase or estimate certification implied.
  - `pending`: source value exists but the **current applicable BIS nominal mass is not confirmed**. Can be read and compared with a prominent **UNVERIFIED** mark; quantity calculator disabled.
  - `hold`: conflicting property or outside applicable scope. Mass appears as a disputed source value, prominently marked **HOLD**; quantity calculator disabled.
  - `invalid`: no valid positive nominal mass. Quantity disabled.
- Geometry-verified flags by themselves cannot upgrade mass to checked. No inferential certification.
- User-selected member size shows a succinct source check explanation beside the optional calculator. "Calculate weight" button disabled for an unverified or held row.
- Preserves original specific-source conflict reasons (including RHS 120×80×6 anomaly and amendment scope) in the calculator errors; new fail-closed quantity guard follows them.
- User-entered geometrical section calculator stays distinct, labelled *theoretical only*. It must never be described as an authoritative BIS nominal kg/m.
- Comparison explicitly annotates numeric masses as **limited check**, **UNVERIFIED** or **HOLD**; no implied structural choice recommendation.
- Reuses actual source status and all 757 catalogue/Osdag records; no new numerical BIS values were asserted.
- Full automated test suite includes `tests/verify-steel-v32-quantity-gate.mjs`: executes **the actual calculator** for each row, requires rejection of all pending/held inputs before a quantity-engine call, preserves checked arithmetic, and tests adversarial conflicts and geometry-only false positives.
- Offline cache refreshed; native Android QA workflow uses same release gate.

## Release decision
**No final APK release.** Limited source-row verification is not full BIS/edition/amendment completeness or MTC acceptance. Resolve on-hold anomalies or exclude unsupported items, verify all offered live standards and numerical fields, test comparisons and real Android rendering, then explicitly approve a release scope. DO NOT reclassify unverified rows as certified to force a release.
