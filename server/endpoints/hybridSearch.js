const { reqBody, userFromSession, multiUserMode } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const {
  ROLES,
  flexUserRoleValid,
} = require("../utils/middleware/multiUserProtected");
const { validWorkspaceSlug } = require("../utils/middleware/validWorkspace");
const { hybridSearch } = require("../utils/search/hybridSearch");
const { comparePrices, getRFQsWithMultipleQuotations } = require("../utils/services/priceComparison");
const { 
  getRFQSummary, 
  getActiveRFQs, 
  getExpiredRFQs, 
  getRFQStatistics 
} = require("../utils/services/rfqSummary");
const { 
  compareInvoiceToPO, 
  compareCertificateToPO, 
  getOpenDiscrepancies 
} = require("../utils/services/documentComparator");

/**
 * Hybrid Search Endpoints
 * Combines Vector DB (Qdrant) + SQL (SQLite/PostgreSQL) for specialized queries
 * 
 * 4 Use Cases:
 * 1. Price Comparison: /hybrid-search/price-comparison
 * 2. RFQ Summary: /hybrid-search/rfq-summary
 * 3. Document Validation: /hybrid-search/document-validation
 * 4. General Hybrid Search: /hybrid-search/search
 */
function hybridSearchEndpoints(app) {
  if (!app) return;

  /**
   * 🔍 General Hybrid Search
   * POST /api/hybrid-search/search
   * 
   * Auto-classifies query and searches both SQL + Vector DB
   */
  app.post(
    "/hybrid-search/search",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const { query, workspaceId, topK = 10, minScore = 0.5 } = reqBody(request);

        if (!query?.trim()) {
          return response.status(400).json({
            success: false,
            error: "Query is required",
          });
        }

        console.log(`[Hybrid Search API] Query: "${query}"`);

        const results = await hybridSearch(query, {
          workspaceId: workspaceId || null,
          topK,
          minScore,
        });

        return response.status(200).json({
          success: true,
          query,
          classification: results.classification,
          totalResults: results.results.length,
          sources: results.sources,
          results: results.results,
        });
      } catch (error) {
        console.error("[Hybrid Search API] Error:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  /**
   * 💰 Price Comparison
   * POST /api/hybrid-search/price-comparison
   * 
   * Use Case 1: "So sánh giá MT với đối thủ"
   * Compare MT Corp prices vs competitors for specific RFQ
   */
  app.post(
    "/hybrid-search/price-comparison",
    [validatedRequest, flexUserRoleValid([ROLES.all]), validWorkspaceSlug],
    async (request, response) => {
      try {
        const { rfqNumber } = reqBody(request);

        if (!rfqNumber?.trim()) {
          return response.status(400).json({
            success: false,
            error: "RFQ number is required",
          });
        }

        console.log(`[Price Comparison] RFQ: ${rfqNumber}`);

        const comparison = await comparePrices(rfqNumber);

        if (!comparison.found) {
          return response.status(404).json({
            success: false,
            error: `RFQ "${rfqNumber}" not found or no quotations available`,
          });
        }

        return response.status(200).json({
          success: true,
          rfqNumber,
          comparison,
        });
      } catch (error) {
        console.error("[Price Comparison] Error:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  /**
   * 📋 List RFQs with Multiple Quotations
   * GET /api/hybrid-search/competitive-rfqs
   * 
   * Get all RFQs that have quotations from multiple vendors (competitive bidding)
   */
  app.get(
    "/hybrid-search/competitive-rfqs",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const rfqs = await getRFQsWithMultipleQuotations();

        return response.status(200).json({
          success: true,
          count: rfqs.length,
          rfqs,
        });
      } catch (error) {
        console.error("[Competitive RFQs] Error:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  /**
   * 📄 RFQ Summary
   * GET /api/hybrid-search/rfq-summary/:rfqNumber?
   * 
   * Use Case 2: "List nội dung chính RFQ"
   * Get structured metadata: buyer, deadline, delivery, bid bond
   */
  app.get(
    "/hybrid-search/rfq-summary/:rfqNumber?",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const { rfqNumber } = request.params;

        // If specific RFQ requested
        if (rfqNumber) {
          const summary = await getRFQSummary(rfqNumber);
          
          if (!summary.found) {
            return response.status(404).json({
              success: false,
              error: `RFQ "${rfqNumber}" not found`,
            });
          }

          return response.status(200).json({
            success: true,
            rfq: summary,
          });
        }

        // Otherwise return statistics
        const stats = await getRFQStatistics();
        
        return response.status(200).json({
          success: true,
          statistics: stats,
        });
      } catch (error) {
        console.error("[RFQ Summary] Error:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  /**
   * 📅 Active RFQs
   * GET /api/hybrid-search/active-rfqs
   * 
   * Get all RFQs with future deadlines
   */
  app.get(
    "/hybrid-search/active-rfqs",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const rfqs = await getActiveRFQs();

        return response.status(200).json({
          success: true,
          count: rfqs.length,
          rfqs,
        });
      } catch (error) {
        console.error("[Active RFQs] Error:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  /**
   * ⏰ Expired RFQs
   * GET /api/hybrid-search/expired-rfqs
   * 
   * Get all RFQs past deadline
   */
  app.get(
    "/hybrid-search/expired-rfqs",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const rfqs = await getExpiredRFQs();

        return response.status(200).json({
          success: true,
          count: rfqs.length,
          rfqs,
        });
      } catch (error) {
        console.error("[Expired RFQs] Error:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  /**
   * ✅ Document Validation - Invoice
   * POST /api/hybrid-search/validate-invoice
   * 
   * Use Case 4: "So sánh Invoice vs PO"
   * Validate invoice against purchase order
   */
  app.post(
    "/hybrid-search/validate-invoice",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const { invoiceNumber, poNumber } = reqBody(request);

        if (!invoiceNumber || !poNumber) {
          return response.status(400).json({
            success: false,
            error: "Invoice number and PO number are required",
          });
        }

        const validation = await compareInvoiceToPO(invoiceNumber, poNumber);

        return response.status(200).json({
          success: true,
          validation,
        });
      } catch (error) {
        console.error("[Invoice Validation] Error:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  /**
   * ✅ Document Validation - Certificate
   * POST /api/hybrid-search/validate-certificate
   * 
   * Use Case 4: "So sánh Certificate vs PO"
   * Validate CO/CQ/COC against purchase order
   */
  app.post(
    "/hybrid-search/validate-certificate",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const { certificateNumber, poNumber } = reqBody(request);

        if (!certificateNumber || !poNumber) {
          return response.status(400).json({
            success: false,
            error: "Certificate number and PO number are required",
          });
        }

        const validation = await compareCertificateToPO(certificateNumber, poNumber);

        return response.status(200).json({
          success: true,
          validation,
        });
      } catch (error) {
        console.error("[Certificate Validation] Error:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  /**
   * ⚠️ Open Discrepancies
   * GET /api/hybrid-search/discrepancies
   * 
   * Get all unresolved document validation issues
   */
  app.get(
    "/hybrid-search/discrepancies",
    [validatedRequest, flexUserRoleValid([ROLES.all])],
    async (request, response) => {
      try {
        const discrepancies = await getOpenDiscrepancies();

        return response.status(200).json({
          success: true,
          count: discrepancies.length,
          discrepancies,
        });
      } catch (error) {
        console.error("[Discrepancies] Error:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );

  /**
   * 🔄 Process New Documents
   * POST /api/hybrid-search/process-documents
   * 
   * Extract structured data from newly uploaded documents
   */
  app.post(
    "/hybrid-search/process-documents",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { processAllDocuments } = require("../utils/extraction/documentExtractor");
        
        console.log("[Process Documents] Starting extraction...");
        
        const results = await processAllDocuments();

        return response.status(200).json({
          success: true,
          message: "Document processing completed",
          results,
        });
      } catch (error) {
        console.error("[Process Documents] Error:", error);
        return response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );
}

module.exports = { hybridSearchEndpoints };
