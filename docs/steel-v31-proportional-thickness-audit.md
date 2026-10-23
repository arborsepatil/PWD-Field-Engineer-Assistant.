# Steel V31 — preserve exact sourced drawing thickness

**Project**: PWD Field Engineer Assistant only; final production APK still on hold until the catalogue's source audit, held conflicts, and mobile QA are complete.

## V30 follow-on accuracy correction

The new SVG drawing module now draws true depth-to-width proportional envelopes. V31 also removes *the remaining visual clamps on valid published nominal section thicknesses*.

- Beams/channels: a web thickness source `t < B` and a flange thickness source `2T < D` are mapped using the same pixel scale as the envelope, without any arbitrary 85%, 70%, or 35% caps. If source dimensions are impossible/absent, a schematic fallback is used with an explicit warning.
- Angles: a sourced `t < min(D,B)` is drawn at the same source scale, rather than capping at 65% of leg length. Missing/conflicting values remain schematic.
- RHS/SHS: sourced `2t < min(D,B)` creates a proportional inside opening, without a 35% pixel cap. Corner radii are still schematic.
- Pile series: until full profile dimensions are confirmed, the I-shaped outline is explicitly described as a **generic pile envelope**, not a detailed pile bulb/edge section.
- SVG strokes make sub-pixel geometric details illustrative; nominal annotation values are the source record and the authoritative numeric data. Drawing is never a fabrication or load-design drawing.
- Added synthetic extreme-thickness regression `tests/verify-steel-v31-thickness.mjs` for each family, protecting against future proportionality regressions. No BIS table rows, nominal weights, or sectional properties modified.

**Gates:** complete release suite + Android QA TEST APK. No final APK is being published. Once approved, the existing 20 held + 588 pending source rows remain separate from diagrams.
