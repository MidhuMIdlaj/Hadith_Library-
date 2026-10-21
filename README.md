# Hadith Library — Format A

A responsive React + TypeScript prototype for browsing hadith collections in Arabic and Malayalam. It currently uses local JSON data and does not require a backend.

## Run locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

Open the local URL Vite prints in the terminal.

To create a production build:

```bash
npm run build
npm run preview
```

## Current features

- Search across Arabic text, Malayalam text, narrator, kitab, bab, collection, and reference number
- Collection, kitab, bab, grading, and related-narration filters
- Responsive desktop/mobile layout
- Pagination
- Local bookmarks using browser localStorage
- External source-reference links where provided

## Important data notice

This is a **UI prototype**, not a complete hadith corpus. `public/data/hadiths.json` contains only a few demo records. Some records are explicitly marked as demo placeholders and must not be treated as authentic hadith text. Do not publish this as a complete or scholarly verified library until the full source datasets and Malayalam translations have been sourced, licensing checked, and references reviewed.

### JSON record format

Each record in `public/data/hadiths.json` follows the `Hadith` interface in `src/types/hadith.ts`. Add verified records using the same field names.

For authenticity grades, store the grading source and do not assign Hasan/Da'if grades without a reliable, identifiable scholarly source. The two collections themselves are Sahih collections; individual grading metadata should not be guessed.

### Suggested import workflow

1. Choose a reliable digital source for each collection.
2. Verify that reuse and redistribution are permitted by its license/terms.
3. Preserve each source's book, chapter, numbering scheme, and chain/text fields.
4. Add a reviewed Malayalam translation and record its source/reviewer.
5. Validate duplicates as related narrations rather than deleting repeated entries.
6. Run a consistency check before release.

## Tech stack

- React
- TypeScript
- Vite
- CSS
- Lucide icons
- Local JSON data
