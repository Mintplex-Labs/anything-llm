/**
 * Test Hybrid Search API Endpoints
 * 
 * Simple tests to verify API functionality
 */

require("dotenv").config({ path: `.env.development` });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAPIs() {
  console.log('\n🧪 Testing Hybrid Search API Functions...\n');

  try {
    // Test 1: Hybrid Search
    console.log('1️⃣ Testing Hybrid Search...');
    const { hybridSearch } = require('./utils/search/hybridSearch');
    
    const searchResult = await hybridSearch('RFQ deadline', {
      workspaceId: null,
      topK: 5,
      minScore: 0.5
    });
    
    console.log(`   ✅ Query Classification: ${searchResult.classification.type} (${(searchResult.classification.confidence * 100).toFixed(1)}%)`);
    console.log(`   ✅ Total Results: ${searchResult.results.length}`);
    console.log(`   ✅ Sources: SQL=${searchResult.sources.sql}, Vector=${searchResult.sources.vector}\n`);

    // Test 2: RFQ Statistics
    console.log('2️⃣ Testing RFQ Statistics...');
    const { getRFQStatistics, getActiveRFQs } = require('./utils/services/rfqSummary');
    
    const stats = await getRFQStatistics();
    console.log(`   ✅ Total RFQs: ${stats.totalRFQs}`);
    console.log(`   ✅ Active: ${stats.activeRFQs}, Expired: ${stats.expiredRFQs}\n`);

    // Test 3: Active RFQs
    console.log('3️⃣ Testing Active RFQs...');
    const activeRFQs = await getActiveRFQs();
    console.log(`   ✅ Found ${activeRFQs.length} active RFQs`);
    
    if (activeRFQs.length > 0) {
      const sample = activeRFQs[0];
      console.log(`   📄 Sample: ${sample.rfqNumber} - ${sample.projectName}`);
      console.log(`      Deadline: ${new Date(sample.deadline).toLocaleDateString()}`);
      console.log(`      Days Remaining: ${sample.daysRemaining}\n`);
    }

    // Test 4: Price Comparison Service
    console.log('4️⃣ Testing Price Comparison Service...');
    const { getRFQsWithMultipleQuotations } = require('./utils/services/priceComparison');
    
    const competitiveRFQs = await getRFQsWithMultipleQuotations();
    console.log(`   ✅ RFQs with multiple quotations: ${competitiveRFQs.length}`);
    
    if (competitiveRFQs.length === 0) {
      console.log(`   ⚠️  Note: No competitive quotations found. Upload more quotation PDFs.\n`);
    }

    // Test 5: Document Comparator Service
    console.log('5️⃣ Testing Document Comparator Service...');
    const { getOpenDiscrepancies } = require('./utils/services/documentComparator');
    
    const discrepancies = await getOpenDiscrepancies();
    console.log(`   ✅ Open discrepancies: ${discrepancies.length}\n`);

    // Test 6: Database Counts
    console.log('6️⃣ Checking Database...');
    const [rfqCount, poCount, quotCount] = await Promise.all([
      prisma.rfq_metadata.count(),
      prisma.purchase_orders.count(),
      prisma.quotations.count()
    ]);
    
    console.log(`   ✅ RFQs in database: ${rfqCount}`);
    console.log(`   ✅ Purchase Orders: ${poCount}`);
    console.log(`   ✅ Quotations: ${quotCount}\n`);

    console.log('═══════════════════════════════════════');
    console.log('✅ ALL TESTS PASSED!');
    console.log('═══════════════════════════════════════\n');

    console.log('🚀 Ready to test API endpoints via HTTP!\n');
    console.log('Try these commands:\n');
    console.log('# Test general search');
    console.log('curl -X POST http://localhost:3001/api/hybrid-search/search \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"query": "RFQ deadline", "topK": 5}\'\n');
    console.log('# Get active RFQs');
    console.log('curl http://localhost:3001/api/hybrid-search/active-rfqs\n');
    console.log('# Get RFQ statistics');
    console.log('curl http://localhost:3001/api/hybrid-search/rfq-summary\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

// Run tests
testAPIs();
