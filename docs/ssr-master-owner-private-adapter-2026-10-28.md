# CIVIL BANDHU — SSR Master owner-private integration adapter (2026-10-28)

## Scope and release boundary
SSR Master is a **separate module in PWD Field Engineer Assistant** (not the separate Estimate Creator or MPR). Task 1 retains the existing original 2022–23 XLSX local importer. Tasks 2–6 now have a common source-only owner-private interface. The code can be packaged in the public app because it contains **no digitized SSR, QC price, published notes, images or licensed PDF text**. This is an integration **adapter**, not an assertion that the earlier six-task private archive has been converted or installed.

The existing handover package `CIVIL_BANDHU_SSR_MASTER_Tasks_1_to_6_PRIVATE_INTEGRATED_2026-10-27.zip` is a different artifact. **Do not relabel or alter it**. Conversion requires auditing its exact filenames, schemas, and hashes before exporting JSON for this adapter.

## Compatible owner-private JSON contract
- Single UTF-8 JSON document, maximum 20 MB.
- `schema`: exactly `civilbandhu.ssr.private.v1`
- `edition`: exactly `2022-23`
- `tasks` has keys `"2"`, `"3"`, `"4"`, `"5"`, `"6"`.
- Tasks 2–5 are arrays; every record must include a nonempty `source` (source page, GR date or annexure reference).
- Task 6 is `{"frequencies": [...], "charges": [...]}`. Every frequency needs `test`, `unit`, `source`. Every tariff record needs `test`, nonnegative numeric `rate`, `source`.

### Task-specific field contract
| Task | Fields needed for safe operation |
|---|---|
| 2 Notes / GR | `id, title, text, section, source` |
| 3 Annexures | `id, category, description, rate, unit, source` |
| 4 Lead | `id, material_group, loading_method, lead_km, rate, unit, rate_basis, source` |
| 5 Consumption | `id, material, item_code, coefficient, unit, mapping_status, source` |
| 6 Frequency | `id, test, kind, auto_eligible, special_rule, frequency_qty, unit, minimum_tests, source` |
| 6 Charges | `id, test, rate, unit, source` |

Include additional genuine source fields freely; the browser renders them as text rather than executing HTML. The owner-private converter must preserve original record IDs, source page, rate basis, edition and review flags. Do not insert defaults for missing engineering source values.

## Calculation guards
- Lead: exact rate or *linear interpolation only* between source-provided adjacent slabs with same material, loading method, unit and rate basis. Show both source slab rates. No extrapolation. Source-specific loading methods must remain separate.
- Consumption: find/filter; **no automatic SSR item mapping or approval**. Historical 972 coefficients are not equivalent to approved direct item mappings.
- QC automatic plan: only `kind="test"`, `auto_eligible=true`, `special_rule!=true`, valid `frequency_qty`. Complete tests = max(ceil(quantity / quantity_per_test), source-specified minimum). Laboratory = ceil(30% of complete tests); field = remainder. Manual review for minimum-per-shift, cube specimen vs cube set, batching/day count, container samples, frequency that cannot be established from quantity alone, or unapproved rule.
- **Do not apply 50/50**. No shortfall recovery, penalty or invented portal payment. 30/70 is the requested project workflow, **not a universal mandate of SSR 2022–23**; verify project/contract requirements.
- Task 6 tariff is separate reference lookup, not automatic charge matching or certification. The transcribed 2023–24 tariff must not be assumed current.

## Safe import process
1. Open SSR Master > Task 2–6. Open **Choose private JSON pack**.
2. Import converter output from owner-authorized archive. Validate exact edition, source fields, tasks, record counts/hashes against manifest. No source goes to GitHub/Pages/APK.
3. Local import is parsed as JSON, displayed via text nodes and stored in local private IndexedDB. Removing the pack deletes only the local index, never originals.
4. Compare imported counts against source manifest: Task 2 general notes/references, Task 3 annexures, Task 4 lead slabs, Task 5 972 consumption coefficients, Task 6 123 frequency records and 87 charge records. Source-specific count changes must be logged, not silently normalized.
5. Re-run synthetic tests, owner-private source-to-row audit and physical Android installation/airplane-mode test before considering it operational.

## Not completed yet
- Source ZIP -> private JSON adapter and manifest/hashes audit.
- Source-specific QC special-rule interpretation and engineer sign-off.
- Legal applicability of rates as of October 2026.
- Physical Android installation and owner-private offline data retention/backup tests.
- Public release or merger into main; protected staging branch stays isolated.
