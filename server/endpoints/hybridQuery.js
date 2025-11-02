const { reqBody } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const prisma = require("../utils/prisma");
const { getLLMProvider, getVectorDbClass } = require("../utils/helpers");

/**
 * Hybrid Query Endpoint
 * Query both PostgreSQL structured data AND Qdrant vector embeddings
 * Then use LLM to synthesize a comprehensive answer
 */
function hybridQueryEndpoints(router) {
  if (!router) return;

  // Simple test endpoint first
  router.get("/hybrid-query/test", (req, res) => {
    res.json({ status: "Hybrid Query endpoint is working!" });
  });

  router.post(
    "/hybrid-query",
    [validatedRequest],
    async (request, response) => {
      try {
        const { query, workspaceSlug = null } = reqBody(request);

        if (!query || query.trim().length === 0) {
          return response.status(400).json({
            success: false,
            error: "Query is required",
          });
        }

        console.log(`[Hybrid Query] Processing: "${query}"`);

  // Step 1: Query structured data from PostgreSQL (scoped to workspaceSlug if provided)
  const structuredData = await queryStructuredData(query, workspaceSlug);

        // Step 2: Query vector database for semantic search
        const vectorData = await queryVectorData(query, workspaceSlug);

        // Step 3: Combine results and generate LLM response
        const llmResponse = await generateLLMResponse(
          query,
          structuredData,
          vectorData
        );

        response.status(200).json({
          success: true,
          answer: llmResponse.answer,
          sources: {
            structured: structuredData,
            vector: vectorData.results,
          },
          metadata: {
            structuredCount: structuredData.count,
            vectorCount: vectorData.results.length,
            queryTime: llmResponse.queryTime,
          },
        });
      } catch (error) {
        console.error("[Hybrid Query] Error:", error);
        response.status(500).json({
          success: false,
          error: error.message,
        });
      }
    }
  );
}

/**
 * Query PostgreSQL for structured data
 * Smart query detection: searches RFQ, PO, Invoice, Certificate, Quotation based on keywords
 */
async function queryStructuredData(query, workspaceSlug = null) {
  const results = {
    rfqs: [],
    pos: [],
    invoices: [],
    certificates: [],
    quotations: [],
    count: 0,
  };

  const queryLower = query.toLowerCase();

  try {
    // If a workspaceSlug is provided, limit structured queries to documents that belong to that workspace.
    let workspaceDocIds = null;
    if (workspaceSlug) {
      try {
        const ws = await prisma.workspaces.findUnique({ where: { slug: workspaceSlug } });
        if (ws) {
          const docs = await prisma.workspace_documents.findMany({ where: { workspaceId: ws.id }, select: { docId: true } });
          workspaceDocIds = docs.map((d) => d.docId).filter(Boolean);
          // If there are no documents in the workspace, we can short-circuit and return empty results
          if (!workspaceDocIds || workspaceDocIds.length === 0) {
            return results;
          }
        }
      } catch (wsErr) {
        console.error('[Hybrid Query] workspace scope error:', wsErr.message);
        // fall through to non-scoped behavior
        workspaceDocIds = null;
      }
    }
    // Helper: build contains filters from tokens (improves recall for multi-word queries)
    const generalSearchTerm = queryLower.replace(/[^\p{L}0-9\s-]/gu, "").trim();
    const tokens = generalSearchTerm
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 3);
    const buildContainsFilters = (fields, tokenList) => {
      // Defensive coercion: tokenList may be a string, an array, or an iterable-like object.
      if (!tokenList) return [];

      let list = tokenList;
      if (typeof tokenList === "string") {
        list = tokenList
          .split(/\s+/)
          .map((t) => t.trim())
          .filter((t) => t.length >= 3);
      }

      // If it's not a plain array, try to coerce to one (handles Set, NodeList, etc.)
      if (!Array.isArray(list)) {
        try {
          list = Array.from(list).map((t) => String(t).trim()).filter((t) => t.length >= 3);
        } catch (e) {
          // Not iterable — bail out
          return [];
        }
      }

      if (!list || list.length === 0) return [];

      // Build filters without relying on flatMap (some runtimes/polyfills may not provide it)
      return list.reduce((acc, token) => {
        fields.forEach((field) => acc.push({ [field]: { contains: token, mode: "insensitive" } }));
        return acc;
      }, []);
    };
    // Detect query intent
    const isRFQQuery = /rfq|tender|bid|mời thầu|đấu thầu|submission|deadline|bid bond|hạn nộp|hạn chót/i.test(query);
    const isPOQuery = /po|purchase order|hợp đồng|warranty|penalty|đơn mua|đơn đặt hàng/i.test(query);
    const isInvoiceQuery = /invoice|hóa đơn|payment|thanh toán|thanh toán/i.test(query);
    const isCertificateQuery = /certificate|cert|coo|coc|chứng từ|chứng nhận/i.test(query);
    const isQuotationQuery = /quotation|quote|báo giá|chào giá|giá|so sánh giá|đối thủ|proposal|delivery|warranty/i.test(query);

    // Query RFQs
    if (isRFQQuery || queryLower.includes("buyer") || queryLower.includes("deadline")) {
      const rfqFilters = [];
      const rfqNumber = extractRFQNumber(query);
      if (rfqNumber) rfqFilters.push({ rfqNumber: { contains: rfqNumber, mode: "insensitive" } });
  // use tokenized terms (tokens) so buildContainsFilters receives an array
  rfqFilters.push(...buildContainsFilters(["buyerName", "packageName"], tokens));
      let rfqWhere = rfqFilters.length > 0 ? { OR: rfqFilters } : {};
      if (workspaceDocIds) {
        rfqWhere = rfqWhere && Object.keys(rfqWhere).length ? { AND: [rfqWhere, { documentId: { in: workspaceDocIds } }] } : { documentId: { in: workspaceDocIds } };
      }
      results.rfqs = await prisma.rfq_metadata.findMany({ where: rfqWhere, take: 5, orderBy: { updatedAt: "desc" } });
      results.count += results.rfqs.length;
    }

    // Query POs
    if (isPOQuery) {
      const poFilters = [];
      const poNumber = extractPONumber(query);
      if (poNumber) poFilters.push({ poNumber: { contains: poNumber, mode: "insensitive" } });
  // use tokenized terms (tokens) so buildContainsFilters receives an array
  poFilters.push(...buildContainsFilters(["buyerName", "vendorName"], tokens));
      let poWhere = poFilters.length > 0 ? { OR: poFilters } : {};
      if (workspaceDocIds) {
        poWhere = poWhere && Object.keys(poWhere).length ? { AND: [poWhere, { documentId: { in: workspaceDocIds } }] } : { documentId: { in: workspaceDocIds } };
      }
      results.pos = await prisma.purchase_orders.findMany({ where: poWhere, take: 5, orderBy: { updatedAt: "desc" } });
      results.count += results.pos.length;
    }

    // Query Invoices
    if (isInvoiceQuery) {
      console.log("[Hybrid Query] Invoice query: fetching recent invoices");
      // invoices model has relation field `po` referencing purchase_orders
      // Scope invoices to workspace documents when possible
      const invoiceWhere = workspaceDocIds ? { documentId: { in: workspaceDocIds } } : {};
      results.invoices = await prisma.invoices.findMany({
        where: invoiceWhere,
        include: {
          po: {
            select: {
              poNumber: true,
              buyerName: true,
              vendorName: true,
            },
          },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      });
      results.count += results.invoices.length;
    }

    // Query Certificates
    if (isCertificateQuery) {
      console.log("[Hybrid Query] Certificate query: fetching recent certificates");
      // certificates model has relation field `po` referencing purchase_orders
      const certWhere = workspaceDocIds ? { documentId: { in: workspaceDocIds } } : {};
      results.certificates = await prisma.certificates.findMany({
        where: certWhere,
        include: {
          po: {
            select: {
              poNumber: true,
              vendorName: true,
            },
          },
        },
        take: 5,
        orderBy: { createdAt: "desc" },
      });
      results.count += results.certificates.length;
    }

    // Query Quotations
    if (isQuotationQuery) {
      // Avoid joining unknown relation names; fetch core quotation fields only
      console.log("[Hybrid Query] Quotation query: fetching recent quotations");
      let quotWhere = {};
      if (workspaceDocIds) quotWhere = { documentId: { in: workspaceDocIds } };
      results.quotations = await prisma.quotations.findMany({ where: quotWhere, take: 5, orderBy: { updatedAt: "desc" } });
      results.count += results.quotations.length;
    }

    // If no specific query type detected, return recent data
    if (results.count === 0) {
      // If workspace-scoped, return recent data only from that workspace
      if (workspaceDocIds) {
        results.rfqs = await prisma.rfq_metadata.findMany({ where: { documentId: { in: workspaceDocIds } }, take: 2, orderBy: { updatedAt: "desc" } });
        results.pos = await prisma.purchase_orders.findMany({ where: { documentId: { in: workspaceDocIds } }, take: 2, orderBy: { updatedAt: "desc" } });
      } else {
        results.rfqs = await prisma.rfq_metadata.findMany({ take: 2, orderBy: { updatedAt: "desc" } });
        results.pos = await prisma.purchase_orders.findMany({ take: 2, orderBy: { updatedAt: "desc" } });
      }
      results.count = results.rfqs.length + results.pos.length;
    }

    return results;
  } catch (error) {
    console.error("[Hybrid Query] DB query error:", error);
    return results;
  }
}

/**
 * Query Qdrant vector database for semantic search
 */
async function queryVectorData(query, workspaceSlug) {
  try {
    const VectorClassOrInstance = getVectorDbClass();
    const vectorDb = typeof VectorClassOrInstance === "function" ? new VectorClassOrInstance() : VectorClassOrInstance;

    // If workspace specified, search in that namespace
    const namespace = workspaceSlug || "mte4"; // Default workspace

    const topN = 5;
    const llmConnector = getLLMProvider();
    // Prefer provider.performSimilaritySearch which handles embedding + filtering
    if (typeof vectorDb.performSimilaritySearch === "function") {
      const res = await vectorDb.performSimilaritySearch({
        namespace,
        input: query,
        LLMConnector: llmConnector,
        topN,
        similarityThreshold: 0.25,
      });
      return {
        results: res.sources || [],
        namespace,
      };
    }

    // Fallback: some providers expose similarityResponse(client, { ... })
    if (typeof vectorDb.similarityResponse === "function") {
      // attempt to connect and call similarityResponse
      const { client } = await vectorDb.connect();
      const queryVector = await llmConnector.embedTextInput(query);
      const res = await vectorDb.similarityResponse({
        client,
        namespace,
        queryVector,
        topN,
        similarityThreshold: 0.25,
      });
      return {
        results: (res && res.sourceDocuments ? res.sourceDocuments.map((d, i) => ({ ...d, text: res.contextTexts[i] })) : []),
        namespace,
      };
    }

    // If provider doesn't support expected methods, return empty
    console.error("[Hybrid Query] Vector provider missing search methods");
    return { results: [], namespace };

    return {
      results: searchResults || [],
      namespace,
    };
  } catch (error) {
    console.error("[Hybrid Query] Vector query error:", error);
    return {
      results: [],
      namespace: null,
    };
  }
}

/**
 * Generate LLM response combining structured + vector data
 */
async function generateLLMResponse(query, structuredData, vectorData) {
  const startTime = Date.now();

  try {
    const llm = getLLMProvider();

    // Build context from structured data
    let structuredContext = buildStructuredContext(structuredData);

    // Build context from vector data
    let vectorContext = buildVectorContext(vectorData.results);

    // Create comprehensive prompt
  const prompt = `You are a procurement assistant analyzing both structured database records and document content.

USER QUESTION: ${query}

STRUCTURED DATA FROM DATABASE:
${structuredContext}

DOCUMENT CONTENT FROM VECTOR SEARCH:
${vectorContext}

INSTRUCTIONS:
1. Use STRUCTURED DATABASE VALUES as the authoritative source for numeric or date fields (e.g., delivery days, warranty months, total amounts). If a structured record provides a value, prefer it over any paraphrased value found in document text.
2. If structured data for a field is MISSING, search the DOCUMENT CONTENT (vector results) for explicit numeric phrases (e.g., "150 days", "18 months", "12 months"). If an exact numeric value appears in document text, you may use it but you MUST label it as coming from the document (for example: "Delivery: 150 days (from document 'Gia doi thu...pdf')").
3. If multiple structured records give differing numeric/date values, list them and explain differences. For warranty specifically: if any quotation mentions both an "18 months" option and a "12 months" option (or is phrased as "18 months or 12 months, whichever comes earlier"), present the warranty exactly as: "18 months from delivery OR 12 months after commissioning, whichever comes earlier." Do NOT assume other interpretations.
4. For delivery time/days, prefer the exact number from structured data; when structured lacks the value, use the document-extracted number with an explicit source label.
5. Cite specific data points (numbers, dates, names) from structured data and then reference document excerpts for supporting details. If you use values from documents, clearly mark them as document-sourced.
6. If structured data is missing for an item (e.g., competitor vendor), clearly state which data is missing and whether any document text suggests a value.
7. Format your answer with short sections and a clear conclusion. Use Vietnamese if the question is in Vietnamese, English otherwise.

YOUR ANSWER:`;

    const response = await llm.getChatCompletion(
      [
        {
          role: "system",
      content:
        "You are a helpful procurement assistant with access to both structured database records and full document text. IMPORTANT: treat structured database numeric/date fields as authoritative. When warranty or delivery fields appear in structured data, use those values and apply the warranty interpretation rule: '18 months from delivery OR 12 months after commissioning, whichever comes earlier' when both options are present.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      {
        temperature: 0.3, // Low temperature for factual answers
      }
    );

    return {
      answer: response.textResponse || "No response generated",
      queryTime: Date.now() - startTime,
    };
  } catch (error) {
    console.error("[Hybrid Query] LLM error:", error);
    return {
      answer: `Error generating response: ${error.message}`,
      queryTime: Date.now() - startTime,
    };
  }
}

// Post-process LLM answer to prefer structured DB warranty values when available
async function postProcessLLMAnswer(rawAnswer, structuredData) {
  try {
    const warrantyVals = Array.from(new Set((structuredData.quotations || []).map(q => q.warrantyMonths).filter(Boolean)));
    if (warrantyVals.length === 0) return rawAnswer;

    // Find any month numbers in the LLM answer
    const monthMatches = rawAnswer.match(/(\d{1,3})\s*months?/i);
    if (!monthMatches) return rawAnswer;

    const mentioned = parseInt(monthMatches[1]);
    if (warrantyVals.includes(mentioned)) return rawAnswer; // matches DB, fine

    // Build authoritative note
    const note = `\n\nNOTE: Structured database records list warranty months for quotations as: ${warrantyVals.join(", ")} month(s). Use these structured values as authoritative.`;

    return rawAnswer + note;
  } catch (e) {
    console.error('[Hybrid Query] postProcessLLMAnswer error:', e.message);
    return rawAnswer;
  }
}

/**
 * Build context string from structured data
 */
function buildStructuredContext(data) {
  let context = "";

  if (data.rfqs.length > 0) {
    context += "RFQ RECORDS:\n";
    data.rfqs.forEach((rfq, i) => {
      context += `${i + 1}. RFQ ${rfq.rfqNumber}\n`;
      context += `   - Buyer: ${rfq.buyerName}\n`;
      context += `   - Package: ${rfq.packageName || "N/A"}\n`;
      context += `   - Submission Deadline: ${rfq.submissionDeadline || "N/A"}\n`;
      context += `   - Delivery Weeks: ${rfq.deliveryWeeks || "N/A"}\n`;
      context += `   - Bid Bond Required: ${rfq.bidBondRequired ? "Yes" : "No"}\n`;
      context += `   - Bid Bond %: ${rfq.bidBondPercentage || "N/A"}%\n`;
      context += `   - Technical Req Pages: ${rfq.technicalReqPages || "N/A"}\n\n`;
    });
  }

  if (data.pos.length > 0) {
    context += "PURCHASE ORDER RECORDS:\n";
    data.pos.forEach((po, i) => {
      context += `${i + 1}. PO ${po.poNumber}\n`;
      context += `   - Buyer: ${po.buyerName}\n`;
      context += `   - Vendor: ${po.vendorName}\n`;
      context += `   - Total Amount: ${po.totalAmount} ${po.currency}\n`;
      context += `   - PO Date: ${po.poDate}\n`;
      context += `   - Delivery Days: ${po.deliveryDays || "N/A"}\n`;
      context += `   - Warranty Terms: ${po.warrantyTerms || "N/A"}\n`;
      context += `   - Penalty Clauses: ${po.penaltyClauses || "N/A"}\n\n`;
    });
  }

  if (data.invoices.length > 0) {
    context += "INVOICE RECORDS:\n";
    data.invoices.forEach((inv, i) => {
      context += `${i + 1}. Invoice ${inv.invoiceNumber}\n`;
      context += `   - Total: ${inv.totalAmount} ${inv.currency}\n`;
      context += `   - Date: ${inv.invoiceDate}\n`;
      // invoices relation to purchase_orders is named `po` in the Prisma schema
      context += `   - Linked PO: ${inv.po?.poNumber || "N/A"}\n\n`;
    });
  }

  if (data.quotations.length > 0) {
    context += "QUOTATION RECORDS:\n";
    data.quotations.forEach((quot, i) => {
      context += `${i + 1}. Quotation ${quot.quotationNumber}\n`;
      context += `   - Vendor: ${quot.vendorName}\n`;
      context += `   - Total Amount: ${quot.totalAmount} ${quot.currency}\n`;
      context += `   - Validity: ${quot.validityDays} days\n`;
      context += `   - Delivery Days: ${quot.deliveryDays || "N/A"}\n`;
      context += `   - Warranty Months: ${quot.warrantyMonths || "N/A"}\n`;
  // quotations relation to rfq_metadata is named `rfq` in the Prisma schema
  context += `   - Linked RFQ: ${quot.rfq?.rfqNumber || "N/A"}\n\n`;
    });
    // Add a brief summary note if multiple delivery/warranty values exist
    try {
      const deliveryVals = Array.from(new Set(data.quotations.map((q) => q.deliveryDays).filter(Boolean)));
      const warrantyVals = Array.from(new Set(data.quotations.map((q) => q.warrantyMonths).filter(Boolean)));
      if (deliveryVals.length > 0) {
        context += `NOTE: Delivery days found in quotations: ${deliveryVals.join(", ")} (use structured values as authoritative)\n`;
      }
      if (warrantyVals.length > 0) {
        context += `NOTE: Warranty months found in quotations: ${warrantyVals.join(", ")}. `;
        if (warrantyVals.includes(18) && warrantyVals.includes(12)) {
          context += `Interpreted rule when both 18 and 12 present: 18 months from delivery OR 12 months after commissioning, whichever comes earlier.\n`;
        } else {
          context += `Use the structured value(s) as listed.\n`;
        }
      }
      context += "\n";
    } catch (e) {
      // ignore summary errors
    }
  }

  if (data.certificates.length > 0) {
    context += "CERTIFICATE RECORDS:\n";
    data.certificates.forEach((cert, i) => {
      context += `${i + 1}. Certificate ${cert.certNumber}\n`;
      context += `   - Type: ${cert.certType}\n`;
      context += `   - Issued By: ${cert.issuedBy}\n`;
      context += `   - Issue Date: ${cert.issuedDate}\n\n`;
    });
  }

  return context || "No structured data found matching the query.";
}

/**
 * Build context string from vector search results
 */
function buildVectorContext(results) {
  if (!results || results.length === 0) {
    return "No relevant document content found.";
  }

  let context = "";
  results.forEach((result, i) => {
    context += `DOCUMENT ${i + 1}: ${result.metadata?.title || "Unknown"}\n`;
    context += `Content: ${result.text?.substring(0, 500)}...\n\n`;
  });

  return context;
}

/**
 * Extract RFQ number from query
 */
function extractRFQNumber(query) {
  const match = query.match(/(?:rfq|tender|itb)[\s#:.-]*([a-z0-9-]+)/i);
  return match ? match[1] : null;
}

/**
 * Extract PO number from query
 */
function extractPONumber(query) {
  const match = query.match(/(?:po|purchase\s*order)[\s#:.-]*([a-z0-9-]+)/i);
  return match ? match[1] : null;
}

module.exports = { 
  hybridQueryEndpoints,
  queryStructuredData,
  buildStructuredContext,
  queryVectorData,
  generateLLMResponse
};
