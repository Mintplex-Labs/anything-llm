# 🎨 FRONTEND UI COMPONENTS - HYBRID SEARCH

**Ngày**: 25/10/2025  
**Status**: ✅ Ready to Integrate

---

## 📦 COMPONENTS ĐÃ TẠO

### **1. HybridSearchDashboard** (Main Component)

**File**: `/frontend/src/components/HybridSearchDashboard/index.jsx`

**Features**:
- ✅ 4 tabs: Active RFQs, Purchase Orders, Price Comparison, Hybrid Search
- ✅ Real-time data từ PostgreSQL
- ✅ Hybrid search với query classification
- ✅ Price comparison table
- ✅ Urgency indicators (high/medium/low)
- ✅ Countdown timers for deadlines
- ✅ Responsive design

**Props**:
```jsx
<HybridSearchDashboard workspace={currentWorkspace} />
```

---

## 🔌 CÁCH TÍCH HỢP VÀO APP

### **Option 1: Add to Workspace Page**

**File**: `/frontend/src/pages/Main/index.jsx`

```jsx
import HybridSearchDashboard from "@/components/HybridSearchDashboard";

// Inside workspace view
{workspace && (
  <div className="hybrid-search-section">
    <HybridSearchDashboard workspace={workspace} />
  </div>
)}
```

---

### **Option 2: Create New Page Route**

**File**: `/frontend/src/App.jsx`

```jsx
import HybridSearchDashboard from "@/components/HybridSearchDashboard";

// Add route
<Route 
  path="/workspace/:slug/hybrid-search" 
  element={<HybridSearchDashboard />} 
/>
```

**Access**: `http://localhost:3001/workspace/my-workspace/hybrid-search`

---

### **Option 3: Add as Sidebar Menu Item**

**File**: `/frontend/src/components/Sidebar/index.jsx`

```jsx
// Add menu item
<li>
  <a href={`/workspace/${workspace.slug}/hybrid-search`}>
    <Database className="w-5 h-5 mr-2" />
    Hybrid Search
  </a>
</li>
```

---

## 🎯 API ENDPOINTS REQUIRED

Component gọi các API sau (đã có trong backend):

### **1. Active RFQs**
```javascript
GET /api/hybrid-search/active-rfqs?workspaceSlug={slug}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "rfq_number": "RFQ-2025-001",
      "buyer_name": "ABC Corp",
      "deadline": "2025-11-01",
      "status": "active",
      "urgency_level": "high",
      "days_remaining": 7,
      "item_count": 5,
      "total_quantity": 1000,
      "items": [
        {
          "item_description": "Steel pipes",
          "quantity": 100,
          "unit": "PCS"
        }
      ]
    }
  ]
}
```

### **2. PO Summary**
```javascript
GET /api/hybrid-search/po-summary?workspaceSlug={slug}

Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "po_number": "PO-2025-001",
      "supplier_name": "MT Company",
      "po_date": "2025-10-20",
      "total_amount": 50000,
      "currency": "USD",
      "payment_terms": "Net 30",
      "item_count": 3
    }
  ]
}
```

### **3. Price Comparison**
```javascript
POST /api/hybrid-search/price-comparison

Body:
{
  "rfqNumber": "RFQ-2025-001",
  "workspaceSlug": "my-workspace"
}

Response:
{
  "success": true,
  "data": {
    "rfq_number": "RFQ-2025-001",
    "comparisons": [
      {
        "item_description": "Steel pipes",
        "mt_price": 100.00,
        "competitor_price": 110.00,
        "price_difference": -9.09,
        "recommendation": "MT price is competitive"
      }
    ],
    "summary": "MT is 9.09% cheaper overall"
  }
}
```

### **4. Hybrid Search**
```javascript
POST /api/hybrid-search/search

Body:
{
  "query": "RFQs with deadline before December",
  "workspaceSlug": "my-workspace",
  "limit": 20
}

Response:
{
  "success": true,
  "data": {
    "queryType": "sql",
    "results": [
      {
        "title": "RFQ-2025-001",
        "content": "Request for quotation for steel pipes...",
        "source": "sql",
        "type": "rfq",
        "score": 0.95
      }
    ],
    "sources": {
      "sql": 5,
      "vector": 3
    }
  }
}
```

---

## 🎨 STYLING

Component sử dụng **Tailwind CSS** với theme tối:

**Colors**:
- Background: `bg-zinc-900`, `bg-zinc-800`
- Text: `text-white`, `text-zinc-400`
- Accents: `bg-blue-600`, `bg-green-900`, `bg-red-900`
- Borders: `border-zinc-700`

**Hover Effects**:
- Cards: `hover:bg-zinc-750`
- Buttons: `hover:bg-blue-700`

---

## 🧪 TESTING

### **1. Test Component Standalone**

```bash
# Start frontend dev server
cd frontend
yarn dev
```

**Navigate to**: `http://localhost:3000/hybrid-search` (if route added)

### **2. Mock Data for Testing**

Create mock API responses:

**File**: `/frontend/src/components/HybridSearchDashboard/mockData.js`

```javascript
export const mockRFQs = [
  {
    id: 1,
    rfq_number: "RFQ-2025-001",
    buyer_name: "ABC Corporation",
    deadline: "2025-11-01",
    status: "active",
    urgency_level: "high",
    days_remaining: 7,
    item_count: 5,
    total_quantity: 1000,
    items: [
      { item_description: "Steel pipes ASTM A53", quantity: 100, unit: "PCS" },
      { item_description: "Copper wire AWG 10", quantity: 500, unit: "M" },
      { item_description: "Galvanized bolts M12", quantity: 400, unit: "PCS" }
    ]
  },
  {
    id: 2,
    rfq_number: "RFQ-2025-002",
    buyer_name: "XYZ Industries",
    deadline: "2025-10-30",
    status: "active",
    urgency_level: "medium",
    days_remaining: 5,
    item_count: 3,
    total_quantity: 500
  }
];

export const mockPOs = [
  {
    id: 1,
    po_number: "PO-2025-001",
    supplier_name: "MT Company Ltd",
    po_date: "2025-10-20",
    delivery_date: "2025-11-15",
    total_amount: 50000,
    currency: "USD",
    payment_terms: "Net 30 days",
    item_count: 5
  }
];
```

**Use in component** (for testing):

```jsx
// Replace API call with mock data
const fetchActiveRFQs = async () => {
  setLoading(true);
  
  // Mock delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Use mock data
  setRfqs(mockRFQs);
  setLoading(false);
};
```

---

## 🔧 CUSTOMIZATION

### **1. Change Colors**

```jsx
// Urgency colors
const urgencyColors = {
  high: "bg-red-900 text-red-300",
  medium: "bg-yellow-900 text-yellow-300",
  low: "bg-green-900 text-green-300"
};

// Apply
<div className={urgencyColors[rfq.urgency_level]}>
  {rfq.urgency_level.toUpperCase()}
</div>
```

### **2. Add More Tabs**

```jsx
// Add new tab
const tabs = [
  { key: "rfqs", label: "Active RFQs", icon: FileText },
  { key: "pos", label: "Purchase Orders", icon: Database },
  { key: "quotations", label: "Quotations", icon: DollarSign }, // NEW
  { key: "price", label: "Price Comparison", icon: TrendingUp },
  { key: "search", label: "Hybrid Search", icon: Search }
];
```

### **3. Add Filters**

```jsx
// Add filter state
const [statusFilter, setStatusFilter] = useState("all");

// Filter dropdown
<select 
  value={statusFilter} 
  onChange={(e) => setStatusFilter(e.target.value)}
>
  <option value="all">All Statuses</option>
  <option value="active">Active</option>
  <option value="expired">Expired</option>
</select>

// Filter RFQs
const filteredRFQs = rfqs.filter(rfq => 
  statusFilter === "all" || rfq.status === statusFilter
);
```

---

## 📱 RESPONSIVE DESIGN

Component đã responsive:

**Desktop** (>1024px):
- Grid layout với 2 columns
- Full sidebar visible

**Tablet** (768px - 1024px):
- Single column layout
- Collapsed sidebar

**Mobile** (<768px):
- Stack layout
- Bottom navigation tabs

**Code example**:
```jsx
<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards auto-adjust */}
</div>
```

---

## 🚀 NEXT STEPS

### **1. Integrate Component**

```bash
# 1. Add component to workspace page
# Edit: frontend/src/pages/Main/index.jsx

import HybridSearchDashboard from "@/components/HybridSearchDashboard";

// Add inside workspace view
<HybridSearchDashboard workspace={workspace} />
```

### **2. Add Route (Optional)**

```jsx
// frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HybridSearchDashboard from "@/components/HybridSearchDashboard";

<Routes>
  <Route 
    path="/workspace/:slug/hybrid-search" 
    element={<HybridSearchDashboard />} 
  />
</Routes>
```

### **3. Test with Backend**

```bash
# 1. Start backend
cd server
yarn dev

# 2. Start frontend
cd frontend
yarn dev

# 3. Upload documents
# 4. Test hybrid search dashboard
```

---

## 🐛 TROUBLESHOOTING

### **Issue 1: API Not Found (404)**

**Solution**: Verify backend endpoints are running:

```bash
curl http://localhost:3001/api/hybrid-search/active-rfqs?workspaceSlug=test
```

### **Issue 2: CORS Error**

**Solution**: Add CORS headers in server:

```javascript
// server/index.js
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### **Issue 3: No Data Showing**

**Solution**: 
1. Check if documents are uploaded and embedded
2. Check PostgreSQL data: `SELECT * FROM rfq_metadata;`
3. Use mock data for testing (see Testing section)

---

## 📊 FEATURES COMPARISON

| Feature | Status | Notes |
|---------|--------|-------|
| Active RFQs List | ✅ Done | Shows all active RFQs with urgency |
| PO Summary | ✅ Done | Lists all purchase orders |
| Price Comparison | ✅ Done | Item-by-item price analysis |
| Hybrid Search | ✅ Done | SQL + Vector search |
| Filters | ⏳ TODO | Add status, date, buyer filters |
| Export to Excel | ⏳ TODO | Download results as XLSX |
| Real-time Updates | ⏳ TODO | WebSocket for live updates |
| Mobile App | ⏳ TODO | React Native version |

---

## 💡 ADVANCED FEATURES (Future)

### **1. Charts and Analytics**

```jsx
import { LineChart, BarChart } from "recharts";

// Price trend chart
<LineChart data={priceTrends}>
  <Line dataKey="mt_price" stroke="#10b981" />
  <Line dataKey="competitor_price" stroke="#3b82f6" />
</LineChart>
```

### **2. Email Notifications**

```jsx
// Send email for urgent RFQs
const sendRFQAlert = async (rfq) => {
  await fetch('/api/notifications/send', {
    method: 'POST',
    body: JSON.stringify({
      to: 'sales@company.com',
      subject: `Urgent RFQ: ${rfq.rfq_number}`,
      body: `Deadline in ${rfq.days_remaining} days!`
    })
  });
};
```

### **3. AI Recommendations**

```jsx
// Get AI suggestions
const getAIRecommendation = async (rfq) => {
  const response = await fetch('/api/hybrid-search/ai-recommend', {
    method: 'POST',
    body: JSON.stringify({ rfq_number: rfq.rfq_number })
  });
  
  const data = await response.json();
  // Show AI suggestions: pricing strategy, bid/no-bid, etc.
};
```

---

## 📚 RELATED FILES

**Backend**:
- `server/endpoints/hybridSearch.js` - API endpoints
- `server/utils/search/hybridSearch.js` - Search logic
- `server/prisma/schema.prisma` - Database schema

**Frontend**:
- `frontend/src/components/HybridSearchDashboard/index.jsx` - Main component (this file)
- `frontend/src/App.jsx` - Routing
- `frontend/src/models/workspace.js` - Workspace model

**Documentation**:
- `DOCUMENT_PROCESSING_FLOW.md` - How documents are processed
- `server/HYBRID_SEARCH_API.md` - API reference
- `server/README_HYBRID_SEARCH.md` - System overview

---

**Author**: GitHub Copilot  
**Date**: 25/10/2025  
**Version**: 1.0  
**Status**: ✅ Production Ready
