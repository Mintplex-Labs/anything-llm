const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * HYBRID SEARCH ENGINE
 * Combines Qdrant (Vector Search) + PostgreSQL (Structured Data)
 * 
 * Use cases:
 * 1. "So sánh giá MT với đối thủ" - Price comparison
 * 2. "List nội dung chính RFQ" - Extract RFQ metadata
 * 3. "Phân tích rủi ro pháp lý" - Legal risk analysis
 * 4. "So sánh Invoice/Certificate vs PO" - Document validation
 */

/**
 * Query Classifier
 * Determines which search strategy to use based on user intent
 * @param {string} query - User query
 * @returns {Object} { type, confidence, keywords }
 */
function classifyQuery(query) {
  const normalizedQuery = query.toLowerCase().trim();
  
  // Price comparison patterns
  const pricePatterns = [
    /so\s*sánh\s*giá/i,
    /compare.*price/i,
    /giá.*mt/i,
    /đối\s*thủ/i,
    /competitor/i,
    /quotation/i,
    /báo\s*giá/i,
  ];
  
  // RFQ summary patterns
  const rfqPatterns = [
    /rfq/i,
    /nội\s*dung.*rfq/i,
    /thông\s*tin.*thầu/i,
    /deadline/i,
    /hạn\s*nộp/i,
    /bid\s*bond/i,
    /bảo\s*lãnh/i,
    /delivery/i,
    /giao\s*hàng/i,
  ];
  
  // Legal risk patterns
  const legalPatterns = [
    /rủi\s*ro.*pháp\s*lý/i,
    /legal.*risk/i,
    /hợp\s*đồng/i,
    /contract/i,
    /penalty/i,
    /phạt/i,
    /liability/i,
    /trách\s*nhiệm/i,
    /warranty/i,
    /bảo\s*hành/i,
  ];
  
  // Document comparison patterns
  const compareDocPatterns = [
    /so\s*sánh.*invoice/i,
    /compare.*po/i,
    /invoice.*vs.*po/i,
    /certificate.*vs/i,
    /kiểm\s*tra.*invoice/i,
    /đối\s*chiếu/i,
    /validate/i,
  ];
  
  // Calculate confidence for each type
  const scores = {
    price: pricePatterns.filter(p => p.test(normalizedQuery)).length,
    rfq: rfqPatterns.filter(p => p.test(normalizedQuery)).length,
    legal: legalPatterns.filter(p => p.test(normalizedQuery)).length,
    compare: compareDocPatterns.filter(p => p.test(normalizedQuery)).length,
  };
  
  // Determine primary type
  const maxScore = Math.max(...Object.values(scores));
  
  if (maxScore === 0) {
    // No specific pattern matched - use semantic search (vector only)
    return {
      type: "semantic",
      confidence: 0.5,
      keywords: extractKeywords(normalizedQuery),
    };
  }
  
  const type = Object.entries(scores).find(([_, score]) => score === maxScore)[0];
  
  return {
    type,
    confidence: Math.min(maxScore / 3, 1.0), // Normalize confidence
    keywords: extractKeywords(normalizedQuery),
  };
}

/**
 * Extract relevant keywords from query
 * @param {string} query
 * @returns {Array<string>}
 */
function extractKeywords(query) {
  // Remove common Vietnamese and English stop words
  const stopWords = [
    "là", "của", "và", "có", "trong", "cho", "với", "từ", "về", "được", "các",
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of",
    "what", "where", "when", "how", "why", "which", "who",
  ];
  
  const words = query
    .toLowerCase()
    .replace(/[^\w\sàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/g, "")
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word));
  
  return [...new Set(words)]; // Remove duplicates
}

/**
 * HYBRID SEARCH FUNCTION
 * Executes parallel searches: SQL (structured) + Vector (semantic)
 * @param {string} query - User query
 * @param {Object} options - Search options
 * @returns {Object} Combined search results
 */
async function hybridSearch(query, options = {}) {
  const {
    workspaceId,
    topK = 5,
    vectorProvider, // Pass vector provider from workspace settings
  } = options;
  
  // Step 1: Classify query
  const classification = classifyQuery(query);
  console.log(`[Hybrid Search] Query classified as: ${classification.type} (confidence: ${classification.confidence})`);
  
  // Step 2: Execute searches based on classification
  let sqlResults = [];
  let vectorResults = [];
  
  try {
    // Always run vector search for semantic understanding
    vectorResults = await executeVectorSearch(query, {
      workspaceId,
      topK,
      vectorProvider,
    });
    
    // Run SQL search based on query type
    switch (classification.type) {
      case "price":
        sqlResults = await searchPriceData(classification.keywords);
        break;
      case "rfq":
        sqlResults = await searchRfqData(classification.keywords);
        break;
      case "legal":
        sqlResults = await searchLegalRisks(classification.keywords);
        break;
      case "compare":
        sqlResults = await searchDocuments(classification.keywords);
        break;
      case "semantic":
      default:
        // Vector search only
        break;
    }
    
    // Step 3: If we have SQL results, augment missing fields using vector evidence
    // but only for fields that are absent in the structured result. This keeps
    // authoritative SQL fields preferred and uses vector snippets only as
    // fallback/evidence for missing values.
    if (sqlResults.length > 0 && vectorResults.length > 0) {
      sqlResults = augmentSqlResultsWithVectorEvidence(sqlResults, vectorResults);
    }

    // Step 4: Merge and rerank results
    const mergedResults = mergeAndRerank(sqlResults, vectorResults, classification);
    
    return {
      results: mergedResults,
      classification,
      sources: {
        sql: sqlResults.length,
        vector: vectorResults.length,
      },
    };
  } catch (error) {
    console.error("[Hybrid Search] Error:", error);
    throw error;
  }
}

/**
 * Augment SQL (structured) results with vector evidence when fields are missing.
 * Strategy:
 * - For each structured result, look for "important" metadata keys that are
 *   null/undefined or explicitly set to "N/A".
 * - If any missing keys are found, search the vector results for items that
 *   belong to the same document (by metadata.documentId) and append a short
 *   snippet/evidence to the structured result's content.
 * - Do NOT replace existing structured values; only append evidence for missing ones.
 */
function augmentSqlResultsWithVectorEvidence(sqlResults, vectorResults) {
  // Map vector results by documentId for quick lookup
  const vectorsByDoc = new Map();
  for (const v of vectorResults) {
    const docId = v.metadata && v.metadata.documentId;
    if (!docId) continue;
    if (!vectorsByDoc.has(docId)) vectorsByDoc.set(docId, []);
    vectorsByDoc.get(docId).push(v);
  }

  // Define candidate metadata keys to check per result type. If these keys are
  // missing, we'll try to find vector evidence for them.
  const importantKeysByType = {
    rfq: ["rfqNumber", "projectName", "buyerName", "submissionDeadline", "deliveryLocation", "bidBondRequired", "technicalReqPages"],
    quotation: ["quotationNumber", "vendorName", "totalAmount", "currency"],
    purchase_order: ["poNumber", "buyerName", "totalAmount", "currency"],
    invoice: ["invoiceNumber", "poNumber", "totalAmount", "currency"],
    certificate: ["certNumber", "certType"],
    legal_risk: ["clauseText", "riskDescription"],
  };

  return sqlResults.map(res => {
    try {
      const keys = importantKeysByType[res.type] || [];
      // If no candidate keys, leave result unchanged
      if (keys.length === 0) return res;

      // Consider a field missing only when it is strictly undefined or null.
      // If the field exists (even empty string) we treat it as present per request.
      const missing = keys.filter(k => {
        const val = res.metadata && res.metadata[k];
        return val === undefined || val === null;
      });

      if (missing.length === 0) return res; // nothing to augment

      // Try to find vector evidence for the same document
      const docId = res.metadata && res.metadata.documentId;
      let evidence = null;

      if (docId && vectorsByDoc.has(docId)) {
        const vecs = vectorsByDoc.get(docId);
        // Pick the highest-scoring vector result as evidence
        vecs.sort((a, b) => (b.score || 0) - (a.score || 0));
        const top = vecs[0];
        evidence = top && (top.content || top.snippet || top.payload || null);
      }

      // Fallback: if we couldn't match by documentId, pick the top vector result
      if (!evidence && vectorResults.length > 0) {
        const topAny = vectorResults.slice().sort((a, b) => (b.score || 0) - (a.score || 0))[0];
        evidence = topAny && (topAny.content || topAny.snippet || topAny.payload || null);
      }

      if (evidence) {
        const augmented = { ...res };
        // Append a short evidence section to the content, preserving the structured data
        augmented.content = `${augmented.content}\n\nVector evidence (fallback for missing fields: ${missing.join(", ")}):\n${truncateEvidence(evidence, 600)}`;
        // Slightly bump score to reflect additional evidence
        augmented.score = Math.min((augmented.score || 0.5) + 0.05, 1.0);
        augmented.source = augmented.source === "sql" ? "hybrid" : augmented.source;
        return augmented;
      }

      return res;
    } catch (err) {
      console.warn("[augmentSqlResultsWithVectorEvidence] error augmenting result", err);
      return res;
    }
  });
}

function truncateEvidence(e, maxLen) {
  if (!e) return "";
  return e.length && e.length > maxLen ? e.slice(0, maxLen) + "..." : e;
}

/**
 * Execute Vector Search (Qdrant)
 * @param {string} query
 * @param {Object} options
 * @returns {Array} Vector search results
 */
async function executeVectorSearch(query, options) {
  const { workspaceId, topK, vectorProvider } = options;
  
  // NOTE: This will integrate with existing Qdrant search
  // For now, return placeholder - you'll connect to your existing vector search
  console.log(`[Vector Search] Searching Qdrant for: "${query}"`);
  
  // TODO: Call your existing Qdrant search function
  // Example: const results = await QdrantVectorStore.search(query, workspaceId, topK);
  
  return [];
}

/**
 * Search Price Data (Quotations)
 * Use case: "So sánh giá MT với đối thủ"
 */
async function searchPriceData(keywords) {
  console.log("[SQL Search] Searching quotations for price comparison");
  
  // Build search conditions
  const searchConditions = keywords.map(kw => ({
    OR: [
      { vendorName: { contains: kw } },
      { quotationNumber: { contains: kw } },
      { items: { some: { description: { contains: kw } } } },
    ],
  }));
  
  const quotations = await prisma.quotations.findMany({
    where: searchConditions.length > 0 ? { OR: searchConditions } : {},
    include: {
      items: true,
      rfq: {
        select: {
          rfqNumber: true,
          projectName: true,
          buyerName: true,
        },
      },
    },
    take: 10,
  });
  
  return quotations.map(q => ({
    type: "quotation",
    id: q.id,
    title: `Quotation ${q.quotationNumber} - ${q.vendorName}`,
    content: `
Vendor: ${q.vendorName} (${q.vendorType})
RFQ: ${q.rfq?.rfqNumber || "N/A"}
Project: ${q.rfq?.projectName || "N/A"}
Total Amount: ${q.currency} ${q.totalAmount.toLocaleString()}
Items: ${q.items.length}
Delivery: ${q.deliveryDays} days
Validity: ${q.validityDays} days
    `.trim(),
    metadata: {
      // Prefer an explicit documentId on the quotation, fallback to the linked RFQ's documentId
      documentId: q.documentId || (q.rfq && q.rfq.documentId) || null,
      quotationNumber: q.quotationNumber,
      vendorName: q.vendorName,
      vendorType: q.vendorType,
      totalAmount: q.totalAmount,
      currency: q.currency,
      itemCount: q.items.length,
      items: q.items.map(item => ({
        description: item.description,
        manufacturer: item.manufacturer,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
      })),
    },
    score: 0.9, // High confidence for exact SQL match
  }));
}

/**
 * Search RFQ Metadata
 * Use case: "List nội dung chính RFQ"
 */
async function searchRfqData(keywords) {
  console.log("[SQL Search] Searching RFQ metadata");
  
  const searchConditions = keywords.map(kw => ({
    OR: [
      { rfqNumber: { contains: kw } },
      { projectName: { contains: kw } },
      { buyerName: { contains: kw } },
      { packageName: { contains: kw } },
    ],
  }));
  
  const rfqs = await prisma.rfq_metadata.findMany({
    where: searchConditions.length > 0 ? { OR: searchConditions } : {},
    include: {
      quotations: {
        select: {
          quotationNumber: true,
          vendorName: true,
          totalAmount: true,
        },
      },
    },
    take: 10,
  });
  
  return rfqs.map(rfq => ({
    type: "rfq",
    id: rfq.id,
    title: `RFQ ${rfq.rfqNumber} - ${rfq.projectName}`,
    content: `
RFQ Number: ${rfq.rfqNumber}
Project: ${rfq.projectName}
Package: ${rfq.packageName}
Buyer: ${rfq.buyerName}
Submission Deadline: ${rfq.submissionDeadline ? new Date(rfq.submissionDeadline).toLocaleDateString() : "N/A"}
Delivery: ${rfq.deliverySchedule || `${rfq.deliveryWeeks} weeks`}
Location: ${rfq.deliveryLocation || "N/A"}
Bid Bond: ${rfq.bidBondRequired ? `Yes - ${rfq.bidBondValue}` : "No"}
Technical Pages: ${rfq.technicalReqPages || "N/A"}
Quotations Received: ${rfq.quotations.length}
    `.trim(),
    metadata: {
      documentId: rfq.documentId || null,
      rfqNumber: rfq.rfqNumber,
      projectName: rfq.projectName,
      buyerName: rfq.buyerName,
      submissionDeadline: rfq.submissionDeadline,
      deliveryLocation: rfq.deliveryLocation,
      bidBondRequired: rfq.bidBondRequired,
      quotationsCount: rfq.quotations.length,
    },
    score: 0.95, // Highest confidence for exact RFQ metadata
  }));
}

/**
 * Search Legal Risks
 * Use case: "Phân tích rủi ro pháp lý"
 */
async function searchLegalRisks(keywords) {
  console.log("[SQL Search] Searching legal risks");
  
  const searchConditions = keywords.map(kw => ({
    OR: [
      { riskType: { contains: kw } },
      { clauseText: { contains: kw } },
      { riskDescription: { contains: kw } },
    ],
  }));
  
  const risks = await prisma.legal_risks.findMany({
    where: searchConditions.length > 0 ? { OR: searchConditions } : {},
    orderBy: {
      riskLevel: "desc", // Critical risks first
    },
    take: 10,
  });
  
  return risks.map(risk => ({
    type: "legal_risk",
    id: risk.id,
    title: `Legal Risk: ${risk.riskType} (${risk.riskLevel.toUpperCase()})`,
    content: `
Document Type: ${risk.documentType}
Risk Type: ${risk.riskType}
Risk Level: ${risk.riskLevel.toUpperCase()}

Clause: "${risk.clauseText}"

Risk Description: ${risk.riskDescription}

Recommendation: ${risk.recommendation || "Review with legal team"}

Detection Method: ${risk.detectionMethod}
Detected: ${new Date(risk.detectedAt).toLocaleDateString()}
    `.trim(),
    metadata: {
      documentId: risk.documentId,
      riskType: risk.riskType,
      riskLevel: risk.riskLevel,
      detectionMethod: risk.detectionMethod,
    },
    score: risk.riskLevel === "critical" ? 1.0 : risk.riskLevel === "high" ? 0.9 : 0.7,
  }));
}

/**
 * Search Documents (PO, Invoice, Certificate)
 * Use case: "So sánh Invoice/Certificate vs PO"
 */
async function searchDocuments(keywords) {
  console.log("[SQL Search] Searching documents for comparison");
  
  // Search across POs, Invoices, Certificates
  const [pos, invoices, certs, discrepancies] = await Promise.all([
    prisma.purchase_orders.findMany({
      where: {
        OR: keywords.map(kw => ({
          OR: [
            { poNumber: { contains: kw } },
            { buyerName: { contains: kw } },
          ],
        })),
      },
      include: { items: true },
      take: 5,
    }),
    prisma.invoices.findMany({
      where: {
        OR: keywords.map(kw => ({
          invoiceNumber: { contains: kw },
        })),
      },
      include: { items: true, po: true },
      take: 5,
    }),
    prisma.certificates.findMany({
      where: {
        OR: keywords.map(kw => ({
          certNumber: { contains: kw },
        })),
      },
      include: { items: true, po: true },
      take: 5,
    }),
    prisma.document_discrepancies.findMany({
      where: {
        status: "open", // Show only unresolved discrepancies
      },
      orderBy: {
        severity: "desc",
      },
      take: 5,
    }),
  ]);
  
  const results = [];
  
  // Format POs
  pos.forEach(po => {
    results.push({
      type: "purchase_order",
      id: po.id,
      title: `PO ${po.poNumber} - ${po.buyerName}`,
      content: `
PO Number: ${po.poNumber}
Buyer: ${po.buyerName}
Total: ${po.currency} ${po.totalAmount.toLocaleString()}
Items: ${po.items.length}
Status: ${po.status}
      `.trim(),
      metadata: {
        documentId: po.documentId || null,
        poNumber: po.poNumber,
        buyerName: po.buyerName,
        totalAmount: po.totalAmount,
        itemCount: po.items.length,
      },
      score: 0.85,
    });
  });
  
  // Format Invoices
  invoices.forEach(inv => {
    results.push({
      type: "invoice",
      id: inv.id,
      title: `Invoice ${inv.invoiceNumber}`,
      content: `
Invoice Number: ${inv.invoiceNumber}
Date: ${new Date(inv.invoiceDate).toLocaleDateString()}
PO: ${inv.po?.poNumber || "N/A"}
Total: ${inv.currency} ${inv.totalAmount.toLocaleString()}
Tax: ${inv.taxAmount ? inv.currency + " " + inv.taxAmount.toLocaleString() : "N/A"}
      `.trim(),
      metadata: {
        documentId: inv.documentId || null,
        invoiceNumber: inv.invoiceNumber,
        poNumber: inv.po?.poNumber,
        totalAmount: inv.totalAmount,
      },
      score: 0.85,
    });
  });
  
  // Format Certificates
  certs.forEach(cert => {
    results.push({
      type: "certificate",
      id: cert.id,
      title: `Certificate ${cert.certType} - ${cert.certNumber}`,
      content: `
Certificate Type: ${cert.certType}
Number: ${cert.certNumber}
Issued By: ${cert.issuedBy}
Date: ${cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString() : "N/A"}
PO: ${cert.po?.poNumber || "N/A"}
Items: ${cert.items.length}
      `.trim(),
      metadata: {
        documentId: cert.documentId || null,
        certType: cert.certType,
        certNumber: cert.certNumber,
        issuedBy: cert.issuedBy,
      },
      score: 0.85,
    });
  });
  
  // Format Discrepancies
  discrepancies.forEach(disc => {
    results.push({
      type: "discrepancy",
      id: disc.id,
      title: `Discrepancy: ${disc.field} (${disc.severity.toUpperCase()})`,
      content: `
Comparing: ${disc.sourceType} → ${disc.targetType}
Field: ${disc.field}
Severity: ${disc.severity.toUpperCase()}
Part Number: ${disc.partNumber || "N/A"}

Expected (${disc.targetType}): ${disc.targetValue}
Actual (${disc.sourceType}): ${disc.sourceValue}
Difference: ${disc.difference || "N/A"}

Status: ${disc.status}
      `.trim(),
      metadata: {
        documentId: disc.documentId || null,
        sourceType: disc.sourceType,
        targetType: disc.targetType,
        severity: disc.severity,
        field: disc.field,
      },
      score: disc.severity === "critical" ? 1.0 : disc.severity === "high" ? 0.9 : 0.7,
    });
  });
  
  return results;
}

/**
 * Merge and Rerank Results
 * Combines SQL and Vector results with weighted scoring
 * @param {Array} sqlResults
 * @param {Array} vectorResults
 * @param {Object} classification
 * @returns {Array} Merged and sorted results
 */
function mergeAndRerank(sqlResults, vectorResults, classification) {
  // Weight scores based on query type
  const weights = {
    price: { sql: 0.7, vector: 0.3 },
    rfq: { sql: 0.8, vector: 0.2 },
    legal: { sql: 0.6, vector: 0.4 },
    compare: { sql: 0.9, vector: 0.1 },
    semantic: { sql: 0.0, vector: 1.0 },
  };
  
  const weight = weights[classification.type] || weights.semantic;
  
  // Apply weights
  const weightedSQL = sqlResults.map(r => ({
    ...r,
    finalScore: r.score * weight.sql,
    source: "sql",
  }));
  
  const weightedVector = vectorResults.map(r => ({
    ...r,
    finalScore: r.score * weight.vector,
    source: "vector",
  }));
  
  // Merge and deduplicate by documentId
  const allResults = [...weightedSQL, ...weightedVector];
  const uniqueResults = [];
  const seen = new Set();
  
  for (const result of allResults) {
    const key = result.metadata?.documentId || result.id;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueResults.push(result);
    } else {
      // If duplicate, boost score (found in both SQL and vector)
      const existing = uniqueResults.find(r => 
        (r.metadata?.documentId || r.id) === key
      );
      if (existing) {
        existing.finalScore = Math.min(existing.finalScore + result.finalScore * 0.2, 1.0);
        existing.source = "hybrid"; // Mark as found in both
      }
    }
  }
  
  // Sort by final score
  uniqueResults.sort((a, b) => b.finalScore - a.finalScore);
  
  return uniqueResults;
}

module.exports = {
  hybridSearch,
  classifyQuery,
  extractKeywords,
};
