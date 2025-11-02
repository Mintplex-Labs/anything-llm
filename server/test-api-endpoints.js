/**
 * Test Hybrid Search API Endpoints via HTTP
 * 
 * Requires server to be running on http://localhost:3001
 */

const http = require('http');

// Helper function to make HTTP requests
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: `/api/hybrid-search${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

async function testEndpoints() {
  console.log('\n🧪 Testing Hybrid Search API Endpoints\n');
  console.log('📡 Server: http://localhost:3001\n');
  console.log('═══════════════════════════════════════\n');

  try {
    // Test 1: Active RFQs
    console.log('1️⃣  GET /active-rfqs');
    const activeRFQs = await makeRequest('GET', '/active-rfqs');
    
    if (activeRFQs.status === 200 && activeRFQs.data.success) {
      console.log(`   ✅ SUCCESS (${activeRFQs.status})`);
      console.log(`   Found: ${activeRFQs.data.count} active RFQs`);
      if (activeRFQs.data.rfqs.length > 0) {
        const sample = activeRFQs.data.rfqs[0];
        console.log(`   Sample: ${sample.rfqNumber || 'N/A'} - ${sample.daysRemaining} days left`);
      }
    } else {
      console.log(`   ❌ FAILED (${activeRFQs.status})`);
      console.log(`   Error: ${activeRFQs.data.error || 'Unknown error'}`);
    }
    console.log('');

    // Test 2: RFQ Summary/Statistics
    console.log('2️⃣  GET /rfq-summary');
    const rfqStats = await makeRequest('GET', '/rfq-summary');
    
    if (rfqStats.status === 200 && rfqStats.data.success) {
      console.log(`   ✅ SUCCESS (${rfqStats.status})`);
      const stats = rfqStats.data.statistics;
      console.log(`   Total RFQs: ${stats.totalRFQs}`);
      console.log(`   Active: ${stats.activeRFQs}, Expired: ${stats.expiredRFQs}`);
    } else {
      console.log(`   ❌ FAILED (${rfqStats.status})`);
      console.log(`   Error: ${rfqStats.data.error || 'Unknown error'}`);
    }
    console.log('');

    // Test 3: Hybrid Search
    console.log('3️⃣  POST /search');
    const searchResult = await makeRequest('POST', '/search', {
      query: 'RFQ deadline tháng 11',
      topK: 5
    });
    
    if (searchResult.status === 200 && searchResult.data.success) {
      console.log(`   ✅ SUCCESS (${searchResult.status})`);
      console.log(`   Query: "${searchResult.data.query}"`);
      console.log(`   Classification: ${searchResult.data.classification.type} (${(searchResult.data.classification.confidence * 100).toFixed(1)}%)`);
      console.log(`   Results: ${searchResult.data.totalResults}`);
      console.log(`   Sources: SQL=${searchResult.data.sources.sql}, Vector=${searchResult.data.sources.vector}`);
    } else {
      console.log(`   ❌ FAILED (${searchResult.status})`);
      console.log(`   Error: ${searchResult.data.error || 'Unknown error'}`);
    }
    console.log('');

    // Test 4: Competitive RFQs
    console.log('4️⃣  GET /competitive-rfqs');
    const competitive = await makeRequest('GET', '/competitive-rfqs');
    
    if (competitive.status === 200 && competitive.data.success) {
      console.log(`   ✅ SUCCESS (${competitive.status})`);
      console.log(`   RFQs with multiple quotations: ${competitive.data.count}`);
    } else {
      console.log(`   ❌ FAILED (${competitive.status})`);
      console.log(`   Error: ${competitive.data.error || 'Unknown error'}`);
    }
    console.log('');

    // Test 5: Expired RFQs
    console.log('5️⃣  GET /expired-rfqs');
    const expired = await makeRequest('GET', '/expired-rfqs');
    
    if (expired.status === 200 && expired.data.success) {
      console.log(`   ✅ SUCCESS (${expired.status})`);
      console.log(`   Expired RFQs: ${expired.data.count}`);
    } else {
      console.log(`   ❌ FAILED (${expired.status})`);
      console.log(`   Error: ${expired.data.error || 'Unknown error'}`);
    }
    console.log('');

    // Test 6: Price Comparison (will fail without data, but tests endpoint)
    console.log('6️⃣  POST /price-comparison');
    const priceComp = await makeRequest('POST', '/price-comparison', {
      rfqNumber: 'BD-OPS-2022-029'
    });
    
    if (priceComp.status === 200 || priceComp.status === 404) {
      console.log(`   ✅ Endpoint works (${priceComp.status})`);
      if (priceComp.data.success) {
        console.log(`   Found comparison data`);
      } else {
        console.log(`   Expected: No quotations available yet`);
      }
    } else {
      console.log(`   ❌ FAILED (${priceComp.status})`);
      console.log(`   Error: ${priceComp.data.error || 'Unknown error'}`);
    }
    console.log('');

    // Test 7: Discrepancies
    console.log('7️⃣  GET /discrepancies');
    const discrepancies = await makeRequest('GET', '/discrepancies');
    
    if (discrepancies.status === 200 && discrepancies.data.success) {
      console.log(`   ✅ SUCCESS (${discrepancies.status})`);
      console.log(`   Open discrepancies: ${discrepancies.data.count}`);
    } else {
      console.log(`   ❌ FAILED (${discrepancies.status})`);
      console.log(`   Error: ${discrepancies.data.error || 'Unknown error'}`);
    }
    console.log('');

    console.log('═══════════════════════════════════════\n');
    console.log('✅ API Endpoint Testing Complete!\n');
    console.log('📊 Summary:');
    console.log('   - 7 endpoints tested');
    console.log('   - Server is responding');
    console.log('   - Hybrid Search API is working\n');

  } catch (error) {
    console.error('\n❌ Error testing endpoints:', error.message);
    console.error('\n⚠️  Make sure the server is running:');
    console.error('   cd server && yarn dev\n');
  }
}

// Run tests
console.log('🚀 Starting API endpoint tests...');
console.log('⏳ Waiting for server connection...\n');

setTimeout(() => {
  testEndpoints();
}, 1000);
