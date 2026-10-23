# V26 — Original PDF Library: source-first phone workflow

_Date: 23 October 2026 • Scope: PWD Field Engineer Assistant only_

## Background
The user requested fewer distracting controls on phone screens. V20–V25 simplified Home and reference readers. This pass addresses a distinct remaining issue: every Library document card presented original reader, digital index, Drive, import, export, replace and delete controls together, competing with the simple field task of opening the desired publication.

## User-visible changes
- Remove the duplicate large "Reference books" introduction card; keep the compact Library heading, search and the essential **check edition/amendments/project specification** caution.
- On each document card show a single **Open PDF reader** primary action; where the source has a separate digital index (notably bridge), retain the visible **Open digital reader** alongside it.
- Move optional **Open in Drive**, **Save/Replace PDF**, **Export copy** and **Remove offline** into a native collapsed **More options** disclosure on that same document. Nothing is deleted.
- Move bulk save, renderer preparation and offline-only filter inside collapsed **Offline library setup**. If offline-only filtering is active, show this condition in the disclosure's label even while closed; empty search results therefore remain explicable.
- Use >=44 px touch targets for the retained PDF and offline-action buttons.
- Keep the offline saved/not-saved tag in plain sight, plus the original-source caveats, document categories/search, GR register, SSR listings and private-PDF boundary.
- Version the public PWA asset cache to ensure updated Library markup reaches installed browser users.

## Engineering and security limits
- **UI only**; no numeric engineering data, formulas, source codes, catalogue entries, source editions, recorded verification status or project approval logic changed.
- Bridge digital index is not a substitute for the original PDF, and no new drawing is claimed reviewed.
- PDF documents remain private; no private Drive bytes or credentials are added to the APK/repository.
- Offline setup still requires downloaded/on-device documents and renderer preparation for dependable PDF reading.
- Android remains a native installable APK. This work does not mix MPR Management, PWD Estimate Creator, or the scanner startup.

## QA
New `tests/verify-v26-simple-library.mjs` executes the actual card generator in a Node VM for an ordinary code document, a bridge with separate digital index, and an already-saved PDF. It verifies main-vs-optional buttons, critical caution, preserved original-file picker, category navigation, filter-active signaling and cache invalidation. Both release smoke and Android APK workflows run this regression alongside earlier tests.

## Review
The marked screen-recording was not available as independently readable frames in this development session, so this change addresses **the confirmed clutter in the latest source UI**, not a claim that every marked X/✓ was individually verified. The original source/final engineering acceptance requirements remain separate.
