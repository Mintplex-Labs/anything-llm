# 🔍 Hybrid Search API Documentation

## Overview

Hệ thống Hybrid Search kết hợp **Vector DB (Qdrant)** + **SQL Database (SQLite/PostgreSQL)** để truy vấn dữ liệu RFQ/tender documents với độ chính xác cao.

---

## 🎯 4 Use Cases Chính

### 1️⃣ **So sánh giá MT với đối thủ** (Price Comparison)
### 2️⃣ **List nội dung chính RFQ** (RFQ Summary)
### 3️⃣ **Phân tích rủi ro pháp lý** (Legal Risk) - Coming soon
### 4️⃣ **So sánh Invoice/Certificate vs PO** (Document Validation)

---

## 📡 API Endpoints

Base URL: `http://localhost:3001/api/hybrid-search`

### 1. General Hybrid Search

**POST** `/search`

Tự động phân loại câu hỏi và tìm kiếm trên cả SQL + Vector DB.

**Request:**
```json
{
  "query": "RFQ deadline tháng 11",
  "topK": 10,
  "minScore": 0.5
}
```

**Response:**
```json
{
  "success": true,
  "query": "RFQ deadline tháng 11",
  "classification": {
    "type": "rfq",
    "confidence": 0.8,
    "keywords": ["rfq", "deadline"]
  },
  "totalResults": 5,
  "sources": {
    "sql": 3,
    "vector": 2
  },
  "results": [
    {
      "score": 0.95,
      "source": "sql",
      "type": "rfq",
      "data": {
        "rfqNumber": "BD-OPS-2022-029",
        "projectName": "Block B Installation",
        "buyer": "PVEP",
        "deadline": "2025-11-24T00:00:00.000Z",
        "daysRemaining": 30
      }
    }
  ]
}
```

**Classification Types:**
- `price` - Câu hỏi về giá cả, báo giá
- `rfq` - Thông tin RFQ (deadline, buyer, bid bond)
- `legal` - Rủi ro pháp lý, điều khoản hợp đồng
- `compare` - So sánh documents (Invoice vs PO)
- `semantic` - Câu hỏi chung, semantic search

---

### 2. Price Comparison (Use Case 1)

**POST** `/price-comparison`

So sánh giá MT Corp vs đối thủ cho một RFQ cụ thể.

**Request:**
```json
{
  "rfqNumber": "VT-1609/25-XL-DA-VVD"
}
```

**Response:**
```json
{
  "success": true,
  "rfqNumber": "VT-1609/25-XL-DA-VVD",
  "comparison": {
    "found": true,
    "rfq": {
      "rfqNumber": "VT-1609/25-XL-DA-VVD",
      "projectName": "RC12 Equipment Supply",
      "buyer": "PVEP"
    },
    "quotations": [
      {
        "vendor": "MT Corp",
        "quotationNumber": "250136-MTC",
        "totalValue": 125000.00,
        "currency": "USD",
        "itemCount": 15
      },
      {
        "vendor": "Competitor A",
        "quotationNumber": "Q-2025-001",
        "totalValue": 132000.00,
        "currency": "USD",
        "itemCount": 15
      }
    ],
    "analysis": {
      "mtPosition": "lowest",
      "priceDifference": -7000.00,
      "percentageDifference": -5.3,
      "recommendation": "MT Corp has the most competitive price"
    },
    "items": [
      {
        "description": "Pressure Transmitter",
        "mtPrice": 1200.00,
        "competitorBest": 1350.00,
        "difference": -150.00,
        "mtWinning": true
      }
    ]
  }
}
```

**Error (No Quotations):**
```json
{
  "success": false,
  "error": "RFQ \"XYZ\" not found or no quotations available"
}
```

---

### 3. List Competitive RFQs

**GET** `/competitive-rfqs`

Lấy danh sách RFQs có nhiều quotations (bidding cạnh tranh).

**Response:**
```json
{
  "success": true,
  "count": 3,
  "rfqs": [
    {
      "rfqNumber": "VT-1609/25-XL-DA-VVD",
      "projectName": "RC12",
      "buyer": "PVEP",
      "quotationCount": 3,
      "lowestPrice": 125000.00,
      "highestPrice": 140000.00,
      "currency": "USD"
    }
  ]
}
```

---

### 4. RFQ Summary (Use Case 2)

**GET** `/rfq-summary/:rfqNumber?`

Lấy thông tin cấu trúc của RFQ (buyer, deadline, delivery, bid bond).

**GET** `/rfq-summary/BD-OPS-2022-029` - Specific RFQ

**Response:**
```json
{
  "success": true,
  "rfq": {
    "found": true,
    "rfqNumber": "BD-OPS-2022-029",
    "projectName": "Block B Installation",
    "buyer": "PVEP",
    "deadline": "2025-11-24T00:00:00.000Z",
    "deliveryPlace": "PVEP Warehouse, Vung Tau",
    "deliveryTime": "30 days after PO",
    "bidBondRequired": true,
    "bidBondValue": 50000.00,
    "currency": "USD",
    "totalValue": 2500000.00,
    "status": "active",
    "daysRemaining": 30,
    "urgency": "normal",
    "textSummary": "RFQ BD-OPS-2022-029\nProject: Block B Installation\n..."
  }
}
```

**GET** `/rfq-summary` - Overall Statistics

**Response:**
```json
{
  "success": true,
  "statistics": {
    "totalRFQs": 5,
    "activeRFQs": 4,
    "expiredRFQs": 1,
    "totalValue": 5000000.00,
    "currency": "USD",
    "topBuyers": [
      { "buyer": "PVEP", "count": 3 },
      { "buyer": "VSP", "count": 2 }
    ],
    "urgentRFQs": 1
  }
}
```

---

### 5. Active RFQs

**GET** `/active-rfqs`

Lấy danh sách RFQs còn hạn (chưa quá deadline).

**Response:**
```json
{
  "success": true,
  "count": 4,
  "rfqs": [
    {
      "rfqNumber": "BD-OPS-2022-029",
      "projectName": "Block B Installation",
      "buyer": "PVEP",
      "deadline": "2025-11-24T00:00:00.000Z",
      "daysRemaining": 30,
      "urgency": "normal",
      "totalValue": 2500000.00
    }
  ]
}
```

**Urgency Levels:**
- `critical` - < 3 days remaining
- `warning` - 3-7 days remaining
- `normal` - > 7 days remaining

---

### 6. Expired RFQs

**GET** `/expired-rfqs`

Lấy danh sách RFQs đã quá hạn.

**Response:**
```json
{
  "success": true,
  "count": 1,
  "rfqs": [
    {
      "rfqNumber": "OLD-RFQ-2024-001",
      "projectName": "Old Project",
      "buyer": "Client X",
      "deadline": "2024-12-31T00:00:00.000Z",
      "daysOverdue": 298,
      "totalValue": 100000.00
    }
  ]
}
```

---

### 7. Validate Invoice (Use Case 4)

**POST** `/validate-invoice`

So sánh Invoice với Purchase Order để phát hiện sai lệch.

**Request:**
```json
{
  "invoiceNumber": "INV-2025-001",
  "poNumber": "PO-240152"
}
```

**Response:**
```json
{
  "success": true,
  "validation": {
    "found": true,
    "invoice": {
      "invoiceNumber": "INV-2025-001",
      "invoiceDate": "2025-10-20",
      "totalValue": 125000.00,
      "currency": "USD"
    },
    "purchaseOrder": {
      "poNumber": "PO-240152",
      "poDate": "2025-09-15",
      "totalValue": 125000.00,
      "currency": "USD"
    },
    "discrepancies": [
      {
        "type": "quantity_mismatch",
        "severity": "high",
        "description": "Item 'Pressure Transmitter': PO qty=10, Invoice qty=8",
        "itemDescription": "Pressure Transmitter PT-100",
        "expected": 10,
        "actual": 8
      }
    ],
    "status": "has_discrepancies",
    "totalDiscrepancies": 1,
    "criticalIssues": 1
  }
}
```

**Status Values:**
- `match` - Khớp hoàn toàn
- `has_discrepancies` - Có sai lệch
- `not_found` - Không tìm thấy Invoice/PO

**Discrepancy Types:**
- `quantity_mismatch` - Số lượng không khớp
- `price_mismatch` - Giá không khớp
- `missing_item` - Thiếu item
- `extra_item` - Item thừa
- `total_mismatch` - Tổng tiền sai

---

### 8. Validate Certificate

**POST** `/validate-certificate`

So sánh Certificate (CO/CQ/COC) với Purchase Order.

**Request:**
```json
{
  "certificateNumber": "CO-2025-001",
  "poNumber": "PO-240152"
}
```

**Response:** (Similar to Invoice Validation)
```json
{
  "success": true,
  "validation": {
    "found": true,
    "certificate": {
      "certificateNumber": "CO-2025-001",
      "certificateType": "CO",
      "issueDate": "2025-10-25"
    },
    "discrepancies": [],
    "status": "match"
  }
}
```

---

### 9. Open Discrepancies

**GET** `/discrepancies`

Lấy danh sách các sai lệch chưa giải quyết.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "discrepancies": [
    {
      "id": 1,
      "invoiceNumber": "INV-2025-001",
      "poNumber": "PO-240152",
      "discrepancyType": "quantity_mismatch",
      "severity": "high",
      "description": "Qty mismatch: PO=10, Invoice=8",
      "status": "open",
      "createdAt": "2025-10-25T10:00:00.000Z"
    }
  ]
}
```

---

### 10. Process New Documents

**POST** `/process-documents` (Admin/Manager only)

Xử lý và extract dữ liệu từ documents mới upload.

**Response:**
```json
{
  "success": true,
  "message": "Document processing completed",
  "results": {
    "processed": 10,
    "success": 8,
    "failed": 2,
    "extracted": {
      "rfqs": 3,
      "quotations": 2,
      "pos": 2,
      "invoices": 1,
      "certificates": 0
    }
  }
}
```

---

## 🔧 Usage Examples

### JavaScript/Node.js

```javascript
// 1. General Search
const response = await fetch('http://localhost:3001/api/hybrid-search/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN' // if auth enabled
  },
  body: JSON.stringify({
    query: 'RFQ deadline tháng 11',
    topK: 10
  })
});

const data = await response.json();
console.log(data.results);

// 2. Price Comparison
const priceData = await fetch('http://localhost:3001/api/hybrid-search/price-comparison', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ rfqNumber: 'VT-1609/25-XL-DA-VVD' })
});

const comparison = await priceData.json();
console.log(`MT Price: $${comparison.comparison.quotations[0].totalValue}`);

// 3. Active RFQs
const activeRFQs = await fetch('http://localhost:3001/api/hybrid-search/active-rfqs')
  .then(r => r.json());

console.log(`You have ${activeRFQs.count} active RFQs`);
```

### Python

```python
import requests

BASE_URL = 'http://localhost:3001/api/hybrid-search'

# 1. General Search
response = requests.post(f'{BASE_URL}/search', json={
    'query': 'RFQ deadline tháng 11',
    'topK': 10
})
results = response.json()
print(f"Found {results['totalResults']} results")

# 2. Price Comparison
comparison = requests.post(f'{BASE_URL}/price-comparison', json={
    'rfqNumber': 'VT-1609/25-XL-DA-VVD'
}).json()

mt_quote = comparison['comparison']['quotations'][0]
print(f"MT Corp price: ${mt_quote['totalValue']}")

# 3. Validate Invoice
validation = requests.post(f'{BASE_URL}/validate-invoice', json={
    'invoiceNumber': 'INV-2025-001',
    'poNumber': 'PO-240152'
}).json()

if validation['validation']['status'] == 'has_discrepancies':
    print(f"⚠️ Found {len(validation['validation']['discrepancies'])} issues!")
```

### cURL

```bash
# 1. General Search
curl -X POST http://localhost:3001/api/hybrid-search/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "RFQ deadline tháng 11",
    "topK": 10
  }'

# 2. Price Comparison
curl -X POST http://localhost:3001/api/hybrid-search/price-comparison \
  -H "Content-Type: application/json" \
  -d '{"rfqNumber": "VT-1609/25-XL-DA-VVD"}'

# 3. Active RFQs
curl http://localhost:3001/api/hybrid-search/active-rfqs

# 4. Validate Invoice
curl -X POST http://localhost:3001/api/hybrid-search/validate-invoice \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceNumber": "INV-2025-001",
    "poNumber": "PO-240152"
  }'
```

---

## 🎨 Frontend Integration Examples

### React Component

```jsx
import React, { useState, useEffect } from 'react';

function HybridSearchDemo() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/hybrid-search/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, topK: 10 })
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        value={query} 
        onChange={e => setQuery(e.target.value)}
        placeholder="Tìm kiếm RFQ, quotations..."
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      {results && (
        <div>
          <p>Query Type: {results.classification.type}</p>
          <p>Found: {results.totalResults} results</p>
          <ul>
            {results.results.map((r, i) => (
              <li key={i}>
                <strong>{r.data.rfqNumber}</strong> - {r.data.projectName}
                (Score: {r.score.toFixed(2)})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default HybridSearchDemo;
```

### Active RFQs Dashboard

```jsx
function ActiveRFQsDashboard() {
  const [rfqs, setRfqs] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/hybrid-search/active-rfqs')
      .then(r => r.json())
      .then(data => setRfqs(data.rfqs));
  }, []);

  return (
    <div className="dashboard">
      <h2>Active RFQs ({rfqs.length})</h2>
      
      {rfqs.map(rfq => (
        <div 
          key={rfq.rfqNumber}
          className={`rfq-card ${rfq.urgency}`}
        >
          <h3>{rfq.rfqNumber}</h3>
          <p>{rfq.projectName}</p>
          <p>Buyer: {rfq.buyer}</p>
          <p>Deadline: {new Date(rfq.deadline).toLocaleDateString()}</p>
          <p className={`urgency ${rfq.urgency}`}>
            {rfq.daysRemaining} days remaining
          </p>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔒 Authentication

If multi-user mode is enabled, include JWT token in headers:

```javascript
fetch('http://localhost:3001/api/hybrid-search/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${YOUR_JWT_TOKEN}`
  },
  body: JSON.stringify({ query: '...' })
});
```

---

## ⚡ Performance Tips

1. **Use Specific Endpoints**: Use `/price-comparison` instead of `/search` for price queries
2. **Limit Results**: Set `topK` to reasonable number (10-20)
3. **Filter by Score**: Use `minScore` to exclude low-quality results
4. **Cache Results**: Cache common queries (active RFQs, statistics)
5. **Batch Processing**: Process documents in batches during off-peak hours

---

## 📊 Query Classification Examples

The system auto-detects query intent:

| Query | Detected Type | SQL Weight | Vector Weight |
|-------|--------------|------------|---------------|
| "So sánh giá MT với đối thủ cho RFQ ABC" | `price` | 70% | 30% |
| "RFQ deadline tháng 11" | `rfq` | 80% | 20% |
| "Kiểm tra Invoice INV-001 với PO 240152" | `compare` | 90% | 10% |
| "Điều khoản thanh toán trong hợp đồng" | `legal` | 60% | 40% |
| "Những dự án liên quan đến offshore" | `semantic` | 0% | 100% |

---

## 🐛 Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common Errors:**
- `400` - Bad Request (missing required fields)
- `404` - Not Found (RFQ/Invoice/PO not found)
- `500` - Internal Server Error

**Example:**
```javascript
try {
  const response = await fetch('/api/hybrid-search/price-comparison', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rfqNumber: 'ABC' })
  });

  const data = await response.json();
  
  if (!data.success) {
    console.error('Error:', data.error);
    // Handle error (show toast, alert, etc.)
  } else {
    // Process data
    console.log(data.comparison);
  }
} catch (error) {
  console.error('Network error:', error);
}
```

---

## 📝 Next Steps

1. **Test APIs**: Use Postman/cURL to test endpoints
2. **Build UI**: Create React components for each use case
3. **Upload Documents**: Add more quotation PDFs for price comparison
4. **Improve Extraction**: Enhance regex patterns for better data quality
5. **Monitor Performance**: Track query times and accuracy

---

## 🆘 Support

- See `HYBRID_SEARCH_SETUP.md` for setup guide
- See `HYBRID_SEARCH_SUMMARY.md` for Vietnamese quick start
- Check `SETUP_COMPLETE.md` for known issues

**Current Status:**
- ✅ General Search: Working
- ✅ RFQ Summary: Working (5 RFQs available)
- ✅ Active/Expired RFQs: Working
- ⏳ Price Comparison: Ready (needs quotation data)
- ⏳ Document Validation: Ready (needs invoice/cert data)

---

**Version**: 1.0  
**Last Updated**: October 25, 2025  
**Author**: Hybrid Search Integration Team
