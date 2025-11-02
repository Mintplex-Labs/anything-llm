# 🎉 Hybrid Search System - Tổng Hợp

## ✅ Đã tạo 6 file mới cho hệ thống Hybrid Search

### 1. **Database Schema** (`server/prisma/schema.prisma`)
- **Mục đích**: Định nghĩa cấu trúc database cho dữ liệu có cấu trúc
- **Nội dung**: 10 bảng mới được thêm vào schema hiện có
  - `rfq_metadata` - Thông tin RFQ (buyer, deadline, delivery, bid bond)
  - `quotations` + `quotation_items` - Giá chào MT + đối thủ
  - `purchase_orders` + `po_items` - PO từ khách hàng
  - `vendor_pos` + `vendor_po_items` - PO gửi nhà cung cấp
  - `invoices` + `invoice_items` - Invoice từ MT
  - `vendor_invoices` + `vendor_invoice_items` - Invoice từ vendor
  - `certificates` + `certificate_items` - CO, CQ, COC
  - `vendor_certificates` + `vendor_certificate_items` - Certificate từ vendor
  - `legal_risks` - Rủi ro pháp lý phát hiện được
  - `document_discrepancies` - So sánh Invoice/Cert vs PO

### 2. **Hybrid Search Engine** (`server/utils/search/hybridSearch.js`)
- **Mục đích**: Kết hợp Qdrant (vector) + SQL (structured data)
- **Tính năng**:
  - Query Classifier - Phân loại câu hỏi người dùng
  - Parallel Search - Tìm kiếm đồng thời SQL + Vector
  - Merge & Rerank - Gộp kết quả với scoring thông minh
- **Trọng số theo loại query**:
  - Price comparison: 70% SQL, 30% Vector
  - RFQ summary: 80% SQL, 20% Vector
  - Legal risk: 60% SQL, 40% Vector
  - Document compare: 90% SQL, 10% Vector
  - Semantic: 0% SQL, 100% Vector

### 3. **Data Extractor** (`server/utils/extraction/documentExtractor.js`)
- **Mục đích**: Trích xuất dữ liệu có cấu trúc từ PDF đã xử lý
- **Tính năng**:
  - Tự động detect loại document (RFQ, quotation, PO, invoice, certificate, contract)
  - Trích xuất thông tin bằng regex patterns
  - Populate database tự động
  - Link documents với nhau (Invoice → PO, Quotation → RFQ)

### 4. **Price Comparison Service** (`server/utils/services/priceComparison.js`)
- **Use case 1**: "So sánh giá MT với đối thủ"
- **Tính năng**:
  - So sánh tổng giá MT vs competitors
  - So sánh từng item (manufacturer, unit price)
  - Tính vị trí cạnh tranh (lowest, below average, above average, highest)
  - Generate comparison table

### 5. **RFQ Summary Service** (`server/utils/services/rfqSummary.js`)
- **Use case 2**: "List nội dung chính RFQ"
- **Tính năng**:
  - Trích xuất metadata: buyer, deadline, delivery, bid bond
  - Danh sách quotations nhận được
  - Urgency indicator (CRITICAL, URGENT, SOON, NORMAL)
  - Legal risks phát hiện được
  - Statistics: active RFQs, expired RFQs, top buyers

### 6. **Document Comparator Service** (`server/utils/services/documentComparator.js`)
- **Use case 4**: "So sánh Invoice/Certificate vs PO"
- **Tính năng**:
  - So sánh Invoice vs PO (total amount, items, quantities, prices)
  - So sánh Certificate vs PO (items, manufacturers, quantities)
  - Phát hiện discrepancies với severity levels (critical, high, medium, low)
  - Track & resolve discrepancies

### 7. **Setup Guide** (`server/HYBRID_SEARCH_SETUP.md`)
- **Mục đích**: Hướng dẫn chi tiết cách sử dụng
- **Nội dung**:
  - Setup steps (migration, extraction, testing)
  - Example queries (Vietnamese + English)
  - Customization guide
  - Debugging tips
  - Performance optimization

### 8. **Quick Start Script** (`server/quickstart-hybrid-search.js`)
- **Mục đích**: Setup nhanh với 1 command
- **Chức năng**:
  - Process all existing documents
  - Show database statistics
  - List competitive RFQs
  - Provide usage examples

---

## 🚀 Cách Sử Dụng

### Bước 1: Run Database Migration

```bash
cd /home/akbazan/Downloads/anything-llm/server
npx prisma migrate dev --name init_hybrid_search
npx prisma generate
```

**Kết quả**: Tạo 10 bảng mới trong database (SQLite hiện tại, có thể chuyển sang PostgreSQL sau)

### Bước 2: Process Existing Documents

```bash
node quickstart-hybrid-search.js
```

**Script này sẽ**:
- Đọc tất cả JSON files trong `storage/documents/custom-documents/`
- Detect loại document (RFQ, quotation, PO, invoice, certificate, contract)
- Extract structured data
- Populate SQL tables
- Show statistics

### Bước 3: Test Use Cases

#### Test 1: So sánh giá MT với đối thủ

```bash
node -e "
const { comparePrices } = require('./utils/services/priceComparison');
comparePrices('YOUR-RFQ-NUMBER').then(r => console.log(JSON.stringify(r, null, 2)));
"
```

#### Test 2: List nội dung chính RFQ

```bash
node -e "
const { generateTextSummary } = require('./utils/services/rfqSummary');
generateTextSummary('YOUR-RFQ-NUMBER').then(t => console.log(t));
"
```

#### Test 3: Hybrid Search

```javascript
const { hybridSearch } = require('./utils/search/hybridSearch');

const results = await hybridSearch("So sánh giá MT với đối thủ", {
  workspaceId: 1,
  topK: 5,
});

console.log(results.classification); // Type: "price"
console.log(results.results); // Merged SQL + vector results
console.log(results.sources); // { sql: 3, vector: 2 }
```

#### Test 4: So sánh Invoice vs PO

```bash
node -e "
const { compareInvoiceToPO } = require('./utils/services/documentComparator');
compareInvoiceToPO('YOUR-INVOICE-NUMBER').then(r => console.log(JSON.stringify(r, null, 2)));
"
```

---

## 📊 Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                     USER QUERY                              │
│         "So sánh giá MT với đối thủ"                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              QUERY CLASSIFIER                               │
│  Detect intent: price | rfq | legal | compare | semantic   │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌───────────────────┐      ┌───────────────────┐
│   SQL SEARCH      │      │  VECTOR SEARCH    │
│   (Prisma ORM)    │      │  (Qdrant)         │
│                   │      │                   │
│ - quotations      │      │ - embeddings      │
│ - rfq_metadata    │      │ - similarity      │
│ - legal_risks     │      │ - semantic        │
│ - discrepancies   │      │                   │
└───────────────────┘      └───────────────────┘
        │                             │
        └──────────────┬──────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│              MERGE & RERANK                                 │
│  Weighted scoring based on query type                       │
│  SQL: 70% | Vector: 30% (for price queries)                │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                 FINAL RESULTS                               │
│  Ranked by relevance, deduplicated                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 Tích Hợp Vào AnythingLLM

### Option 1: Add to Chat Endpoint

In `server/endpoints/workspaces.js`:

```javascript
const { hybridSearch } = require('../utils/search/hybridSearch');

// Inside your chat handler
async function handleChat(req, res) {
  const { message, workspaceId } = req.body;
  
  // Use hybrid search instead of pure vector search
  const searchResults = await hybridSearch(message, {
    workspaceId,
    topK: 5,
    vectorProvider: workspace.chatProvider,
  });
  
  // searchResults.classification tells you what type of query
  // searchResults.results contains merged results
  
  // Pass to LLM with context
  const context = searchResults.results
    .map(r => r.content)
    .join("\n\n");
  
  // ... rest of your chat logic
}
```

### Option 2: Add New API Endpoints

Create `server/endpoints/hybridSearch.js`:

```javascript
const { hybridSearch } = require('../utils/search/hybridSearch');
const { comparePrices } = require('../utils/services/priceComparison');
const { getRFQSummary } = require('../utils/services/rfqSummary');
const { compareInvoiceToPO } = require('../utils/services/documentComparator');

function hybridSearchEndpoints(app) {
  app.post("/api/search/hybrid", async (req, res) => {
    const { query, workspaceId } = req.body;
    const results = await hybridSearch(query, { workspaceId, topK: 5 });
    res.json(results);
  });
  
  app.get("/api/rfq/:rfqNumber/summary", async (req, res) => {
    const summary = await getRFQSummary(req.params.rfqNumber);
    res.json(summary);
  });
  
  app.get("/api/rfq/:rfqNumber/price-comparison", async (req, res) => {
    const comparison = await comparePrices(req.params.rfqNumber);
    res.json(comparison);
  });
  
  app.get("/api/invoice/:invoiceNumber/compare", async (req, res) => {
    const comparison = await compareInvoiceToPO(req.params.invoiceNumber);
    res.json(comparison);
  });
}

module.exports = { hybridSearchEndpoints };
```

---

## 📈 Ví Dụ Kết Quả

### Price Comparison Output:

```json
{
  "rfq": {
    "number": "VT-1609/25-XL-DA-VVD",
    "project": "HV SWITCHGEAR AND DISTRIBUTION TRANSFORMER",
    "buyer": "Vietsovpetro"
  },
  "statistics": {
    "totalQuotations": 3,
    "mtQuotations": 1,
    "competitorQuotations": 2,
    "avgPrice": 4500000000,
    "minPrice": 4407569828,
    "maxPrice": 4600000000
  },
  "mtPosition": {
    "position": "lowest",
    "description": "MT Corp has the LOWEST price",
    "mtPrice": 4407569828,
    "diffFromAvgPercent": "-2.05",
    "diffFromMinPercent": "0.00"
  },
  "comparisons": [
    {
      "mt": {
        "quotationNumber": "250136-MTCO",
        "amount": 4407569828,
        "currency": "VND"
      },
      "competitor": {
        "name": "SCHNEIDER ELECTRIC",
        "amount": 4550000000,
        "currency": "VND"
      },
      "difference": {
        "amount": -142430172,
        "percentage": "-3.13",
        "advantage": "MT Corp cheaper"
      }
    }
  ]
}
```

### RFQ Summary Output:

```
═══════════════════════════════════════════════════════
  RFQ SUMMARY: VT-1609/25-XL-DA-VVD
═══════════════════════════════════════════════════════

PROJECT INFORMATION
───────────────────────────────────────────────────────
Project Name:    HV SWITCHGEAR AND DISTRIBUTION TRANSFORMER
Package:         GROUP 1 & GROUP 2
Source Folder:   HST/VSP

BUYER INFORMATION
───────────────────────────────────────────────────────
Company:         Vietsovpetro
Tax Code:        8400125332
Address:         Vung Tau, Vietnam
Contact:         procurement@vietsov.com.vn

TIMELINE
───────────────────────────────────────────────────────
Submission Deadline:  15/02/2025
Status:               5 days remaining
Urgency:              SOON
Validity Period:      90 days

DELIVERY REQUIREMENTS
───────────────────────────────────────────────────────
Schedule:        150 calendar days after LOI
Location:        Vietsovpetro warehouse, Vung Tau

BID BOND REQUIREMENTS
───────────────────────────────────────────────────────
Required:        Yes
Percentage:      3%
Value:           3% of Purchase Order Value
Due Within:      3 days after effective date

QUOTATIONS RECEIVED (3)
───────────────────────────────────────────────────────
MT Quotations:   1
Competitors:     2

Lowest Bid:      MT Corp
Amount:          VND 4,407,569,828
Type:            MT Corp

All Quotations:
  1. MT Corp (MT Corp) - VND 4,407,569,828
  2. SCHNEIDER ELECTRIC (Competitor) - VND 4,550,000,000
  3. SIEMENS (Competitor) - VND 4,600,000,000
```

---

## 🎯 Kế Hoạch Tiếp Theo

### Phase 1: Testing & Validation ✅ (Hiện tại)
- [x] Create database schema
- [x] Implement hybrid search
- [x] Build 4 service modules
- [x] Write documentation
- [ ] **YOU ARE HERE**: Run quickstart script & test

### Phase 2: Integration (Tuần tới)
- [ ] Integrate hybrid search into chat endpoint
- [ ] Add API endpoints for each service
- [ ] Build frontend UI for each use case
- [ ] Add notification system for deadlines

### Phase 3: AI Enhancement (Tuần sau)
- [ ] Use LLM for data extraction (fallback when regex fails)
- [ ] AI-powered legal risk analysis
- [ ] Smart item matching across documents
- [ ] Generate insights from price trends

### Phase 4: Production (Tháng sau)
- [ ] Migrate to PostgreSQL (from SQLite)
- [ ] Add user authentication for discrepancy resolution
- [ ] Export features (PDF, Excel)
- [ ] Performance optimization for large datasets

---

## 📞 Liên Hệ & Hỗ Trợ

Nếu gặp vấn đề:

1. **Check logs**: Tất cả functions đều có logging với prefix rõ ràng
   - `[Hybrid Search]` - Query classification & search
   - `[Extractor]` - Document processing
   - `[Price Comparison]` - Price analysis
   - `[RFQ Summary]` - RFQ metadata
   - `[Document Comparator]` - Invoice/Cert validation

2. **Debug với Prisma Studio**:
   ```bash
   cd server
   npx prisma studio
   ```
   Opens web UI at http://localhost:5555

3. **Check processed JSONs**:
   ```bash
   ls -la server/storage/documents/custom-documents/
   ```

4. **Verify extraction**:
   ```javascript
   const { detectDocumentType } = require('./utils/extraction/documentExtractor');
   const doc = { title: "...", pageContent: "..." };
   console.log(detectDocumentType(doc));
   ```

---

## 🎉 Tóm Tắt

**Bạn đã có**:
- ✅ Database schema với 10 bảng mới (RFQ, Quotation, PO, Invoice, Certificate, Legal Risks)
- ✅ Hybrid search engine kết hợp Qdrant + SQL
- ✅ 4 service modules cho 4 use cases
- ✅ Data extractor tự động từ PDF
- ✅ Complete documentation & quick start script

**Bước tiếp theo**:
1. Run `npx prisma migrate dev --name init_hybrid_search`
2. Run `node quickstart-hybrid-search.js`
3. Test với các RFQ/quotation PDFs trong `/AI - Tai lieu cung cap/`
4. Tích hợp vào chat endpoint hoặc tạo API mới

**Thời gian estimate**:
- Setup & migration: 5 phút
- Process existing documents: 10-30 phút (tùy số lượng PDFs)
- Testing: 15 phút
- Integration vào frontend: 2-4 giờ

---

Good luck! 🚀
