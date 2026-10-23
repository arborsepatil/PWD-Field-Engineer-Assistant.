# V36 — complete permissions check of the former 73-entry private Drive catalogue

**Project:** PWD Field Engineer Assistant. **Audit date:** 23 October 2026.

## Scope and method

The superseded 73-item `PWDDrivePDFCatalog` was read from an archived GitHub revision only for the purpose of locating the original Drive records. Each item was checked individually using authenticated Google Drive file metadata. **No original PDF was copied, made public or redistributed; no file's sharing settings were modified.** This report intentionally does **not** publish private Drive file IDs, URLs or other user-identifying details.

The Google Drive `shared` flag and available `permissions` were assessed separately; `shared=true` by itself does not mean publicly accessible. Publisher publication-page access is independent of the permissions for the owner's specific Drive copy.

## Complete audit results

| Former section | Original records | `shared=false` | `shared=true`, named-user permissions | `shared=true`, permissions not available |
|---|---:|---:|---:|---:|
| IS / IRC / PWD Codes | 59 | 57 | 0 | 2 |
| Specifications | 4 | 3 | 1 | 0 |
| SSR | 4 | 3 | 1 | 0 |
| Rules / Manuals | 2 | 2 | 0 | 0 |
| Design guidelines | 2 | 2 | 0 | 0 |
| Bridge books | 2 | 2 | 0 | 0 |
| **Total** | **73** | **69** | **2** | **2** |

All original entries returned metadata; no known item was skipped. The 2 named-user-shared records are a PWD Red Book volume and a historical SSR copy; neither has an `anyone` or domain permission in the returned metadata. The other 2 shared entries concern older IRC books; the provider reports `source_visibility_status=access_not_verified`, with no permission details available and `current_user_can_share=false`. It is **not supported** to call those copies public, nor can their exact access-control lists be resolved with the available metadata.

**Confirmed public Drive copies from these 73: 0.** This is not proof that the government publishers do not separately distribute their own copies to the public. It is also not a legal redistribution-permission assessment.

## What the shared app may safely show

V35's **15 official publisher links** are **not** copies of these 73 owner Drive files:
- **12 public publisher pages reachable at last check**, including Maharashtra PWD rule/account manuals, SSR publication pages, department E-books, bridge/design publication pages, the BIS portal, GR portal and other department indexes. Page access does not certify that every attached PDF is free to read, current or licensed for redistribution.
- **3 official-site endpoints had unverified accessibility**: CPWD Civil Specifications PDF (request rejected), CPWD Publications listing (timeout), and IRC catalogue page (gateway error). These are labelled **Check publisher availability**, not **View**.

Original private PDFs, retired book viewers, private file IDs, publication digitisations and local import/export tools are excluded from the shared Android/Pages build by the V34 packaging policy. The latest publicly shared Library provides publisher links, not preloaded PDFs. Existing installations can still retain old app-private PDF data; updating an APK does not automatically erase that data.

## Release policy

1. Never publish, bundle, expose or freely share any of the 73 owner Drive copies based on these access flags.
2. Leave original Drive sharing permissions and files unchanged.
3. Only link to official publisher sites with an accurate availability label and publication-year caveat.
4. Redistribution/embedding of an entire PDF requires a separate, documented publisher or license authorization. A browser link is not an offline-bundling license.
5. If availability/permission facts change, repeat the source check rather than silently promoting a record to 'public'.

The app's Steel Table engineering source audit and production APK release gates remain separate from this document-access audit.
