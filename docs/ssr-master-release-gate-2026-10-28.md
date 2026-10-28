# SSR Master v0.2 owner-preview release gate — 28 October 2026

**Scope:** CIVIL BANDHU / PWD Field Engineer Assistant only. **Do not merge** into separate Estimate Creator or MPR repositories. The GitHub repository is public; owner-private digitized SSR data stays **outside** GitHub and APK/AAB.

## Delivered on staging

- Six navigable SSR workspaces. Task 1 reads the owner's Excel. Tasks 2–6 import one owner-local private JSON into IndexedDB.
- Search across notes, annexures, coefficients and tariff reference; source-referenced C1 lead with material/loading method, before/after slabs, validated rate basis, optional quantity. Lead table interpolation rejects extrapolation and source-basis mismatch.
- QC material/test source search, exact quantity-based count (if explicitly eligible), and 30/70 allocation **only when allocation_eligible=true**. Never invent whether a test must be in a laboratory or field. Special lot/day/set test rules are deliberately manual.
- 2026 Play policy migration: Android Gradle `targetSdk=36`, `versionCode=2`, `versionName=0.2.0-ssr-preview`. Signed debug APK is for an owner device trial; AAB is unsigned and requires Play upload signing.
- Android bundle excludes all SSR workbook, OCR scans, source-derived JSON, private PDFs, and tariff files.

## Owner-private dataset V3 (not in this repository)

An external owner-private JSON/ZIP assembled from the original 2022–23 SSR source Excel and PDF. It is intentionally not in this public repository or bundled APK:
- 183 general note rows (not the final classified 177).
- 1,347 historic annexure rate rows.
- 1,612 historical C1 material × loading method × distance rows; cross-checked on source cost/capacity. Avoid double adding separately printed fuel.
- 531 raw numeric consumption candidates, **not** the prior verified 972 coefficients.
- Owner-private V3 has **44 visually source-checked QC frequency records** (SSR printed pages 588, 589, 590, 591 and 602; original PDF pages 595, 596, 597, 598 and 609). **28** are direct one-per-quantity count rules; **16** are grouped, consignment, source-dependent, time- or specimen-set rules and stay manual. None authorizes a per-test 30/70 split. **Not the full previously reported 123-rule handover.**
- 87 testing charge references from the *2023–24* V&QC schedule, validity 1 July 2023 through 30 June 2024 only; descriptions/units still require review and are not auto-billed.

## Release blockers

1. Recover original certified six-task private handover ZIP (123 QC frequency rules, 972 consumption coefficients, 177 classified notes) and independently reconcile hashes and numeric values.
2. Confirm 2026 SSR changes, test charge validity, MoRTH/IS/IRC material applicability, C1 loading conditions, set/day/lot special rules and engineer sign-off for billed quantities. The existing 30/70 workflow is a project preference and must be contract-approved.
3. Complete physical-phone tests (installation, data import, local IndexedDB persistence after restart, flight mode, screen navigation, field/lab gate, reading Android download folder). A CI build is not a device acceptance result.
4. Sign release AAB using a protected owner-controlled upload key and submit through an authorized Play Console account, supplying store listing, policy/privacy details and required tester program. No owner Play Console access is connected to this conversation.
5. Do not merge staging code into main until the owner reviews release scope and all applicable full-suite CI checks succeed. A release candidate is not a published production app.

Owner-preview is useful for non-billing source reference and testing; unsupported modules must fail closed.

## Android build gate (new owner preview)
- `ssr_private_workspace.html` now displays QC construction type, original frequency wording, source page and special quantity-input notes. Source-dependent sampling stays blocked. No 30/70 is automatically assigned in V3.
- Fresh Android owner-debug APK compiled and signature/asset checks passed: GitHub Actions run **40677318488** (GitHub public-code commit `6820a6e465ad522f886603551d95e579a5e041b2`). APK SHA-256 `e52a233a7209806b866ac7a7eae1001501e91ecb6e94bc008ea5475ae92e4313`.
- Private V3 ZIP/JSON are delivered directly to owner, never via GitHub source or APK. Physical Android import/durable storage test still pending.
