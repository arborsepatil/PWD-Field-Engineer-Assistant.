# CIVIL BANDHU · MoRTH QC Draft Register: development handover
**Date:** 27 October 2026
**Working branch:** `morth-reader-finalization-2026-10-27`
**Scope:** privately tested offline MoRTH Fifth Revision 2013 reference reader; not an official QA approval system.

## Workflow
1. Open Library → MoRTH → QC references.
2. Search the existing selected 129 reference rows by material, work or test.
3. Expand **Prepare field QC draft register**, enter project, site/chainage, date and contractor (optional).
4. Click **Choose tests and enter results**. Matching entries appear directly below the controls.
5. Untick irrelevant entries. Enter sample/test identifier, observed result and review remarks for the selected ones.
6. **Export draft CSV** (contains only checked, currently matching rows), or **Print draft** (omits unchecked rows and prints user-entered values).
7. Export/save before closing. The app deliberately does not store entered project information or send it to a server.

## Deliberate technical boundaries
- The 129 entries are a selected 2013 MoRTH *documentary reference*, not a complete or current contract QC schedule.
- The sheet does not determine number of tests, 30/70 or other allocation, shortfall, recovery, pass/fail, quality compliance or engineer approval.
- All user-entered observations remain `DRAFT ONLY - NOT TESTED OR APPROVED`.
- CSV text fields are quoted and potential formula prefixes are neutralised.
- Source anomalies and unresolved sampling controls in the reference page remain visible and outside the calculator.
- The app never authenticates a laboratory report, signature or engineer identity.
- Fields live only within the open page, including filter changes; they are lost on reload/exit unless saved to a CSV.
- PWA and Android WebView file-save and printing experience still requires real device acceptance.

## Programmatic acceptance
- `tests/verify-morth-qc-plan.mjs`: manual result/remark entry, selected-only CSV and printing, no export when all are unchecked, entry preservation across preview, mobile draft placement, CSV formula injection guard, offline asset presence and no on-device data upload/storage.
- `tests/verify-morth-qc-frequency.mjs`: preserves all 129 source-reference IDs/frequency strings, source holds and searchable QC functionality.
- `tests/verify-morth-offline.mjs`: section reader, existing modules, owner-local packaging and source-link controls.
- `android/scripts/prepare_assets.py`: includes the two QC draft scripts only in opt-in owner-local MoRTH builds; excludes those modules from the public default Android APK.
- `.github/workflows/morth-private-smoke.yml`: runs above regression and packaging checks, builds private-test offline PWA ZIP, not a new Android APK.

## Outstanding
- Real Samsung Android install/browser/WebView checks: search, large font, offline, input editing, CSV file save and print.
- Independent source-page and approved-contract review for QC rules/acceptance.
- Review the intended distribution rights before a public release.
- Do not equate a passing software regression with approved engineering source content.
