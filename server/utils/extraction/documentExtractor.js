const { PrismaClient } = require("@prisma/client");
const fs = require("fs").promises;
const path = require("path");
const prisma = new PrismaClient();
const { extractWithLLM } = require("./llmExtractor");

/**
 * PDF DATA EXTRACTOR
 * Uses LLM for intelligent extraction with regex fallback
 */

/**
 * Extract structured data from processed document JSON
 * @param {string} documentId - Document ID from workspace_documents
 * @param {string} jsonFilePath - Path to processed JSON file
 * @returns {Object} Extracted data
 */
async function extractDocumentData(documentId, jsonFilePath) {
  try {
    console.log(`[Extractor] Processing document: ${documentId}`);
    
    // Read processed JSON
    const jsonContent = await fs.readFile(jsonFilePath, "utf-8");
    const document = JSON.parse(jsonContent);
    
    // Try LLM to detect document type AND extract (smart approach)
    try {
      console.log(`[Extractor] Using LLM to detect document type and extract data`);
      
      // Use LLM to detect type first
      const { pageContent, title } = document;
  const detectionPrompt = `Analyze this document and identify its type. Return ONLY one word: rfq, po, quotation, invoice, or certificate.

Hint: this workspace contains Vietnamese documents. If you see Vietnamese keywords like "báo giá", "giá chào", "giá đối thủ", "báo\s*giá" or English phrases like "Letter of Bid", "Letter of Offer", return 'quotation'. If you see "Purchase Order", "PO", "Lệnh mua", return 'po'. If you see "Request for Quotation", "RFQ", "Invitation to Bid", return 'rfq'.

Document Title: ${title}
Document Content (first 500 chars): ${pageContent.substring(0, 500)}

Return ONLY the document type (one word):`;
      
      const { extractWithLLM } = require("./llmExtractor");
      const { getLLMProvider } = require("../helpers");
      const llm = getLLMProvider();
      
      if (llm) {
        const response = await llm.getChatCompletion(
          [
            { role: "system", content: "You are a document classifier. Return only the document type: rfq, po, quotation, invoice, or certificate." },
            { role: "user", content: detectionPrompt }
          ],
          { temperature: 0.1 }
        );
        
        // Sanitize LLM answer and take the first token (model may return extra text)
        let detectedType = response?.textResponse?.trim().toLowerCase() || "unknown";
        detectedType = String(detectedType).split(/\s|[:;,\-]/)[0];
        console.log(`[Extractor] LLM detected type: ${detectedType}`);

        // Reconcile with local heuristic detection to avoid LLM mislabel on short excerpts
        try {
          const heuristic = detectDocumentType(document) || 'unknown';
          console.log(`[Extractor] Heuristic detection: ${heuristic}`);
          if ((heuristic === 'quotation' || heuristic === 'po') && detectedType === 'rfq') {
            console.log(`[Extractor] Overriding LLM detected '${detectedType}' -> '${heuristic}' based on heuristic`);
            detectedType = heuristic;
          }
        } catch (e) {
          console.warn('[Extractor] Heuristic reconciliation failed:', e.message);
        }

        // Now extract with LLM (best-effort). Avoid calling LLM on very large documents to prevent context overflow.
        try {
          const MAX_LLM_CHARS = parseInt(process.env.MAX_LLM_CHARS || '15000', 10);
          const MAX_LLM_TOKENS = parseInt(process.env.MAX_LLM_TOKENS || '3000', 10);
          const content = document.pageContent || '';
          const contentLen = content.length || 0;
          // Use project's tokenizer if available to estimate tokens more accurately
          let tokenCount = null;
          try {
            // tokenizer lives in collector/utils/tokenizer
            // require dynamically to avoid startup ordering issues
            const { tokenizeString } = require("../../../../collector/utils/tokenizer");
            tokenCount = tokenizeString(content);
          } catch (e) {
            // fallback heuristic: estimate tokens as chars / 4
            tokenCount = Math.ceil(contentLen / 4);
          }

          if (contentLen > MAX_LLM_CHARS || tokenCount > MAX_LLM_TOKENS) {
            console.warn(`[Extractor] Skipping LLM extraction because document is too large (${contentLen} chars, ~${tokenCount} tokens) > limits (chars:${MAX_LLM_CHARS}, tokens:${MAX_LLM_TOKENS}). Falling back to deterministic extractor.`);
          } else {
            const llmResult = await extractWithLLM(documentId, document, detectedType);
            if (llmResult) {
              console.log(`[Extractor] ✅ LLM extraction successful`);
              return llmResult;
            }
            // If LLM extractor returned null (e.g., internal error or model refusal), fallback deterministically
          }
          console.warn('[Extractor] LLM extraction returned null — falling back to deterministic extractor');
          const docType = detectDocumentType(document);
          switch (docType) {
            case 'quotation':
              return await extractQuotationData(documentId, document);
            case 'po':
              return await extractPOData(documentId, document);
            case 'rfq':
              return await extractRfqData(documentId, document);
            case 'invoice':
              return await extractInvoiceData(documentId, document);
            case 'certificate':
              return await extractCertificateData(documentId, document);
            case 'contract':
              return await extractContractData(documentId, document);
            default:
              console.log(`[Extractor] Unknown type from heuristic: ${docType}, skipping deterministic extraction`);
              return null;
          }
        } catch (e) {
          console.warn('[Extractor] LLM extraction threw, will fallback to deterministic extractor:', e.message);
        }
      }
    } catch (llmError) {
      console.error(`[Extractor] ❌ LLM detection/extraction failed:`, llmError.message);
      console.error(`[Extractor] Stack trace:`, llmError.stack);
      // Fallback: use deterministic regex-based extraction based on local detection
      try {
        const docType = detectDocumentType(document);
        console.log(`[Extractor] Falling back to deterministic extractor for type: ${docType}`);
        switch (docType) {
          case 'quotation':
            return await extractQuotationData(documentId, document);
          case 'po':
            return await extractPOData(documentId, document);
          case 'rfq':
            return await extractRfqData(documentId, document);
          case 'invoice':
            return await extractInvoiceData(documentId, document);
          case 'certificate':
            return await extractCertificateData(documentId, document);
          case 'contract':
            return await extractContractData(documentId, document);
          default:
            console.log(`[Extractor] Unknown type: ${docType}, skipping structured extraction`);
            return null;
        }
      } catch (fallbackError) {
        console.error('[Extractor] Deterministic fallback also failed:', fallbackError.message);
        return null;
      }
    }
    
    // REMOVED: Regex fallback - We use LLM-only extraction now
    // If you need regex fallback, uncomment the switch statement below
    
    /*
    const docType = detectDocumentType(document);
    console.log(`[Extractor] Regex detected type: ${docType}`);
    console.log(`[Extractor] Using regex fallback for ${docType}`);
    
    switch (docType) {
      case "rfq":
      case "itb":
        return await extractRfqData(documentId, document);
      case "quotation":
      case "bid":
        return await extractQuotationData(documentId, document);
      case "po":
        return await extractPOData(documentId, document);
      case "invoice":
        return await extractInvoiceData(documentId, document);
      case "certificate":
        return await extractCertificateData(documentId, document);
      case "contract":
        return await extractContractData(documentId, document);
      default:
        console.log(`[Extractor] Unknown type: ${docType}, skipping structured extraction`);
        return null;
    }
    */
  } catch (error) {
    console.error(`[Extractor] Error processing ${documentId}:`, error);
    throw error;
  }
}

/**
 * Detect document type from content
 * @param {Object} document
 * @returns {string} Document type
 */
function detectDocumentType(document) {
  const { title, pageContent, metadata } = document;
  const fullText = (title + " " + (pageContent || "")).toLowerCase();
  
  // PO patterns - CHECK FIRST (more specific)
  if (
    /purchase\s+order|p\.?o\.?\s*(?:no|number|#)?\s*[:.]?\s*\d|signed\s+po|po\s+\d{6}/i.test(fullText) ||
    /mcpec\.po\.|lệnh\s*mua\s*hàng/i.test(fullText) ||
    title.toLowerCase().includes('po ') ||
    title.toLowerCase().includes('signed po')
  ) {
    return "po";
  }
  // Quotation/Bid patterns (check BEFORE invoice to avoid false positives when 'invoice' appears in text)
  if (
    /letter\s+of\s+bid|summary\s+of\s+bidding\s+price|quotation|giá\s*chào|báo\s*giá|letter\s+of\s+offer|letter\s+of\s+quotation|bid\s+proposal/i.test(fullText) ||
    /form\s*2a|form\s*10a|form\s*11|bidding\s*price/i.test(fullText) ||
    title.toLowerCase().includes('gia mt chao') || /summary of bidding price/i.test(fullText)
  ) {
    return "quotation";
  }

  // Invoice patterns (less aggressive)
  if (
    /\binvoice\b/i.test(fullText) || /hóa\s*đơn/i.test(fullText)
  ) {
    return "invoice";
  }
  
  // RFQ/ITB patterns - check AFTER quotation
  if (
    /rfq|request\s+for\s+quotation|invitation\s+to\s+bid|itb/i.test(fullText) ||
    /hồ\s*sơ\s*thầu|hsmt|đấu\s*thầu/i.test(fullText)
  ) {
    return "rfq";
  }
  
  // Contract patterns
  if (
    /contract|agreement|hợp\s*đồng/i.test(fullText)
  ) {
    return "contract";
  }
  
  return "unknown";
}

/**
 * Extract RFQ metadata
 */
async function extractRfqData(documentId, document) {
  const { pageContent, title, metadata } = document;
  const fullText = pageContent || "";
  
  // RFQ may be referenced in multiple ways. Try several patterns (RFQ/ITB, Ref. No., Bidding Package No.)
  let rfqNumber = null;
  const rfqPatterns = [
    /(?:RFQ|ITB)\s*(?:No\.?|Number)?\s*:?\s*([A-Z0-9\-\/]+)/i,
    /Ref\.\s*No\.\s*[:\.]?\s*([A-Z0-9\-\/]+)/i,
    /Ref\.?\s*No\.?\s*[:\.]?\s*([A-Z0-9\-\/]+)/i,
    /Bidding\s+Package\s+No\.?\s*[:\.]?\s*([A-Z0-9\-\/]+)/i,
    /Bidding\s+Package\s+No\.?\s*[:\.]?\s*(WI[-A-Z0-9\/]+)/i,
  ];
  for (const p of rfqPatterns) {
    const m = fullText.match(p);
    if (m && m[1]) {
      rfqNumber = m[1].trim();
      break;
    }
  }
  
  // Extract project name
  const projectMatch = fullText.match(/(?:PROJECT|Project)\s*:?\s*([^\n]+)/i);
  const projectName = projectMatch ? projectMatch[1].trim() : null;
  
  // Extract package/scope
  const packageMatch = fullText.match(/(?:Package|Scope)\s*:?\s*([^\n]+)/i);
  const packageName = packageMatch ? packageMatch[1].trim() : null;
  
  // Extract buyer info - improved pattern
  const buyerPatterns = [
    /(?:Buyer|Purchaser|Company)\s*Name\s*:?\s*([A-Z][A-Za-z\s&\.,\-]{5,60}?)(?:\n|\.|\||$)/i,
    /(?:Client|Owner)\s*:?\s*([A-Z][A-Za-z\s&\.,\-]{5,60}?)(?:\n|\.|\||$)/i,
    /(?:Issued\s+by|From)\s*:?\s*([A-Z][A-Za-z\s&\.,\-]{5,60}?)(?:\n|\.|\||$)/i,
  ];
  
  let buyerName = null;
  for (const pattern of buyerPatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      // Filter out common false positives
      if (!name.match(/\bis\snot\b|being|prosecuted|criminal|liability|herein|unless/i)) {
        buyerName = name;
        break;
      }
    }
  }
  
  // Extract deadline
  const deadlineMatch = fullText.match(/(?:deadline|due\s+date|closing\s+date)\s*:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i);
  const submissionDeadline = deadlineMatch ? parseDate(deadlineMatch[1]) : null;
  
  // Look for phrases like "Delivery time:150 calendar days" (no space), "Delivery time: 150 calendar days" and generic "150 calendar days"
  let deliverySchedule = null;
  let deliveryWeeks = null;
  const deliveryPatterns = [
    /Delivery\s*time\s*[:\-]?\s*(\d{1,4})\s*(?:calendar\s+)?days/i,
    /Delivery\s*[:\-]?\s*(\d{1,4})\s*(?:calendar\s+)?days/i,
    /(\d{1,4})\s*(?:calendar\s+)?days/i,
  ];
  for (const p of deliveryPatterns) {
    const m = fullText.match(p);
    if (m && m[1]) {
      const days = parseInt(m[1]);
      if (!isNaN(days) && days > 0) {
        deliverySchedule = `${days} calendar days`;
        deliveryWeeks = Math.ceil(days / 7);
        break;
      }
    }
  }
  
  // Extract delivery location
  const locationMatch = fullText.match(/(?:deliver|delivery)\s+(?:to|at)\s+([^\n,]+)/i);
  const deliveryLocation = locationMatch ? locationMatch[1].trim() : null;
  
  // Extract bid bond info
  const bidBondMatch = fullText.match(/bid\s+bond|bảo\s*lãnh\s*dự\s*thầu/i);
  const bidBondRequired = !!bidBondMatch;
  const bidBondPercentageMatch = fullText.match(/(\d+\.?\d*)\s*%/);
  const bidBondPercentage = bidBondPercentageMatch ? parseFloat(bidBondPercentageMatch[1]) : null;
  
  // Save to database
  const rfqData = await prisma.rfq_metadata.upsert({
    where: { documentId },
    update: {
      rfqNumber,
      projectName,
      packageName,
      buyerName,
      submissionDeadline,
      deliverySchedule,
      deliveryWeeks,
      deliveryLocation,
      bidBondRequired,
      bidBondPercentage,
      sourceFolder: metadata?.sourceFolder || extractSourceFolder(title),
      updatedAt: new Date(),
    },
    create: {
      documentId,
      rfqNumber,
      projectName,
      packageName,
      buyerName,
      submissionDeadline,
      deliverySchedule,
      deliveryWeeks,
      deliveryLocation,
      bidBondRequired,
      bidBondPercentage,
      sourceFolder: metadata?.sourceFolder || extractSourceFolder(title),
    },
  });
  
  console.log(`[Extractor] RFQ data saved: ${rfqData.id}`);
  return rfqData;
}

/**
 * Extract quotation data
 */
async function extractQuotationData(documentId, document) {
  const { pageContent, title, metadata } = document;
  const fullText = pageContent || "";
  // Prefer the original uploaded filename when available, otherwise fall back to title or documentId
  const sourceFilePath = (metadata && metadata.originalFileName) ? metadata.originalFileName : (title || documentId);
  
  // Extract quotation number — STRICT: only accept if the text explicitly mentions 'Quotation' or 'Quote'
  // e.g. 'Quotation No: Q-12345' or 'Quote No: Q-12345'
  let quotationNumber = null;
  // Prefer explicit ITB / Bid Invitation / Bid invitation Letter No / Bidding Package identifiers
  try {
    const itbPattern = /(?:ITB\s*No\.?|Bid\s+Invitation(?:\s+Letter)?\s*No\.?|Bid\s+invitation\s+Letter\s+No\.|Bid\s+Invitation\s+No\.?|Bid\s+invitation\s+No\.?|Bidding\s+Package\s+No\.?|Bid\s+Invitation)\s*[:\-\.]?\s*([A-Z0-9\-\/]+)/i;
    const itbMatch = fullText.match(itbPattern);
    if (itbMatch && itbMatch[1]) {
      quotationNumber = itbMatch[1].trim();
    }
  } catch (e) {
    // ignore
  }
  const strictQuotPatterns = [
    /(?:Quotation|Quote)\b\s*(?:No\.?|Number)?\s*[:\-]?\s*([A-Z0-9\-\/]+)/i,
    /(?:Quotation|Quote)\b\s*[:\-]\s*([A-Z0-9\-\/]+)/i,
  ];
  for (const p of strictQuotPatterns) {
    const m = fullText.match(p);
    if (m && m[1]) {
      quotationNumber = m[1].trim();
      break;
    }
  }
  // Note: we DO NOT fallback to picking arbitrary 'No.' occurrences (like Bidding Package No.)
  // If no explicit quotation/quote token is present, leave quotationNumber = null and persist by documentId instead.
  // However, capture 'Bidding Package No' (common in procurement docs) as a candidate and use its full
  // value (including slashes) as quotationNumber when no explicit quotation number is found.
  let biddingPackageNumber = null;
  // If we already captured an ITB/Invitation above, prefer it over biddingPackageNumber candidates
  if (!quotationNumber) {
    try {
      // Also accept common 'Ref' patterns used by MT docs: 'Ref: 250136-MTCO ORIGINAL' or 'MT Ref: 250136-MTCO'
      const itbFallback = fullText.match(/(?:Bidding\s+Package\s+No\.?|Bid\s+Invitation\s+No\.?|ITB\s*No\.?)\s*[:\-\.]?\s*([A-Z0-9\-\/]+)/i);
      if (itbFallback && itbFallback[1]) quotationNumber = itbFallback[1].trim();
    } catch (e) {}
  }
  try {
    // Also accept common 'Ref' patterns used by MT docs: 'Ref: 250136-MTCO ORIGINAL' or 'MT Ref: 250136-MTCO'
    if (!biddingPackageNumber) {
      const refMatch = fullText.match(/(?:Ref\.?|MT\s*Ref)[:\.]?\s*([A-Z0-9\-\s_\/]+)(?:\s|\n|$)/i);
      if (refMatch && refMatch[1]) {
        // take first token-like part (strip trailing words like 'ORIGINAL')
        biddingPackageNumber = String(refMatch[1]).trim().split(/\s+/)[0];
      }
    }
    const bpMatch = fullText.match(/Bidding\s+Package\s+No\.?\s*[:\.]?\s*([A-Z0-9\-\/]+)/i);
    if (bpMatch && bpMatch[1]) biddingPackageNumber = bpMatch[1].trim();
    else {
      // also accept a looser label 'Bidding Package' followed by 'No' on same line
      const bpMatch2 = fullText.match(/Bidding\s+Package\s*[:\-]\s*([A-Z0-9\-\/]+)/i);
      if (bpMatch2 && bpMatch2[1]) biddingPackageNumber = bpMatch2[1].trim();
    }
  } catch (e) {
    biddingPackageNumber = null;
  }

  if (!quotationNumber && biddingPackageNumber) {
    // Use biddingPackageNumber as the document's quotationNumber when no explicit 'Quotation' existed
    quotationNumber = biddingPackageNumber;
  }

  // If still no quotationNumber, try to extract from filename (common pattern for these docs)
  if (!quotationNumber && sourceFilePath) {
    try {
      const fromFile = extractQuotationNumberFromFilename(sourceFilePath || '');
      if (fromFile) quotationNumber = fromFile;
    } catch (e) {
      // ignore
    }
  }

  // Additional fallback: look for ITB/VT/WI or MT Ref patterns commonly used as package identifiers
  if (!quotationNumber) {
    const itbMatch = fullText.match(/(?:ITB\s*No\.?|Bid\s+Invitation\s+No\.?|Bid\s+Invitation)\s*[:\-]?\s*([A-Z0-9\-\/]+)/i);
    if (itbMatch && itbMatch[1]) quotationNumber = itbMatch[1].trim();
  }
  if (!quotationNumber) {
    const mtRef = fullText.match(/MT\s*Ref\.?\s*[:\-]?\s*([A-Z0-9\-\/]+)/i);
    if (mtRef && mtRef[1]) quotationNumber = mtRef[1].trim();
  }
  if (!quotationNumber) {
    const refMatch = fullText.match(/Ref\.?\s*[:\-]?\s*([A-Z0-9\-\/]+)/i);
    if (refMatch && refMatch[1]) quotationNumber = refMatch[1].trim();
  }

  // If there's already a saved quotation for this documentId, and it contains a truncated
  // quotationNumber (e.g., 'WI-1609'), prefer updating it to the full biddingPackageNumber
  // when available.
  if (biddingPackageNumber) {
    try {
      const existingByDoc = await prisma.quotations.findFirst({ where: { documentId } });
      if (existingByDoc) {
        const existingQN = existingByDoc.quotationNumber || null;
        if (existingQN && existingQN !== biddingPackageNumber) {
          // Update the existing row to store the full biddingPackageNumber
          await prisma.quotations.update({
            where: { id: existingByDoc.id },
            data: { quotationNumber: biddingPackageNumber, updatedAt: new Date() },
          });
          // also set local variable so subsequent upsert refers to new value
          quotationNumber = biddingPackageNumber;
        }
      }
    } catch (e) {
      console.warn('[Extractor] Failed to update existing quotationNumber with biddingPackageNumber:', e.message);
    }
  }
  
  // Extract vendor info using multiple patterns and robust sanitization
  const vendorPatterns = [
    // Prefer explicit 'Bidder' field when present (MT docs use 'Bidder: MT Corp')
    /(?:Bidder)\s*[:\-]?\s*([^,\n]{3,120})/i,
    /(?:Vendor|Bidder|Company)\s*:?\s*([^\n]{3,120})/i,
    /(?:Vendor|Bidder|Company)\s*-\s*([^\n]{3,120})/i,
    /(?:From|Issued\s+by)\s*:?\s*([^\n]{3,120})/i,
    // Common company suffixes
    /([A-Z][A-Za-z0-9&\.,\-\s]{3,120}?(?:LTD|LTD\.|PTE|PTE\.|CO\.|CO|INC|CORP|COMPANY|JSC|LLC|CÔNG\s*TỈNH|CÔ\s*PHẦN|CTY))/i,
  ];

  // Blacklist words that indicate this capture is actually an address or contact block
  const contactBlacklist = /\b(address|địa\s+chỉ|tel|phone|fax|website|www\.|email|contact|đt|tel:)\b/i;

  let vendorName = null;
  for (const p of vendorPatterns) {
    const m = fullText.match(p);
    if (m && m[1]) {
      let candidate = String(m[1]).trim();
      // If candidate contains 'Tax Code' or 'Tax' trailing, strip that part
      candidate = candidate.replace(/(,?\s*Tax\s*Code[:\s].*)/i, '').trim();
      // If candidate clearly contains contact/address, skip it
      if (contactBlacklist.test(candidate)) {
        continue;
      }
      // Reject if candidate contains submission/deadline/validity fragments (OCR artifacts)
      const headerReject = /\b(deadline|submission|validity|proposal|we commit|after studying|date:|bidding|summary of bidding|deadline for submission|lo dau)\b/i;
      if (headerReject.test(candidate)) {
        continue;
      }
      // Reject if candidate looks like a sentence fragment (contains many lowercase words and verbs)
      const lowercaseWords = candidate.split(/\s+/).filter(w => /^[a-zà-ỹ]/.test(w));
      if (lowercaseWords.length > Math.max(1, Math.floor(candidate.split(/\s+/).length / 2))) {
        continue;
      }

      vendorName = candidate;
      break;
    }
  }

  // If not found yet, try line-based search preferring company-like keywords (Vietnamese + English)
  if (!vendorName) {
    const lines = fullText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const companyKeywords = /(CÔNG\s*TỈNH|CÔ\s*PHẦN|CTY|COMPANY|TRADING|CORPORATION|JSC|LTD|CO\.|PETROVIETNAM|GLOCOM|PETROLEUM|OFFSHORE|GENERAL\s+SERVICES)/i;
    // Extra blacklist for lines that are clearly not names but sentence fragments (deadline, validity, submission etc.)
    const headerReject = /\b(deadline|submission|validity|proposal|deadline for submission|validity of the proposal|we commit|after studying|letter of bid|attention to|date:|bidding|bid|summary of bidding|validity of the proposal)\b/i;

    for (const line of lines.slice(0, 30)) { // check header lines more generously
      // Skip lines that look like contact/address blocks
      if (!line || contactBlacklist.test(line)) continue;
      // Skip lines that contain headerReject keywords
      if (headerReject.test(line)) continue;
      // Skip lines that are likely sentence fragments: start with lowercase or contain verbs/clauses
      if (/^[a-zà-ỹ]/.test(line)) continue;
      // If the line contains multiple words but also punctuation typical of addresses, skip
      if (/[\d]{2,}|\b(unit|floor|street|ward|city|province|tel|fax)\b/i.test(line)) continue;

      if (companyKeywords.test(line) && line.length > 3 && line.length < 200) {
        vendorName = line.replace(/[\x00-\x1F\x7F]+/g, ' ').replace(/\s+/g, ' ').trim();
        break;
      }
    }
  }

  // Fallback: if there's an "Address" label, take the previous non-empty line (likely the company name)
  if (!vendorName && /address[:\s]/i.test(fullText)) {
    const addressIdx = fullText.search(/address[:\s]/i);
    if (addressIdx > 0) {
      const before = fullText.substring(0, addressIdx);
      const beforeLines = before.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      let candidate = beforeLines.length ? beforeLines[beforeLines.length - 1] : null;
      // Reject if candidate looks like a sentence or contains rejection keywords
      const headerReject = /\b(deadline|submission|validity|proposal|we commit|after studying|date:|bidding|summary of bidding)\b/i;
      if (candidate && !contactBlacklist.test(candidate) && !headerReject.test(candidate)) {
        // Also avoid candidate that's clearly a short fragment like 'the deadline for submission'
        if (!/\b(deadline|submission|validity|proposal|date|validity)\b/i.test(candidate)) {
          vendorName = candidate.replace(/\s+/g, ' ').trim();
        }
      }
    }
  }

  // Additional heuristic: if company name appears split across multiple header lines (often before 'Address:'),
  // join contiguous header lines into a fuller vendor name. This handles patterns like:
  // "PETROVIETNAM GENERAL SERVICES IS CORPORATION \n& Be PETROLEUM OFFSHORE TRADING AND SERVICES JOINT STOCK COMPANY\nAddress: ..."
  try {
    const addrMatch = fullText.match(/address[:\s]/i);
    if (addrMatch) {
      const addrIdx = addrMatch.index;
      const windowStart = Math.max(0, addrIdx - 600);
      const headerBlock = fullText.substring(windowStart, addrIdx);
      const headerLines = headerBlock.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      // Collect candidate name lines until we hit a line that looks like 'Address' or contact
      const nameLines = [];
      for (let i = 0; i < headerLines.length; i++) {
        const line = headerLines[i];
        if (!line) continue;
        // stop if line contains obvious non-name markers
        if (/\b(address|tel:|phone:|fax:|website|www\.|http|email)\b/i.test(line)) break;
        // if line contains many lowercase verbs it's unlikely to be part of company header
        if (/\b(after|we|dear|study|bid|proposal|date)\b/i.test(line)) continue;
        // accept lines with uppercase/company keywords or ampersand connector
        if (/(CÔNG\s*TỈNH|CÔ\s*PHẦN|CTY|COMPANY|TRADING|CORPORATION|JSC|LTD|CO\.|PETROLEUM|OFFSHORE|GENERAL\s+SERVICES|PETROVIETNAM)/i.test(line) || /&/.test(line) || /^[A-Z\s\&]{6,}$/.test(line)) {
          nameLines.push(line.replace(/^&\s*/,'').replace(/^\&/,'').replace(/^be\s+/i, '').trim());
        }
      }
      if (nameLines.length >= 1) {
        // join lines intelligently: remove repeated words and trailing commas, stop before numeric tokens
        let joined = nameLines.join(' ').replace(/\s+/g, ' ').trim();
        // remove trailing commas and stray punctuation
        joined = joined.replace(/^[,\.\s]+|[,\.\s]+$/g, '').trim();
        // strip trailing fragments that look like 'Address' or 'Unit' accidentally included
        joined = joined.replace(/\b(Address|Unit|Floor|Tel|Phone)[:\s\S]*$/i, '').trim();
        // If joined looks like a proper name (contains company keywords), prefer it
        if (/(COMPANY|CÔNG TY|CÔ\s*PHẦN|TRADING|JOINT STOCK|SERVICES|PETROLEUM|GENERAL SERVICES|CORPORATION|JSC|LTD)/i.test(joined) && joined.length > 6) {
          vendorName = joined;
        }
      }
    }
  } catch (e) {
    // ignore header-join errors
  }

  if (!vendorName) vendorName = "Unknown Vendor";

  // If vendorName ends with a conjunction like 'and' or '&', try to append the following header line
  try {
    if (/\b(?:and|&|with)\b[\,\.\s]*$/i.test(vendorName)) {
      const headerLines = (fullText.split(/\r?\n/).map(l => l.trim()).filter(Boolean)).slice(0, 20);
      for (let i = 0; i < headerLines.length - 1; i++) {
        // find a header line that contains the vendorName prefix (or equals vendorName trimmed)
        const h = headerLines[i];
        if (!h) continue;
        // match approximate prefix: first 5-6 chars to avoid byte-for-byte matching in OCR
        const prefix = vendorName.slice(0, 20).replace(/[^A-Za-z0-9]/g, '').toLowerCase();
        if (!prefix) continue;
        const hNorm = h.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
        if (hNorm.includes(prefix) || h.startsWith(vendorName) || vendorName.startsWith(h)) {
          const next = headerLines[i + 1];
          if (next && !contactBlacklist.test(next) && !/^(\d|tel|phone|fax|www\.|http)/i.test(next) && next.length < 200) {
            // append next line to vendorName (remove trailing conjunction and join)
            vendorName = (vendorName.replace(/\b(?:and|&|with)\b[\,\.\s]*$/i, '').trim() + ' ' + next.replace(/[,\.\s]*$/g, '').trim()).replace(/\s+/g, ' ').trim();
            break;
          }
        }
      }
    }
  } catch (e) {
    // ignore append errors
  }

  // Special-case: if vendorName ends with 'and' (common when OCR split the company name across lines),
  // try a multi-line capture from the 'Bidder' block to join the two lines.
  try {
    if (/\band\b[\,\.\s]*$/i.test(vendorName)) {
      const bidderMulti = fullText.match(/Bidder[\s:\-]*([^\n]+)\n\s*([^\n,]{3,200})/i);
      if (bidderMulti && bidderMulti[1] && bidderMulti[2]) {
        let a = bidderMulti[1].trim();
        let b = bidderMulti[2].trim();
        // if b contains 'tax' or 'MST' remove trailing parts after comma
        if (/,/.test(b)) b = b.split(',')[0].trim();
        vendorName = (a.replace(/\b(?:and|&|with)\b[\,\.\s]*$/i, '').trim() + ' ' + b).replace(/\s+/g, ' ').trim();
      }
    }
  } catch (e) {
    // ignore
  }

  // Sanitize vendorName: remove control chars, collapse whitespace
  vendorName = vendorName.replace(/[\x00-\x1F\x7F]+/g, ' ').replace(/\s+/g, ' ').trim();
  // Remove trailing contact fragments like phone/website/email if present
  vendorName = vendorName.replace(/(tel[:\s]*|phone[:\s]*|fax[:\s]*|www\.|https?:\/\/|email[:\s]*).+$/i, '').trim();
  vendorName = vendorName.replace(/\+?\d[\d\.\-\s]{6,}$/i, '').trim();
  // Extra aggressive cleanup: if vendorName still contains obvious contact/address fragments, prefer a clean header line
  if (/(email|@|www\.|http|tel|phone|fax|\d{2,} [A-Za-z]|\d{6,})/i.test(vendorName) || /^v[eè]?[\s\"]?/i.test(vendorName)) {
    const lines = fullText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const companyKeywords = /(CÔNG\s*TỈNH|CÔ\s*PHẦN|CTY|COMPANY|TRADING|CORPORATION|JSC|LTD|CO\.|PETROLEUM|OFFSHORE|MT\s*Corp|MTCO|PETROVIETNAM|GLOCOM)/i;
    for (const line of lines.slice(0, 12)) {
      if (!line) continue;
      // skip lines with obvious contact info or addresses
      if (/(@|www\.|http|tel[:\s]|phone[:\s]|fax[:\s]|\b\d{3,}\b|\bSuite\b|\bFloor\b|Street|St\.|Road|Rd\.|Ward|District|Quarler|Quận|TP\.|City) /i.test(line)) continue;
      // skip if contains many punctuation typical of addresses
      if (/[,\/\\]/.test(line) && line.replace(/[^,\/\\]/g, '').length > 2) continue;
      if (companyKeywords.test(line) && line.length > 3 && line.length < 200) {
        let candidate = line.replace(/[\x00-\x1F\x7F]+/g, ' ').replace(/\s+/g, ' ').trim();
        // remove trailing comma-separated address parts
        if (candidate.includes(',')) candidate = candidate.split(',')[0].trim();
        // strip trailing phone/email fragments
        candidate = candidate.replace(/(tel[:\s]*|phone[:\s]*|fax[:\s]*|www\.|https?:\/\/|email[:\s]*).+$/i, '').trim();
        // if candidate is short and alphabetic, accept it
        if (candidate && /^[A-Za-zÀ-ỹ0-9\s\.&,\-()]{3,200}$/.test(candidate)) {
          vendorName = candidate;
          break;
        }
      }
    }
  }
  // If vendorName accidentally includes the word 'Address', prefer the part before it
  if (/address[:\s]/i.test(vendorName)) {
    const parts = vendorName.split(/address[:\s]/i);
    if (parts[0] && parts[0].trim().length >= 3) {
      vendorName = parts[0].trim();
    } else if (parts[1]) {
      vendorName = parts[1].split(',')[0].trim();
    }
  }
  // If it's still very long and looks like an address, take text before first comma as name
  if (vendorName.length > 200 && vendorName.includes(',')) {
    vendorName = vendorName.split(',')[0].trim();
  }
  
  // Post-processing improvements to clean common OCR artifacts
  // 1) Remove leading articles/stray lowercase 'a' or 'the' that sometimes precede the header
  // Remove obvious leading articles/artifacts (more aggressive to catch OCR noise)
  vendorName = vendorName.replace(/^[\s\x00-\x1F\x7F]*?(?:a|an|the|r|lo)\b[\s\-,:\.]+(?=[A-ZÀ-Ỹ0-9])/i, '').trim();

  // 2) Fix truncated company fragments commonly produced by OCR
  // e.g., 'IS CO' -> 'IS CORPORATION', 'IS CO,' -> 'IS CORPORATION'
  vendorName = vendorName.replace(/\bIS\s*CO\b(?:\.|,)?/i, 'IS CORPORATION');
  vendorName = vendorName.replace(/\bIS\s*CORP\b/i, 'IS CORPORATION');

  // 3) If vendorName looks like a truncated header (ends with common suffix but is short), try to reconstruct
  if (/\b(IS CORPORATION|CORPORATION|COMPANY|TRADING|CÔNG TY|CÔ\s*PHẦN|JSC|LTD|CO\.|PTE)\b/i.test(vendorName) && vendorName.length < 60) {
    try {
      const headerLines = (fullText.split(/\r?\n/).map(l => l.trim()).filter(Boolean)).slice(0, 10);
      // Find a header line that contains most of vendorName or complementary uppercase words
      const nameTokens = vendorName.split(/\s+/).filter(Boolean).map(t => t.replace(/[\W_]+/g, '').toLowerCase());
      for (const h of headerLines) {
        const hNorm = h.replace(/[\W_]+/g, ' ').trim();
        const hTokens = hNorm.split(/\s+/).map(t => t.toLowerCase());
        const common = nameTokens.filter(t => hTokens.includes(t));
        if (common.length >= Math.max(1, Math.floor(nameTokens.length / 2))) {
          // Compose a candidate by combining h and vendorName and dedupe tokens
          const combined = (h + ' ' + vendorName).replace(/\s+/g, ' ').trim();
          // Use combined if it is longer and looks like a proper name
          if (combined.length > vendorName.length && combined.length < 200) {
            vendorName = combined;
            break;
          }
        }
      }
    } catch (e) {
      // ignore reconstruction errors
    }
  }

  // 4) Collapse obvious duplicated header fragments (e.g., header repeated twice due to combining)
  try {
    // First try a simple repeated-string check
    const halfIdx = Math.floor(vendorName.length / 2);
    const firstHalf = vendorName.slice(0, halfIdx).trim();
    const secondHalf = vendorName.slice(halfIdx).trim();
    if (firstHalf && firstHalf.length > 10 && firstHalf === secondHalf) {
      vendorName = firstHalf;
    } else {
      // Token-based repeat detection: check small prefix repeated twice
      const tokens = vendorName.split(/\s+/).filter(Boolean);
      for (let k = 1; k <= Math.floor(tokens.length / 2); k++) {
        const a = tokens.slice(0, k).join(' ');
        const b = tokens.slice(k, k * 2).join(' ');
        if (a && a === b) {
          vendorName = a;
          break;
        }
      }
    }
  } catch (e) {
    // ignore
  }

  // Additional robust duplicate collapse using normalized whitespace and prefix search
  try {
    const norm = vendorName.replace(/\s+/g, ' ').trim();
    let deduped = false;
    const minPrefix = 20;
    for (let p = minPrefix; p <= Math.floor(norm.length / 2); p++) {
      const pref = norm.slice(0, p).trim();
      if (!pref) continue;
      if ((pref + ' ' + pref) === norm || (pref + pref) === norm) {
        vendorName = pref;
        deduped = true;
        break;
      }
    }
    if (!deduped) {
      // Token-based fallback (normalized tokens)
      const tokens = norm.split(/\s+/).filter(Boolean);
      for (let k = 1; k <= Math.floor(tokens.length / 2); k++) {
        const a = tokens.slice(0, k).join(' ');
        const b = tokens.slice(k, k * 2).join(' ');
        if (a && a === b) {
          vendorName = a;
          break;
        }
      }
    }
  } catch (e) {
    // ignore
  }

  // If vendorName still looks suspicious (very long or contains repeated fragments), prefer a scored header line
  try {
    const headerLines = (fullText.split(/\r?\n/).map(l => l.trim()).filter(Boolean)).slice(0, 30);
    const scoreLine = (line) => {
      let score = 0;
      if (!line || line.length < 3) return -100;
      if (contactBlacklist.test(line)) return -100;
      const headerReject = /\b(deadline|submission|validity|proposal|we commit|after studying|date:|bidding|summary of bidding)\b/i;
      if (headerReject.test(line)) return -100;
      // company keyword boost
      if (/(CÔNG\s*TỈNH|CÔ\s*PHẦN|CTY|COMPANY|TRADING|CORPORATION|JSC|LTD|CO\.|PETROVIETNAM|GLOCOM|PETROLEUM|OFFSHORE|GENERAL\s+SERVICES)/i.test(line)) score += 10;
      // uppercase words boost
      const tokenWords = line.split(/\s+/).filter(Boolean);
      const uppercaseCount = tokenWords.filter(w => /[A-ZÀ-Ỹ]/.test(w[0])).length;
      score += Math.max(0, uppercaseCount - 1);
      // penalize digits and address-like tokens
      if (/\d{2,}|\b(unit|floor|street|ward|city|province|tel|fax|www\.|http|email)\b/i.test(line)) score -= 5;
      // longer but reasonable length is ok
      if (line.length > 200) score -= 5;
      return score;
    };

    let best = null;
    let bestScore = -999;
    for (const line of headerLines) {
      const s = scoreLine(line);
      if (s > bestScore) {
        bestScore = s;
        best = line;
      }
    }

    if (best && bestScore > 5) {
      vendorName = best.replace(/[\x00-\x1F\x7F]+/g, ' ').replace(/\s+/g, ' ').trim();
      // Final small cleanups: strip leading punctuation/artifacts and stray words like 'Be' introduced by OCR
      vendorName = vendorName.replace(/^[&\s\-,:\.]+/, '').replace(/^be\s+/i, '').replace(/^a\s+/i, '').trim();
    }
  } catch (e) {
    // ignore
  }

  // 5) Final cleanup: remove stray leading single letters/artifacts and trim
  vendorName = vendorName.replace(/^[\s\p{C}]*[a-z]{1,3}[\s\-,:\.]+(?=[A-ZÀ-Ỹ0-9])/iu, '').trim();
  // Collapse multiple spaces
  vendorName = vendorName.replace(/\s+/g, ' ').trim();
  
  // Check if MT Corp (internal) or competitor
  const isMT = /MT\s*Corp|MTCO|Minh\s*Tuan/i.test(fullText);
  const vendorType = isMT ? "internal" : "competitor";
  
  // If MT Corp, use that name
  if (isMT && (!vendorName || vendorName === "Unknown Vendor")) {
    vendorName = "MT Corp";
  }

  // If there's an explicit 'Bidder:' label anywhere, prefer that as vendorName (clean it)
  try {
    // Prefer a multi-line capture when company name is split across lines (common with OCR)
    const bidderMatch = fullText.match(/Bidder\s*[:\-]?\s*([^\n,]{3,200})(?:\n\s*([^\n,]{3,200}))?/i);
    if (bidderMatch && bidderMatch[1]) {
      let b = bidderMatch[1].trim();
      // If a second line exists and first line ends with a conjunction, append the second
      if (bidderMatch[2] && /\b(?:and|&|with)\b[\,\.\s]*$/i.test(b)) {
        const cont = bidderMatch[2].trim();
        const contClean = cont.split(',')[0].trim();
        if (contClean && !contactBlacklist.test(contClean)) {
          b = (b.replace(/\b(?:and|&|with)\b[\,\.\s]*$/i, '').trim() + ' ' + contClean).trim();
        }
      }
      // strip trailing 'Tax Code' or contact fragments
      b = b.replace(/\s*,\s*Tax\s*Code[:\s].*$/i, '').replace(/(tel[:\s]*|phone[:\s]*|fax[:\s]*|www\.|https?:\/\/|email[:\s]*).+$/i, '').trim();
      if (b && !/\b(address|địa\s+chỉ)\b/i.test(b)) vendorName = b;
    }
  } catch (e) {
    // ignore
  }

  // Remove leading Vietnamese artifact 'về' or stray punctuation
  vendorName = vendorName.replace(/^v[eè]\b[\s\"\'\-]*/i, '').trim();
  
  // Extract tax code
  const taxCodeMatch = fullText.match(/(?:Tax\s+Code|MST|Tax\s+ID)\s*:?\s*([0-9\-\.\s]{6,})/i);
  const vendorTaxCode = taxCodeMatch ? String(taxCodeMatch[1]).replace(/[^0-9]/g, '').trim() : null;
  
  // Robust total amount extraction helper
  function parseAmountString(amountStr) {
    if (!amountStr || !String(amountStr).trim()) return NaN;
    let s = String(amountStr).trim();
    // Remove surrounding currency symbols/words
    s = s.replace(/(?:VND|VNĐ|USD|EUR|GBP|\$|₫)/ig, '');
    // Keep only digits, comma, dot
    s = s.replace(/[^0-9\.,]/g, '');

    // If both comma and dot present, assume comma is thousand sep and remove commas
    if (s.indexOf(',') !== -1 && s.indexOf('.') !== -1) {
      // If last '.' occurs after last ',', treat '.' as decimal separator -> remove commas
      if (s.lastIndexOf('.') > s.lastIndexOf(',')) {
        s = s.replace(/,/g, '');
      } else {
        // else remove dots as thousand separators and replace comma with dot for decimals
        s = s.replace(/\./g, '').replace(/,/g, '.');
      }
    } else {
      // If only commas, assume commas are thousand separators -> remove them
      if (s.indexOf(',') !== -1 && s.indexOf('.') === -1) {
        s = s.replace(/,/g, '');
      }
    }

    const n = parseFloat(s);
    return Number.isFinite(n) ? n : NaN;
  }

  function extractTotalAmountFromText(text) {
    if (!text) return { amount: NaN, currency: null };
    const candidates = [];
    const totalPatterns = [
      // pattern: currency then number (e.g., 'VND 4,407,569,828')
      /(?:\b(VND|VNĐ|USD|EUR|GBP|\$|₫)\b\s*([\d\.,\s]{4,}))/ig,
      /(?:grand\s+total)\s*[:\-]?\s*(?:\(?\s*(?:VND|VNĐ|USD|EUR|GBP|\$|₫)?\s*\)?\s*([\d\.,\s]+))/ig,
      /(?:total\s+amount|total)\s*[:\-]?\s*(?:\(?\s*(?:VND|VNĐ|USD|EUR|GBP|\$|₫)?\s*\)?\s*([\d\.,\s]+))/ig,
      /(?:tổng\s+cộng|thành\s+tiền|tổng\s+thành\s+tiền)\s*[:\-]?\s*(?:\(?\s*(?:VND|VNĐ|USD|EUR|GBP|\$|₫)?\s*\)?\s*([\d\.,\s]+))/ig,
      /([\d\.,\s]{4,})\s*(?:VND|VNĐ|USD|EUR|GBP|\$|₫)/ig,
    ];

    for (const p of totalPatterns) {
      for (const m of text.matchAll(p)) {
        try {
          // m may have different capture groups depending on the pattern (currency-first vs number-first)
          let raw = '';
          if (m[2]) raw = m[2];
          else if (m[1]) raw = m[1];
          else raw = (m[0] || '');
          const amt = parseAmountString(raw);
          if (Number.isFinite(amt) && amt > 0) {
            // Try to find currency near the match
            const window = text.substring(Math.max(0, m.index - 40), Math.min(text.length, m.index + (m[0] ? m[0].length + 40 : 100)));
            let curMatch = window.match(/(VND|VNĐ|USD|EUR|GBP|\$|₫)/i);
            // if not found, also check immediately before the match for a leading currency token
            if (!curMatch) {
              const before = text.substring(Math.max(0, m.index - 8), m.index);
              curMatch = before.match(/(VND|VNĐ|USD|EUR|GBP|\$|₫)/i);
            }
            const cur = curMatch ? curMatch[0].toUpperCase().replace('VNĐ', 'VND') : null;
            // Stronger filter: skip numeric candidates that look like tax IDs or pure numeric identifiers.
            // 1) If the raw matched string contains no punctuation and is 9-12 digits long, it's likely a tax code / id
            // 2) If the nearby text window contains 'tax code', 'mst', 'tax id' etc., skip it
            const windowLower = window.toLowerCase();
            const rawDigits = String(raw).replace(/[^0-9]/g, '');
            const looksLikeTaxId = /^0?\d{8,11}$/.test(rawDigits) && !/[\.,]/.test(String(raw));
            if (looksLikeTaxId || /\b(tax\s*code|mst|tax\s*id|tax\s+id|m\.|mst[:\s]|tax[:\s])/i.test(windowLower)) {
              // skip this candidate as it's likely a tax identifier, not a monetary total
              continue;
            }
            candidates.push({ amt, cur, idx: m.index || 0, label: p.toString(), raw: (m[0] || '') });
          }
        } catch (e) {
          // ignore
        }
      }
    }

    if (candidates.length === 0) return { amount: NaN, currency: null };
    // DEBUG: show all numeric candidates found for manual inspection
    try { console.log('[Extractor] Total candidates:', candidates.slice(0,20)); } catch (e) {}

    // Prefer monetary-looking candidates (have currency token or thousand separators)
    try {
      const moneyLike = candidates.filter(c => {
        if (c.cur && /VND|VNĐ|₫|USD|\$|EUR|GBP/i.test(c.cur)) return true;
        if (c.raw && /[\.,]/.test(String(c.raw))) return true;
        return false;
      });
      if (moneyLike.length > 0) {
        // Prefer VND candidates when present (project expects VND grand totals)
        const vndCandidates = moneyLike.filter(c => c.cur && /VND|VNĐ|₫/i.test(c.cur));
        if (vndCandidates.length > 0) {
          // pick the largest VND amount (robust if multiple VND-like numbers exist)
          vndCandidates.sort((a, b) => b.amt - a.amt);
          return { amount: vndCandidates[0].amt, currency: vndCandidates[0].cur || 'VND' };
        }
        // Otherwise pick the largest monetary-like candidate (regardless of currency)
        moneyLike.sort((a, b) => b.amt - a.amt);
        return { amount: moneyLike[0].amt, currency: moneyLike[0].cur || 'VND' };
      }
    } catch (e) {
      // ignore
    }

    // Priority 0: look for explicit labeled totals (strong signal)
    try {
      const labelPatterns = [
        /(?:Total\s+Bidding\s+Price|Total\s+Bidding)\s*[:\-]?\s*(?:\(?\s*(?:VND|VNĐ|USD|EUR|GBP|\$|₫)?\s*\)?\s*([\d\.,\s]{4,}))/i,
        /with\s+bid\s+price\s+of\s*(?:VND|VNĐ|USD|\$|₫)?\s*([\d\.,\s]{4,})/i,
        /bid\s+price\s+of\s*(?:VND|VNĐ|USD|\$|₫)?\s*([\d\.,\s]{4,})/i,
        /Total\s+Bidding\s+Price[:\-]?\s*([\d\.,\s]{4,})/i,
      ];

      for (const lp of labelPatterns) {
        const m = text.match(lp);
        if (m && m[1]) {
          const amt = parseAmountString(m[1]);
          if (Number.isFinite(amt) && amt > 0) {
            // try to detect currency near match
            const idx = m.index || text.indexOf(m[0]);
            const window = text.substring(Math.max(0, idx - 80), Math.min(text.length, idx + (m[0] ? m[0].length + 80 : 200)));
            const cm = window.match(/(VND|VNĐ|USD|EUR|GBP|\$|₫)/i);
            const cur = cm ? (cm[0].toUpperCase().replace('VNĐ', 'VND')) : 'VND';
            return { amount: amt, currency: cur };
          }
        }
      }
    } catch (e) {
      // ignore label-based selection errors
    }

    // Priority 1: prefer the numeric candidate that has an '(In words:' nearby (strong indicator of grand total)
    try {
      const inWordsMatches = [...text.matchAll(/\(In words\s*[:\)]/ig)];
      if (inWordsMatches.length > 0) {
        for (const iw of inWordsMatches) {
          const pos = iw.index || 0;
          // search backwards up to 300 chars for the nearest numeric candidate
          const windowStart = Math.max(0, pos - 300);
          const window = text.substring(windowStart, pos + 200);
          const numMatch = window.match(/([\d\.,\s]{4,})\s*(?:VND|VNĐ|USD|\$|₫)?/i);
          if (numMatch && numMatch[1]) {
            const amt = parseAmountString(numMatch[1]);
            if (Number.isFinite(amt) && amt > 0) {
              const cm = window.match(/(VND|VNĐ|USD|EUR|GBP|\$|₫)/i);
              const cur = cm ? (cm[0].toUpperCase().replace('VNĐ', 'VND')) : 'VND';
              return { amount: amt, currency: cur };
            }
          }
        }
      }
    } catch (e) {
      // ignore
    }

    // If we have a vendorName in scope, prefer the candidate closest to the vendor occurrence
    try {
      const vendorIdx = (typeof vendorName === 'string' && vendorName && vendorName !== 'Unknown Vendor') ? text.indexOf(vendorName) : -1;
      if (vendorIdx >= 0) {
        let best = null;
        let bestDist = Number.POSITIVE_INFINITY;
        for (const c of candidates) {
          const d = Math.abs((c.idx || 0) - vendorIdx);
          if (d < bestDist) {
            bestDist = d;
            best = c;
          }
        }
        if (best) return { amount: best.amt, currency: best.cur || 'VND' };
      }
    } catch (e) {
      // ignore vendor proximity selection errors and fall back
    }

    // Prefer candidates that are VND or large numbers (likely totals in VND). This helps when USD small subtotals and large VND grand totals both exist.
    const vndOrLarge = candidates.filter(c => (c.cur && /VND|VNĐ|₫/i.test(c.cur)) || (c.amt && c.amt > 1000000));
    if (vndOrLarge.length > 0) {
      // prefer grand-like within vndOrLarge
      const grandVnd = vndOrLarge.find(c => /grand|tổng/i.test(c.label));
      if (grandVnd) return { amount: grandVnd.amt, currency: grandVnd.cur || 'VND' };
      // otherwise prefer last occurrence among vndOrLarge
      vndOrLarge.sort((a, b) => b.idx - a.idx);
      return { amount: vndOrLarge[0].amt, currency: vndOrLarge[0].cur || 'VND' };
    }

    // Prefer candidate with label containing 'grand' or Vietnamese 'tổng cộng'
    const grand = candidates.find(c => /grand|tổng/i.test(c.label));
    if (grand) return { amount: grand.amt, currency: grand.cur || 'VND' };

    // Otherwise prefer the candidate that appears last in document (highest idx)
    candidates.sort((a, b) => b.idx - a.idx);
    return { amount: candidates[0].amt, currency: candidates[0].cur || 'VND' };
  }

  const totalResult = extractTotalAmountFromText(fullText);
  console.log('[Extractor] Total extraction result:', totalResult);
  let totalAmount = totalResult.amount;
  // Safety guard: if the chosen total looks inconsistent with other numeric tokens in the document,
  // prefer the large VND-like candidate when it's significantly larger than the chosen value.
  try {
    const allNumMatches = fullText.match(/[0-9\.,\s]{6,}/g) || [];
    let maxCandidate = 0;
    for (const nm of allNumMatches) {
      const rawToken = String(nm);
      // Skip pure digit tokens that look like tax codes (9-12 digits) to avoid false grand totals
      if (/^\s*\d{9,12}\s*$/.test(rawToken) && !/[\.,]/.test(rawToken)) continue;
      // If token contains whitespace but no comma/dot, it's likely multiple numbers joined by OCR newlines -> skip
      if (/\s/.test(rawToken) && !/[\.,]/.test(rawToken)) continue;
      let ss = rawToken.replace(/[^0-9\.,]/g, '');
      // Remove spaces inside tokens only when there is a punctuation separator (to avoid joining separate numbers)
      if (/[\.,]/.test(rawToken)) ss = ss.replace(/\s+/g, '');
      if (ss.indexOf(',') !== -1 && ss.indexOf('.') !== -1) {
        if (ss.lastIndexOf('.') > ss.lastIndexOf(',')) ss = ss.replace(/,/g, '');
        else ss = ss.replace(/\./g, '').replace(/,/g, '.');
      } else if (ss.indexOf(',') !== -1 && ss.indexOf('.') === -1) {
        ss = ss.replace(/,/g, '');
      }
      const parsed = parseFloat(ss);
      if (Number.isFinite(parsed) && parsed > maxCandidate) maxCandidate = parsed;
    }
    // If there's a much larger candidate (e.g., >1.5x current) and it's a realistic grand total (>1M), choose it.
  // Cap absurdly large candidates (likely OCR-joined) to a sane limit (e.g., < 1e13)
  if (maxCandidate > 1e13) maxCandidate = 0;
  if (Number.isFinite(maxCandidate) && maxCandidate > 1000000 && Number.isFinite(totalAmount) && maxCandidate > (totalAmount * 1.5)) {
      console.log('[Extractor] Safety-override: chosen total', totalAmount, 'replaced with larger candidate', maxCandidate);
      totalAmount = maxCandidate;
    }
  } catch (e) {
    // ignore guard failures
  }
  const currency = totalResult.currency || (fullText.match(/(?:VND|VNĐ|USD|EUR|GBP)/i) ? fullText.match(/(?:VND|VNĐ|USD|EUR|GBP)/i)[0].toUpperCase().replace('VNĐ', 'VND') : 'VND');
  
  // Extract validity
  const validityMatch = fullText.match(/(\d+)\s*days?\s*(?:validity|valid)/i);
  const validityDays = validityMatch ? parseInt(validityMatch[1]) : 90;
  
  // Extract delivery days
  let deliveryDays = null;
  try {
    // First try delivery-specific patterns to avoid picking up '90 days' validity
    const deliveryPatterns = [
      /Delivery\s*time\s*[:\-]?\s*(\d{1,4})\s*(?:calendar\s+)?days/i,
      /Delivery\s*date\s*[:\-]?\s*(?:[^\n]*?)(\d{1,4})\s*(?:calendar\s+)?days/i,
      /delivery\s*[:\-]?\s*(?:within|in)\s*(\d{1,4})\s*(?:calendar\s+)?days/i,
      /(\d{1,4})\s*(?:calendar\s+)?days\s*(?:after|from)\s+(?:receiving|issue|letter|loi|award|loa)/i,
    ];
    for (const p of deliveryPatterns) {
      const m = fullText.match(p);
      if (m && m[1]) {
        deliveryDays = parseInt(m[1]);
        break;
      }
    }

    // If not found, fall back to picking the numeric 'days' occurrence nearest to delivery-related labels
    if (!deliveryDays) {
      const allMatches = [];
      for (const m of fullText.matchAll(/(\d{1,4})\s*(?:calendar\s+)?days/ig)) {
        allMatches.push({ val: parseInt(m[1]), idx: m.index });
      }
      if (allMatches.length === 1) {
        deliveryDays = allMatches[0].val;
      } else if (allMatches.length > 1) {
        // find index of closest delivery keyword
        const deliveryKeywordIdx = (() => {
          const kws = ['delivery time','delivery date','place of delivery','delivery','terms of delivery','term of delivery'];
          let best = -1;
          for (const kw of kws) {
            const ix = fullText.toLowerCase().indexOf(kw);
            if (ix >= 0) { best = ix; break; }
          }
          return best;
        })();
        if (deliveryKeywordIdx >= 0) {
          let best = null;
          let bestDist = Number.POSITIVE_INFINITY;
          for (const m of allMatches) {
            const d = Math.abs((m.idx || 0) - deliveryKeywordIdx);
            if (d < bestDist) { bestDist = d; best = m; }
          }
          if (best) deliveryDays = best.val;
        } else {
          // no delivery keyword found; prefer the largest plausible delivery (>7 days) or null
          const plausible = allMatches.filter(a => a.val > 7);
          if (plausible.length > 0) {
            // pick the largest plausible
            plausible.sort((a,b)=>b.val-a.val);
            deliveryDays = plausible[0].val;
          } else {
            // fallback to the first occurrence
            deliveryDays = allMatches[0].val;
          }
        }
      }
    }
  } catch (e) {
    // keep deliveryDays null if parsing fails
    deliveryDays = null;
  }
  
  // Extract warranty clause more robustly:
  // - Find the warranty section (text around the word 'warranty' or Vietnamese 'bảo hành')
  // - Extract all duration mentions (digits, digits-in-parentheses, or common number-words)
  // - Convert years to months, prefer the FIRST number mentioned when clause contains 'whichever comes first/earlier',
  //   otherwise choose the largest duration as canonical warrantyMonths
  let warrantyMonths = null;
  let warrantyClause = null;
  const warrantySectionMatch = fullText.match(/(?:warranty|bảo\s*hành)[\s\S]{0,800}/i);
  if (warrantySectionMatch) {
    warrantyClause = warrantySectionMatch[0];

    // Helper: convert common number-words to digits (support up to 36)
    const numberWords = {
      one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,
      eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,sixteen:16,seventeen:17,eighteen:18,nineteen:19,twenty:20,
      twentyone:21,twentytwo:22,twentythree:23,twentyfour:24,twentyfive:25,twentysix:26,twentyseven:27,twentyeight:28,twentynine:29,thirty:30,thirtyone:31,thirtytwo:32,thirtythree:33,thirtyfour:34,thirtyfive:35,thirtysix:36
    };

    const durations = [];

    // 1) Find numbers in parentheses or plain digits followed by months/years, possibly with Vietnamese words
    const digitPattern = /\(?\s*(\d{1,3})\s*\)?\s*(months?|tháng|years?|năm)/gi;
    for (const m of warrantyClause.matchAll(digitPattern)) {
      const n = parseInt(m[1]);
      const unit = (m[2] || '').toLowerCase();
      durations.push(unit.includes('year') || unit.includes('năm') ? n * 12 : n);
    }

    // 2) Find number-words like 'eighteen months' or Vietnamese spelled numbers (basic English support)
    const wordPattern = /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|twenty one|twentyone|twenty two|twentytwo|twenty three|twentythree|twenty four|twentyfour|twenty five|twentyfive|twenty six|twentysix|twenty seven|twentyseven|twenty eight|twentyeight|twenty nine|twentynine|thirty|thirty one|thirtyone|thirty two|thirtytwo|thirty three|thirtythree|thirty four|thirtyfour|thirty five|thirtyfive|thirty six|thirtysix)\b\s*(?:months?|tháng|years?|năm)/gi;
    for (const m of warrantyClause.matchAll(wordPattern)) {
      const key = m[1].replace(/\s+/g, '').toLowerCase();
      const val = numberWords[key];
      if (val) durations.push(val);
    }

    console.log('[Extractor] Warranty candidate durations (months):', durations);
    if (durations.length > 0) {
      // If clause explicitly says 'whichever comes first/earlier', choose the FIRST number mentioned
      if (/whichever\s+comes\s+(first|earlier)/i.test(warrantyClause) || /whichever\s+comes\s+first/i.test(warrantyClause)) {
        warrantyMonths = durations[0];
      } else {
        // Otherwise choose the largest duration as canonical value per project rule
        warrantyMonths = Math.max(...durations);
      }
    }
  }
  // Fallback: try a looser search across the document if no warranty section found
  if (warrantyMonths == null) {
    const looseMatch = [...fullText.matchAll(/(\d+)\s*(months?|years?)\s*(?:warranty|warranty time|Warranty)/gi)];
    if (looseMatch.length > 0) {
      const durations = looseMatch.map(m => (m[2].toLowerCase().includes('year') ? parseInt(m[1]) * 12 : parseInt(m[1])));
      warrantyMonths = Math.max(...durations);
    }
  }
  // As final fallback, keep previous simple match
  if (warrantyMonths == null) {
    const warrantyMatch = fullText.match(/(\d+)\s*months?\s*(?:from|after|of)?/i);
    warrantyMonths = warrantyMatch ? parseInt(warrantyMatch[1]) : null;
  }

  if (warrantyClause) {
    console.log('[Extractor] Warranty clause detected:', warrantyClause.replace(/\n/g, ' '));
    console.log('[Extractor] Parsed warrantyMonths (canonical):', warrantyMonths);
  }
  
  // Extract delivery terms
  // Delivery terms/location/days extraction: prefer explicit labels then fallbacks
  let deliveryTerms = null;
  // Helper: sanitize delivery terms strings to fix common OCR/typo issues and trim trailing prepositions
  function sanitizeDeliveryTerms(raw) {
    if (!raw) return null;
    let s = String(raw).trim();
    // common OCR typos -> corrections
    s = s.replace(/warchouse/ig, 'warehouse');
    s = s.replace(/vietsovpetro/ig, 'Vietsovpetro');
    s = s.replace(/viet\s*nam/ig, 'Vietnam');
    // fix stray .R. -> P.R.
    s = s.replace(/\.R\./g, 'P.R.');
    // normalize whitespace
    s = s.replace(/\s+/g, ' ').trim();
    // collapse multiple commas
    s = s.replace(/,\s*,+/g, ', ');
    // remove trailing incomplete prepositions like 'from', 'to', 'including', 'excluding', 'with'
    s = s.replace(/(?:\b(from|to|including|excluding|with)\b[\.\s,:-]*)$/i, '').trim();
    // tidy leading/trailing punctuation
    s = s.replace(/^[,\.\s]+|[,\.\s]+$/g, '').trim();
    return s || null;
  }
  // Prefer explicit 'Term of delivery' (or 'Terms of delivery') label first, then fall back to 'Place of delivery'.
  try {
    const termLabelRegex = /(?:Term\s*(?:s)?\s*of\s*delivery|Term\s*of\s*delivery|Terms\s+of\s+delivery)/i;
    const placeLabelRegex = /(?:Place of delivery|Place of Delivery|Place\s+of\s+delivery)/i;

    // Try to capture value on same line (or immediately after small newline) for 'Term(s) of delivery'
    let match = fullText.match(new RegExp('(?:Term\\s*(?:s)?\\s*of\\s*delivery|Term\\s*of\\s*delivery|Terms\\s+of\\s+delivery)\\s*[:\\-]?\\s*(?:\\r?\\n\\s*)?([^\\n]+)', 'i'));
    // If not found, try 'Place of delivery'
    if (!match) {
      match = fullText.match(new RegExp('(?:Place of delivery|Place of Delivery|Place\\s+of\\s+delivery)\\s*[:\\-]?\\s*(?:\\r?\\n\\s*)?([^\\n]+)', 'i'));
    }

    if (match && match[1]) {
      // Found value on same line (or after a small newline). Preserve verbatim (trim only).
      deliveryTerms = String(match[1]).trim();
    } else {
      // If label exists but value may be on the next non-empty line (e.g. OCR split), find it.
      let labelIdx = fullText.search(termLabelRegex);
      if (labelIdx < 0) labelIdx = fullText.search(placeLabelRegex);
      if (labelIdx >= 0) {
        // take substring after the label and find the first non-empty line
        const after = fullText.substring(labelIdx);
        // remove the label itself from the start
        const afterNoLabel = after.replace(termLabelRegex, '').replace(placeLabelRegex, '');
        const followingLines = afterNoLabel.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        if (followingLines.length > 0) {
          // The first non-empty following line likely contains the place/term
          deliveryTerms = String(followingLines[0]).trim();
        }
      }
    }
  } catch (e) {
    // fall back to earlier logic if anything goes wrong
  }
  if (!deliveryTerms) {
    const dtMatch = fullText.match(/(?:Delivery\s+date|Delivery\s+time|Delivery\s*:\s*)([^\n]+)/i);
    if (dtMatch && dtMatch[1]) deliveryTerms = dtMatch[1].trim();
  }
  if (!deliveryTerms) {
    const incotermMatch = fullText.match(/\b(?:DDP|FOB|CIF|CFR)\b/i);
    if (incotermMatch) deliveryTerms = incotermMatch[0];
  }
  // As a last resort detect known place 'Vietsovpetro warehouse' or similar
  if (!deliveryTerms && /Vietsovpetro\s+warehouse/i.test(fullText)) deliveryTerms = 'Vietsovpetro warehouse, Vung Tau City';

  // IMPORTANT: prefer preserving the original captured deliveryTerms exactly as found in the document
  // when a regex produced a value (user requested "lấy như này thôi"). Keep the raw string if present.
  const deliveryTermsRaw = deliveryTerms ? String(deliveryTerms).trim() : null;
  if (deliveryTermsRaw) {
    // store verbatim (but trim surrounding whitespace)
    deliveryTerms = deliveryTermsRaw;
  } else {
    // No raw capture — try to normalize/guess a delivery term
    deliveryTerms = sanitizeDeliveryTerms(deliveryTerms);
  }
  
  // Find linked RFQ
  // Before attempting any DB lookups, if we clearly don't have a vendor or total,
  // avoid creating an empty PO row. Instead flag the document for manual review.
  const vnorm = String(vendorName || '').trim().toLowerCase();
  const vendorUnknown = !vnorm || /^unknown/i.test(vnorm) || vnorm === 'unknown vendor' || vnorm.length < 3 || /\b(bidder|\[bidder|insert name|name of bidder|buyer|seller)\b/i.test(vnorm) || /\[.*\]/.test(String(vendorName));
  const totalMissingFlag = !totalAmount || Number.isNaN(Number(totalAmount)) || Number(totalAmount) <= 0;
  if (vendorUnknown && totalMissingFlag) {
    try {
      const reviewDir = path.join(__dirname, '..', '..', 'storage', 'review-needed');
      await fs.mkdir(reviewDir, { recursive: true });
      const flag = {
        documentId,
        poNumber: poNumber || null,
        buyerName: buyerName || null,
        vendorName: vendorName || null,
        totalAmount: totalAmount || 0,
        currency: currency || null,
        reason: 'missing_vendor_and_total',
        flaggedAt: new Date().toISOString(),
      };
      await fs.writeFile(path.join(reviewDir, `${documentId}-needs_review.json`), JSON.stringify(flag, null, 2), 'utf8');
      console.log(`[Extractor] Skipping PO save: vendor unknown and total missing — flagged for manual review: ${documentId}`);
    } catch (e) {
      console.warn('[Extractor] Failed to write review flag file:', e.message);
    }
    return null;
  }

  const rfqMatch = fullText.match(/(?:RFQ|ITB)\s*(?:No\.?|Number)?\s*:?\s*([A-Z0-9\-\/]+)/i);
  const rfqNumber = rfqMatch ? rfqMatch[1].trim() : null;
  
  let rfqId = null;
  if (rfqNumber) {
    const linkedRfq = await prisma.rfq_metadata.findFirst({
      where: { rfqNumber },
    });
    rfqId = linkedRfq?.id || null;
  }
  
  // Sanitize payload to avoid Prisma unknown-argument errors and ensure types
  // Ensure we never pass NaN to Prisma (JSON.stringify will convert NaN -> null and Prisma will reject)
  const parsedTotalRaw = (typeof totalAmount === 'number' && Number.isFinite(totalAmount)) ? totalAmount : parseFloat(String(totalAmount || '').replace(/[,\s]/g, ''));
  const safeTotal = Number.isFinite(parsedTotalRaw) ? parsedTotalRaw : 0;
  const safeValidity = validityDays != null ? parseInt(String(validityDays)) || null : null;
  const safeDelivery = deliveryDays != null ? parseInt(String(deliveryDays)) || null : null;
  const safeWarranty = warrantyMonths != null ? parseInt(String(warrantyMonths)) || null : null;
  const safeTax = vendorTaxCode ? String(vendorTaxCode).replace(/[^0-9]/g, '') : null;

  const quotationPayload = {
    quotationNumber,
    vendorName,
    vendorType,
    vendorTaxCode: safeTax,
    totalAmount: safeTotal,
    currency,
    validityDays: safeValidity,
    deliveryDays: safeDelivery,
    deliveryTerms: deliveryTerms || null,
    warrantyMonths: safeWarranty,
    rfqId,
    documentId,
    sourceFilePath: sourceFilePath,
  };

  try {
    let quotation = null;

    // If we derived a more meaningful quotationNumber but an existing row has a trivial/placeholder
    // quotationNumber (e.g. '1' or short numeric), update that row first so upsert by quotationNumber will use the good value.
    if (quotationNumber) {
      try {
        const existingByDoc = await prisma.quotations.findFirst({ where: { documentId } });
        if (existingByDoc && existingByDoc.quotationNumber && existingByDoc.quotationNumber !== quotationNumber) {
          const isTrivial = existingByDoc.quotationNumber.length < 3 || /^\d+$/.test(existingByDoc.quotationNumber);
          if (isTrivial) {
            await prisma.quotations.update({ where: { id: existingByDoc.id }, data: { quotationNumber, updatedAt: new Date() } });
          }
        }
      } catch (e) {
        // ignore pre-update failures
      }
    }

    if (quotationNumber) {
      // If we have a clear quotation number, upsert by it (preserves previous behaviour)
      quotation = await prisma.quotations.upsert({
        where: { quotationNumber },
        update: { ...quotationPayload, updatedAt: new Date() },
        create: quotationPayload,
      });
    } else {
      // Otherwise, try to find an existing row by documentId and update it; if not present, create new
      const existing = await prisma.quotations.findFirst({ where: { documentId } });
      if (existing) {
        quotation = await prisma.quotations.update({
          where: { id: existing.id },
          data: { ...quotationPayload, updatedAt: new Date() },
        });
      } else {
        quotation = await prisma.quotations.create({ data: quotationPayload });
      }
    }

    // Extract line items (if structured data available)
    await extractQuotationItems(quotation.id, fullText);
    console.log(`[Extractor] Quotation data saved: ${quotation.id}`);
    return quotation;
  } catch (err) {
    console.error('[Extractor] Failed to save quotation:', err.message, 'payload:', JSON.stringify(quotationPayload));
    throw err;
  }
}

/**
 * Extract quotation line items from text
 * Improved with more flexible patterns
 */
async function extractQuotationItems(quotationId, text) {
  // Multiple patterns to handle different PDF formats
  const itemPatterns = [
    // Pattern 1: Numbered items with clear structure
    /(\d+)\.\s*([^\n]{10,100}?)\s+(?:Manufacturer|Mfr|Make)[\s:]+([^\n]+?)\s+(?:Qty|Quantity|Q'ty)[\s:]+(\d+)\s+(?:Unit\s+Price|Price|U\.Price)[\s:]+(\d+[\d,\.]*)\s+(?:Total|Amount)[\s:]+(\d+[\d,\.]*)/gi,
    
    // Pattern 2: Table with tabs or multiple spaces
    /(\d+)\s{2,}([^\t\n]{10,80})\s{2,}([^\t\n]{5,40})\s{2,}(\d+)\s{2,}([\d,\.]+)\s{2,}([\d,\.]+)/gi,
    
    // Pattern 3: Simple numbered list with prices
    /(\d+)\s*[.)\-]\s*([^\n]{10,100}?)[\s\-:]+(?:USD|VND|EUR)?\s*([\d,\.]+)/gi,
    
    // Pattern 4: Items in quotation format (simpler)
    /(?:Item|No\.?)\s*(\d+)[:\s]+([^\n]{10,100})[^\d]*([\d,\.]+)/gi,
  ];
  
  const items = [];
  
  for (const pattern of itemPatterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      // Safely parse captured groups — some patterns may leave groups undefined
      const lineNumber = match[1] ? parseInt(String(match[1]).replace(/[^0-9]/g, '')) : null;
      const description = match[2] ? String(match[2]).trim() : '';
      const manufacturer = match[3] ? String(match[3]).trim() : null;
      const quantity = match[4] ? parseInt(String(match[4]).replace(/[^0-9]/g, '')) : null;
      let unitPrice = null;
      let totalPrice = null;
      try {
        if (match[5]) unitPrice = parseFloat(String(match[5]).replace(/[,\s]/g, ""));
      } catch (e) {
        unitPrice = null;
      }
      try {
        if (match[6]) totalPrice = parseFloat(String(match[6]).replace(/[,\s]/g, ""));
      } catch (e) {
        totalPrice = null;
      }

      // Only include an item if we have at least a description and one numeric field
      if (description || lineNumber || quantity || unitPrice || totalPrice) {
        items.push({
          quotationId,
          lineNumber: lineNumber || (items.length + 1),
          description,
          manufacturer,
          quantity: quantity || 0,
          unitPrice: unitPrice || 0,
          totalPrice: totalPrice || 0,
        });
      }
    }
  }
  
  // Save items to database
  if (items.length > 0) {
    for (const item of items) {
      try {
        await prisma.quotation_items.create({ data: item });
      } catch (e) {
        console.warn('[Extractor] Failed to save quotation item, skipping:', e.message, item);
      }
    }
    console.log(`[Extractor] Extracted ${items.length} quotation items`);
  }
  
  return items;
}

/**
 * Extract PO data
 */
async function extractPOData(documentId, document) {
  const { pageContent, title, metadata } = document;
  const fullText = pageContent || "";
  const sourceFilePath = (metadata && metadata.originalFileName) ? metadata.originalFileName : (title || documentId);
  
  // Extract PO number - improved patterns for McPEC format
  let poNumber = null;
  
  // Try to extract full McPEC PO number first
  const mcpecMatch = fullText.match(/McPEC\/PO\/(\d+\/\d+\/\d+\/[A-Z0-9]+)/i);
  if (mcpecMatch) {
    poNumber = `McPEC/PO/${mcpecMatch[1]}`;
  }
  
  // If not found, try other patterns
  if (!poNumber) {
    const poPatterns = [
      /PURCHASE\s+ORDER\s+NO\.\s*:?\s*'?([A-Z0-9\/\.\-]+)/i,
      /P\.?O\.?\s*NO\.\s*:?\s*([A-Z0-9\/\.\-]+)/i,
      /McPEC\.PO\.(\d+[\.\d]+)/i,
    ];
    
    for (const pattern of poPatterns) {
      const match = fullText.match(pattern);
      if (match && match[1]) {
        poNumber = match[1].trim().replace(/^'|'$/g, ''); // Remove quotes
        break;
      }
    }
  }
  
  // Fallback to filename
  if (!poNumber) {
    const filenameMatch = title.match(/\(([^)]+)\)/);
    poNumber = filenameMatch ? filenameMatch[1] : `PO-${documentId.substring(0, 8)}`;
  }
  
  // Extract buyer/vendor info - improved for McPEC format
  let buyerName = "Unknown";
  let vendorName = "Unknown";
  
  // Extract VENDOR line (this is the vendor in McPEC format)
  const vendorLineMatch = fullText.match(/VENDOR\s+([A-Z][A-Za-z\s&\.\-,\"]+?)(?:\s{2,}|\n)/i);
  if (vendorLineMatch) {
    vendorName = vendorLineMatch[1].trim().replace(/\s+/g, ' ').replace(/[\"]/g, '');
  }
  
  // Extract BUYER line
  const buyerLineMatch = fullText.match(/BUYER\s*:?\s*([A-Z][^\n]{3,80}?)(?:\s*\||$)/i);
  if (buyerLineMatch) {
    buyerName = buyerLineMatch[1].trim().replace(/\s+/g, ' ');
  }
  
  // If buyer still unknown, try from company header
  if (buyerName === "Unknown") {
    const headerMatch = fullText.match(/^([A-Z][A-Z\s&]+(?:PTE|LTD|LTD\.|PTE\. LTD))/m);
    if (headerMatch) {
      buyerName = headerMatch[1].trim().replace(/\s+/g, ' ');
    }
  }
  
  // Extract PO date - improved for McPEC format
  let poDate = null;
  
  // Try to extract from PO number (format: McPEC/PO/65105/2025/06/0098/RL)
  const dateFromPOMatch = poNumber.match(/\/(\d{4})\/(\d{2})\//);
  if (dateFromPOMatch) {
    const year = dateFromPOMatch[1];
    const month = dateFromPOMatch[2];
    poDate = new Date(`${year}-${month}-01`);
  }
  
  // If not found, try other patterns
  if (!poDate) {
    const datePatterns = [
      /(?:PO\s+Date|Order\s+Date|Date)\s*:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
      /(?:Dated?|Issue[d]?\s+Date)\s*:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i,
    ];
    
    for (const pattern of datePatterns) {
      const match = fullText.match(pattern);
      if (match && match[1]) {
        poDate = parseDate(match[1]);
        if (poDate) break;
      }
    }
  }
  
  // Extract total amount - look for USD amounts
  const totalPatterns = [
    /TOTAL\s*\|\s*USD\s*\|\s*i?\s*$/im,  // Find "TOTAL | USD |" line
    /(?:GRAND\s+TOTAL|NET\s+TOTAL)\s*:?\s*(?:VND|USD|EUR)?\s*([\d,\.]+)/i,
  ];
  
  let totalAmount = 0;
  // For this document, total seems to be not filled, so keep as 0
  for (const pattern of totalPatterns) {
    const match = fullText.match(pattern);
    if (match && match[1]) {
      const amount = parseFloat(match[1].replace(/,/g, ""));
      if (amount > 0) {
        totalAmount = amount;
        break;
      }
    }
  }
  
  // Extract currency
  const currencyMatch = fullText.match(/CURRENCY\s+AMOUNT.*?(USD|VND|EUR)/is) || 
                        fullText.match(/TOTAL\s*\|\s*(USD|VND|EUR)/i);
  const currency = currencyMatch ? currencyMatch[1].toUpperCase() : "USD";
  
  // Extract payment terms - improved
  const paymentMatch = fullText.match(/Payment\s+terms?\s+shall\s+be\s+(\d+)\s+days/i) ||
                       fullText.match(/(?:Payment\s+Terms?)\s*:?\s*([^\n]{5,100})/i);
  const paymentTerms = paymentMatch ? paymentMatch[1].trim() : null;
  
  // Extract delivery info
  const deliveryTermsMatch = fullText.match(/Terms\s+shall\s+be\s+([A-Z]{3})\s+in\s+accordance/i) ||
                             fullText.match(/(?:Delivery\s+Terms?|Incoterms?)\s*:?\s*([^\n]{3,50})/i);
  const deliveryTerms = deliveryTermsMatch ? deliveryTermsMatch[1].trim() : null;
  
  const deliveryDaysMatch = fullText.match(/within\s+(\d+)\s+working\s+weeks/i);
  const deliveryDays = deliveryDaysMatch ? parseInt(deliveryDaysMatch[1]) * 7 : null; // Convert weeks to days
  
  // Extract linked RFQ if mentioned
  const rfqMatch = fullText.match(/(?:RFQ|ITB|Ref)\s*(?:No\.?|Number)?\s*:?\s*([A-Z0-9\-\/]+)/i);
  const rfqNumber = rfqMatch ? rfqMatch[1].trim() : null;
  // If PO appears to be empty (no vendor and no total), flag for review and don't save
  try {
    const vnormPO = String(vendorName || '').trim().toLowerCase();
    const vendorUnknownPO = !vnormPO || /^unknown/i.test(vnormPO) || vnormPO === 'unknown vendor' || vnormPO.length < 3 || /\b(bidder|\[bidder|insert name|name of bidder)\b/i.test(vnormPO) || /\[.*\]/.test(String(vendorName));
    const totalMissingPO = !totalAmount || Number.isNaN(Number(totalAmount)) || Number(totalAmount) <= 0;
    if (vendorUnknownPO && totalMissingPO) {
      try {
        const reviewDir = path.join(__dirname, '..', '..', 'storage', 'review-needed');
        await fs.mkdir(reviewDir, { recursive: true });
        const flag = {
          documentId,
          poNumber: poNumber || null,
          buyerName: buyerName || null,
          vendorName: vendorName || null,
          totalAmount: totalAmount || 0,
          currency: currency || null,
          reason: 'po_missing_vendor_and_total',
          flaggedAt: new Date().toISOString(),
        };
        await fs.writeFile(path.join(reviewDir, `${documentId}-po_needs_review.json`), JSON.stringify(flag, null, 2), 'utf8');
        console.log(`[Extractor] PO appears empty — flagged for manual review: ${documentId}`);
      } catch (e) {
        console.warn('[Extractor] Failed to write PO review flag file:', e.message);
      }
      return null;
    }
  } catch (e) {
    // ignore
  }

  // Save PO (only use fields that exist in schema)
  // If DATABASE_URL is not set (local/dry-run), avoid attempting a DB upsert — write a preview flag instead
  if (!process.env.DATABASE_URL) {
    try {
      const reviewDir = path.join(__dirname, '..', '..', 'storage', 'review-needed');
      await fs.mkdir(reviewDir, { recursive: true });
      const preview = {
        poNumber,
        poDate: poDate ? poDate.toISOString() : null,
        rfqNumber,
        buyerName,
        vendorName,
        totalAmount,
        currency,
        paymentTerms,
        deliveryTerms,
        deliveryDays,
        documentId,
        sourceFilePath: sourceFilePath,
        note: 'dry-run - DATABASE_URL not set; no DB write performed',
        generatedAt: new Date().toISOString(),
      };
      await fs.writeFile(path.join(reviewDir, `${documentId}-po_preview.json`), JSON.stringify(preview, null, 2), 'utf8');
      console.log('[Extractor] DATABASE_URL not set — dry-run: PO preview written to', path.join(reviewDir, `${documentId}-po_preview.json`));
      return preview;
    } catch (e) {
      console.warn('[Extractor] Failed to write PO preview file:', e.message);
      return null;
    }
  }

  const po = await prisma.purchase_orders.upsert({
    where: { poNumber },
    update: {
      poDate,
      rfqNumber,
      buyerName,
      vendorName,
      totalAmount,
      currency,
      paymentTerms,
      deliveryTerms,
      deliveryDays,
      documentId,
      sourceFilePath: sourceFilePath,
      updatedAt: new Date(),
    },
    create: {
      poNumber,
      poDate,
      rfqNumber,
      buyerName,
      vendorName,
      totalAmount,
      currency,
      paymentTerms,
      deliveryTerms,
      deliveryDays,
      documentId,
      sourceFilePath: sourceFilePath,
    },
  });
  
  console.log(`[Extractor] PO data saved: ${po.id}`);
  console.log(`[Extractor] PO#: ${poNumber}`);
  console.log(`[Extractor] Buyer: ${buyerName} | Vendor: ${vendorName}`);
  console.log(`[Extractor] Amount: ${totalAmount} ${currency} | Delivery: ${deliveryTerms} (${deliveryDays} days)`);
  return po;
}

/**
 * Extract invoice data
 */
async function extractInvoiceData(documentId, document) {
  const { pageContent, title, metadata } = document;
  const fullText = pageContent || "";
  const sourceFilePath = (metadata && metadata.originalFileName) ? metadata.originalFileName : (title || documentId);
  
  // Extract invoice number
  const invNumMatch = fullText.match(/(?:Invoice|INV)\s*(?:No\.?|Number)?\s*:?\s*([A-Z0-9\-]+)/i);
  const invoiceNumber = invNumMatch ? invNumMatch[1].trim() : title;
  
  // Extract date
  const dateMatch = fullText.match(/(?:Date|Issued)\s*:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i);
  const invoiceDate = dateMatch ? parseDate(dateMatch[1]) : new Date();
  
  // Extract total
  const totalMatch = fullText.match(/(?:Total|Amount)\s*:?\s*(?:VND|USD)?\s*([\d,\.]+)/i);
  const totalAmount = totalMatch ? parseFloat(totalMatch[1].replace(/,/g, "")) : 0;
  
  const currencyMatch = fullText.match(/(?:VND|USD|EUR)/i);
  const currency = currencyMatch ? currencyMatch[0].toUpperCase() : "VND";
  
  // Link to PO if mentioned
  const poMatch = fullText.match(/(?:PO|P\.O\.|Purchase\s+Order)\s*(?:No\.?|Number)?\s*:?\s*([A-Z0-9\-]+)/i);
  const poNumber = poMatch ? poMatch[1].trim() : null;
  
  let poId = null;
  if (poNumber) {
    const linkedPO = await prisma.purchase_orders.findUnique({
      where: { poNumber },
    });
    poId = linkedPO?.id || null;
  }
  
  // Save invoice
  const invoice = await prisma.invoices.upsert({
    where: { invoiceNumber },
    update: {
      invoiceDate,
      totalAmount,
      currency,
      poId,
      documentId,
      sourceFilePath: sourceFilePath,
    },
    create: {
      invoiceNumber,
      invoiceDate,
      totalAmount,
      currency,
      poId,
      documentId,
      sourceFilePath: sourceFilePath,
    },
  });
  
  console.log(`[Extractor] Invoice data saved: ${invoice.id}`);
  return invoice;
}

/**
 * Extract certificate data
 */
async function extractCertificateData(documentId, document) {
  const { pageContent, title, metadata } = document;
  const fullText = pageContent || "";
  const sourceFilePath = (metadata && metadata.originalFileName) ? metadata.originalFileName : (title || documentId);
  
  // Determine certificate type
  let certType = "CO"; // Default
  if (/certificate\s+of\s+quality|CQ/i.test(fullText)) certType = "CQ";
  if (/certificate\s+of\s+conformity|COC/i.test(fullText)) certType = "COC";
  if (/FAT|Factory\s+Acceptance\s+Test/i.test(fullText)) certType = "FAT";
  if (/Type\s+Test/i.test(fullText)) certType = "Type Test";
  
  // Extract cert number
  const certNumMatch = fullText.match(/(?:Certificate|Cert)\s*(?:No\.?|Number)?\s*:?\s*([A-Z0-9\-]+)/i);
  const certNumber = certNumMatch ? certNumMatch[1].trim() : title;
  
  // Extract issuer
  const issuerMatch = fullText.match(/(?:Issued\s+by|Issuer)\s*:?\s*([^\n]+)/i);
  const issuedBy = issuerMatch ? issuerMatch[1].trim() : "Unknown";
  
  // Extract date
  const dateMatch = fullText.match(/(?:Date|Issued)\s*:?\s*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i);
  const issuedDate = dateMatch ? parseDate(dateMatch[1]) : null;
  
  // Link to PO
  const poMatch = fullText.match(/(?:PO|P\.O\.|Purchase\s+Order)\s*(?:No\.?|Number)?\s*:?\s*([A-Z0-9\-]+)/i);
  const poNumber = poMatch ? poMatch[1].trim() : null;
  
  let poId = null;
  if (poNumber) {
    const linkedPO = await prisma.purchase_orders.findUnique({
      where: { poNumber },
    });
    poId = linkedPO?.id || null;
  }
  
  // Save certificate
  const certificate = await prisma.certificates.upsert({
    where: { certNumber },
    update: {
      certType,
      issuedBy,
      issuedDate,
      poId,
      documentId,
      sourceFilePath: sourceFilePath,
    },
    create: {
      certNumber,
      certType,
      issuedBy,
      issuedDate,
      poId,
      documentId,
      sourceFilePath: sourceFilePath,
    },
  });
  
  console.log(`[Extractor] Certificate data saved: ${certificate.id}`);
  return certificate;
}

/**
 * Extract contract data and analyze legal risks
 */
async function extractContractData(documentId, document) {
  const { pageContent } = document;
  const fullText = pageContent || "";
  
  // Legal risk patterns to detect
  const riskPatterns = [
    {
      type: "penalty",
      level: "high",
      pattern: /(?:penalty|liquidated\s+damages|phạt)\s+(?:of|là)?\s*(\d+\.?\d*)\s*%/gi,
      description: "High penalty clause detected",
    },
    {
      type: "payment_terms",
      level: "medium",
      pattern: /payment\s+(?:within|in)\s+(\d+)\s+days/gi,
      description: "Short payment terms",
    },
    {
      type: "liability",
      level: "high",
      pattern: /unlimited\s+liability|trách\s*nhiệm\s*vô\s*hạn/gi,
      description: "Unlimited liability clause",
    },
    {
      type: "warranty",
      level: "medium",
      pattern: /warranty\s+(?:for|period)\s+(\d+)\s+(?:years?|months?)/gi,
      description: "Long warranty period",
    },
  ];
  
  const detectedRisks = [];
  
  for (const riskPattern of riskPatterns) {
    const matches = [...fullText.matchAll(riskPattern.pattern)];
    
    for (const match of matches) {
      const clauseStart = Math.max(0, match.index - 200);
      const clauseEnd = Math.min(fullText.length, match.index + match[0].length + 200);
      const clauseText = fullText.substring(clauseStart, clauseEnd).trim();
      
      // Save risk to database
      const risk = await prisma.legal_risks.create({
        data: {
          documentId,
          documentType: "contract",
          riskType: riskPattern.type,
          riskLevel: riskPattern.level,
          clauseText,
          riskDescription: `${riskPattern.description}: ${match[0]}`,
          detectionMethod: "pattern",
        },
      });
      
      detectedRisks.push(risk);
    }
  }
  
  console.log(`[Extractor] Detected ${detectedRisks.length} legal risks in contract`);
  return detectedRisks;
}

/**
 * Helper: Parse date from various formats
 */
function parseDate(dateStr) {
  // Try common formats: DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD
  const formats = [
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})/,  // DD/MM/YYYY or MM/DD/YYYY
    /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/,    // YYYY-MM-DD
  ];
  
  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      try {
        // Assume DD/MM/YYYY for Vietnamese docs
        const day = parseInt(match[1]);
        const month = parseInt(match[2]);
        const year = parseInt(match[3]);
        
        // Expand 2-digit year
        const fullYear = year < 100 ? 2000 + year : year;
        
        // JavaScript months are 0-indexed
        return new Date(fullYear, month - 1, day);
      } catch (e) {
        console.error("[Extractor] Date parse error:", e);
      }
    }
  }
  
  return null;
}

/**
 * Helper: Extract source folder from filename
 */
function extractSourceFolder(filename) {
  const match = filename.match(/HST[\/\\]([^\/\\]+)|PO\s+&\s+CERTS[\/\\]([^\/\\]+)/i);
  if (match) {
    return match[1] || match[2] || "Unknown";
  }
  return "Unknown";
}

/**
 * Helper: Extract quotation number from filename
 */
function extractQuotationNumberFromFilename(filename) {
  // Pattern: "Gia MT chao - (250136-MTC).pdf"
  const match = filename.match(/\(([A-Z0-9\-]+)\)/i);
  if (match) return match[1];
  
  // Fallback: use filename without extension
  return path.basename(filename, path.extname(filename));
}

/**
 * Main function: Process all documents in storage
 * @param {string} storageDir - Path to custom-documents folder
 */
async function processAllDocuments(storageDir) {
  try {
    const files = await fs.readdir(storageDir);
    const jsonFiles = files.filter(f => f.endsWith(".json"));
    
    console.log(`[Extractor] Found ${jsonFiles.length} documents to process`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const file of jsonFiles) {
      try {
        const documentId = path.basename(file, ".json");
        const filePath = path.join(storageDir, file);
        
        await extractDocumentData(documentId, filePath);
        successCount++;
      } catch (error) {
        console.error(`[Extractor] Error processing ${file}:`, error.message);
        errorCount++;
      }
    }
    
    console.log(`[Extractor] Processing complete: ${successCount} success, ${errorCount} errors`);
    
    return {
      total: jsonFiles.length,
      success: successCount,
      errors: errorCount,
    };
  } catch (error) {
    console.error("[Extractor] Error reading storage directory:", error);
    throw error;
  }
}

module.exports = {
  extractDocumentData,
  processAllDocuments,
  detectDocumentType,
};
