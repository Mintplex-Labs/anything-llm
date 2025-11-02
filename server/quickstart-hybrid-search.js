#!/usr/bin/env node

/**
 * HYBRID SEARCH - Quick Start Script
 * 
 * This script helps you set up and test the hybrid search system:
 * 1. Migrates database schema
 * 2. Processes existing documents
 * 3. Runs test queries
 */

const { PrismaClient } = require("@prisma/client");
const { processAllDocuments } = require("./utils/extraction/documentExtractor");
const { getRFQStatistics, getActiveRFQs } = require("./utils/services/rfqSummary");
const { getRFQsWithMultipleQuotations } = require("./utils/services/priceComparison");
const path = require("path");

const prisma = new PrismaClient();

async function quickStart() {
  console.log("\n═══════════════════════════════════════════════════════");
  console.log("   HYBRID SEARCH SYSTEM - Quick Start");
  console.log("═══════════════════════════════════════════════════════\n");

  try {
    // Step 1: Check database connection
    console.log("📊 Step 1: Checking database connection...");
    await prisma.$connect();
    console.log("✅ Database connected successfully\n");

    // Step 2: Process existing documents
    console.log("📄 Step 2: Processing existing documents...");
    const storageDir = path.join(__dirname, "storage", "documents", "custom-documents");
    console.log(`   Storage directory: ${storageDir}\n`);

    const processResult = await processAllDocuments(storageDir);
    console.log(`✅ Processing complete:`);
    console.log(`   - Total: ${processResult.total}`);
    console.log(`   - Success: ${processResult.success}`);
    console.log(`   - Errors: ${processResult.errors}\n`);

    // Step 3: Show statistics
    console.log("📈 Step 3: Database Statistics...");
    const stats = await getRFQStatistics();
    console.log(`✅ Statistics:`);
    console.log(`   - Total RFQs: ${stats.total}`);
    console.log(`   - Active RFQs: ${stats.active}`);
    console.log(`   - Expired RFQs: ${stats.expired}`);
    console.log(`   - Quotations: ${stats.quotationsReceived}`);
    console.log(`   - Avg Quotations/RFQ: ${stats.avgQuotationsPerRFQ}\n`);

    if (stats.topBuyers.length > 0) {
      console.log("   Top Buyers:");
      stats.topBuyers.forEach((buyer, i) => {
        console.log(`   ${i + 1}. ${buyer.name || "Unknown"} (${buyer.rfqCount} RFQs)`);
      });
      console.log("");
    }

    // Step 4: Show RFQs with competitive quotations
    console.log("💰 Step 4: RFQs with Multiple Quotations (Price Comparison Ready)...");
    const competitiveRFQs = await getRFQsWithMultipleQuotations();
    
    if (competitiveRFQs.length > 0) {
      console.log(`✅ Found ${competitiveRFQs.length} RFQs with competitive quotations:\n`);
      competitiveRFQs.slice(0, 5).forEach((rfq, i) => {
        console.log(`   ${i + 1}. RFQ: ${rfq.rfqNumber}`);
        console.log(`      Project: ${rfq.projectName || "N/A"}`);
        console.log(`      Buyer: ${rfq.buyerName || "N/A"}`);
        console.log(`      Quotations: ${rfq.quotationCount} (${rfq.vendors.join(", ")})`);
        console.log("");
      });
    } else {
      console.log("⚠️  No RFQs with multiple quotations found yet\n");
      console.log("   Upload more quotation documents to enable price comparison.\n");
    }

    // Step 5: Show active RFQs
    console.log("📋 Step 5: Active RFQs (Not Expired)...");
    const activeRFQs = await getActiveRFQs();
    
    if (activeRFQs.length > 0) {
      console.log(`✅ Found ${activeRFQs.length} active RFQs:\n`);
      activeRFQs.slice(0, 5).forEach((rfq, i) => {
        console.log(`   ${i + 1}. ${rfq.rfqNumber} - ${rfq.projectName || "N/A"}`);
        console.log(`      Deadline: ${rfq.deadline.date} (${rfq.deadline.status})`);
        console.log(`      Urgency: ${rfq.deadline.urgency}`);
        console.log(`      Quotations: ${rfq.quotationCount} (MT: ${rfq.hasMTQuotation ? "Yes" : "No"}, Competitors: ${rfq.hasCompetitors ? "Yes" : "No"})`);
        console.log("");
      });
    } else {
      console.log("ℹ️  No active RFQs found\n");
    }

    // Step 6: Usage examples
    console.log("═══════════════════════════════════════════════════════");
    console.log("   NEXT STEPS - Try These Queries:");
    console.log("═══════════════════════════════════════════════════════\n");

    console.log("1️⃣  PRICE COMPARISON:");
    console.log('   const { comparePrices } = require("./utils/services/priceComparison");');
    if (competitiveRFQs.length > 0) {
      console.log(`   await comparePrices("${competitiveRFQs[0].rfqNumber}");\n`);
    } else {
      console.log('   await comparePrices("YOUR-RFQ-NUMBER");\n');
    }

    console.log("2️⃣  RFQ SUMMARY:");
    console.log('   const { generateTextSummary } = require("./utils/services/rfqSummary");');
    if (activeRFQs.length > 0) {
      console.log(`   await generateTextSummary("${activeRFQs[0].rfqNumber}");\n`);
    } else {
      console.log('   await generateTextSummary("YOUR-RFQ-NUMBER");\n');
    }

    console.log("3️⃣  HYBRID SEARCH:");
    console.log('   const { hybridSearch } = require("./utils/search/hybridSearch");');
    console.log('   await hybridSearch("So sánh giá MT với đối thủ", { workspaceId: 1, topK: 5 });\n');

    console.log("4️⃣  DOCUMENT COMPARISON:");
    console.log('   const { compareInvoiceToPO } = require("./utils/services/documentComparator");');
    console.log('   await compareInvoiceToPO("YOUR-INVOICE-NUMBER");\n');

    console.log("═══════════════════════════════════════════════════════");
    console.log("   ✅ Quick Start Complete!");
    console.log("═══════════════════════════════════════════════════════\n");

    console.log("📖 For detailed documentation, see: server/HYBRID_SEARCH_SETUP.md\n");

  } catch (error) {
    console.error("\n❌ Error during quick start:", error.message);
    console.error("\nStack trace:", error.stack);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run if called directly
if (require.main === module) {
  quickStart().catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

module.exports = { quickStart };
