# V24 — Reference reader tap-to-record on mobile

23 October 2026. Follow-up to user's screen-recording review: useful tools should be immediately usable, with no unnecessary jumping or repeated scrolling.

## Issue reproduced from code

In the three legacy reference readers, phone/tablet layouts stack the index above the record pane, limiting the index to 270–280 px. The original `pick(i)` handlers updated the selected record and index but **did not bring the record into view**, forcing engineers to scroll down manually after every selection. On a desktop wide layout, the index and content sit beside each other so auto-scrolling would be undesirable.

## Fix

- **MoRTH clauses**, **Red Book specifications** and **Maharashtra PWD Rule Book** now reveal the selected content pane when the user taps an index record at widths up to 900 px.
- The result is rendered before the smooth scroll. Desktop widths above 900 px retain the original no-scroll behavior.
- On stacked layouts the filter toolbar is no longer sticky, so a selected result cannot be hidden behind stacked search/filter controls. The reader has a 74px scroll margin for the page header.
- The query/search/filter handlers are unchanged: filtering does not automatically jump away from the search box.
- The original source-status notes, selected/current applicability warnings, Marathi/English text metadata, historical version boundaries and downstream JavaScript calculator functionality are unchanged.
- A new executable Node VM test exercises each real `pick()` function with mobile and desktop mocks, records rendering order, checks correct destination and verifies CSS view margins; mandatory in Android and release QA.
- Offline web cache key bumped so installed web sessions receive the new screen code.

No private standard PDFs, proprietary OCR books, engineering safety statements, design capacities or numeric source tables are added or modified. **This remains a navigation-only update**, not an assertion of new engineering verification.
