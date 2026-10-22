# V21 — Batch Assistant context help consistency
_Date: 23 October 2026 | PWD Field Engineer Assistant_

## Problem
V20 made the input explanations optional across the Batch Assistant but put the
**Show input guidance** toggle only on the **Material Order** tab. An engineer
using **AJAX Batch** could not access its concealed guidance without returning
to another workflow. This defeated the simple-but-useful UX policy.

## Fix
- Display the same short help toggle on both Material Order and AJAX Batch.
- The buttons use one shared visibility state, stay in sync, and expose
  `aria-pressed` status for screen readers.
- Initial view remains uncluttered. Engineer-entered source family, item,
  quantity, water/cement ratio, batch volumes and operator instructions are
  unchanged.
- The **Engineering checks & notes** action, source tables, the water-ratio
  cautions and the distinction between working bulk densities and approved
  concrete mix requirements stay intact.
- Native Android and web source use the identical interface.

A new executable regression test simulates clicks on the actual embedded
controller code, including opening help directly from AJAX, closing from
Material Order, and synchronized accessible button state.

**Not changed:** field math, approved concrete criteria, code references,
quantity calculation, other app modules, or licensed source publications.
