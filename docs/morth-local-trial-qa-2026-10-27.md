# MoRTH Fifth Revision (2013) — controlled local-reader QA register
Date: 2026-10-27
Scope: CIVIL BANDHU MoRTH Reader; local/private testing only, no redistribution of original publication.

## Inventory verified in existing source
- Base reader index: Sections 400–2400 (21 section groups, 260 main-clause records).
- Additional module: Sections 100–300 (37 partial source/QC summary records).
- Extension modules: Section 2500 (10 records), 2600 (15), 2700 (9), 2800 (15), 2900 (11), 3000 (5), 3100 (10).
- Total: 31 section groups and **372 main-clause records**. This counts indexed records, not full source-text digitization, and not full proof of accuracy.
- Ten supplemental module scripts load in order via app-shell.js.

## Implemented / preserved
- Search by clause/title/keywords, section and verification filters.
- Source page labels, source-discrepancy/hold language, JE Quick View and selected engineering tables.
- Individual source-only quick-calculation references, where developed earlier; no new formula logic in this sprint.
- Local-only offline preload of reader, 10 modules and user-owned PDF import viewer.
- Public Github Pages/Android packaging exclusions remain intact.

## Discrepancies and work awaiting evidence
1. **2500**: Appendix Table 2500/1: multi-level heading-to-value mapping unresolved; do not enable auto acceptance for held values.
2. **2700**: Clause 2703.2 last printed sentence incomplete; use original book/approved instruction, not an inferred operation.
3. **2800**: 2803–2815 contain selected documentary/QC source checks, not full specialist structural-repair procedures.
4. **100–300**: only limited source-checked QC/documentary summaries; not a complete verbatim clause set.
5. **All**: many printed-page-to-PDF-page mappings require independent comparison. Do not invent PDF page numbers.
6. **All**: contract amendments/approved project documents and edition applicability remain engineering decision points.
7. **QC**: legacy `qc.html` is no longer shipped; reader now instructs reference to applicable original Section 900 and project QC schedule.
8. **Source PDF**: original MoRTH publication is not bundled or publicly distributed.

## Next verification gate
- Select representative source pages per section and compare exact printed clause numbers, tables, numerical values and units.
- Review high-impact acceptance and test frequencies separately with relevant project amendments.
- Run `python3 tests/verify-morth-local-trial.py` to validate package, offline asset presence and release segregation.
- Test browser navigation / airplane mode on Android using a local HTTPS/localhost preview.
- No declaration of complete MoRTH digitization, certified engineering acceptance or production-ready release until these pass.

**Local trial build**: `python3 scripts/prepare_morth_local_trial.py`; output folder `local-morth-trial-dist/`. **Do not publish this folder**.
