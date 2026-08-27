# Contributing: Fix Vector Database Document Deletion Data Integrity Gap

## Summary

This PR addresses a silent data integrity bug in the Vector Database (VDB) deletion flow. When workspaces or documents are deleted, the VDB `delete-namespace` call is wrapped in a swallowed `try-catch` that only logs `error.message` (losing stack traces), while Prisma records are already deleted. Additionally, `docId` is stripped from VDB metadata in all provider `addDocumentToNamespace` methods, leaving no fallback for recovery if deletion fails.

## Problem Details

### Issue 1: Swallowed Error Logging in Workspace Deletion

**Current behavior:**
- In `server/endpoints/workspaces.js:322-326` and `server/endpoints/workspaces.js:363-367`, the VDB `delete-namespace` call is wrapped in:
  ```js
  try {
    await VectorDb["delete-namespace"]({ namespace: slug });
  } catch (e) {
    console.error(e.message);
  }
  ```
- This logs only `e.message`, losing the full error stack trace, and does not propagate the failure to the caller.
- Similar pattern in `server/endpoints/admin.js:316-320` and `server/endpoints/api/workspace/index.js:266-270`.

**Impact:**
- If VDB deletion fails, Prisma records are already deleted, making vectors unrecoverable without manual VDB intervention.
- Silent failure makes debugging impossible for users.

### Issue 2: `docId` Stripped from VDB Metadata

**Current behavior:**
- All 7 provider implementations (chroma, pinecone, qdrant, milvus, lance, pgvector, astra) strip `docId` from metadata:
  ```js
  const { pageContent, docId, ...metadata } = documentData;
  ```
- The stripped `docId` is used only for linking to Prisma records via `DocumentVectors.bulkInsert`, but is never stored in the VDB itself.

**Impact:**
- If Prisma records are lost or out of sync, there's no way to identify which VDB vectors belong to a document.
- During deletion failures, there's no fallback to find vectors by `docId` within the VDB metadata.

## Proposed Changes

### 1. `server/models/vectors.js` — Enhanced `deleteForWorkspace`

**Before:**
```js
deleteForWorkspace: async function (workspaceId) {
  const documents = await Document.forWorkspace(workspaceId);
  const docIds = [...new Set(documents.map((doc) => doc.docId))];
  try {
    await prisma.document_vectors.deleteMany({
      where: { docId: { in: docIds } },
    });
    return true;
  } catch (error) {
    console.error("Delete for workspace failed", error);
    return false;
  }
}
```

**After:**
```js
deleteForWorkspace: async function (workspaceId) {
  const documents = await Document.forWorkspace(workspaceId);
  const docIds = [...new Set(documents.map((doc) => doc.docId))];

  try {
    await prisma.document_vectors.deleteMany({
      where: { docId: { in: docIds } },
    });
    return { success: true, docIds, documents };
  } catch (error) {
    console.error("Delete for workspace failed", error);
    return { success: false, error: error.message, docIds, documents };
  }
}
```

**Rationale:**
- Return structured result so callers can attempt VDB cleanup even if Prisma fails.
- Return `docIds` and `documents` list so callers can log which documents were affected.

### 2. Endpoint-Level Error Handling Improvements

In all 4 endpoint locations that call `delete-namespace`:

**Before:**
```js
try {
  await VectorDb["delete-namespace"]({ namespace: slug });
} catch (e) {
  console.error(e.message);
}
```

**After:**
```js
try {
  await VectorDb["delete-namespace"]({ namespace: slug });
} catch (e) {
  console.error(`Failed to delete VDB namespace for workspace ${slug}:`, e);
  // Log structured error for debugging; Prisma records already deleted.
  // Vectors may remain in VDB and require manual cleanup.
}
```

**Rationale:**
- Preserve full error object (not just `e.message`) for stack traces.
- Add context (workspace slug) to the log message.
- Add a comment explaining the failure mode.

### 3. VDB Metadata: Retain `docId` in All Providers

In all 7 provider `addDocumentToNamespace` methods:

**Before:**
```js
const { pageContent, docId, ...metadata } = documentData;
// metadata used for embedding/splitting, but docId not stored in VDB
```

**After:**
```js
const { pageContent, docId, ...metadata } = documentData;
// Add docId to metadata so it is stored in VDB as a secondary index
const vdbMetadata = { ...metadata, docId };
```

Then use `vdbMetadata` (instead of `metadata`) in the two places metadata is passed:
1. The `TextSplitter` configuration: `chunkHeaderMeta: TextSplitter.buildHeaderMeta(vdbMetadata)`
2. The vector record metadata: `metadata: { ...vdbMetadata, text: textChunks[i] }`

**Affected files:**
- `server/utils/vectorDbProviders/chroma/index.js` (line 211, 271, 295)
- `server/utils/vectorDbProviders/pinecone/index.js` (line 123, cache path + novel document path)
- `server/utils/vectorDbProviders/qdrant/index.js` (line 164, 243, 267)
- `server/utils/vectorDbProviders/milvus/index.js` (line 165, 225, 243)
- `server/utils/vectorDbProviders/lance/index.js` (line 313, 356, 375)
- `server/utils/vectorDbProviders/pgvector/index.js` (line 554, 603, 621)
- `server/utils/vectorDbProviders/astra/index.js` (line 166, 223, 239)

**Note:** Zilliz extends Milvus and does not override `addDocumentToNamespace`, so no change needed there. ChromaCloud extends Chroma and does not override `addDocumentToNamespace`, so no change needed there either.

**Rationale:**
- Storing `docId` in VDB metadata provides a recovery path when Prisma records are out of sync.
- This is additive to metadata — existing functionality is preserved.
- All 9 providers (including Zilliz and ChromaCloud which inherit) will store `docId`.

### 4. `server/utils/vectorDbProviders/base.js` — Updated JSDoc

Update the `addDocumentToNamespace` JSDoc to document that `docId` will be retained in metadata.

## Testing

Add or update unit tests in `server/__tests__/`:

1. **Test `deleteForWorkspace` returns structured result** — verify the return shape includes `success`, `docIds`, and `documents`.
2. **Test endpoint error handling** — verify that VDB deletion errors are logged with full error context (not just `error.message`).
3. **Test providers retain `docId` in metadata** — verify that after calling `addDocumentToNamespace`, the VDB receives a payload where metadata includes `docId`.

## Verification Steps

1. Run lint: `cd server && yarn lint`
2. Run typecheck: `cd server && yarn typecheck`
3. Run tests: `cd server && yarn test`
4. Manually verify: After deleting a workspace with an offline VDB, check logs contain the full error with workspace slug context.
5. Manually verify: After adding a document, confirm `docId` appears in VDB metadata (query the VDB directly).

## Files Modified

1. `server/models/vectors.js` — `deleteForWorkspace` returns structured result
2. `server/endpoints/workspaces.js` — improved error logging in 2 locations (workspace delete + reset vector db)
3. `server/endpoints/admin.js` — improved error logging in 1 location
4. `server/endpoints/api/workspace/index.js` — improved error logging in 1 location
5. `server/utils/vectorDbProviders/base.js` — updated JSDoc for `addDocumentToNamespace`
6. `server/utils/vectorDbProviders/chroma/index.js` — retain `docId` in metadata
7. `server/utils/vectorDbProviders/pinecone/index.js` — retain `docId` in metadata
8. `server/utils/vectorDbProviders/qdrant/index.js` — retain `docId` in metadata
9. `server/utils/vectorDbProviders/milvus/index.js` — retain `docId` in metadata
10. `server/utils/vectorDbProviders/lance/index.js` — retain `docId` in metadata
11. `server/utils/vectorDbProviders/pgvector/index.js` — retain `docId` in metadata
12. `server/utils/vectorDbProviders/astra/index.js` — retain `docId` in metadata
13. `server/__tests__/models/vectors.test.js` — new tests (if exists, append; if not, create)

## Compatibility

- **Backward compatible:** `deleteForWorkspace` change only affects the return shape — callers are updated in the same PR.
- **Metadata additive:** Adding `docId` to VDB metadata does not break existing queries or filters. It's an additional field.
- **No breaking API changes** to the public interface.
