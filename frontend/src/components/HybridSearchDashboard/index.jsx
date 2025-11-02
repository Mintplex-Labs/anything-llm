import React, { useState, useEffect } from "react";
import { Search, Database, FileText, TrendingUp } from "react-feather";
import Workspace from "@/models/workspace";

/**
 * Hybrid Search Dashboard Component
 * Displays structured data from PostgreSQL + semantic search from Qdrant
 */
export default function HybridSearchDashboard({ workspace }) {
  const [activeTab, setActiveTab] = useState("rfqs"); // rfqs, pos, quotations, search
  const [searchQuery, setSearchQuery] = useState("");
  const [rfqs, setRfqs] = useState([]);
  const [pos, setPOs] = useState([]);
  const [quotations, setQuotations] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [queryType, setQueryType] = useState(null);

  // Fetch active RFQs
  useEffect(() => {
    if (activeTab === "rfqs") {
      fetchActiveRFQs();
    }
  }, [activeTab, workspace]);

  const fetchActiveRFQs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/hybrid-search/active-rfqs?workspaceSlug=${workspace.slug}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (data.success) {
        setRfqs(data.data);
      }
    } catch (error) {
      console.error("Error fetching RFQs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch POs
  const fetchPOs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/hybrid-search/po-summary?workspaceSlug=${workspace.slug}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      if (data.success) {
        setPOs(data.data);
      }
    } catch (error) {
      console.error("Error fetching POs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hybrid Search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/hybrid-search/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          workspaceSlug: workspace.slug,
          limit: 20,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSearchResults(data.data.results);
        setQueryType(data.data.queryType);
      }
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  // Price comparison
  const [priceComparison, setPriceComparison] = useState(null);
  const [rfqNumberInput, setRfqNumberInput] = useState("");

  const handlePriceComparison = async () => {
    if (!rfqNumberInput.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/hybrid-search/price-comparison`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfqNumber: rfqNumberInput,
          workspaceSlug: workspace.slug,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPriceComparison(data.data);
      }
    } catch (error) {
      console.error("Error comparing prices:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-zinc-900 text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Hybrid Search Dashboard</h1>
        <p className="text-zinc-400">
          Structured data from PostgreSQL + Semantic search from Qdrant
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-zinc-700">
        <button
          onClick={() => setActiveTab("rfqs")}
          className={`px-4 py-2 transition-colors ${
            activeTab === "rfqs"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <FileText className="inline mr-2 w-4 h-4" />
          Active RFQs
        </button>
        <button
          onClick={() => {
            setActiveTab("pos");
            fetchPOs();
          }}
          className={`px-4 py-2 transition-colors ${
            activeTab === "pos"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Database className="inline mr-2 w-4 h-4" />
          Purchase Orders
        </button>
        <button
          onClick={() => setActiveTab("price")}
          className={`px-4 py-2 transition-colors ${
            activeTab === "price"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <TrendingUp className="inline mr-2 w-4 h-4" />
          Price Comparison
        </button>
        <button
          onClick={() => setActiveTab("search")}
          className={`px-4 py-2 transition-colors ${
            activeTab === "search"
              ? "border-b-2 border-blue-500 text-blue-500"
              : "text-zinc-400 hover:text-white"
          }`}
        >
          <Search className="inline mr-2 w-4 h-4" />
          Hybrid Search
        </button>
      </div>

      {/* Content */}
      <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
        {/* Active RFQs Tab */}
        {activeTab === "rfqs" && (
          <div>
            {loading ? (
              <div className="text-center py-10">Loading RFQs...</div>
            ) : rfqs.length === 0 ? (
              <div className="text-center py-10 text-zinc-500">
                No active RFQs found. Upload RFQ documents to get started.
              </div>
            ) : (
              <div className="grid gap-4">
                {rfqs.map((rfq) => (
                  <div
                    key={rfq.id}
                    className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-750 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{rfq.rfq_number}</h3>
                        <p className="text-sm text-zinc-400">{rfq.buyer_name}</p>
                      </div>
                      <div className="text-right">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            rfq.urgency_level === "high"
                              ? "bg-red-900 text-red-300"
                              : rfq.urgency_level === "medium"
                              ? "bg-yellow-900 text-yellow-300"
                              : "bg-green-900 text-green-300"
                          }`}
                        >
                          {rfq.urgency_level?.toUpperCase() || "NORMAL"}
                        </div>
                        <p className="text-xs text-zinc-500 mt-1">
                          {rfq.days_remaining} days left
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-zinc-500">Deadline:</span>{" "}
                        <span className="text-white">
                          {new Date(rfq.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Items:</span>{" "}
                        <span className="text-white">{rfq.item_count || 0}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Total Quantity:</span>{" "}
                        <span className="text-white">{rfq.total_quantity || 0}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Status:</span>{" "}
                        <span className="text-green-400">{rfq.status}</span>
                      </div>
                    </div>

                    {rfq.items && rfq.items.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-zinc-700">
                        <p className="text-xs text-zinc-500 mb-2">Items Preview:</p>
                        <div className="space-y-1">
                          {rfq.items.slice(0, 3).map((item, idx) => (
                            <p key={idx} className="text-xs text-zinc-300">
                              • {item.item_description} ({item.quantity} {item.unit})
                            </p>
                          ))}
                          {rfq.items.length > 3 && (
                            <p className="text-xs text-zinc-500">
                              +{rfq.items.length - 3} more items...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Purchase Orders Tab */}
        {activeTab === "pos" && (
          <div>
            {loading ? (
              <div className="text-center py-10">Loading Purchase Orders...</div>
            ) : pos.length === 0 ? (
              <div className="text-center py-10 text-zinc-500">
                No purchase orders found. Upload PO documents to get started.
              </div>
            ) : (
              <div className="grid gap-4">
                {pos.map((po) => (
                  <div
                    key={po.id}
                    className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-750 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{po.po_number}</h3>
                        <p className="text-sm text-zinc-400">{po.supplier_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-400">
                          ${po.total_amount?.toLocaleString() || "N/A"}
                        </p>
                        <p className="text-xs text-zinc-500">{po.currency}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-zinc-500">PO Date:</span>{" "}
                        <span className="text-white">
                          {po.po_date
                            ? new Date(po.po_date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Delivery:</span>{" "}
                        <span className="text-white">
                          {po.delivery_date
                            ? new Date(po.delivery_date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Payment Terms:</span>{" "}
                        <span className="text-white">{po.payment_terms || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500">Items:</span>{" "}
                        <span className="text-white">{po.item_count || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Price Comparison Tab */}
        {activeTab === "price" && (
          <div>
            <div className="bg-zinc-800 rounded-lg p-4 mb-6">
              <label className="block text-sm font-medium mb-2">
                Enter RFQ Number
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={rfqNumberInput}
                  onChange={(e) => setRfqNumberInput(e.target.value)}
                  placeholder="e.g., RFQ-2025-001"
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handlePriceComparison()}
                />
                <button
                  onClick={handlePriceComparison}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Comparing..." : "Compare Prices"}
                </button>
              </div>
            </div>

            {priceComparison && (
              <div className="bg-zinc-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">
                  Price Comparison Results
                </h3>

                {priceComparison.comparisons?.length === 0 ? (
                  <p className="text-zinc-500">
                    No quotations found for this RFQ. Upload quotation documents.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-zinc-700">
                          <th className="text-left py-2">Item</th>
                          <th className="text-right py-2">MT Price</th>
                          <th className="text-right py-2">Competitor</th>
                          <th className="text-right py-2">Difference</th>
                          <th className="text-left py-2">Recommendation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priceComparison.comparisons?.map((item, idx) => (
                          <tr key={idx} className="border-b border-zinc-800">
                            <td className="py-3">{item.item_description}</td>
                            <td className="text-right text-green-400 font-medium">
                              ${item.mt_price?.toFixed(2) || "N/A"}
                            </td>
                            <td className="text-right text-blue-400">
                              ${item.competitor_price?.toFixed(2) || "N/A"}
                            </td>
                            <td
                              className={`text-right font-medium ${
                                item.price_difference > 0
                                  ? "text-red-400"
                                  : "text-green-400"
                              }`}
                            >
                              {item.price_difference > 0 ? "+" : ""}
                              {item.price_difference?.toFixed(1)}%
                            </td>
                            <td className="py-3">
                              <span
                                className={`px-2 py-1 rounded text-xs ${
                                  item.recommendation?.includes("competitive")
                                    ? "bg-green-900 text-green-300"
                                    : "bg-yellow-900 text-yellow-300"
                                }`}
                              >
                                {item.recommendation || "Review"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-4 p-3 bg-zinc-900 rounded">
                  <p className="text-sm">
                    <span className="font-medium">Summary:</span>{" "}
                    {priceComparison.summary || "No summary available"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hybrid Search Tab */}
        {activeTab === "search" && (
          <div>
            <div className="bg-zinc-800 rounded-lg p-4 mb-6">
              <label className="block text-sm font-medium mb-2">
                Hybrid Search Query
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="e.g., RFQs with deadline before December, steel pipe quotations"
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors disabled:opacity-50"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              {queryType && (
                <div className="mt-2">
                  <span className="text-xs text-zinc-500">Query Type: </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      queryType === "sql"
                        ? "bg-blue-900 text-blue-300"
                        : queryType === "vector"
                        ? "bg-purple-900 text-purple-300"
                        : "bg-green-900 text-green-300"
                    }`}
                  >
                    {queryType.toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-3">
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-800 rounded-lg p-4 hover:bg-zinc-750 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{result.title || "Document"}</h4>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          result.source === "sql"
                            ? "bg-blue-900 text-blue-300"
                            : "bg-purple-900 text-purple-300"
                        }`}
                      >
                        {result.source?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400 line-clamp-2">
                      {result.content || result.description}
                    </p>
                    <div className="mt-2 text-xs text-zinc-500">
                      Score: {result.score?.toFixed(2)} | Type: {result.type}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
