const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * DOCUMENT COMPARATOR SERVICE
 * Use case: "So sánh Invoice/Certificate vs PO"
 * 
 * Validates invoices and certificates against purchase orders
 * Detects discrepancies in:
 * - Item descriptions
 * - Quantities
 * - Unit prices
 * - Total amounts
 * - Part numbers
 */

/**
 * Compare invoice against PO
 * @param {string} invoiceNumber - Invoice number
 * @returns {Object} Comparison results with discrepancies
 */
async function compareInvoiceToPO(invoiceNumber) {
  try {
    console.log(`[Document Comparator] Comparing invoice: ${invoiceNumber}`);
    
    const invoice = await prisma.invoices.findUnique({
      where: { invoiceNumber },
      include: {
        items: true,
        po: {
          include: {
            items: true,
          },
        },
      },
    });
    
    if (!invoice) {
      throw new Error(`Invoice ${invoiceNumber} not found`);
    }
    
    if (!invoice.po) {
      return {
        invoice: {
          number: invoiceNumber,
          amount: invoice.totalAmount,
          currency: invoice.currency,
        },
        status: "NO_PO_LINKED",
        message: "Invoice is not linked to any Purchase Order",
        discrepancies: [],
      };
    }
    
    // Compare totals
    const discrepancies = [];
    
    // Check total amount
    if (Math.abs(invoice.totalAmount - invoice.po.totalAmount) > 0.01) {
      const diff = invoice.totalAmount - invoice.po.totalAmount;
      const diffPercent = (diff / invoice.po.totalAmount) * 100;
      
      discrepancies.push({
        field: "totalAmount",
        severity: Math.abs(diffPercent) > 10 ? "high" : Math.abs(diffPercent) > 5 ? "medium" : "low",
        expected: invoice.po.totalAmount,
        actual: invoice.totalAmount,
        difference: diff,
        differencePercent: diffPercent.toFixed(2),
        message: `Invoice total ${diff > 0 ? "exceeds" : "is less than"} PO by ${Math.abs(diffPercent).toFixed(2)}%`,
      });
    }
    
    // Check currency match
    if (invoice.currency !== invoice.po.currency) {
      discrepancies.push({
        field: "currency",
        severity: "critical",
        expected: invoice.po.currency,
        actual: invoice.currency,
        message: "Currency mismatch between invoice and PO",
      });
    }
    
    // Compare line items
    const itemDiscrepancies = await compareItems(
      invoice.items,
      invoice.po.items,
      "invoice",
      "po",
      invoiceNumber,
      invoice.po.poNumber
    );
    
    discrepancies.push(...itemDiscrepancies);
    
    // Save discrepancies to database
    for (const disc of discrepancies) {
      await prisma.document_discrepancies.create({
        data: {
          sourceType: "invoice",
          sourceId: invoice.id,
          targetType: "po",
          targetId: invoice.po.id,
          field: disc.field,
          severity: disc.severity,
          partNumber: disc.partNumber || null,
          sourceValue: String(disc.actual),
          targetValue: String(disc.expected),
          difference: disc.message,
          status: "open",
        },
      });
    }
    
    const status = discrepancies.length === 0 ? "MATCH" : "DISCREPANCY";
    
    return {
      invoice: {
        number: invoiceNumber,
        date: new Date(invoice.invoiceDate).toLocaleDateString(),
        amount: invoice.totalAmount,
        currency: invoice.currency,
        itemCount: invoice.items.length,
      },
      po: {
        number: invoice.po.poNumber,
        date: invoice.po.poDate ? new Date(invoice.po.poDate).toLocaleDateString() : "N/A",
        amount: invoice.po.totalAmount,
        currency: invoice.po.currency,
        itemCount: invoice.po.items.length,
      },
      status,
      discrepancyCount: discrepancies.length,
      discrepancies,
    };
  } catch (error) {
    console.error("[Document Comparator] Error comparing invoice:", error);
    throw error;
  }
}

/**
 * Compare certificate against PO
 * @param {string} certNumber - Certificate number
 * @returns {Object} Comparison results
 */
async function compareCertificateToPO(certNumber) {
  try {
    console.log(`[Document Comparator] Comparing certificate: ${certNumber}`);
    
    const certificate = await prisma.certificates.findUnique({
      where: { certNumber },
      include: {
        items: true,
        po: {
          include: {
            items: true,
          },
        },
      },
    });
    
    if (!certificate) {
      throw new Error(`Certificate ${certNumber} not found`);
    }
    
    if (!certificate.po) {
      return {
        certificate: {
          number: certNumber,
          type: certificate.certType,
        },
        status: "NO_PO_LINKED",
        message: "Certificate is not linked to any Purchase Order",
        discrepancies: [],
      };
    }
    
    const discrepancies = [];
    
    // Compare items
    const itemDiscrepancies = await compareItems(
      certificate.items,
      certificate.po.items,
      "certificate",
      "po",
      certNumber,
      certificate.po.poNumber
    );
    
    discrepancies.push(...itemDiscrepancies);
    
    // Save discrepancies
    for (const disc of discrepancies) {
      await prisma.document_discrepancies.create({
        data: {
          sourceType: "certificate",
          sourceId: certificate.id,
          targetType: "po",
          targetId: certificate.po.id,
          field: disc.field,
          severity: disc.severity,
          partNumber: disc.partNumber || null,
          sourceValue: String(disc.actual),
          targetValue: String(disc.expected),
          difference: disc.message,
          status: "open",
        },
      });
    }
    
    const status = discrepancies.length === 0 ? "MATCH" : "DISCREPANCY";
    
    return {
      certificate: {
        number: certNumber,
        type: certificate.certType,
        issuedBy: certificate.issuedBy,
        issuedDate: certificate.issuedDate ? new Date(certificate.issuedDate).toLocaleDateString() : "N/A",
        itemCount: certificate.items.length,
      },
      po: {
        number: certificate.po.poNumber,
        itemCount: certificate.po.items.length,
      },
      status,
      discrepancyCount: discrepancies.length,
      discrepancies,
    };
  } catch (error) {
    console.error("[Document Comparator] Error comparing certificate:", error);
    throw error;
  }
}

/**
 * Compare items between two documents
 * @param {Array} sourceItems - Items from invoice/certificate
 * @param {Array} targetItems - Items from PO
 * @param {string} sourceType - "invoice" or "certificate"
 * @param {string} targetType - "po"
 * @returns {Array} Discrepancies found
 */
async function compareItems(sourceItems, targetItems, sourceType, targetType, sourceDoc, targetDoc) {
  const discrepancies = [];
  
  for (const sourceItem of sourceItems) {
    // Find matching item in PO by part number or description
    const matchingItem = targetItems.find(poItem => {
      // Try exact part number match first
      if (sourceItem.partNumber && poItem.partNumber) {
        return sourceItem.partNumber.toLowerCase() === poItem.partNumber.toLowerCase();
      }
      
      // Fall back to description similarity
      const similarity = calculateStringSimilarity(
        sourceItem.description.toLowerCase(),
        poItem.description.toLowerCase()
      );
      
      return similarity > 0.7;
    });
    
    if (!matchingItem) {
      discrepancies.push({
        field: "item_not_in_po",
        severity: "high",
        partNumber: sourceItem.partNumber,
        actual: `${sourceItem.description} (${sourceItem.partNumber || "No part number"})`,
        expected: "Item should exist in PO",
        message: `Item in ${sourceType} "${sourceItem.description}" not found in PO ${targetDoc}`,
      });
      continue;
    }
    
    // Check quantity
    if (sourceItem.quantity !== matchingItem.quantity) {
      const diff = sourceItem.quantity - matchingItem.quantity;
      
      discrepancies.push({
        field: "quantity",
        severity: "medium",
        partNumber: sourceItem.partNumber,
        actual: sourceItem.quantity,
        expected: matchingItem.quantity,
        difference: diff,
        message: `Quantity mismatch for ${sourceItem.partNumber || sourceItem.description}: ${sourceType} has ${sourceItem.quantity}, PO has ${matchingItem.quantity}`,
      });
    }
    
    // Check unit price (for invoices, not applicable to certificates)
    if (sourceType === "invoice" && sourceItem.unitPrice && matchingItem.unitPrice) {
      const priceDiff = Math.abs(sourceItem.unitPrice - matchingItem.unitPrice);
      const priceDiffPercent = (priceDiff / matchingItem.unitPrice) * 100;
      
      if (priceDiff > 0.01 && priceDiffPercent > 1) {
        discrepancies.push({
          field: "unitPrice",
          severity: priceDiffPercent > 10 ? "high" : "medium",
          partNumber: sourceItem.partNumber,
          actual: sourceItem.unitPrice,
          expected: matchingItem.unitPrice,
          difference: sourceItem.unitPrice - matchingItem.unitPrice,
          differencePercent: priceDiffPercent.toFixed(2),
          message: `Unit price mismatch for ${sourceItem.partNumber}: ${priceDiffPercent.toFixed(2)}% difference`,
        });
      }
    }
    
    // Check manufacturer (for certificates)
    if (sourceType === "certificate" && sourceItem.manufacturer && matchingItem.manufacturer) {
      if (sourceItem.manufacturer.toLowerCase() !== matchingItem.manufacturer.toLowerCase()) {
        discrepancies.push({
          field: "manufacturer",
          severity: "high",
          partNumber: sourceItem.partNumber,
          actual: sourceItem.manufacturer,
          expected: matchingItem.manufacturer,
          message: `Manufacturer mismatch for ${sourceItem.partNumber}: ${sourceType} shows "${sourceItem.manufacturer}", PO requires "${matchingItem.manufacturer}"`,
        });
      }
    }
    
    // Check description similarity
    const descSimilarity = calculateStringSimilarity(
      sourceItem.description.toLowerCase(),
      matchingItem.description.toLowerCase()
    );
    
    if (descSimilarity < 0.5) {
      discrepancies.push({
        field: "description",
        severity: "low",
        partNumber: sourceItem.partNumber,
        actual: sourceItem.description,
        expected: matchingItem.description,
        message: `Description mismatch for ${sourceItem.partNumber}: similarity ${(descSimilarity * 100).toFixed(0)}%`,
      });
    }
  }
  
  // Check for items in PO but not in source document
  for (const poItem of targetItems) {
    const matchingItem = sourceItems.find(srcItem => {
      if (srcItem.partNumber && poItem.partNumber) {
        return srcItem.partNumber.toLowerCase() === poItem.partNumber.toLowerCase();
      }
      
      const similarity = calculateStringSimilarity(
        srcItem.description.toLowerCase(),
        poItem.description.toLowerCase()
      );
      
      return similarity > 0.7;
    });
    
    if (!matchingItem) {
      discrepancies.push({
        field: "item_missing_from_source",
        severity: "critical",
        partNumber: poItem.partNumber,
        actual: "Item not present",
        expected: `${poItem.description} (${poItem.partNumber || "No part number"})`,
        message: `PO item "${poItem.description}" (${poItem.partNumber}) is missing from ${sourceType} ${sourceDoc}`,
      });
    }
  }
  
  return discrepancies;
}

/**
 * Calculate string similarity (Jaccard index)
 */
function calculateStringSimilarity(str1, str2) {
  const words1 = new Set(str1.split(/\s+/));
  const words2 = new Set(str2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Get all open discrepancies
 * @param {Object} filters - Optional filters
 * @returns {Array} Open discrepancies
 */
async function getOpenDiscrepancies(filters = {}) {
  const where = {
    status: "open",
    ...filters,
  };
  
  const discrepancies = await prisma.document_discrepancies.findMany({
    where,
    orderBy: [
      { severity: "desc" },
      { detectedAt: "desc" },
    ],
  });
  
  return discrepancies.map(disc => ({
    id: disc.id,
    type: `${disc.sourceType} vs ${disc.targetType}`,
    field: disc.field,
    severity: disc.severity,
    partNumber: disc.partNumber,
    sourceValue: disc.sourceValue,
    targetValue: disc.targetValue,
    difference: disc.difference,
    detectedAt: new Date(disc.detectedAt).toLocaleDateString(),
  }));
}

/**
 * Resolve discrepancy
 * @param {string} discrepancyId - Discrepancy ID
 * @param {string} resolvedBy - User who resolved
 * @param {string} notes - Resolution notes
 */
async function resolveDiscrepancy(discrepancyId, resolvedBy, notes) {
  return await prisma.document_discrepancies.update({
    where: { id: discrepancyId },
    data: {
      status: "resolved",
      resolvedBy,
      resolvedAt: new Date(),
      notes,
    },
  });
}

/**
 * Ignore discrepancy
 * @param {string} discrepancyId - Discrepancy ID
 * @param {string} ignoredBy - User who ignored
 * @param {string} notes - Reason for ignoring
 */
async function ignoreDiscrepancy(discrepancyId, ignoredBy, notes) {
  return await prisma.document_discrepancies.update({
    where: { id: discrepancyId },
    data: {
      status: "ignored",
      resolvedBy: ignoredBy,
      resolvedAt: new Date(),
      notes,
    },
  });
}

/**
 * Batch compare all invoices to their POs
 * @returns {Object} Summary of all comparisons
 */
async function batchCompareInvoices() {
  const invoices = await prisma.invoices.findMany({
    where: {
      poId: { not: null },
    },
    select: {
      invoiceNumber: true,
    },
  });
  
  const results = {
    total: invoices.length,
    matched: 0,
    discrepancies: 0,
    errors: 0,
  };
  
  for (const invoice of invoices) {
    try {
      const comparison = await compareInvoiceToPO(invoice.invoiceNumber);
      
      if (comparison.status === "MATCH") {
        results.matched++;
      } else {
        results.discrepancies++;
      }
    } catch (error) {
      console.error(`Error comparing invoice ${invoice.invoiceNumber}:`, error);
      results.errors++;
    }
  }
  
  return results;
}

module.exports = {
  compareInvoiceToPO,
  compareCertificateToPO,
  getOpenDiscrepancies,
  resolveDiscrepancy,
  ignoreDiscrepancy,
  batchCompareInvoices,
};
