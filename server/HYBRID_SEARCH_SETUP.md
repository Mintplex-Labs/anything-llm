# HYBRID SEARCH SYSTEM - Setup Guide

## Overview

This hybrid search system combines **Qdrant (vector database)** for semantic search with **SQL (SQLite/PostgreSQL)** for structured data queries. This enables advanced document analysis capabilities for RFQ/tender documents.

## 🎯 Use Cases

### 1. **Price Comparison** ("So sánh giá MT với đối thủ")
Compare MT Corp quotations vs competitors for the same RFQ.

```javascript
const { comparePrices } = require('./utils/services/priceComparison');

// Compare all quotations for a specific RFQ
const result = await comparePrices("BD-OPS-2022-029");
console.log(result.mtPosition); // MT's competitive position
console.log(result.comparisons); // Head-to-head comparisons
```

### 2. **RFQ Summary** ("List nội dung chính RFQ")
Extract structured metadata: buyer, deadline, delivery, bid bond, technical pages.

```javascript
const { getRFQSummary, generateTextSummary } = require('./utils/services/rfqSummary');

// Get structured summary
const summary = await getRFQSummary("VT-1609/25-XL-DA-VVD");
console.log(summary.buyer); // Buyer information
console.log(summary.timeline); // Deadline with urgency indicator
console.log(summary.delivery); // Delivery schedule & location

// Or get formatted text
const text = await generateTextSummary("VT-1609/25-XL-DA-VVD");
console.log(text);
```

### 3. **Legal Risk Analysis** ("Phân tích rủi ro pháp lý")
Detect risky clauses in contracts (penalties, unlimited liability, etc.)

```javascript
// Legal risks are automatically extracted during document processing
// Search for high-risk contracts:
const { hybridSearch } = require('./utils/search/hybridSearch');

const results = await hybridSearch("rủi ro pháp lý", {
  workspaceId: 1,
  topK: 5,
});

// Results will include detected legal risks from SQL database
```

### 4. **Document Validation** ("So sánh Invoice/Certificate vs PO")
Validate invoices and certificates against purchase orders.

```javascript
const { compareInvoiceToPO, compareCertificateToPO } = require('./utils/services/documentComparator');

// Compare invoice
const invResult = await compareInvoiceToPO("INV-240023");
console.log(invResult.discrepancies); // List of mismatches

// Compare certificate
const certResult = await compareCertificateToPO("CO-240023-001");
console.log(certResult.discrepancies); // Quantity/manufacturer mismatches
```

## 📁 File Structure

```
server/
├── prisma/
│   └── schema.prisma              # NEW: Database schema (10 new tables)
├── utils/
│   ├── search/
│   │   └── hybridSearch.js        # NEW: Query classifier + hybrid search orchestrator
│   ├── extraction/
│   │   └── documentExtractor.js   # NEW: Extract structured data from processed PDFs
│   └── services/
│       ├── priceComparison.js     # NEW: Use case 1 - Price comparison
│       ├── rfqSummary.js          # NEW: Use case 2 - RFQ metadata extraction
│       └── documentComparator.js  # NEW: Use case 4 - Invoice/Cert validation
```

## 🗄️ Database Schema (10 New Tables)

### RFQ & Quotations
- `rfq_metadata` - RFQ information (buyer, deadline, delivery, bid bond)
- `quotations` - MT + competitor quotations
- `quotation_items` - Line items with manufacturer, price, quantity

### Purchase Orders
- `purchase_orders` - Customer POs to MT Corp
- `po_items` - PO line items
- `vendor_pos` - MT Corp POs to suppliers
- `vendor_po_items` - Vendor PO line items

### Invoices & Certificates
- `invoices` - MT invoices to customers
- `invoice_items` - Invoice line items
- `vendor_invoices` - Supplier invoices to MT
- `vendor_invoice_items` - Vendor invoice items
- `certificates` - CO, CQ, COC certificates
- `certificate_items` - Certificate line items
- `vendor_certificates` - Certificates from vendors
- `vendor_certificate_items` - Vendor certificate items

### Analysis
- `legal_risks` - Detected legal risks in contracts
- `document_discrepancies` - Invoice/Cert vs PO mismatches

## 🚀 Setup Steps

### Step 1: Run Database Migration

```bash
cd server
npx prisma migrate dev --name init_hybrid_search
npx prisma generate
```

This will:
- Create all 10 new tables in your database
- Generate Prisma Client with TypeScript types

### Step 2: Extract Data from Existing PDFs

```javascript
const { processAllDocuments } = require('./utils/extraction/documentExtractor');

// Process all documents in storage
const storageDir = "/app/server/storage/documents/custom-documents";
const result = await processAllDocuments(storageDir);

console.log(`Processed ${result.success} documents successfully`);
```

This will:
- Read all processed JSON files
- Detect document type (RFQ, quotation, PO, invoice, certificate, contract)
- Extract structured data using regex patterns
- Populate SQL tables

### Step 3: Integrate Hybrid Search into Chat Endpoint

In your existing chat endpoint (`server/endpoints/workspaces.js`):

```javascript
const { hybridSearch } = require('../utils/search/hybridSearch');

// In your chat handler:
const results = await hybridSearch(userQuery, {
  workspaceId: workspace.id,
  topK: 5,
  vectorProvider: workspace.chatProvider, // Your existing vector provider
});

// results.classification tells you query type: "price", "rfq", "legal", "compare", or "semantic"
// results.results contains merged SQL + vector results
// results.sources shows how many came from each source
```

### Step 4: Test Individual Use Cases

#### Test Price Comparison:
```bash
cd server
node -e "
const { comparePrices } = require('./utils/services/priceComparison');
comparePrices('VT-1609/25-XL-DA-VVD').then(r => console.log(JSON.stringify(r, null, 2)));
"
```

#### Test RFQ Summary:
```bash
node -e "
const { generateTextSummary } = require('./utils/services/rfqSummary');
generateTextSummary('VT-1609/25-XL-DA-VVD').then(t => console.log(t));
"
```

#### Test Document Comparison:
```bash
node -e "
const { compareInvoiceToPO } = require('./utils/services/documentComparator');
compareInvoiceToPO('INV-240023').then(r => console.log(JSON.stringify(r, null, 2)));
"
```

## 🔍 How Hybrid Search Works

### Query Flow:

```
User Query
    ↓
┌───────────────────┐
│ Query Classifier  │ ← Detects intent using regex patterns
└───────────────────┘
    ↓
┌───────────────────┬───────────────────┐
│   SQL Search      │  Vector Search    │ ← Parallel execution
│   (Structured)    │  (Semantic)       │
└───────────────────┴───────────────────┘
    ↓                       ↓
    └───────────┬───────────┘
                ↓
    ┌───────────────────┐
    │ Merge & Rerank    │ ← Weighted scoring based on query type
    └───────────────────┘
                ↓
         Final Results
```

### Weighting by Query Type:

| Query Type | SQL Weight | Vector Weight | Example Query |
|------------|------------|---------------|---------------|
| Price      | 70%        | 30%           | "So sánh giá MT với đối thủ" |
| RFQ        | 80%        | 20%           | "List nội dung chính RFQ" |
| Legal      | 60%        | 40%           | "Phân tích rủi ro pháp lý" |
| Compare    | 90%        | 10%           | "So sánh Invoice vs PO" |
| Semantic   | 0%         | 100%          | "What are the technical specs?" |

## 📊 Example Queries

### Vietnamese Queries:
```
"So sánh giá MT với đối thủ cho RFQ BD-OPS-2022-029"
→ Type: price, SQL-heavy (70%)

"Liệt kê các RFQ chưa hết hạn"
→ Type: rfq, SQL-heavy (80%)

"Phân tích rủi ro pháp lý trong hợp đồng PETRONAS"
→ Type: legal, Hybrid (60% SQL, 40% vector)

"Kiểm tra invoice INV-240023 có khớp với PO không"
→ Type: compare, SQL-heavy (90%)

"SIEMENS switchgear specifications"
→ Type: semantic, Vector-only (100%)
```

### English Queries:
```
"Compare MT price vs competitors"
"List active RFQs with deadlines"
"Analyze penalty clauses in contracts"
"Validate invoice against purchase order"
"What are the delivery terms for Vietsovpetro project?"
```

## 🎨 Customization

### Add New Legal Risk Patterns

In `utils/extraction/documentExtractor.js`:

```javascript
const riskPatterns = [
  {
    type: "payment_delay",
    level: "medium",
    pattern: /late\s+payment\s+fee|phí\s*trả\s*chậm/gi,
    description: "Late payment fee detected",
  },
  // Add your custom patterns here
];
```

### Adjust Query Classification

In `utils/search/hybridSearch.js`:

```javascript
const pricePatterns = [
  /so\s*sánh\s*giá/i,
  /compare.*price/i,
  // Add your custom patterns
];
```

### Change Similarity Thresholds

In `utils/services/documentComparator.js`:

```javascript
// Current threshold: 0.7 (70% similarity)
const similarity = calculateStringSimilarity(desc1, desc2);
if (similarity > 0.7) { // Adjust this value
  // Items match
}
```

## 🐛 Debugging

### Enable Query Logging:

```javascript
// In hybridSearch.js, all logs start with [Hybrid Search]
// In documentExtractor.js, logs start with [Extractor]
// In services, logs start with [Service Name]

// Check console output for:
console.log("[Hybrid Search] Query classified as: price (confidence: 0.8)");
console.log("[SQL Search] Searching quotations for price comparison");
```

### Check Database Content:

```bash
cd server
npx prisma studio
# Opens web UI at http://localhost:5555
```

### Verify Extraction Results:

```javascript
const { detectDocumentType } = require('./utils/extraction/documentExtractor');

const doc = {
  title: "RFQ No. BD-OPS-2022-029.pdf",
  pageContent: "...",
};

const type = detectDocumentType(doc);
console.log("Detected type:", type); // Should be "rfq"
```

## 📈 Performance Optimization

### For Large Datasets:

1. **Index frequently queried fields:**
```prisma
// In schema.prisma
@@index([rfqNumber])
@@index([submissionDeadline])
@@index([buyerName])
```

2. **Limit SQL results:**
```javascript
const quotations = await prisma.quotations.findMany({
  take: 10, // Limit to 10 results
  orderBy: { totalAmount: 'asc' },
});
```

3. **Use select to reduce payload:**
```javascript
const rfqs = await prisma.rfq_metadata.findMany({
  select: {
    rfqNumber: true,
    projectName: true,
    // Only select needed fields
  },
});
```

## 🔐 Security Notes

- All SQL queries use Prisma ORM with parameterized queries (SQL injection safe)
- User input is sanitized in `extractKeywords()` function
- Discrepancy resolution requires user authentication (implement in your app)

## 📝 Next Steps

1. **Integrate with Frontend:**
   - Add UI buttons for each use case
   - Display RFQ summary in formatted table
   - Show price comparison charts

2. **Add AI Enhancement:**
   - Use LLM to extract data from unstructured text (fallback when regex fails)
   - AI-powered legal risk description generation
   - Smart item matching across documents

3. **Notification System:**
   - Alert when RFQ deadline is approaching (< 3 days)
   - Notify when discrepancy severity is "critical"
   - Email when competitor quotation is lower than MT

4. **Export Features:**
   - Export RFQ summary to PDF
   - Export price comparison to Excel
   - Export discrepancy report

## 🆘 Support

### Common Issues:

**"RFQ not found"**
- Check if document was processed with `processAllDocuments()`
- Verify RFQ number format matches (case-sensitive)

**"No quotations found"**
- Quotations must be linked to RFQ via `rfqNumber` field
- Ensure quotation documents contain RFQ reference

**"Items not matching"**
- Similarity threshold may be too high (adjust to 0.5 for looser matching)
- Part numbers must match exactly (case-insensitive)

**"Query always classified as semantic"**
- Add more keywords to classification patterns
- Check Vietnamese diacritics are preserved

## 📚 Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Qdrant Vector Database](https://qdrant.tech/documentation/)
- [Hybrid Search Patterns](https://www.elastic.co/blog/improving-information-retrieval-elastic-stack-hybrid)

---

**Built for AnythingLLM** | Version 1.0 | Last Updated: 2024
