# V27 — Digital SSR item search (private local Excel import)

**Project:** PWD Field Engineer Assistant only. No change to MPR or Estimate Creator.

## Verified source
The connected private Drive contains **SSR_2022-23.xlsx** (master workbook) and **SSR_2022-23_Final1.pdf** (original publication copy). The Excel master has the tab **SSR 2022-23** with row 2 columns:

- A Serial, B Chapter, C SSR Item No., D Reference No., E Description, F Additional Specification, G Unit, H Completed Rate 2022-23 excluding GST, I Labour Rate
- Original workbook also has material/labour/consumption sheets, **intentionally not mapped in V27**.
- A prior *SSR Item Engineering v1.0* workbook reports 50 SSR sections and 2,222 indexed items, with a large number requiring chief-engineer review. This is prior workbook metadata **not a substitute for direct per-row QA**.

## Implemented V27
1. Library's **SSR** category now exposes **Search SSR Items · Digital (2022–23)** above the original SSR PDFs. Home remains the user's eight-tool arrangement.
2. The digital reader accepts the **original XLSX** through Android's file picker, parses the dedicated source worksheet on device, and builds an offline, searchable index of **item code, description, actual workbook chapter, unit, completed-rate excluding GST, original row**.
3. Source chapters are inherited from the workbook, not invented from generic Civil/Buildings/Roads labels. Rate values are displayed with their **historical year** and *GST exclusion* clearly visible. Deleted entries are labelled without usable rates.
4. Search accepts keyword and code. Numeric Excel values such as `1.1` have an optional `1.10` *search alias* because Excel may drop trailing zeros; the exact cell value is not silently rewritten. The original PDF remains the authority in ambiguous cases.
5. Index is stored in browser's **private IndexedDB**, can be removed independently of PDFs, and is not uploaded to a server or packaged as public data. Import once per device; the original private Google Drive permissions remain unchanged. No private XLSX/PDF is committed.
6. No external spreadsheet parser or internet connection required: an XLSX ZIP reader uses built-in modern WebView `DecompressionStream('deflate-raw')`. Unsupported devices get an explicit message rather than an empty result. File and XML size limits prevent pathological inputs.
7. Keeps fixed, clear engineering warnings: this is **historical SSR 2022–23**, not current automatic approval. Cross-year comparison or adaptation is not done.
8. V27 tests use a synthetic compressed workbook with source-shaped heading, 3 items and 2 chapters to verify the real parser, chapter search, source rate basis, offline packaging and private-device boundary. Existing complete release and engineering tests are still required by both workflows.

## Deferred on purpose
- Additional specification/reference clause linking.
- Material consumption and rate analysis.
- Complete review of every row against original PDF / errata (do not call all entries certified).
- Automatic Drive sign-in/synchronization, multi-user sharing, private SSR bulk publishing.
- Any estimate generation or integration with separate **PWD Estimate Creator**.

## Device usage
Open PWD Field Assistant → SSR Master → **Search SSR Items** → **Choose SSR Excel** → select `SSR_2022-23.xlsx` on your device. Search by code/description and filter the source chapter. Store the PDF separately in the Library for the original publication check.
