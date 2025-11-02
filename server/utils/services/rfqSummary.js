const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * RFQ SUMMARY SERVICE
 * Use case: "List nội dung chính RFQ"
 * 
 * Extracts and presents structured RFQ metadata:
 * - Buyer information
 * - Deadline
 * - Delivery schedule & location
 * - Bid bond requirements
 * - Technical requirement pages
 * - Quotations received
 */

/**
 * Get complete RFQ summary
 * @param {string} rfqNumber - RFQ number
 * @returns {Object} Structured RFQ summary
 */
async function getRFQSummary(rfqNumber) {
  try {
    console.log(`[RFQ Summary] Retrieving summary for: ${rfqNumber}`);
    
    const rfq = await prisma.rfq_metadata.findFirst({
      where: { rfqNumber },
      include: {
        quotations: {
          select: {
            quotationNumber: true,
            vendorName: true,
            vendorType: true,
            totalAmount: true,
            currency: true,
            quotedDate: true,
          },
          orderBy: {
            totalAmount: "asc",
          },
        },
        legalRisks: {
          where: {
            riskLevel: { in: ["high", "critical"] },
          },
          select: {
            riskType: true,
            riskLevel: true,
            riskDescription: true,
          },
        },
      },
    });
    
    if (!rfq) {
      throw new Error(`RFQ ${rfqNumber} not found`);
    }
    
    // Format deadline
    const deadline = rfq.submissionDeadline
      ? formatDeadline(rfq.submissionDeadline)
      : "Not specified";
    
    // Format delivery
    const delivery = formatDelivery(rfq);
    
    // Format bid bond
    const bidBond = formatBidBond(rfq);
    
    // Quotation summary
    const quotationSummary = formatQuotationSummary(rfq.quotations);
    
    // Build summary
    const summary = {
      basicInfo: {
        rfqNumber: rfq.rfqNumber,
        projectName: rfq.projectName || "Not specified",
        packageName: rfq.packageName || "Not specified",
        sourceFolder: rfq.sourceFolder || "Unknown",
      },
      buyer: {
        name: rfq.buyerName || "Not specified",
        address: rfq.buyerAddress || "Not specified",
        contact: rfq.buyerContact || "Not specified",
        taxCode: rfq.buyerTaxCode || "Not specified",
      },
      timeline: {
        submissionDeadline: deadline,
        validityPeriod: rfq.validityPeriodDays
          ? `${rfq.validityPeriodDays} days`
          : "90 days (default)",
        uploadedAt: new Date(rfq.uploadedAt).toLocaleDateString(),
        lastUpdated: new Date(rfq.updatedAt).toLocaleDateString(),
      },
      delivery,
      bidBond,
      technicalRequirements: {
        pages: rfq.technicalReqPages || "Not specified",
        scopeOfSupply: rfq.scopeOfSupply || "See RFQ document",
      },
      quotations: quotationSummary,
      legalRisks: rfq.legalRisks.map(risk => ({
        type: risk.riskType,
        level: risk.riskLevel,
        description: risk.riskDescription,
      })),
    };
    
    return summary;
  } catch (error) {
    console.error("[RFQ Summary] Error:", error);
    throw error;
  }
}

/**
 * Format deadline with urgency indicator
 */
function formatDeadline(deadline) {
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const daysUntilDeadline = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
  
  let urgency;
  let status;
  
  if (daysUntilDeadline < 0) {
    urgency = "EXPIRED";
    status = `Expired ${Math.abs(daysUntilDeadline)} days ago`;
  } else if (daysUntilDeadline === 0) {
    urgency = "CRITICAL";
    status = "DUE TODAY";
  } else if (daysUntilDeadline <= 3) {
    urgency = "URGENT";
    status = `${daysUntilDeadline} days remaining`;
  } else if (daysUntilDeadline <= 7) {
    urgency = "SOON";
    status = `${daysUntilDeadline} days remaining`;
  } else {
    urgency = "NORMAL";
    status = `${daysUntilDeadline} days remaining`;
  }
  
  return {
    date: deadlineDate.toLocaleDateString("en-GB"),
    dateTime: deadlineDate.toISOString(),
    daysRemaining: daysUntilDeadline,
    urgency,
    status,
  };
}

/**
 * Format delivery information
 */
function formatDelivery(rfq) {
  return {
    schedule: rfq.deliverySchedule || `${rfq.deliveryWeeks || "N/A"} weeks`,
    weeks: rfq.deliveryWeeks || "Not specified",
    location: rfq.deliveryLocation || "Not specified",
  };
}

/**
 * Format bid bond information
 */
function formatBidBond(rfq) {
  if (!rfq.bidBondRequired) {
    return {
      required: false,
      message: "No bid bond required",
    };
  }
  
  return {
    required: true,
    percentage: rfq.bidBondPercentage
      ? `${rfq.bidBondPercentage}%`
      : "See RFQ document",
    value: rfq.bidBondValue || "Not specified",
    dueWithin: rfq.bidBondDueDays
      ? `${rfq.bidBondDueDays} days after effective date`
      : "See RFQ document",
  };
}

/**
 * Format quotation summary
 */
function formatQuotationSummary(quotations) {
  if (quotations.length === 0) {
    return {
      count: 0,
      message: "No quotations submitted yet",
      vendors: [],
    };
  }
  
  const mtQuotations = quotations.filter(q => q.vendorType === "internal");
  const competitorQuotations = quotations.filter(q => q.vendorType === "competitor");
  
  const lowestQuotation = quotations[0]; // Already sorted by amount ascending
  
  return {
    count: quotations.length,
    mtCount: mtQuotations.length,
    competitorCount: competitorQuotations.length,
    lowestBid: {
      vendor: lowestQuotation.vendorName,
      amount: lowestQuotation.totalAmount,
      currency: lowestQuotation.currency,
      type: lowestQuotation.vendorType === "internal" ? "MT Corp" : "Competitor",
    },
    vendors: quotations.map(q => ({
      name: q.vendorName,
      quotationNumber: q.quotationNumber,
      amount: q.totalAmount,
      currency: q.currency,
      type: q.vendorType === "internal" ? "MT Corp" : "Competitor",
      quotedDate: q.quotedDate ? new Date(q.quotedDate).toLocaleDateString() : "N/A",
    })),
  };
}

/**
 * Get all active RFQs (not expired)
 * @returns {Array} List of active RFQs
 */
async function getActiveRFQs() {
  const now = new Date();
  
  const rfqs = await prisma.rfq_metadata.findMany({
    where: {
      OR: [
        { submissionDeadline: { gte: now } },
        { submissionDeadline: null },
      ],
    },
    include: {
      quotations: {
        select: {
          vendorName: true,
          vendorType: true,
        },
      },
    },
    orderBy: {
      submissionDeadline: "asc",
    },
  });
  
  return rfqs.map(rfq => ({
    rfqNumber: rfq.rfqNumber,
    projectName: rfq.projectName,
    buyerName: rfq.buyerName,
    deadline: formatDeadline(rfq.submissionDeadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
    quotationCount: rfq.quotations.length,
    hasCompetitors: rfq.quotations.some(q => q.vendorType === "competitor"),
    hasMTQuotation: rfq.quotations.some(q => q.vendorType === "internal"),
  }));
}

/**
 * Get expired RFQs
 * @returns {Array} List of expired RFQs
 */
async function getExpiredRFQs() {
  const now = new Date();
  
  const rfqs = await prisma.rfq_metadata.findMany({
    where: {
      submissionDeadline: { lt: now },
    },
    include: {
      quotations: {
        select: {
          vendorName: true,
          totalAmount: true,
          currency: true,
        },
        orderBy: {
          totalAmount: "asc",
        },
        take: 1, // Get lowest bid
      },
    },
    orderBy: {
      submissionDeadline: "desc",
    },
  });
  
  return rfqs.map(rfq => ({
    rfqNumber: rfq.rfqNumber,
    projectName: rfq.projectName,
    buyerName: rfq.buyerName,
    deadline: new Date(rfq.submissionDeadline).toLocaleDateString(),
    daysExpired: Math.floor((now - new Date(rfq.submissionDeadline)) / (1000 * 60 * 60 * 24)),
    quotationCount: rfq.quotations.length,
    lowestBid: rfq.quotations[0]
      ? {
          vendor: rfq.quotations[0].vendorName,
          amount: rfq.quotations[0].totalAmount,
          currency: rfq.quotations[0].currency,
        }
      : null,
  }));
}

/**
 * Search RFQs by buyer name
 * @param {string} buyerName - Buyer name (partial match)
 * @returns {Array} Matching RFQs
 */
async function searchRFQsByBuyer(buyerName) {
  const rfqs = await prisma.rfq_metadata.findMany({
    where: {
      buyerName: {
        contains: buyerName,
        mode: "insensitive",
      },
    },
    include: {
      quotations: {
        select: {
          vendorName: true,
          totalAmount: true,
        },
      },
    },
    orderBy: {
      submissionDeadline: "desc",
    },
  });
  
  return rfqs.map(rfq => ({
    rfqNumber: rfq.rfqNumber,
    projectName: rfq.projectName,
    buyerName: rfq.buyerName,
    deadline: rfq.submissionDeadline
      ? new Date(rfq.submissionDeadline).toLocaleDateString()
      : "Not specified",
    quotationCount: rfq.quotations.length,
  }));
}

/**
 * Get RFQ statistics
 * @returns {Object} Overall statistics
 */
async function getRFQStatistics() {
  const [totalRFQs, activeRFQs, expiredRFQs, totalQuotations] = await Promise.all([
    prisma.rfq_metadata.count(),
    prisma.rfq_metadata.count({
      where: {
        OR: [
          { submissionDeadline: { gte: new Date() } },
          { submissionDeadline: null },
        ],
      },
    }),
    prisma.rfq_metadata.count({
      where: {
        submissionDeadline: { lt: new Date() },
      },
    }),
    prisma.quotations.count(),
  ]);
  
  const topBuyers = await prisma.rfq_metadata.groupBy({
    by: ["buyerName"],
    _count: {
      id: true,
    },
    orderBy: {
      _count: {
        id: "desc",
      },
    },
    take: 5,
  });
  
  return {
    total: totalRFQs,
    active: activeRFQs,
    expired: expiredRFQs,
    quotationsReceived: totalQuotations,
    avgQuotationsPerRFQ: totalRFQs > 0 ? (totalQuotations / totalRFQs).toFixed(2) : 0,
    topBuyers: topBuyers.map(b => ({
      name: b.buyerName,
      rfqCount: b._count.id,
    })),
  };
}

/**
 * Generate formatted text summary (for display)
 * @param {string} rfqNumber - RFQ number
 * @returns {string} Formatted text
 */
async function generateTextSummary(rfqNumber) {
  const summary = await getRFQSummary(rfqNumber);
  
  let text = `
═══════════════════════════════════════════════════════
  RFQ SUMMARY: ${summary.basicInfo.rfqNumber}
═══════════════════════════════════════════════════════

PROJECT INFORMATION
───────────────────────────────────────────────────────
Project Name:    ${summary.basicInfo.projectName}
Package:         ${summary.basicInfo.packageName}
Source Folder:   ${summary.basicInfo.sourceFolder}

BUYER INFORMATION
───────────────────────────────────────────────────────
Company:         ${summary.buyer.name}
Tax Code:        ${summary.buyer.taxCode}
Address:         ${summary.buyer.address}
Contact:         ${summary.buyer.contact}

TIMELINE
───────────────────────────────────────────────────────
Submission Deadline:  ${summary.timeline.submissionDeadline.date}
Status:               ${summary.timeline.submissionDeadline.status}
Urgency:              ${summary.timeline.submissionDeadline.urgency}
Validity Period:      ${summary.timeline.validityPeriod}

DELIVERY REQUIREMENTS
───────────────────────────────────────────────────────
Schedule:        ${summary.delivery.schedule}
Location:        ${summary.delivery.location}

BID BOND REQUIREMENTS
───────────────────────────────────────────────────────
${summary.bidBond.required
  ? `Required:        Yes
Percentage:      ${summary.bidBond.percentage}
Value:           ${summary.bidBond.value}
Due Within:      ${summary.bidBond.dueWithin}`
  : `Required:        No`
}

TECHNICAL REQUIREMENTS
───────────────────────────────────────────────────────
Reference Pages: ${summary.technicalRequirements.pages}
Scope:           ${summary.technicalRequirements.scopeOfSupply}

QUOTATIONS RECEIVED (${summary.quotations.count})
───────────────────────────────────────────────────────
MT Quotations:   ${summary.quotations.mtCount}
Competitors:     ${summary.quotations.competitorCount}
${summary.quotations.lowestBid
  ? `
Lowest Bid:      ${summary.quotations.lowestBid.vendor}
Amount:          ${summary.quotations.lowestBid.currency} ${summary.quotations.lowestBid.amount.toLocaleString()}
Type:            ${summary.quotations.lowestBid.type}
`
  : ""
}
`;
  
  if (summary.quotations.vendors.length > 0) {
    text += `\nAll Quotations:\n`;
    summary.quotations.vendors.forEach((v, i) => {
      text += `  ${i + 1}. ${v.name} (${v.type}) - ${v.currency} ${v.amount.toLocaleString()}\n`;
    });
  }
  
  if (summary.legalRisks.length > 0) {
    text += `\n⚠️  LEGAL RISKS DETECTED (${summary.legalRisks.length})\n`;
    text += `───────────────────────────────────────────────────────\n`;
    summary.legalRisks.forEach((risk, i) => {
      text += `  ${i + 1}. [${risk.level.toUpperCase()}] ${risk.type}: ${risk.description}\n`;
    });
  }
  
  text += `\n═══════════════════════════════════════════════════════\n`;
  
  return text;
}

module.exports = {
  getRFQSummary,
  getActiveRFQs,
  getExpiredRFQs,
  searchRFQsByBuyer,
  getRFQStatistics,
  generateTextSummary,
};
