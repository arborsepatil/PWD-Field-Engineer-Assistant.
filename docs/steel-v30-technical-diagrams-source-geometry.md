# V30 — technically reliable steel cross-section diagrams

**Scope:** PWD Field Engineer Assistant Steel Table only. This change does not alter MPR Management, PWD Estimate Creator, steel source database, catalog mass, or quantity calculations. Production APK release remains blocked pending full source audit.

## Choice
Use **dimensioned, source-proportional cross-section diagrams**, not an appearance-only icon and not an unjustified fabrication drawing. The UI remains member → size → schematic/weight/dimensions → compare → optional quantity.

## What has been strengthened
- Independent offline module `pwd-steel-diagram.js`, with a pure testable `model()` and escaped SVG generator `svg()`.
- Common linear scale for B/D and thickness. Extreme aspect ratios are fitted as one picture using `min(166 / D, 194 / B)`; the old renderer independently restricted section width using a 48–210 px clamp and hence distorted profiles.
- I sections, channels, angles, RHS, SHS, CHS, rounds and flats have appropriate geometric envelopes. For CHS the only overall dimension is **outside diameter (OD)**; not an invented rectangular width.
- Web, flange or wall thickness geometry is derived at that scale **only if the source supplies a positive, plausible numeric property**. Missing/conflicting thickness values use a clearly labelled schematic.
- No taper or fillet shape is fabricated from incomplete source data. This deliberately keeps accurate **outside envelope and trusted thickness labels** separate from a truly authoritative rolled-profile polygon.
- SVG `<desc>` and a plain-text warning below the diagram identify fillets, slope and hollow corner approximations. The selected numeric source audit remains displayed next to unit mass.
- No change to nominal mass, material grade, design strength or cross-section property calculations; a drawing alone never justifies a load-capacity conclusion.
- Rebuilds offline cache, includes the new renderer in the Android asset checks, and gates the Android/test build and QA on `tests/verify-steel-v30-diagram.mjs`.

## What 'accurate' means here
- Dimensions on the annotation are **source-stated nominal dimensions**. Exterior depth-to-width geometry is proportional. When sourced, representative internal thickness is proportional too.
- Actual root and toe radii, taper geometry, rounded rectangular hollow corners, manufacturing tolerances and **production/fabrication drawings** require complete authoritative standard/manufacturer geometric definition. In V30 these remain schematic and are not marked as exact.
- Information being *present in a reference record* is different from having been *independently checked against the current BIS edition*. Existing `PWDSteelCompare.audit()` continues to show checked vs review vs hold.
- Any source field missing from the original catalog stays unspecified. Do not infer dimensions from illustrated pixel measurements; the SVG view is a reference display only.

## Source audit and release gates
Current dataset has 757 section records with limited verification coverage; unresolved holds remain. No source rows have been promoted by this diagram change. UI regression and mobile device inspection required before production. **No final release APK** without source amendment audit, held-row resolution, whole-catalog review, contrast/mobile QA, and approval of the actual supported scope.

## Next deeper engineering phase
Where full authoritative cross-section shape parameters are available, implement verified arcs/tapers as a *separately audited precise geometry representation*; compare analytical cross-sectional area from the contour to the tabulated BIS area, with tolerance documented per applicable source. Never use geometric reconstruction for a nominal kg/m replacement unless explicitly defined and separately validated.
