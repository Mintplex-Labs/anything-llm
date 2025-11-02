const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * PRICE COMPARISON SERVICE
 * Use case: "So sánh giá MT với đối thủ"
 * 
 * Compares MT Corp quotations with competitors for the same RFQ
 */

/**
 * Compare MT Corp price vs competitors for a specific RFQ
 * @param {string} rfqNumber - RFQ number to compare
 * @returns {Object} Comparison results
 */
async function comparePrices(rfqNumber) {
  try {
    console.log(`[Price Comparison] Analyzing RFQ: ${rfqNumber}`);
    
    // Find RFQ
    const rfq = await prisma.rfq_metadata.findFirst({
      where: { rfqNumber },
      include: {
        quotations: {
          include: {
            items: true,
          },
        },
      },
    });
    
    if (!rfq) {
      throw new Error(`RFQ ${rfqNumber} not found`);
    }
    
    if (rfq.quotations.length === 0) {
      return {
        rfq: {
          number: rfqNumber,
          project: rfq.projectName,
          buyer: rfq.buyerName,
        },
        message: "No quotations found for this RFQ",
        quotations: [],
      };
    }
    
    // Separate MT and competitor quotations
    const mtQuotations = rfq.quotations.filter(q => q.vendorType === "internal");
    const competitorQuotations = rfq.quotations.filter(q => q.vendorType === "competitor");
    
    console.log(`[Price Comparison] MT quotations: ${mtQuotations.length}, Competitors: ${competitorQuotations.length}`);
    
    // Calculate statistics
    const allPrices = rfq.quotations.map(q => q.totalAmount);
    const avgPrice = allPrices.reduce((a, b) => a + b, 0) / allPrices.length;
    const minPrice = Math.min(...allPrices);
    const maxPrice = Math.max(...allPrices);
    
    // Compare MT vs competitors
    const comparisons = [];
    
    for (const mtQuot of mtQuotations) {
      for (const compQuot of competitorQuotations) {
        const priceDiff = mtQuot.totalAmount - compQuot.totalAmount;
        const priceDiffPercent = (priceDiff / compQuot.totalAmount) * 100;
        
        comparisons.push({
          mt: {
            quotationNumber: mtQuot.quotationNumber,
            amount: mtQuot.totalAmount,
            currency: mtQuot.currency,
            deliveryDays: mtQuot.deliveryDays,
            warrantyMonths: mtQuot.warrantyMonths,
          },
          competitor: {
            name: compQuot.vendorName,
            quotationNumber: compQuot.quotationNumber,
            amount: compQuot.totalAmount,
            currency: compQuot.currency,
            deliveryDays: compQuot.deliveryDays,
            warrantyMonths: compQuot.warrantyMonths,
          },
          difference: {
            amount: priceDiff,
            percentage: priceDiffPercent.toFixed(2),
            advantage: priceDiff < 0 ? "MT Corp cheaper" : "Competitor cheaper",
          },
        });
      }
    }
    
    // Item-level comparison
    const itemComparisons = await compareQuotationItems(mtQuotations, competitorQuotations);
    
    // Competitive position
    const mtAvgPrice = mtQuotations.length > 0
      ? mtQuotations.reduce((sum, q) => sum + q.totalAmount, 0) / mtQuotations.length
      : 0;
    
    const position = calculateCompetitivePosition(mtAvgPrice, avgPrice, minPrice, maxPrice);
    
    return {
      rfq: {
        number: rfqNumber,
        project: rfq.projectName,
        buyer: rfq.buyerName,
        deadline: rfq.submissionDeadline,
      },
      statistics: {
        totalQuotations: rfq.quotations.length,
        mtQuotations: mtQuotations.length,
        competitorQuotations: competitorQuotations.length,
        avgPrice,
        minPrice,
        maxPrice,
        currency: rfq.quotations[0]?.currency || "VND",
      },
      mtPosition: position,
      comparisons,
      itemComparisons,
    };
  } catch (error) {
    console.error("[Price Comparison] Error:", error);
    throw error;
  }
}

/**
 * Compare quotation items (line-by-line)
 */
async function compareQuotationItems(mtQuotations, competitorQuotations) {
  const itemComparisons = [];
  
  for (const mtQuot of mtQuotations) {
    for (const competitorQuot of competitorQuotations) {
      // Match items by description similarity
      for (const mtItem of mtQuot.items) {
        const matchingCompItem = findMatchingItem(mtItem, competitorQuot.items);
        
        if (matchingCompItem) {
          const priceDiff = mtItem.unitPrice - matchingCompItem.unitPrice;
          const priceDiffPercent = (priceDiff / matchingCompItem.unitPrice) * 100;
          
          itemComparisons.push({
            description: mtItem.description,
            mt: {
              manufacturer: mtItem.manufacturer,
              unitPrice: mtItem.unitPrice,
              quantity: mtItem.quantity,
              totalPrice: mtItem.totalPrice,
            },
            competitor: {
              vendor: competitorQuot.vendorName,
              manufacturer: matchingCompItem.manufacturer,
              unitPrice: matchingCompItem.unitPrice,
              quantity: matchingCompItem.quantity,
              totalPrice: matchingCompItem.totalPrice,
            },
            difference: {
              unitPriceDiff: priceDiff,
              percentage: priceDiffPercent.toFixed(2),
              advantage: priceDiff < 0 ? "MT cheaper" : "Competitor cheaper",
            },
          });
        }
      }
    }
  }
  
  return itemComparisons;
}

/**
 * Find matching item in competitor quotation
 * Uses fuzzy string matching on description
 */
function findMatchingItem(mtItem, competitorItems) {
  const mtDesc = mtItem.description.toLowerCase().trim();
  
  for (const compItem of competitorItems) {
    const compDesc = compItem.description.toLowerCase().trim();
    
    // Simple similarity check (can be improved with Levenshtein distance)
    const similarity = calculateStringSimilarity(mtDesc, compDesc);
    
    if (similarity > 0.6) {
      return compItem;
    }
  }
  
  return null;
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
 * Calculate competitive position
 */
function calculateCompetitivePosition(mtPrice, avgPrice, minPrice, maxPrice) {
  if (mtPrice === 0) {
    return {
      position: "unknown",
      description: "No MT quotation data available",
      rank: null,
    };
  }
  
  const diffFromAvg = ((mtPrice - avgPrice) / avgPrice) * 100;
  const diffFromMin = ((mtPrice - minPrice) / minPrice) * 100;
  
  let position;
  let description;
  
  if (mtPrice === minPrice) {
    position = "lowest";
    description = "MT Corp has the LOWEST price";
  } else if (mtPrice < avgPrice) {
    position = "below_average";
    description = `MT Corp is ${Math.abs(diffFromAvg).toFixed(2)}% BELOW average price`;
  } else if (mtPrice === avgPrice) {
    position = "average";
    description = "MT Corp price is at market AVERAGE";
  } else if (mtPrice < maxPrice) {
    position = "above_average";
    description = `MT Corp is ${diffFromAvg.toFixed(2)}% ABOVE average price`;
  } else {
    position = "highest";
    description = "MT Corp has the HIGHEST price";
  }
  
  return {
    position,
    description,
    mtPrice,
    avgPrice,
    minPrice,
    maxPrice,
    diffFromAvgPercent: diffFromAvg.toFixed(2),
    diffFromMinPercent: diffFromMin.toFixed(2),
  };
}

/**
 * Get all RFQs with multiple quotations (for comparison)
 */
async function getRFQsWithMultipleQuotations() {
  const rfqs = await prisma.rfq_metadata.findMany({
    include: {
      quotations: {
        select: {
          quotationNumber: true,
          vendorName: true,
          vendorType: true,
          totalAmount: true,
          currency: true,
        },
      },
    },
  });
  
  // Filter RFQs with at least 2 quotations (1 MT + 1 competitor)
  const competitiveRFQs = rfqs.filter(rfq => {
    const hasMT = rfq.quotations.some(q => q.vendorType === "internal");
    const hasCompetitor = rfq.quotations.some(q => q.vendorType === "competitor");
    return hasMT && hasCompetitor;
  });
  
  return competitiveRFQs.map(rfq => ({
    rfqNumber: rfq.rfqNumber,
    projectName: rfq.projectName,
    buyerName: rfq.buyerName,
    quotationCount: rfq.quotations.length,
    vendors: rfq.quotations.map(q => q.vendorName),
  }));
}

/**
 * Compare all vendors for a specific RFQ (table view)
 */
async function generatePriceComparisonTable(rfqNumber) {
  const rfq = await prisma.rfq_metadata.findFirst({
    where: { rfqNumber },
    include: {
      quotations: {
        include: {
          items: true,
        },
        orderBy: {
          totalAmount: "asc", // Sort by price (lowest first)
        },
      },
    },
  });
  
  if (!rfq) {
    throw new Error(`RFQ ${rfqNumber} not found`);
  }
  
  // Build comparison table
  const table = {
    rfq: {
      number: rfqNumber,
      project: rfq.projectName,
      buyer: rfq.buyerName,
    },
    columns: ["Vendor", "Quotation No.", "Total Amount", "Currency", "Delivery (days)", "Warranty (months)", "Type"],
    rows: rfq.quotations.map((q, index) => ({
      rank: index + 1,
      vendor: q.vendorName,
      quotationNumber: q.quotationNumber,
      totalAmount: q.totalAmount,
      currency: q.currency,
      deliveryDays: q.deliveryDays || "N/A",
      warrantyMonths: q.warrantyMonths || "N/A",
      vendorType: q.vendorType === "internal" ? "MT Corp" : "Competitor",
      isLowest: index === 0,
    })),
  };
  
  return table;
}

module.exports = {
  comparePrices,
  getRFQsWithMultipleQuotations,
  generatePriceComparisonTable,
};
