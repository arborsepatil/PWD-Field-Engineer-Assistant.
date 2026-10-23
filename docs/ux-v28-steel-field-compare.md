# V28 — Steel Table field-first UI and audit-aware section comparison

Project: **PWD Field Engineer Assistant** only (MPR Management and PWD Estimate Creator unaffected).

## User-approved interaction
1. **Select member type** — Beam, Channel, Angle, SHS, RHS, CHS, etc.; then optional series.
2. **Find member size** — select designation; searchable, offline catalog.
3. **See nominal unit weight and principal dimensions immediately**, together with original dimensioned diagram. Detailed properties (area, inertias, section moduli, root/toe radii where present) remain under *More section properties*.
4. **Compare similar sections** by tapping *+ Compare* on up to eight sizes within the same family; side-by-side horizontally scrollable table shows kg/m, dimensions, available area/Izz/Iyy, source audit status, and source identity. No interpolation and no structural capacity or "best section" ranking.
5. **Quantity calculator** preserved under an optional collapsed disclosure; original calculation and conflict blocking remain unchanged.
6. **Removed Export CSV / Print-PDF from Steel screen**; no copy control. Internally the legacy safe CSV utility remains because unrelated regression tests exercise the calculation engine, but no visible controls or handlers invoke it.

## Safety and source audit
- The existing curated manufacturer/BIS selected-sample ledger and Osdag attribution are **unchanged**. No new BIS table values invented.
- Comparison reuses `standardAudit()` + `auditRow()`. Source rows with checked numerical conflicts, outside-scope status, or missing/invalid provenance are visibly **On hold**. Checked status states **Selected values checked** only (not product or design certified). Everything else states **Source only · verify**.
- When a dimension or property does not exist in an actual source record, show an em dash rather than derive one. H-section thickness is specifically identified as web thickness; a CHS uses outside diameter with no rectangular width.
- Conflicting published values are shown as *source reported; HOLD*, never silently replaced or used to compute comparative structural performance.
- Existing `calculate()` source-conflict stops and geometry-vs-nominal distinction remain intact.
- Acceptance criteria tested for all catalog rows through `tests/verify-steel-v28-compare.mjs`, including synthetic conflicting mass, mixed-family denial, duplicate comparisons, null property safeguards, offline support, and ordered mobile UI.

## Still pending
- Full authoritative row-by-row verification for remaining IS 808, IS 4923, IS 1161 and manufacturer/Osdag rows, revision-by-revision amendments. BIS spot-checks **must not be advertised as an audited full standard**.
- Physical Android UI/device inspection of tap targets, long names, dark mode and horizontal scrolling.
- Cross-source mass differences and conflict resolution require original authorized publications, official amendment history and MTC; no new numeric validation was inferred in this UI release.

No changes to the Field Engineer Assistant library, SSR, MPR Management or Estimate Creator are in this version.
