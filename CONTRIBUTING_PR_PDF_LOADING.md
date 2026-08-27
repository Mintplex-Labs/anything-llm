# Contributing: Memory-Safe PDF Loading with Password and Large File Support

## Summary

This PR improves the PDF loading pipeline in the collector to address memory safety, password protection, and retry/fallback behavior for PDF processing.

## Problem Details

### Issue 1: Memory-Unsafe File Loading

**Current behavior:**
- `collector/processSingleFile/convert/asPDF/PDFLoader/index.js:10` reads the entire PDF file into memory:
  ```js
  const buffer = await fs.readFile(this.filePath);
  ```
- Then wraps it in a `Uint8Array` and passes to PDF.js:
  ```js
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
    ...
  }).promise;
  ```

**Impact:**
- Large PDFs (>100MB) cause OOM crashes in collector processes.
- No streaming or size guard before loading.

### Issue 2: No Password Support

**Current behavior:**
- When an encrypted PDF is encountered, PDF.js throws a `PasswordException` which is unhandled.
- The error message is confusing and does not indicate the cause.

**Impact:**
- Users uploading password-protected PDFs get a cryptic error.

### Issue 3: No Retry/Fallback in PDF Conversion

**Current behavior:**
- `collector/processSingleFile/convert/asPDF/index.js:24` calls `pdfLoader.load()` once.
- If PDF.js fails, the file is marked as failed immediately.
- There is no fallback to `pdf-parse` (the direct npm package) as a secondary loader.

**Impact:**
- PDFs that fail with PDF.js v1.10.100 (the bundled version) cannot be processed even if `pdf-parse` could handle them.

## Proposed Changes

### 1. `collector/utils/constants.js` — Add Configurable Max PDF Size

Add a new constant:
```js
const MAX_PDF_FILE_SIZE_MB = parseInt(process.env.MAX_PDF_FILE_SIZE_MB) || 250;
```

Export it alongside the existing constants.

### 2. `collector/processSingleFile/convert/asPDF/PDFLoader/index.js` — Enhanced Loader

**Changes:**

1. **File size guard** — Check file size before loading (lazy require of constant to avoid circular dependency issues in tests):
   ```js
   const { MAX_PDF_FILE_SIZE_MB } = require("../../../utils/constants");
   const stats = await fs.stat(this.filePath);
   if (stats.size > MAX_PDF_FILE_SIZE_MB * 1024 * 1024) {
     throw new Error(
       `PDF file size (${(stats.size / (1024 * 1024)).toFixed(2)}MB) exceeds the maximum allowed size of ${MAX_PDF_FILE_SIZE_MB}MB.`
     );
   }
   ```

2. **Password support** — Catch `PasswordException` from PDF.js:
   ```js
   try {
     pdf = await getDocument({ data: uint8Array, ... }).promise;
   } catch (e) {
     if (e.name === "PasswordException" || e.type === "password") {
       throw new Error(
         `PDF file "${this.filePath}" is password protected. This loader does not support password-protected PDFs.`
       );
     }
     throw e;
   }
   ```

3. **Keep `fs.readFile`** — The current approach of reading the full file into a `Uint8Array` is actually what PDF.js requires (it needs the full binary data). However, we add the size guard to prevent OOM crashes. PDF.js does not natively support streaming from a file path in this version, so chunked reading would add complexity without meaningful benefit for the typical use case.

### 3. `collector/processSingleFile/convert/asPDF/index.js` — Retry with Fallback

**Changes:**

Wrap the `pdfLoader.load()` call in a retry/fallback mechanism:

```js
let docs;
try {
  const pdfLoader = new PDFLoader(fullFilePath, { splitPages: true });
  docs = await pdfLoader.load();
} catch (e) {
  console.error(`[asPDF] PDF.js loader failed for ${filename}:`, e.message);
  // Fallback to pdf-parse direct loader
  docs = await pdfParseLoader.load(fullFilePath);
}
```

Create a fallback loader using `pdf-parse` directly (bypassing the PDF.js v1.10.100 wrapper) for when the bundled PDF.js fails:

```js
const pdfParse = require("pdf-parse");

async function fallbackPdfParseLoader(filePath) {
  const buffer = await fs.readFile(filePath);
  const data = await pdfParse(buffer);
  return [{
    pageContent: data.text,
    metadata: {
      source: filePath,
      pdf: {
        version: "pdf-parse",
        info: data.info,
        metadata: data.metadata,
        totalPages: data.numpages,
      },
    },
  }];
}
```

## Files to Modify

1. `collector/utils/constants.js` — Add `MAX_PDF_FILE_SIZE_MB` constant
2. `collector/processSingleFile/convert/asPDF/PDFLoader/index.js` — Add size guard, password detection
3. `collector/processSingleFile/convert/asPDF/index.js` — Add retry/fallback logic
4. `collector/.env.example` — Document the new `MAX_PDF_FILE_SIZE_MB` env var

## Testing

1. **File size guard test** — Create a mock PDF file larger than `MAX_PDF_FILE_SIZE_MB` and verify it throws with a clear error message.
2. **Password detection test** — Mock PDF.js to throw a `PasswordException` and verify the error message clearly indicates password protection.
3. **Fallback chain test** — Mock `PDFLoader.load()` to throw, and verify `pdf-parse` fallback is attempted.

## Verification Steps

1. Upload a PDF larger than 250MB (or set `MAX_PDF_FILE_SIZE_MB=1`) and verify a clear error is returned instead of an OOM crash.
2. Upload a password-protected PDF and verify a descriptive error is returned.
3. Upload a PDF that fails with PDF.js v1.10.100 and verify it falls back to `pdf-parse`.
4. Verify normal PDF processing still works as before (no regression).

## Compatibility

- **Backward compatible:** Default max size is 250MB, which is larger than most use cases.
- **No breaking API changes** to the public interface.
- **`pdf-parse` is already a dependency** — no new dependencies needed.
