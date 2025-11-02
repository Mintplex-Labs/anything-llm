# 📄 DOCUMENT PROCESSING FLOW - GIẢI THÍCH CHI TIẾT

**Ngày**: 25/10/2025  
**Mục đích**: Giải thích cách file được xử lý từ UI → JSON → PostgreSQL

---

## 🔄 TOÀN BỘ FLOW XỬ LÝ DOCUMENT

```
[1] UPLOAD FILE
    Frontend UI → Upload PDF/DOC
         ↓
[2] MULTER (Server)
    Save to /uploads/ folder
         ↓
[3] COLLECTOR API
    Convert PDF → JSON (với OCR)
    Save JSON to /outputs/
         ↓
[4] WORKSPACE PARSED FILES
    Save JSON reference to database
    User xem preview trong UI
         ↓
[5] EMBED (User clicks "Embed")
    Move JSON to /documents/
    Extract structured data → PostgreSQL
    Create vector embeddings → Qdrant
         ↓
[6] HYBRID SEARCH
    Query SQL (PostgreSQL) + Vector (Qdrant)
    Return merged results
```

---

## 📂 CHI TIẾT TỪNG BƯỚC

### **Bước 1: Upload File từ UI**

**Frontend Component**: `WorkspaceChat` hoặc `DocumentManager`

```jsx
// User clicks "Upload Document"
const handleFileUpload = async (files) => {
  const formData = new FormData();
  formData.append('file', files[0]);
  
  // Call API
  const response = await fetch(`/api/workspace/${slug}/parse`, {
    method: 'POST',
    body: formData
  });
  
  // Response: { success: true, files: [...parsedFiles] }
};
```

**Server Endpoint**: `POST /api/workspace/:slug/parse`

**File**: `/server/endpoints/workspacesParsedFiles.js` (line 112)

**Xử lý**:
1. Multer nhận file upload → Save to `/server/storage/uploads/`
2. Gọi Collector API để process
3. Nhận JSON response
4. Save metadata vào `workspace_parsed_files` table

---

### **Bước 2: Collector Converts PDF → JSON**

**Service**: Collector API (port 8888)

**Endpoint**: `POST /process`

**File**: `/collector/index.js` (line 73)

**Input**:
```json
{
  "filename": "RFQ_12345.pdf",
  "options": {
    "enableOCR": true,
    "languages": ["vie", "eng"]
  }
}
```

**Processing**:
```javascript
// 1. Load PDF file
const pdfPath = './hotdir/RFQ_12345.pdf';

// 2. Extract text with OCR (Tesseract)
const text = await extractTextWithOCR(pdfPath);

// 3. Parse tables and structure
const tables = await extractTables(pdfPath);

// 4. Create JSON output
const jsonOutput = {
  id: uuid(),
  title: "RFQ_12345",
  pageContent: text,
  tables: tables,
  metadata: {
    type: "rfq",
    pages: 5,
    createdAt: new Date()
  },
  token_count_estimate: 1500
};

// 5. Save JSON to /outputs/
fs.writeFileSync('./outputs/RFQ_12345.json', JSON.stringify(jsonOutput));
```

**Output**:
```
/collector/outputs/
├── RFQ_12345-uuid1.json  ← Page 1
├── RFQ_12345-uuid2.json  ← Page 2
└── RFQ_12345-uuid3.json  ← Page 3
```

**Response to Server**:
```json
{
  "success": true,
  "documents": [
    {
      "id": "uuid1",
      "title": "RFQ_12345",
      "pageContent": "Request for Quotation...",
      "token_count_estimate": 500
    }
  ]
}
```

---

### **Bước 3: Save to workspace_parsed_files**

**Database**: SQLite/PostgreSQL

**Table**: `workspace_parsed_files`

**File**: `/server/models/workspaceParsedFiles.js`

**Insert**:
```javascript
await WorkspaceParsedFiles.create({
  filename: 'RFQ_12345-uuid1.json',
  workspaceId: 1,
  userId: 5,
  threadId: null,
  metadata: JSON.stringify({
    id: "uuid1",
    title: "RFQ_12345",
    type: "rfq",
    pages: 1
  }),
  tokenCountEstimate: 500
});
```

**Kết quả**: User thấy file trong UI, chưa được embedded

---

### **Bước 4: User Clicks "Embed" Button**

**Frontend**: User clicks "Embed" trên parsed file

**API Call**: `POST /api/workspace/:slug/embed-parsed-file/:fileId`

**Server Endpoint**: `/server/endpoints/workspacesParsedFiles.js` (line 66)

**Processing**:
```javascript
async function embedParsedFile(fileId, workspace) {
  // 1. Get parsed file from database
  const parsedFile = await WorkspaceParsedFiles.get({ id: fileId });
  
  // 2. Read JSON file from /outputs/
  const jsonPath = `./collector/outputs/${parsedFile.filename}`;
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath));
  
  // 3. EXTRACT STRUCTURED DATA → PostgreSQL
  await extractDocumentData(fileId, jsonPath);
  //    ↑ This calls documentExtractor.js
  
  // 4. Move JSON to /documents/
  const newPath = `./server/storage/documents/${workspace.slug}/${parsedFile.filename}`;
  fs.renameSync(jsonPath, newPath);
  
  // 5. CREATE VECTOR EMBEDDINGS → Qdrant
  const vectorDb = getVectorDbClass(); // Qdrant
  await vectorDb.addDocumentToNamespace(
    workspace.slug,
    {
      documentId: fileId,
      content: jsonContent.pageContent,
      metadata: jsonContent.metadata
    }
  );
  
  // 6. Create document record
  await Document.create({
    id: fileId,
    workspaceId: workspace.id,
    filename: parsedFile.filename,
    docpath: newPath
  });
  
  // 7. Delete from parsed_files table
  await WorkspaceParsedFiles.delete({ id: fileId });
}
```

---

### **Bước 5: Extract Structured Data → PostgreSQL**

**File**: `/server/utils/extraction/documentExtractor.js`

**Function**: `extractDocumentData(documentId, jsonFilePath)`

**Processing**:

```javascript
async function extractDocumentData(documentId, jsonFilePath) {
  // 1. Read JSON file
  const jsonContent = await fs.readFile(jsonFilePath, 'utf-8');
  const document = JSON.parse(jsonContent);
  
  // 2. Detect document type
  const docType = detectDocumentType(document); // "rfq", "po", "quotation", etc.
  
  // 3. Route to appropriate extractor
  if (docType === "rfq") {
    return await extractRfqData(documentId, document);
  } else if (docType === "po") {
    return await extractPOData(documentId, document);
  } else if (docType === "quotation") {
    return await extractQuotationData(documentId, document);
  }
  // ... more types
}
```

**Example: RFQ Extraction**

```javascript
async function extractRfqData(documentId, document) {
  const text = document.pageContent;
  
  // Extract using regex patterns
  const rfqNumber = extractPattern(text, /RFQ[:\s#-]*([A-Z0-9-]+)/i);
  const deadline = extractDate(text);
  const buyerName = extractBuyerName(text);
  const items = extractTableItems(document.tables);
  
  // INSERT into PostgreSQL - rfq_metadata table
  const rfq = await prisma.rfq_metadata.create({
    data: {
      document_id: documentId,
      rfq_number: rfqNumber,
      deadline: deadline,
      buyer_name: buyerName,
      status: 'active'
    }
  });
  
  // INSERT into rfq_items table
  for (const item of items) {
    await prisma.rfq_items.create({
      data: {
        rfq_id: rfq.id,
        item_description: item.description,
        quantity: item.quantity,
        unit: item.unit
      }
    });
  }
  
  return rfq;
}
```

**Kết quả**: Data được lưu vào PostgreSQL tables:
- `rfq_metadata`
- `rfq_items`
- `purchase_orders`
- `quotations`
- `invoices`
- `certificates`
- etc.

---

### **Bước 6: Vector Embeddings → Qdrant**

**Parallel Process**: Khi embed file

```javascript
// Create embeddings for semantic search
const vectorDb = new QdrantClient({
  url: process.env.QDRANT_ENDPOINT
});

await vectorDb.upsert('workspace-slug', {
  points: [{
    id: documentId,
    vector: await createEmbedding(text), // LLM creates vector [768 dimensions]
    payload: {
      documentId: documentId,
      title: "RFQ_12345",
      type: "rfq",
      content: text.substring(0, 1000)
    }
  }]
});
```

**Storage**: Qdrant database at `http://localhost:6333`

---

## 🗄️ DATA STORAGE LOCATIONS

### **1. File System**

```
/server/storage/
├── uploads/                    ← Temporary upload location
│   └── temp-file-123.pdf
│
├── documents/                  ← Final embedded documents
│   └── workspace-slug/
│       └── RFQ_12345-uuid.json
│
/collector/
├── hotdir/                     ← Processing queue
│   └── RFQ_12345.pdf
│
└── outputs/                    ← Processed JSON (before embed)
    └── RFQ_12345-uuid.json
```

### **2. PostgreSQL Database**

**Before Embed** (Parsed but not embedded):
```sql
-- workspace_parsed_files table
SELECT * FROM workspace_parsed_files;
```

| id | filename | workspaceId | metadata | tokenCountEstimate |
|----|----------|-------------|----------|-------------------|
| 1  | RFQ_12345-uuid.json | 1 | {...} | 500 |

**After Embed** (Embedded + Extracted):
```sql
-- Documents table
SELECT * FROM workspace_documents;
```

| id | workspaceId | filename | docpath |
|----|-------------|----------|---------|
| 1  | 1           | RFQ_12345-uuid.json | /documents/... |

```sql
-- Structured data tables
SELECT * FROM rfq_metadata;
```

| id | document_id | rfq_number | deadline | buyer_name | status |
|----|-------------|------------|----------|------------|--------|
| 1  | 1           | RFQ-2025-001 | 2025-11-01 | ABC Corp | active |

```sql
SELECT * FROM rfq_items;
```

| id | rfq_id | item_description | quantity | unit |
|----|--------|-----------------|----------|------|
| 1  | 1      | Steel pipes     | 100      | PCS  |
| 2  | 1      | Copper wire     | 500      | M    |

### **3. Qdrant Vector Database**

```json
// Collection: workspace-slug
{
  "points": [
    {
      "id": "uuid1",
      "vector": [0.123, 0.456, ..., 0.789], // 768 dimensions
      "payload": {
        "documentId": "1",
        "title": "RFQ_12345",
        "type": "rfq",
        "content": "Request for Quotation..."
      }
    }
  ]
}
```

---

## 🔍 HYBRID SEARCH QUERY FLOW

**When user searches**: "Show me active RFQs with deadline before December"

```javascript
// 1. Query Classification (Auto-detect query type)
const queryType = classifyQuery(query);
// Result: "sql" (because it mentions deadline, structured field)

// 2. SQL Search (PostgreSQL)
const sqlResults = await prisma.rfq_metadata.findMany({
  where: {
    status: 'active',
    deadline: { lt: new Date('2025-12-01') }
  },
  include: { items: true }
});

// 3. Vector Search (Qdrant) - for semantic context
const vectorResults = await qdrant.search('workspace-slug', {
  vector: await createEmbedding(query),
  limit: 10,
  filter: {
    must: [{ key: 'type', match: { value: 'rfq' } }]
  }
});

// 4. Merge Results (Weighted)
const mergedResults = mergeResults({
  sql: sqlResults,      // Weight: 70%
  vector: vectorResults // Weight: 30%
});

// 5. Return to User
return {
  results: mergedResults,
  sources: {
    sql: sqlResults.length,
    vector: vectorResults.length
  }
};
```

---

## 📊 TÓM TẮT: KHI NÀO DATA Ở ĐÂU?

| Stage | JSON Location | PostgreSQL | Qdrant | User Sees |
|-------|--------------|------------|--------|-----------|
| **1. Upload** | `/uploads/temp.pdf` | ❌ | ❌ | Upload progress |
| **2. Processing** | `/hotdir/temp.pdf` | ❌ | ❌ | "Processing..." |
| **3. Parsed** | `/outputs/doc.json` | `workspace_parsed_files` | ❌ | "Ready to embed" |
| **4. Embedded** | `/documents/doc.json` | ✅ All tables + `workspace_documents` | ✅ Vectors | Can search |

---

## 🎯 TRUYỀN DATA TỪ JSON → POSTGRESQL

### **Method 1: Extractor (Current - Regex)**

**File**: `server/utils/extraction/documentExtractor.js`

**Pros**:
- ✅ Fast (no LLM call)
- ✅ Reliable for structured documents
- ✅ No API costs

**Cons**:
- ❌ Regex brittle (breaks with format changes)
- ❌ Hard to maintain
- ❌ Low accuracy for messy PDFs

**Code Example**:
```javascript
// Extract RFQ number with regex
const rfqNumber = text.match(/RFQ[:\s#-]*([A-Z0-9-]+)/i)?.[1];

// Insert to PostgreSQL
await prisma.rfq_metadata.create({
  data: { rfq_number: rfqNumber }
});
```

---

### **Method 2: LLM Extraction (Better - Recommended)**

**Use LLM to extract structured data**

**Pros**:
- ✅ More accurate
- ✅ Handles messy formats
- ✅ Adapts to variations
- ✅ Can extract complex fields

**Cons**:
- ❌ Slower (LLM API call)
- ❌ Costs money (if using paid LLM)

**Code Example**:
```javascript
async function extractWithLLM(documentText) {
  const prompt = `
Extract structured data from this RFQ document:

${documentText}

Return JSON with:
{
  "rfq_number": "...",
  "deadline": "YYYY-MM-DD",
  "buyer_name": "...",
  "items": [
    { "description": "...", "quantity": 100, "unit": "PCS" }
  ]
}
  `;
  
  const response = await llm.chat(prompt);
  const extracted = JSON.parse(response);
  
  // Insert to PostgreSQL
  await prisma.rfq_metadata.create({
    data: {
      rfq_number: extracted.rfq_number,
      deadline: new Date(extracted.deadline),
      buyer_name: extracted.buyer_name
    }
  });
  
  for (const item of extracted.items) {
    await prisma.rfq_items.create({
      data: {
        rfq_id: rfq.id,
        ...item
      }
    });
  }
}
```

---

### **Method 3: Hybrid (Best - Current + Future)**

**Combine Regex + LLM**

```javascript
async function extractDocumentData(documentId, jsonPath) {
  const document = JSON.parse(await fs.readFile(jsonPath));
  const text = document.pageContent;
  
  // 1. Try regex first (fast, free)
  let rfqNumber = extractPattern(text, /RFQ[:\s#-]*([A-Z0-9-]+)/i);
  let deadline = extractDate(text);
  
  // 2. If regex fails, use LLM (slower, accurate)
  if (!rfqNumber || !deadline) {
    const llmExtracted = await extractWithLLM(text);
    rfqNumber = llmExtracted.rfq_number;
    deadline = llmExtracted.deadline;
  }
  
  // 3. Save to PostgreSQL
  await prisma.rfq_metadata.create({
    data: { rfq_number: rfqNumber, deadline }
  });
}
```

---

## 🚀 NEXT STEPS FOR FRONTEND

**Cần tạo UI components**:

1. **Document Upload Panel** (✅ Exists, maybe improve)
2. **Parsed Files List** (✅ Exists in WorkspaceChat)
3. **Embed Button** (✅ Exists)
4. **Structured Data Viewer** (❌ NEED TO CREATE)
   - View extracted RFQs
   - View POs
   - View Quotations
   - Price comparison table
5. **Hybrid Search Interface** (❌ NEED TO CREATE)
   - Search box
   - Query type indicator
   - Results with source tags
6. **Active RFQs Dashboard** (❌ NEED TO CREATE)
   - Countdown timers
   - Urgency indicators
   - Quick actions

---

## 📝 SUMMARY

**Q: Khi upload file trên giao diện, code tạo ra JSON ở đâu?**  
**A**: Collector API (`/collector/index.js`) converts PDF → JSON, saves to `/collector/outputs/`

**Q: PostgreSQL lấy data từ upload file hay từ đâu?**  
**A**: PostgreSQL lấy data từ JSON file (sau khi JSON được tạo). Flow:
1. Upload PDF → Collector converts → JSON
2. User clicks "Embed" → `documentExtractor.js` reads JSON
3. Extractor parses JSON → Inserts to PostgreSQL

**Q: Vậy có 2 storage?**  
**A**: Đúng! 3 storage:
1. **JSON files** (`/collector/outputs/`, `/server/storage/documents/`) - Raw parsed data
2. **PostgreSQL** - Structured data (RFQs, POs, Quotations)
3. **Qdrant** - Vector embeddings (for semantic search)

**Q: Tại sao cần JSON files nếu đã có PostgreSQL?**  
**A**: 
- JSON = Raw data (full text, tables, metadata)
- PostgreSQL = Extracted structured fields only
- JSON needed for re-processing, full-text search, backup
- PostgreSQL needed for fast SQL queries (filtering, sorting)

**Luồng đơn giản**:
```
PDF Upload → Collector converts → JSON → Extractor reads JSON → PostgreSQL
                                    ↓
                                 Qdrant (embeddings)
```

---

**Author**: GitHub Copilot  
**Date**: 25/10/2025  
**Version**: 1.0
