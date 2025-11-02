# Hybrid Search System Architecture

## System Overview

```
┌────────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                                 │
│  (AnythingLLM Frontend - React)                                        │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ Chat     │  │ Price    │  │ RFQ      │  │ Document │              │
│  │ Interface│  │ Compare  │  │ Summary  │  │ Validate │              │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘              │
└────────────────────────────────────────────────────────────────────────┘
         │              │              │              │
         └──────────────┴──────────────┴──────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      API LAYER (Express.js)                            │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │  POST /api/v1/workspace/:slug/chat                               │ │
│  │  GET  /api/rfq/:rfqNumber/summary                                │ │
│  │  GET  /api/rfq/:rfqNumber/price-comparison                       │ │
│  │  GET  /api/invoice/:invoiceNumber/compare                        │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   HYBRID SEARCH ENGINE                                 │
│  (server/utils/search/hybridSearch.js)                                │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ 1. classifyQuery()                                               │ │
│  │    "So sánh giá MT với đối thủ"                                 │ │
│  │    ↓                                                              │ │
│  │    Type: "price"                                                  │ │
│  │    Confidence: 0.85                                               │ │
│  │    Keywords: ["so", "sánh", "giá", "mt", "đối", "thủ"]         │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ 2. Parallel Execution                                            │ │
│  │                                                                   │ │
│  │    ┌─────────────────┐              ┌─────────────────┐         │ │
│  │    │  SQL Search     │              │ Vector Search   │         │ │
│  │    │  Weight: 70%    │              │ Weight: 30%     │         │ │
│  │    └─────────────────┘              └─────────────────┘         │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ 3. mergeAndRerank()                                              │ │
│  │    - Deduplicate by documentId                                   │ │
│  │    - Apply weights based on query type                           │ │
│  │    - Sort by final score                                         │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
         │                                      │
         ▼                                      ▼
┌─────────────────────────┐        ┌─────────────────────────┐
│   SQL DATABASE          │        │   VECTOR DATABASE       │
│   (SQLite/PostgreSQL)   │        │   (Qdrant)              │
│                         │        │                         │
│ ┌─────────────────────┐ │        │ ┌─────────────────────┐ │
│ │ rfq_metadata        │ │        │ │ embeddings          │ │
│ │ quotations          │ │        │ │ - documentId        │ │
│ │ quotation_items     │ │        │ │ - vector[1536]      │ │
│ │ purchase_orders     │ │        │ │ - metadata          │ │
│ │ po_items            │ │        │ └─────────────────────┘ │
│ │ invoices            │ │        │                         │
│ │ invoice_items       │ │        │ Similarity Search:      │
│ │ certificates        │ │        │ cosine_similarity()     │
│ │ certificate_items   │ │        │ top_k = 5               │
│ │ legal_risks         │ │        │                         │
│ │ discrepancies       │ │        │                         │
│ └─────────────────────┘ │        └─────────────────────────┘
│                         │
│ Structured Queries:     │
│ - Exact match           │
│ - Price comparison      │
│ - Date filtering        │
│ - Aggregations          │
└─────────────────────────┘
```

---

## Document Processing Pipeline

```
┌────────────────────────────────────────────────────────────────────────┐
│                     DOCUMENT UPLOAD                                    │
│  User drags PDF files into AnythingLLM                                │
└────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  COLLECTOR SERVICE (Port 8888)                         │
│  (collector/index.js)                                                  │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ 1. Receive PDF file                                              │ │
│  │ 2. Extract text:                                                 │ │
│  │    - Native PDF text (PyMuPDF)                                   │ │
│  │    - OCR for scanned pages (pytesseract)                         │ │
│  │    - Merge results (hybrid extraction)                           │ │
│  │ 3. Save to JSON:                                                 │ │
│  │    storage/documents/custom-documents/{documentId}.json          │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  SERVER (Port 3001)                                    │
│  (server/endpoints/workspaces.js)                                     │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ 1. Generate embeddings (OpenAI/local)                            │ │
│  │ 2. Store in Qdrant vector DB                                     │ │
│  │ 3. Link to workspace_documents table                             │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│             DATA EXTRACTOR (NEW!)                                      │
│  (server/utils/extraction/documentExtractor.js)                       │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ 1. Read processed JSON file                                      │ │
│  │ 2. Detect document type:                                         │ │
│  │    ┌────────────┬─────────────┬──────────┬──────────┐           │ │
│  │    │ RFQ        │ Quotation   │ PO       │ Invoice  │           │ │
│  │    │ Contract   │ Certificate │          │          │           │ │
│  │    └────────────┴─────────────┴──────────┴──────────┘           │ │
│  │ 3. Extract structured data (regex patterns)                      │ │
│  │ 4. Populate SQL tables:                                          │ │
│  │    - rfq_metadata (buyer, deadline, bid bond)                    │ │
│  │    - quotations + items (prices, manufacturers)                  │ │
│  │    - legal_risks (penalty clauses, liability)                    │ │
│  │ 5. Link documents via foreign keys                               │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    DUAL DATABASE STORAGE                               │
│                                                                         │
│  ┌────────────────────┐              ┌────────────────────┐           │
│  │ SQL Database       │              │ Vector Database    │           │
│  │ (Structured Data)  │              │ (Semantic Search)  │           │
│  │                    │              │                    │           │
│  │ - Prices           │◄─────────────┤ - Full text        │           │
│  │ - Dates            │  documentId  │ - Embeddings       │           │
│  │ - Quantities       │              │ - Similarity       │           │
│  │ - Manufacturers    │              │                    │           │
│  └────────────────────┘              └────────────────────┘           │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Query Processing Flow

### Example 1: Price Comparison Query

```
User Query: "So sánh giá MT với đối thủ cho RFQ BD-OPS-2022-029"
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│ QUERY CLASSIFIER                                                       │
│                                                                         │
│ Patterns matched:                                                      │
│ ✓ /so\s*sánh\s*giá/i                                                 │
│ ✓ /đối\s*thủ/i                                                        │
│ ✓ /rfq/i                                                               │
│                                                                         │
│ Classification:                                                        │
│ - Type: "price"                                                        │
│ - Confidence: 0.9                                                      │
│ - Keywords: ["so", "sánh", "giá", "mt", "đối", "thủ", "rfq"]        │
└────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PARALLEL SEARCH (70% SQL, 30% Vector)                                 │
│                                                                         │
│  ┌──────────────────────────┐    ┌──────────────────────────┐         │
│  │ SQL SEARCH               │    │ VECTOR SEARCH            │         │
│  │                          │    │                          │         │
│  │ SELECT * FROM quotations │    │ qdrant.search(           │         │
│  │ WHERE rfqId = (          │    │   query = "MT vs comp",  │         │
│  │   SELECT id FROM rfq     │    │   limit = 5              │         │
│  │   WHERE rfqNumber =      │    │ )                        │         │
│  │   'BD-OPS-2022-029'      │    │                          │         │
│  │ )                        │    │ Results:                 │         │
│  │                          │    │ 1. RFQ doc (score: 0.92) │         │
│  │ Results:                 │    │ 2. Quote 1 (score: 0.88) │         │
│  │ 1. MT Corp - 4.4B VND    │    │ 3. Quote 2 (score: 0.85) │         │
│  │ 2. SCHNEIDER - 4.5B VND  │    │                          │         │
│  │ 3. SIEMENS - 4.6B VND    │    │                          │         │
│  └──────────────────────────┘    └──────────────────────────┘         │
└────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│ MERGE & RERANK                                                         │
│                                                                         │
│ SQL Results (70% weight):                                              │
│ - MT Corp quotation: 0.9 × 0.7 = 0.63                                 │
│ - SCHNEIDER quotation: 0.9 × 0.7 = 0.63                               │
│ - SIEMENS quotation: 0.9 × 0.7 = 0.63                                 │
│                                                                         │
│ Vector Results (30% weight):                                           │
│ - RFQ document: 0.92 × 0.3 = 0.276                                    │
│ - Quote 1 (duplicate): skip (already in SQL results)                  │
│                                                                         │
│ Final Ranking:                                                         │
│ 1. MT Corp quotation (0.63 + bonus for internal) = 0.73               │
│ 2. SCHNEIDER quotation = 0.63                                          │
│ 3. SIEMENS quotation = 0.63                                            │
│ 4. RFQ document = 0.276                                                │
└────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
┌────────────────────────────────────────────────────────────────────────┐
│ PRICE COMPARISON SERVICE                                               │
│                                                                         │
│ comparePrices("BD-OPS-2022-029")                                      │
│                                                                         │
│ Output:                                                                │
│ {                                                                      │
│   mtPosition: {                                                        │
│     position: "lowest",                                                │
│     description: "MT Corp has the LOWEST price",                      │
│     diffFromAvgPercent: "-2.05"                                       │
│   },                                                                   │
│   comparisons: [                                                       │
│     {                                                                  │
│       mt: { amount: 4407569828, currency: "VND" },                    │
│       competitor: { name: "SCHNEIDER", amount: 4550000000 },          │
│       difference: { percentage: "-3.13", advantage: "MT cheaper" }    │
│     }                                                                  │
│   ]                                                                    │
│ }                                                                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌─────────────┐
│   PDF File  │
│ (HST folder)│
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│   OCR Processing     │
│ - Native text        │
│ - OCR (pytesseract)  │
│ - Merge              │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   JSON Storage       │
│ {                    │
│   title: "...",      │
│   pageContent: "..." │
│ }                    │
└──────┬───────────────┘
       │
       ├────────────────┬─────────────────┐
       ▼                ▼                 ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│  Vector DB  │  │   SQL DB    │  │  Workspace  │
│  (Qdrant)   │  │  (Prisma)   │  │  Documents  │
│             │  │             │  │             │
│ Embeddings  │  │ RFQ         │  │ Metadata    │
│ Similarity  │  │ Quotations  │  │ Links       │
│             │  │ POs         │  │             │
└─────────────┘  └─────────────┘  └─────────────┘
       │                │                 │
       └────────────────┴─────────────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │  Hybrid Search      │
             │  Results            │
             └─────────────────────┘
```

---

## Service Layer Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SERVICE LAYER                                     │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ priceComparison.js                                               │ │
│  │ ┌──────────────────────────────────────────────────────────────┐ │ │
│  │ │ comparePrices(rfqNumber)                                     │ │ │
│  │ │   1. Find RFQ by number                                      │ │ │
│  │ │   2. Get all quotations (MT + competitors)                   │ │ │
│  │ │   3. Calculate statistics (avg, min, max)                    │ │ │
│  │ │   4. Compare MT vs each competitor                           │ │ │
│  │ │   5. Item-level comparison (manufacturers, prices)           │ │ │
│  │ │   6. Determine competitive position                          │ │ │
│  │ └──────────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ rfqSummary.js                                                    │ │
│  │ ┌──────────────────────────────────────────────────────────────┐ │ │
│  │ │ getRFQSummary(rfqNumber)                                     │ │ │
│  │ │   1. Fetch RFQ metadata                                      │ │ │
│  │ │   2. Calculate deadline urgency                              │ │ │
│  │ │   3. Format delivery information                             │ │ │
│  │ │   4. Format bid bond requirements                            │ │ │
│  │ │   5. List quotations received                                │ │ │
│  │ │   6. Include legal risks                                     │ │ │
│  │ └──────────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐ │
│  │ documentComparator.js                                            │ │
│  │ ┌──────────────────────────────────────────────────────────────┐ │ │
│  │ │ compareInvoiceToPO(invoiceNumber)                            │ │ │
│  │ │   1. Find invoice and linked PO                              │ │ │
│  │ │   2. Compare total amounts                                   │ │ │
│  │ │   3. Compare currencies                                      │ │ │
│  │ │   4. Item-by-item comparison:                                │ │ │
│  │ │      - Match items by part number or description             │ │ │
│  │ │      - Compare quantities                                    │ │ │
│  │ │      - Compare unit prices                                   │ │ │
│  │ │      - Detect missing items                                  │ │ │
│  │ │   5. Assign severity (critical/high/medium/low)              │ │ │
│  │ │   6. Save discrepancies to database                          │ │ │
│  │ └──────────────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Database Schema Relationships

```
┌─────────────────────┐
│   rfq_metadata      │
│ ─────────────────── │
│ id (PK)             │
│ documentId (UNIQUE) │◄──────────┐
│ rfqNumber           │           │ Link to vector DB
│ buyerName           │           │
│ submissionDeadline  │           │
│ deliveryLocation    │           │
│ bidBondRequired     │           │
└──────┬──────────────┘           │
       │ 1                        │
       │                          │
       │ N                        │
       ▼                          │
┌─────────────────────┐           │
│   quotations        │           │
│ ─────────────────── │           │
│ id (PK)             │           │
│ rfqId (FK)          │───────────┤
│ quotationNumber     │           │
│ vendorName          │           │
│ vendorType          │           │
│ totalAmount         │           │
│ documentId          │◄──────────┘
└──────┬──────────────┘
       │ 1
       │
       │ N
       ▼
┌─────────────────────┐
│  quotation_items    │
│ ─────────────────── │
│ id (PK)             │
│ quotationId (FK)    │
│ partNumber          │
│ manufacturer        │
│ quantity            │
│ unitPrice           │
│ totalPrice          │
└─────────────────────┘


┌─────────────────────┐
│  purchase_orders    │
│ ─────────────────── │
│ id (PK)             │
│ poNumber (UNIQUE)   │
│ buyerName           │
│ totalAmount         │
│ documentId          │◄──────────┐ Link to vector DB
└──────┬──────────────┘           │
       │ 1                        │
       │                          │
       ├──────┬──────────┬────────┤
       │      │          │        │
       │ N    │ N        │ N      │
       ▼      ▼          ▼        │
┌──────────┐ ┌────────┐ ┌────────┴───┐
│ po_items │ │invoices│ │certificates│
│          │ │        │ │            │
│ partNum  │ │ invNum │ │ certType   │
│ quantity │ │ total  │ │ issuedBy   │
└──────────┘ └────┬───┘ └────┬───────┘
                  │ 1        │ 1
                  │          │
                  │ N        │ N
                  ▼          ▼
           ┌────────────┐ ┌────────────────┐
           │invoice_    │ │certificate_    │
           │items       │ │items           │
           └────────────┘ └────────────────┘


┌─────────────────────┐
│  legal_risks        │
│ ─────────────────── │
│ id (PK)             │
│ documentId          │◄────── Link to any document (contract)
│ rfqId (FK, optional)│
│ riskType            │
│ riskLevel           │
│ clauseText          │
│ riskDescription     │
└─────────────────────┘


┌────────────────────────┐
│ document_discrepancies │
│ ────────────────────── │
│ id (PK)                │
│ sourceType             │ "invoice" | "certificate"
│ sourceId               │
│ targetType             │ "po"
│ targetId               │
│ field                  │ "quantity" | "unitPrice" | etc.
│ severity               │ "critical" | "high" | "medium" | "low"
│ status                 │ "open" | "resolved" | "ignored"
└────────────────────────┘
```

---

## File Organization

```
server/
├── prisma/
│   ├── schema.prisma                    ← DATABASE SCHEMA (10 new tables)
│   └── migrations/
│       └── 20240xxx_init_hybrid_search/
│
├── utils/
│   ├── search/
│   │   └── hybridSearch.js              ← QUERY CLASSIFIER + ORCHESTRATOR
│   │
│   ├── extraction/
│   │   └── documentExtractor.js         ← PDF → SQL DATA
│   │
│   └── services/
│       ├── priceComparison.js           ← USE CASE 1
│       ├── rfqSummary.js                ← USE CASE 2
│       └── documentComparator.js        ← USE CASE 4
│
├── HYBRID_SEARCH_SETUP.md               ← DETAILED GUIDE
├── HYBRID_SEARCH_SUMMARY.md             ← QUICK OVERVIEW (Vietnamese)
├── POSTGRESQL_MIGRATION.md              ← MIGRATION GUIDE
├── ARCHITECTURE.md                      ← THIS FILE
└── quickstart-hybrid-search.js          ← SETUP SCRIPT
```

---

Built with ❤️ for AnythingLLM
