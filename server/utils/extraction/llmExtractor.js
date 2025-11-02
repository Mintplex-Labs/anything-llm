const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * LLM-based Document Extractor
 * Uses configured LLM to intelligently extract structured data from any document format
 */

/**
 * Get the configured LLM provider
 */
async function getLLMProvider() {
  try {
    const { getLLMProvider } = require("../helpers");
    const provider = getLLMProvider({
      provider: null, // Use system default LLM
      model: null,
    });
    return provider;
  } catch (error) {
    console.error("[LLM Extractor] Failed to get LLM provider:", error.message);
    return null;
  }
}

/**
 * Pre-extract obvious fields using deterministic regex to fill gaps when LLM misses
 */
function preExtractFields(documentType, text) {
  const out = {};
  if (!text) return out;

  // normalize (but keep original)
  const raw = text;
  const normalized = text.replace(/\r\n/g, '\n');

  // 1) RFQ / ITB / Ref
  const rfqMatch = raw.match(/(?:RFQ|ITB|Ref(?:\.|erence)?\s*No\.?|Ref)\s*(?:No\.?|Number)?\s*[:\.]?\s*([A-Z0-9\-\/\._]{3,80})/i)
    || raw.match(/Bidding\s+Package\s+No\.?\s*[:\.]?\s*([A-Z0-9\-\/\._]{3,80})/i);
  if (rfqMatch) out.rfqNumber = rfqMatch[1].trim();

  // 2) Tax codes (prefer labeled)
  const taxMatch = raw.match(/(?:Tax\s+Code|MST|Tax\s+ID|Tax\s*No\.?|VAT\s+No\.?|Tax Number)\s*[:\.]?\s*([0-9\-\.\s]{6,20})/i);
  if (taxMatch) out.vendorTaxCode = String(taxMatch[1]).replace(/[^0-9]/g, '').trim();
  // fallback: prefer tax code near "Bidder:" or "Bidder" label
  if (!out.vendorTaxCode) {
    const bidderCtx = raw.match(/Bidder\s*[:\-]\s*([A-Za-z0-9\s\,\.\-&]+?)(?:\n|$)/i);
    if (bidderCtx) {
      const nearText = bidderCtx[0].slice(0, 200) + raw.slice(bidderCtx.index, bidderCtx.index + 200);
      const candidate = nearText.match(/\b(\d{9,13})\b/);
      if (candidate) out.vendorTaxCode = candidate[1];
    }
  }

  // 3) Delivery days (calendar days)
  const delMatch = raw.match(/Delivery\s*(?:time|time\:)?\s*[:\-]?\s*(\d{1,4})\s*(?:calendar\s+)?days/i) || raw.match(/(\d{2,4})\s*calendar\s*days/i);
  if (delMatch) out.deliveryDays = parseInt(delMatch[1]);

  // 4) Incoterm
  const incoterm = raw.match(/\b(DAP|DDP|FOB|CFR|CIF|EXW)\b/i);
  if (incoterm) out.deliveryTerms = incoterm[1].toUpperCase();

  // 5) Warranty extraction — more robust & take FIRST mentioned (not MAX)
  // Look for a "warrant" section or the word "warranty"
  let warrantyText = null;
  const warrBlock = raw.match(/(?:Warranty|Warranty time|Warranty and Performance Guarantee)[:\s\-]{0,10}([\s\S]{0,400})/i);
  if (warrBlock) warrantyText = warrBlock[1];
  else {
    // fallback: search for lines containing 'warranty' or 'warranty time'
    const lineMatch = raw.match(/[^\n]{0,200}warranty[^\n]{0,200}/i);
    if (lineMatch) warrantyText = lineMatch[0];
  }

  if (warrantyText) {
    // find first explicit number mention e.g., "eighteen (18) months" or "18 months" or "1 year"
    const numberParen = warrantyText.match(/(?:zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|eighteen|twenty|thirty|thirty-six|\d{1,2})\s*\(?\s*(\d{1,2})?\s*\)?\s*(?:months|month|years|year)/i);
    if (numberParen) {
      // if parentheses number exist (group 1), use it; else parse leading number token
      const parenNum = numberParen[1];
      if (parenNum) {
        out.warrantyMonths = parseInt(parenNum);
      } else {
        // capture the numeric token (maybe written as digits before 'months' or 'year')
        const simple = numberParen[0].match(/(\d{1,2})\s*(?:months|month|years|year)/i);
        if (simple) {
          const n = parseInt(simple[1]);
          out.warrantyMonths = /year/i.test(numberParen[0]) ? n * 12 : n;
        } else {
          // final fallback: convert some words
          if (/eighteen/i.test(numberParen[0])) out.warrantyMonths = 18;
          else if (/twelve/i.test(numberParen[0])) out.warrantyMonths = 12;
          else out.warrantyMonths = null;
        }
      }
    }
  }

  // 6) Governing law heuristic
  const gov = raw.match(/govern(?:ed|ing)\s+by\s+(?:the\s+)?laws?\s+of\s+([A-Za-z\s]+)/i) || raw.match(/jurisdiction\s*[:\-]?\s*([A-Za-z\s]+)/i) || raw.match(/singapore\s+mediation|singapore\s+court|governed\s+by\s+singapore/i);
  if (gov) {
    try {
      const g = (gov[1] || gov[0]).replace(/[^A-Za-z\s]/g, '').trim();
      if (/singapore/i.test(g)) out.governingLaw = 'Singapore';
      else if (/vietnam|việt|vn/i.test(g)) out.governingLaw = 'Vietnam';
      else out.governingLaw = g;
    } catch (e){}
  } else {
    const countryMatch = raw.match(/\b(Singapore|Vietnam|Viet Nam|United Kingdom|UK|England|Malaysia|Indonesia|China|USA|United States|Australia)\b/i);
    if (countryMatch) out.governingLaw = countryMatch[1].replace(/\s+/g, ' ').trim();
  }

  // 7) Validity days
  const val = raw.match(/valid(?:ity)?\s*(?:for)?\s*(?:the)?\s*(\d{1,3})\s*days/i);
  if (val) out.validityDays = parseInt(val[1]);

  // 8) Payment terms (block)
  const paymentMatch = raw.match(/(payment terms|payment schedule|payment[:\-])/i);
  if (paymentMatch) {
    const idx = paymentMatch.index;
    const block = raw.substring(idx, Math.min(raw.length, idx + 600));
    out.paymentTerms = block.split('\n').slice(0,6).join(' ').replace(/\s+/g,' ').trim();
  } else {
    const percentMatch = raw.match(/(\d+%\s*(?:upon|on)\s*(?:signing|contract|shipment|delivery))/i);
    if (percentMatch) out.paymentTerms = percentMatch[0];
  }

  // 9) Penalty
  const penaltyMatch = raw.match(/liquidat(?:ed|ion)?\s+damag(?:e|es)[:\s\-]*([^\n]{5,200})/i) || raw.match(/(?:penalt(?:y|ies)|liquidated damages)[:\-]?\s*([\d\.%\sand\w,]{3,200})/i);
  if (penaltyMatch) out.penaltyClauses = String(penaltyMatch[1]).replace(/\s+/g,' ').trim();

  // 10) Heuristics for bidder/vendor/competitor names
  // If document contains "LETTER OF BID" or "APPLICATION FOR BIDDING" treat as quotation and extract Bidder:
  const letterBid = raw.match(/LETTER OF BID|APPLICATION FOR BIDDING|SUMMARY OF BIDDING PRICE/i);
  if (letterBid) {
    const bidderMatch = raw.match(/Bidder\s*[:\-]\s*([A-Za-z0-9\.,&\-\(\)\/\s]{3,120})/i)
      || raw.match(/We,\s*([A-Za-z0-9\.,&\-\(\)\/\s]{3,120})\s+hereby\s+pledge/i)
      || raw.match(/We,\s*([A-Za-z0-9\.,&\-\(\)\/\s]{3,120})\s+hereby\s+submit/i);
    if (bidderMatch) out.vendorName = bidderMatch[1].trim();
  }
  // Buyer detection (letterheads)
  const buyerMatch = raw.match(/(?:Attention to:|To:|Buyer:)\s*([A-Za-z0-9\.,&\-\(\)\/\s]{3,120})/i);
  if (buyerMatch) out.buyerName = buyerMatch[1].trim();
  // Also try header top (first 200 chars) as buyer or issuer
  const head = raw.substring(0,300);
  const headerCompany = head.match(/([A-Z][A-Za-z0-9\.,&\-\s]{5,120}?(?:Corporation|Corporation J\.S|JSC|Company|CO\.|CO|Ltd|Limited|Corporation|CORP|PETROVIETNAM|MT CORP|MTCO|GLOCOM))/i);
  if (headerCompany && !out.buyerName) out.buyerName = headerCompany[1].trim();

  return out;
}


/**
 * Extract document data using LLM
 * @param {string} documentId - Document UUID
 * @param {Object} document - Document object with pageContent and title
 * @param {string} documentType - Type: rfq, po, quotation, invoice, certificate, contract
 */
async function extractWithLLM(documentId, document, documentType) {
  const llm = await getLLMProvider();
  if (!llm) {
    console.warn("[LLM Extractor] No LLM provider available, falling back to regex");
    return null;
  }

  const { pageContent, title } = document;
  
  // Create extraction prompt based on document type
  const prompt = createExtractionPrompt(documentType, pageContent, title);
  
  try {
    console.log(`[LLM Extractor] Using LLM to extract ${documentType} data from: ${title}`);
    
    const response = await llm.getChatCompletion(
      [
        {
          role: "system",
          content: `
            You are a professional document classifier and data extraction expert.

            ### Step 1. CLASSIFY DOCUMENT TYPE
            Classify into one of:
            - "rfq" (Request for Quotation): buyer invites others to bid (“Invitation for Bids”, “Request for Quotation”, etc.)
            - "quotation" (Letter of Bid / Bid Proposal): bidder submitting price offer (“We, [Company name], hereby submit our quotation/bid”)
            - "contract": signed agreement after winning a bid
            - "invoice": billing document
            - "po" (purchase order): buyer issues order to seller

            If unsure:
            - "rfq" = buyer’s invitation
            - "quotation" = bidder’s response

            ### Step 2. EXTRACT STRUCTURED DATA
            Return **ONLY valid JSON** (no markdown, no explanation).
            Include all fields relevant to the detected type.
            Important fields:
            - companyName / bidderName
            - competitorName (if mentioned)
            - buyerName
            - totalBidPrice / quotationValue
            - warrantyMonths (integer, only if explicitly stated)
            - deliveryTime or deliveryWeeks
            - scopeOfSupply
            - validityPeriodDays
            - bidBond info
            - projectName

            Rules:
            - If warranty not clearly stated, leave as null (don’t assume 36).
            - Extract company/bidder names carefully (look for headers, signatures, or letterhead).
            - Never omit competitor info if visible (even in letterhead or footer).

            Example output for quotation:
            {
              "documentType": "quotation",
              "bidderName": "MT Corp",
              "competitorName": "PetroVietnam General Services",
              "packageName": "Supply of HV Switchgear",
              "totalBidPrice": 125000.00,
              "warrantyMonths": 18
            }
            `
        },
        {
          role: "user",
          content: prompt
        }
      ],
      { temperature: 0.1 }
    );

    // --- Robustly read LLM response text (support various client shapes)
    const rawText = response?.textResponse || response?.content || response?.text || (typeof response === 'string' ? response : null);
    if (!rawText) {
      console.warn("[LLM Extractor] No response text from LLM - full response object:", response);
      return null;
    }

    // Try to extract the FIRST JSON object found in the text robustly
    const firstJsonMatch = rawText.match(/\{[\s\S]*?\}/);
    if (!firstJsonMatch) {
      console.warn("[LLM Extractor] No JSON object found in LLM response. Raw text (first 1000 chars):", rawText.substring(0,1000));
      return null;
    }

    let extractedData = null;
    try {
      extractedData = JSON.parse(firstJsonMatch[0]);
    } catch (err) {
      // Try a more permissive approach: replace smart quotes / trailing commas etc.
      const cleaned = firstJsonMatch[0]
        .replace(/[\u2018\u2019\u201C\u201D]/g, '"')   // fancy quotes -> normal
        .replace(/,(?=\s*[}\]])/g, '')               // remove trailing commas
        .replace(/\t/g, ' ')
        .trim();
      try {
        extractedData = JSON.parse(cleaned);
      } catch (err2) {
        console.error("[LLM Extractor] Failed to JSON.parse LLM object. cleaned snippet:", cleaned.substring(0,1000), "errors:", err, err2);
        return null;
      }
    }
    console.log(`[LLM Extractor] Successfully extracted ${documentType} data:`, extractedData);

    // Run deterministic pre-extraction and merge missing fields (LLM may miss numeric/label fields)
    try {
      const pre = preExtractFields(documentType, pageContent);
      const filled = [];
      for (const k of Object.keys(pre)) {
        if ((extractedData[k] === null || extractedData[k] === undefined || extractedData[k] === "") && pre[k] != null) {
          extractedData[k] = pre[k];
          filled.push(k);
        }
      }
      
      // CRITICAL: For PO documents, do targeted extraction if LLM missed payment/penalty terms
      if (documentType === 'po') {
        console.log('[LLM Extractor] Checking PO-specific fields...');
        console.log('[LLM Extractor] paymentTerms:', extractedData.paymentTerms ? 'HAS VALUE' : 'NULL/EMPTY');
        console.log('[LLM Extractor] penaltyClauses:', extractedData.penaltyClauses ? 'HAS VALUE' : 'NULL/EMPTY');
        
        // Extract payment terms if missing
        if (!extractedData.paymentTerms || extractedData.paymentTerms === null) {
          console.log('[LLM Extractor] → Payment terms missing, doing targeted extraction...');
          const paymentSection = pageContent.match(/PAYMENT\s+SCHEDULE\s*&?\s*TERMS?:?[\s\S]{10,1500}/i);
          if (paymentSection) {
            const lines = paymentSection[0].split('\n').filter(l => l.trim().length > 5).slice(1, 15); // Skip header
            extractedData.paymentTerms = lines.join(' ').replace(/\s+/g, ' ').trim();
            filled.push('paymentTerms');
            console.log('[LLM Extractor] ✓ Extracted payment terms:', extractedData.paymentTerms.substring(0, 100) + '...');
          } else {
            console.log('[LLM Extractor] ✗ Payment section not found in document');
          }
        }
        
        // Extract penalty clauses if missing
        if (!extractedData.penaltyClauses || extractedData.penaltyClauses === null) {
          console.log('[LLM Extractor] → Penalty clauses missing, doing targeted extraction...');
          const penaltyMatch = pageContent.match(/LIQUIDATED\s+DAMAGES:?[\s\S]{10,500}/i) || 
                              pageContent.match(/penalty.*?(?:per week|per day|maximum)[\s\S]{10,300}/i);
          if (penaltyMatch) {
            const lines = penaltyMatch[0].split('\n').filter(l => l.trim().length > 3).slice(1, 4); // Skip header, take next 3 lines
            extractedData.penaltyClauses = lines.join(' ').replace(/\s+/g, ' ').trim();
            filled.push('penaltyClauses');
            console.log('[LLM Extractor] ✓ Extracted penalty clauses:', extractedData.penaltyClauses);
          } else {
            console.log('[LLM Extractor] ✗ Penalty section not found in document');
          }
        }
      }
      
      if (documentType === "rfq") {
        if (/LETTER OF BID|SUMMARY OF BIDDING PRICE|APPLICATION FOR BIDDING/i.test(pageContent)) {
          documentType = "quotation";
        }
      }


      if (filled.length > 0) console.log(`[LLM Extractor] Filled missing fields from regex: ${filled.join(", ")}`);
    } catch (e) {
      console.warn("[LLM Extractor] Pre-extract merge failed:", e.message);
    }
        // Debug log to see final documentType & key fields before save
    console.log(`[LLM Extractor] Final documentType: ${documentType} — keys extracted:`, Object.keys(extractedData).filter(k => extractedData[k] !== null && extractedData[k] !== undefined));
    // Also print warranty/ vendor quickly for debugging
    console.log(`[LLM Extractor] warrantyMonths (after pre-extract):`, extractedData.warrantyMonths, " vendorName:", extractedData.vendorName || extractedData.bidderName || extractedData.vendor);

    // Save to database based on type (merge of LLM + deterministic fields)
    return await saveExtractedData(documentId, documentType, extractedData, title);
    
  } catch (error) {
    console.error(`[LLM Extractor] Failed to extract ${documentType} data:`, error.message);
    return null;
  }
}

/**
 * Create extraction prompt for specific document type
 */
function createExtractionPrompt(documentType, pageContent, title) {
  const prompts = {
    rfq: `You are a procurement document analyst. Extract RFQ (Request for Quotation) information from this document.

Document Title: ${title}

Document Content (first 6000 chars):
${pageContent.substring(0, 6000)}

Extract and return ONLY a JSON object with these fields (use null if not found):
{
  "rfqNumber": "RFQ number (look for: RFQ No., Request for Quotation No., ITB No.)",
  "packageName": "Package name or lot number if specified",
  "buyerName": "Buyer/client company name (look in letterhead, footer, contact info)",
  "buyerAddress": "Full buyer company address (street, city, country)",
  "buyerContact": "Buyer contact - format: 'Name (email); Name2 (email2)' - combine multiple contacts into one string",
  "buyerTaxCode": "Buyer tax code/Tax ID/VAT number",
  "projectName": "Project name or scope description",
  "submissionDeadline": "Bid/quotation submission deadline in YYYY-MM-DD format. Look for phrases: 'Submission Deadline', 'Closing Date', 'Due Date', 'Submit by', dates near contact section. Convert any date format to YYYY-MM-DD.",
  "validityPeriodDays": "Quotation validity period in DAYS as NUMBER. Look for: 'valid for X days', 'validity period', 'ninety (90) days', 'remain valid for'. Convert spelled numbers to digits (ninety=90). Return only the number.",
  "deliveryWeeks": "Delivery time in WEEKS as NUMBER. Look for: 'within X weeks', 'delivery schedule', 'X weeks after', 'delivery time', 'lead time'. Convert months to weeks (multiply by 4). Return only the number.",
  "deliverySchedule": "Detailed delivery schedule if specified (full text)",
  "deliveryLocation": "Delivery point/location full address. Look for: 'Delivery Point', 'Delivery Location', 'Destination', place names.",
  "bidBondRequired": "true if ANY of these appear: 'Bank Guarantee', 'Bid Bond', 'Performance Bond', 'Bid Security', 'Performance Security', 'three per cent (3%)', guarantee requirements. Otherwise false.",
  "bidBondPercentage": "Bid bond percentage as NUMBER without % sign. Look for: 'X%', 'X per cent', 'three per cent (3%)', percentage near 'bid bond' or 'guarantee'. Extract only the number (e.g., 3 from '3%' or 'three per cent').",
  "bidBondValue": "Bid bond fixed value/amount if specified (with currency)",
  "bidBondDueDays": "Bid bond validity days as NUMBER. Look for bid bond validity period.",
  "technicalReqPages": "Number of technical requirement pages or section reference. Look in Table of Contents for 'Technical Requirements' page number.",
  "scopeOfSupply": "Brief scope of supply/work description (1-2 sentences)"
}

CRITICAL INSTRUCTIONS:
1. For dates: Search the ENTIRE document for submission/closing dates. Common locations: near contact info, in cover letter, submission instructions, or as standalone heading. Convert ANY date format (DD/MM/YYYY, DD Month YYYY, etc.) to YYYY-MM-DD.
2. For validityPeriodDays: Look for "ninety (90) consecutive days", "valid for X days", "validity period". Convert spelled words to numbers (ninety=90, thirty=30).
3. For deliveryWeeks: Search for "within X weeks", "X weeks after contract", "delivery schedule", "lead time". If you see months, multiply by 4 to get weeks. If you see "working weeks", still extract the number.
4. For bidBondRequired: Set to true if you see ANY mention of: Bank Guarantee, Bid Bond, Performance Bond, Bid Security, Performance Security, or percentage requirements (e.g., "3%"). Be generous - if there's ANY guarantee requirement, set true.
5. For bidBondPercentage: Extract the number from phrases like "three per cent (3%)", "3% of bid value", "3 percent". Return only the number.
6. For buyerContact: Combine ALL contact persons with format "Name (email); Name2 (email2)". Look in footer, contact section, or throughout document.
7. Return ONLY valid JSON. Use null for truly missing fields, but search thoroughly first.

EXAMPLES:
- "Submission Deadline: 15 December 2022" → "submissionDeadline": "2022-12-15"
- "valid for ninety (90) consecutive days" → "validityPeriodDays": 90
- "within fourteen (14) working weeks" → "deliveryWeeks": 14
- "Bank Guarantee of three per cent (3%)" → "bidBondRequired": true, "bidBondPercentage": 3

Return ONLY the JSON object, no explanations.`,

    po: `You are a legal contract analyst. Extract ALL Purchase Order (PO) information from this document, paying special attention to legal and compliance terms.

Document Title: ${title}

Document Content (FULL TEXT - Read ALL sections carefully):
${pageContent}

Extract and return ONLY a FLAT JSON object (no nested objects) with these fields:

{
  "poNumber": "PO number (look for: PO#, P.O., Purchase Order No.)",
  "rfqNumber": "Related RFQ/ITB number if mentioned",
  "buyerName": "Buyer/customer company name",
  "vendorName": "Vendor/supplier company name",
  "poDate": "PO issue date in YYYY-MM-DD format",
  "totalAmount": "Total amount as number",
  "currency": "Currency code (VND, USD, EUR, etc.)",
  "paymentTerms": "REQUIRED - Search ENTIRE document for payment terms. Look for sections: 'PAYMENT SCHEDULE', 'PAYMENT TERMS', percentages (20%, 70%, 10%), milestone payments (upon signing, before shipment, upon delivery), payment period (30 days, 60 days). Extract ALL payment milestones and combine into one string. Example: '20% upon signing contract; 70% before shipment; 10% upon final documentation; Payment terms: 30 days from invoice'",
  "deliveryTerms": "Delivery terms/Incoterms (CFR, FOB, CIF, DDP, DAP, EXW, etc.)",
  "deliveryDays": "Delivery lead time in days as number (convert weeks to days: multiply weeks by 7)",
  "warrantyTerms": "Warranty/guarantee terms - extract duration, coverage period, repair/replacement terms",
  "penaltyClauses": "REQUIRED - Search for 'LIQUIDATED DAMAGES', 'PENALTY', 'LATE DELIVERY'. Look for percentage per week/day (e.g., '19% per week'), maximum cap (e.g., 'maximum 8%'). Extract EXACT text with numbers. Example: '19% per week and subject to maximum 8% of Total Purchase Order value'",
  "qualityStandards": "Quality specifications/standards - ISO standards, brand new requirement, fitness for purpose",
  "inspectionReqs": "Inspection/testing requirements - FAT, SAT, factory test, witness testing, documentation",
  "complianceReqs": "Legal compliance/regulatory requirements - certificates required (COO, COC, mill certs), approvals",
  "insuranceReqs": "Insurance requirements - insurance coverage, marine insurance, all-risk insurance",
  "disputeResolution": "Dispute resolution/arbitration - governing law, arbitration clause, jurisdiction. Look for 'governed by', 'Singapore Court', 'arbitration', 'mediation'",
  "specialConditions": "Special terms/conditions - partial shipment, transshipment, approval requirements",
  "legalRisks": ["CRITICAL: Analyze the ACTUAL CONTRACT CONTENT and list SPECIFIC legal risks found. Check these areas:
    - Missing PO date/issue date → 'PO issue date not specified'
    - Payment terms missing or vague → 'No payment terms specified, creating uncertainty for cash flow'
    - Delivery deadline vague (e.g., 'estimated', 'or earliest') → 'Delivery lead time expressed as estimate only, no firm deadline'
    - NO penalty/liquidated damages clause → 'No penalty clause for late delivery'
    - Warranty too short or unclear → 'Warranty period may be insufficient for long-term operation'
    - Acceptance criteria vague → 'Acceptance criteria not clearly defined'
    - Insurance not mentioned → 'Insurance requirements missing'
    - No dispute resolution clause → 'No explicit dispute resolution or arbitration provision'
    - Payment security weak (TT only, no LC/guarantee) → 'Payment method only TT, no guarantee of payment security'
    - ONLY list risks ACTUALLY present in this contract. Do NOT list generic risks if the clause exists clearly."]
}

CRITICAL EXTRACTION RULES:
1. **paymentTerms**: MUST extract if ANY payment information exists. Search for:
   - Section titled "PAYMENT SCHEDULE & TERMS" or "PAYMENT TERMS"
   - Percentages: "20%", "70%", "10%"
   - Keywords: "upon signing", "before shipment", "after delivery", "T/T", "LC"
   - Payment period: "30 days", "60 days", "from invoice"
   - Combine ALL found into one descriptive string
   - Do NOT return null if payment info exists ANYWHERE in document

2. **penaltyClauses**: MUST extract if ANY penalty/liquidated damages mentioned. Search for:
   - Section titled "LIQUIDATED DAMAGES" or "PENALTY"
   - Percentage rates: "19%", "1%", "0.5%"
   - Time periods: "per week", "per day"
   - Maximum caps: "maximum 8%", "not exceed X%"
   - Extract EXACT wording with all numbers
   - Do NOT return null if penalty clause exists

3. **disputeResolution**: Look for "governed by", "Singapore", "arbitration", "mediation"

4. **legalRisks**: BE SPECIFIC. Only flag ACTUAL missing or vague items.

5. Read ENTIRE pageContent provided (not just first 4000 chars) - all payment and penalty terms are usually in middle/end of document

Return ONLY the JSON object, no explanations or comments.`,

    quotation: `Extract Quotation/Bid/Proposal information from this document.

Document Title: ${title}

Document Content (Beginning - Company info, bid details):
${pageContent.substring(0, 6000)}

Document Content (Middle - Terms & Conditions, pricing details):
${pageContent.substring(Math.max(0, Math.floor(pageContent.length * 0.7)), Math.floor(pageContent.length * 0.7) + 4000)}

Extract and return ONLY a JSON object with these fields (use null if not found):

CRITICAL INSTRUCTIONS:
1. quotationNumber: Look for "REF:", "Bid No.", "Quote No.", "Proposal No." at document top (in Beginning section). Extract EXACT text after "REF:" or similar keyword.

2. vendorTaxCode: Search in Beginning section for:
   - "Tax Code: 0303014918" pattern
   - "Bidder: MT Corp, Tax Code: XXXXXXXXXX" pattern  
   - Look in LETTER OF BID section, near company name
   - Extract ONLY the numeric tax code (10 digits for Vietnam)

3. deliveryDays: Extract from "Delivery Schedule" table (in Beginning) or "Terms and Conditions" section (in Middle). 
   - Look for: "150 calendar days after", "Delivery time:", "3. Delivery time:"
   - CONVERT to integer DAYS: "150 calendar days" → 150, "5 months" → 150, "3 weeks" → 21

4. deliveryTerms: Look for Incoterms in Middle section:
   - Search for standalone words: "DAP", "DDP", "FOB", "CFR", "CIF", "EXW"
   - Common locations: "Note: DAP MT Corp...", price table columns, Terms section
   - Extract ONLY the Incoterm (3 letters usually)

5. warrantyMonths: Look in "Warranty time:" or "Warranty:" in Middle section.
   - Common formats: 
     * "18 months from delivery or 12 months from commissioning, whichever comes first" → 18
     * "eighteen (18) months from delivery or twelve (12) months after commissioning whichever comes first" → 18
   - Rule: When there are TWO warranty periods with "OR" / "whichever comes first/earlier":
     * Take the FIRST number mentioned (the one from delivery/site)
     * Example: "18 months OR 12 months" → warrantyMonths: 18
   - If only ONE warranty period mentioned: extract that number
   - "2 years" → 24, "1 year" → 12
   - Do NOT add or multiply numbers (18 OR 12 is NOT 36!)

6. validityDays: Look for "Validity of proposal:", "Valid until", "Bid validity", "Validity of the BDB" in Beginning section.
   - Extract integer: "90 days" → 90

EXAMPLES FROM REAL QUOTATIONS:
- "Bidder: MT Corp, Tax Code: 0303014918" → vendorTaxCode: "0303014918"
- "REF: 250136-MTCO ORIGINAL" → quotationNumber: "250136-MTCO ORIGINAL"  
- "3 Delivery time:\n150 calendar days after receiving of Letter of Intent" → deliveryDays: 150
- "Note:\nDAP MT Corp will use taxes exemption" → deliveryTerms: "DAP"
- "Warranty: eighteen (18) months from delivery or twelve (12) months after commissioning whichever comes first" → warrantyMonths: 18 (NOT 36!)
- "Validity of the BDB is 90 days, from the deadline" → validityDays: 90

{
  "quotationNumber": "Quotation/bid reference number",
  "rfqNumber": "Related RFQ/ITB/tender number (look for 'ITB No.', 'Tender No.', 'RFQ No.')",
  "vendorName": "Vendor/bidder company name (company issuing this quotation)",
  "vendorTaxCode": "Vendor tax code/tax ID/MST",
  "totalAmount": "Total quoted/bid price as number (look in price summary, total bid price)",
  "currency": "Currency code (VND, USD, EUR, etc.)",
  "quotationDate": "Quotation/bid submission date in YYYY-MM-DD format",
  "validityDays": "Validity period in days as integer (e.g., 90, 60, 30)",
  "deliveryDays": "Delivery time in days as integer (convert from weeks/months/calendar days)",
  "deliveryTerms": "Delivery terms/Incoterms (DDP, DAP, FOB, CFR, CIF, EXW, etc.)",
  "warrantyMonths": "Warranty period in months as integer (convert from years if needed)"
}

Return ONLY the JSON object, no explanations.`,

    invoice: `Extract Invoice information from this document.

Document Title: ${title}

Document Content:
${pageContent.substring(0, 4000)}

Extract and return ONLY a JSON object with these fields (use null if not found):
{
  "invoiceNumber": "Invoice number",
  "poNumber": "Related PO number (if mentioned)",
  "vendorName": "Vendor/supplier company name",
  "clientName": "Client/buyer company name",
  "invoiceDate": "Invoice date in YYYY-MM-DD format",
  "dueDate": "Payment due date in YYYY-MM-DD format",
  "totalAmount": "Total invoice amount as number",
  "taxAmount": "Tax amount as number",
  "currency": "Currency code (VND, USD, EUR, etc.)",
  "paymentStatus": "Payment status (paid, pending, overdue)"
}

Return ONLY the JSON object, no explanations.`,

    certificate: `Extract Certificate information from this document.

Document Title: ${title}

Document Content:
${pageContent.substring(0, 4000)}

Extract and return ONLY a JSON object with these fields (use null if not found):
{
  "certificateNumber": "Certificate number",
  "poNumber": "Related PO number (if mentioned)",
  "certificateType": "Type of certificate (COO, COC, etc.)",
  "issuer": "Issuing authority",
  "issueDate": "Issue date in YYYY-MM-DD format",
  "expiryDate": "Expiry date in YYYY-MM-DD format",
  "productDescription": "Product description",
  "quantity": "Quantity as number",
  "origin": "Country of origin"
}

Return ONLY the JSON object, no explanations.`
  };

  return prompts[documentType] || prompts.rfq;
}

/**
 * Save extracted data to appropriate table
 */
async function saveExtractedData(documentId, documentType, data, sourceFilePath) {
  try {
    switch (documentType) {
      case "rfq":
        // Minimal normalization but rely on LLM to provide fields (LLM-only mode)
        const rfqData = {
          ...data,
          buyerContact: data.buyerContact && typeof data.buyerContact === 'object'
            ? JSON.stringify(data.buyerContact)
            : data.buyerContact,
        };

        // Normalize some common types returned by LLM
        if (rfqData.bidBondPercentage && typeof rfqData.bidBondPercentage === 'string') {
          const num = rfqData.bidBondPercentage.match(/(\d+(?:\.\d+)?)/);
          rfqData.bidBondPercentage = num ? parseFloat(num[1]) : null;
        }
        if (rfqData.bidBondRequired && typeof rfqData.bidBondRequired === 'string') {
          rfqData.bidBondRequired = /true|yes|required|required\b/i.test(rfqData.bidBondRequired);
        }

          // Build sanitized payload for rfq_metadata (avoid unknown args)
          const rfqPayload = {
            rfqNumber: rfqData.rfqNumber || `RFQ-${documentId.substring(0, 8)}`,
            projectName: rfqData.projectName || null,
            packageName: rfqData.packageName || null,
            buyerName: rfqData.buyerName || null,
            buyerAddress: rfqData.buyerAddress || null,
            buyerContact: rfqData.buyerContact || null,
            buyerTaxCode: rfqData.buyerTaxCode || null,
            submissionDeadline: rfqData.submissionDeadline ? new Date(rfqData.submissionDeadline) : null,
            validityPeriodDays: rfqData.validityPeriodDays || rfqData.validityDays || 90,
            deliveryWeeks: rfqData.deliveryWeeks || null,
            deliverySchedule: rfqData.deliverySchedule || null,
            deliveryLocation: rfqData.deliveryLocation || null,
            bidBondRequired: typeof rfqData.bidBondRequired === 'boolean' ? rfqData.bidBondRequired : (/true|yes|required/i.test(String(rfqData.bidBondRequired || ''))),
            bidBondPercentage: rfqData.bidBondPercentage != null ? parseFloat(rfqData.bidBondPercentage) : null,
            bidBondValue: rfqData.bidBondValue || null,
            bidBondDueDays: rfqData.bidBondDueDays || null,
            technicalReqPages: rfqData.technicalReqPages != null ? String(rfqData.technicalReqPages) : null,
            scopeOfSupply: rfqData.scopeOfSupply || null,
            sourceFolder: sourceFilePath,
            documentId,
          };

          return await prisma.rfq_metadata.upsert({
            where: {
              rfqNumber: rfqPayload.rfqNumber,
            },
            update: {
              ...rfqPayload,
              updatedAt: new Date(),
            },
            create: rfqPayload,
          });

      case "po":
        // Flatten nested structure if LLM returns grouped data
        let flatData = { ...data };
        if (data["BASIC INFORMATION"] || data["LEGAL & COMPLIANCE"] || data["RISK ANALYSIS"]) {
          flatData = {
            ...(data["BASIC INFORMATION"] || {}),
            ...(data["LEGAL & COMPLIANCE"] || {}),
            ...(data["RISK ANALYSIS"] || {}),
          };
        }
        
        // Prepare data with defaults for required fields
        const poData = {
          ...flatData,
          // Required fields with defaults
          buyerName: flatData.buyerName || "Unknown Buyer",
          vendorName: flatData.vendorName || "Unknown Vendor",
          totalAmount: flatData.totalAmount ?? 0,
          currency: flatData.currency || "VND",
          // Convert legalRisks array to JSON string
          legalRisks: flatData.legalRisks ? JSON.stringify(flatData.legalRisks) : null,
        };
        

        // NOTE: poDate column removed from DB schema usage. We keep poData.poDate in memory
        // for LLM consumers only but do not persist it into the purchase_orders table.

        // Sanitize PO payload to only include known fields
        const poPayload = {
          poNumber: poData.poNumber || `PO-${documentId.substring(0, 8)}`,
          // NOTE: poDate excluded (column removed) - do not include here
          rfqNumber: poData.rfqNumber || null,
          buyerName: poData.buyerName || 'Unknown Buyer',
          buyerTaxCode: poData.buyerTaxCode || null,
          vendorName: poData.vendorName || 'Unknown Vendor',
          vendorTaxCode: poData.vendorTaxCode || null,
          totalAmount: typeof poData.totalAmount === 'number' ? poData.totalAmount : parseFloat(poData.totalAmount) || 0,
          currency: poData.currency || 'VND',
          paymentTerms: poData.paymentTerms || null,
          deliveryTerms: poData.deliveryTerms || null,
          deliveryDays: poData.deliveryDays || null,
          warrantyTerms: poData.warrantyTerms || null,
          penaltyClauses: poData.penaltyClauses || null,
          qualityStandards: poData.qualityStandards || null,
          inspectionReqs: poData.inspectionReqs || null,
          complianceReqs: poData.complianceReqs || null,
          insuranceReqs: poData.insuranceReqs || null,
          disputeResolution: poData.disputeResolution || null,
          // New field: governing law / jurisdiction
          governingLaw: poData.governingLaw || null,
          specialConditions: poData.specialConditions || null,
          legalRisks: poData.legalRisks || null,
          documentId,
          sourceFilePath,
        };

        return await prisma.purchase_orders.upsert({
          where: { poNumber: poPayload.poNumber },
          update: {
            ...poPayload,
            updatedAt: new Date(),
          },
          create: poPayload,
        });

      case "quotation":
        // Ensure quotationNumber is always set (fallback to generated ID)
        const quotationNumber = data.quotationNumber || `QT-${documentId.substring(0, 8)}`;
        
        // Parse quotationDate if present
        let quotationDate = null;
        if (data.quotationDate) {
          const d = new Date(data.quotationDate);
          if (!isNaN(d)) quotationDate = d;
        }
        
        // Link to RFQ if rfqId present (optional - if you want to link by rfqNumber)
        let rfqId = null;
        if (data.rfqNumber) {
          try {
            const linkedRfq = await prisma.rfq_metadata.findUnique({ where: { rfqNumber: data.rfqNumber } });
            if (linkedRfq) rfqId = linkedRfq.id;
          } catch (e) {}
        }
        
        // Sanitize and normalize fields before writing to DB to avoid unknown argument errors
        const safeTotal = typeof data.totalAmount === 'number' ? data.totalAmount : (parseFloat(String(data.totalAmount || '').replace(/[,\s]/g, '')) || 0);
        const safeValidity = data.validityDays != null ? parseInt(String(data.validityDays)) || null : null;
        const safeDeliveryDays = data.deliveryDays != null ? parseInt(String(data.deliveryDays)) || null : null;
        const safeWarranty = data.warrantyMonths != null ? parseInt(String(data.warrantyMonths)) || null : null;
        const safeVendorTax = data.vendorTaxCode ? String(data.vendorTaxCode).replace(/[^0-9]/g, '') : null;

        const quotationPayload = {
          quotationNumber,
          vendorName: data.vendorName || 'Unknown Vendor',
          vendorType: data.vendorType || 'internal',
          vendorTaxCode: safeVendorTax,
          totalAmount: safeTotal,
          currency: data.currency || 'VND',
          quotedDate: quotationDate,
          validityDays: safeValidity,
          deliveryDays: safeDeliveryDays,
          deliveryTerms: data.deliveryTerms || null,
          warrantyMonths: safeWarranty,
          documentId,
          sourceFilePath: sourceFilePath || null,
          rfqId,
        };

        try {
          // Prefer to update an existing quotation linked to this documentId to avoid stale duplicates
          const existing = await prisma.quotations.findFirst({ where: { documentId } });
          if (existing) {
            console.log('[LLM Extractor] Found existing quotation for documentId, updating by id:', existing.id);
            return await prisma.quotations.update({
              where: { id: existing.id },
              data: { ...quotationPayload, updatedAt: new Date() },
            });
          }

          // If no existing by documentId, fall back to upsert by quotationNumber
          return await prisma.quotations.upsert({
            where: { quotationNumber },
            update: {
              ...quotationPayload,
              updatedAt: new Date(),
            },
            create: quotationPayload,
          });
        } catch (e) {
          console.error("[LLM Extractor] Quotations upsert/update failed - payload:", JSON.stringify(quotationPayload));
          throw e;
        }

      case "invoice":
        // Find linked PO by poNumber if provided and set poId relation
        let poId = null;
        if (data.poNumber) {
          try {
            const linked = await prisma.purchase_orders.findUnique({ where: { poNumber: data.poNumber } });
            if (linked) poId = linked.id;
          } catch (e) {
            // ignore
          }
        }

        // Normalize dates
        let invDate = data.invoiceDate ? new Date(data.invoiceDate) : null;
        if (!invDate || isNaN(invDate)) invDate = new Date(); // fallback to now to satisfy non-null constraint
        let dueDate = data.dueDate ? new Date(data.dueDate) : null;

        // Ensure numeric amounts
        const totalAmount = typeof data.totalAmount === 'number' ? data.totalAmount : parseFloat(data.totalAmount) || 0;
        const taxAmount = data.taxAmount != null ? (typeof data.taxAmount === 'number' ? data.taxAmount : parseFloat(data.taxAmount) || null) : null;

        return await prisma.invoices.upsert({
          where: { 
            invoiceNumber: data.invoiceNumber || `INV-${documentId.substring(0, 8)}` 
          },
          update: {
            invoiceDate: invDate,
            totalAmount,
            currency: data.currency || 'VND',
            taxAmount,
            documentId,
            sourceFilePath,
            poId,
          },
          create: {
            invoiceNumber: data.invoiceNumber || `INV-${documentId.substring(0, 8)}`,
            invoiceDate: invDate,
            totalAmount,
            currency: data.currency || 'VND',
            taxAmount,
            documentId,
            sourceFilePath,
            poId,
          },
        });

      case "certificate":
        // Map incoming certificate fields to schema (certNumber, certType, issuedBy, issuedDate)
        const certPayload = { ...data };
        
        // Map certificateNumber -> certNumber (keep original for fallback)
        const finalCertNumber = certPayload.certificateNumber || `CERT-${documentId.substring(0, 8)}`;
        
        // Map certificateType -> certType
        const finalCertType = certPayload.certificateType || certPayload.certType || null;
        
        // Map issuer -> issuedBy
        const finalIssuedBy = certPayload.issuer || certPayload.issuedBy || null;
        
        // Parse issueDate -> issuedDate
        let finalIssuedDate = null;
        if (certPayload.issueDate) {
          const d = new Date(certPayload.issueDate);
          if (!isNaN(d)) finalIssuedDate = d;
        } else if (certPayload.issuedDate) {
          const d = new Date(certPayload.issuedDate);
          if (!isNaN(d)) finalIssuedDate = d;
        }

        // Link to PO if poNumber present
        let certPoId = null;
        if (certPayload.poNumber) {
          try {
            const linked = await prisma.purchase_orders.findUnique({ where: { poNumber: certPayload.poNumber } });
            if (linked) certPoId = linked.id;
          } catch (e) {}
        }

        return await prisma.certificates.upsert({
          where: { 
            certNumber: finalCertNumber
          },
          update: {
            certType: finalCertType,
            issuedBy: finalIssuedBy,
            issuedDate: finalIssuedDate,
            documentId,
            sourceFilePath,
            poId: certPoId,
          },
          create: {
            certNumber: finalCertNumber,
            certType: finalCertType,
            issuedBy: finalIssuedBy,
            issuedDate: finalIssuedDate,
            documentId,
            sourceFilePath,
            poId: certPoId,
          },
        });

      default:
        console.warn(`[LLM Extractor] Unknown document type: ${documentType}`);
        return null;
    }
  } catch (error) {
    console.error(`[LLM Extractor] Failed to save ${documentType} data:`, error.message);
    throw error;
  }
}

module.exports = {
  extractWithLLM,
  getLLMProvider,
};
