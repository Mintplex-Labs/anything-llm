// Test WebDAV connector functionality
async function testWebDAVConnector() {
  console.log('🧪 Testing WebDAV Connector Implementation...\n');

  // Test 1: Check if our WebDAV extension file exists
  const fs = require('fs');
  const path = require('path');
  
  const webdavExtensionPath = path.join(__dirname, 'collector/utils/extensions/WebDAV/index.js');
  if (fs.existsSync(webdavExtensionPath)) {
    console.log('✅ WebDAV extension file exists');
  } else {
    console.log('❌ WebDAV extension file not found');
  }

  // Test 2: Check if frontend WebDAV component exists
  const webdavComponentPath = path.join(__dirname, 'frontend/src/components/Modals/ManageWorkspace/DataConnectors/Connectors/WebDAV/index.jsx');
  if (fs.existsSync(webdavComponentPath)) {
    console.log('✅ WebDAV frontend component exists');
  } else {
    console.log('❌ WebDAV frontend component not found');
  }

  // Test 3: Check if WebDAV is added to data connectors
  const dataConnectorPath = path.join(__dirname, 'frontend/src/models/dataConnector.js');
  if (fs.existsSync(dataConnectorPath)) {
    const content = fs.readFileSync(dataConnectorPath, 'utf8');
    if (content.includes('webdav:')) {
      console.log('✅ WebDAV is added to data connectors');
    } else {
      console.log('❌ WebDAV not found in data connectors');
    }
  }

  // Test 4: Check if WebDAV endpoint is added to server
  const serverExtensionsPath = path.join(__dirname, 'server/endpoints/extensions/index.js');
  if (fs.existsSync(serverExtensionsPath)) {
    const content = fs.readFileSync(serverExtensionsPath, 'utf8');
    if (content.includes('/ext/webdav')) {
      console.log('✅ WebDAV endpoint is added to server');
    } else {
      console.log('❌ WebDAV endpoint not found in server');
    }
  }

  // Test 5: Check if WebDAV endpoint is added to collector
  const collectorExtensionsPath = path.join(__dirname, 'collector/extensions/index.js');
  if (fs.existsSync(collectorExtensionsPath)) {
    const content = fs.readFileSync(collectorExtensionsPath, 'utf8');
    if (content.includes('/ext/webdav')) {
      console.log('✅ WebDAV endpoint is added to collector');
    } else {
      console.log('❌ WebDAV endpoint not found in collector');
    }
  }

  // Test 6: Check if WebDAV icon exists
  const webdavIconPath = path.join(__dirname, 'frontend/src/components/DataConnectorOption/media/webdav.svg');
  if (fs.existsSync(webdavIconPath)) {
    console.log('✅ WebDAV icon exists');
  } else {
    console.log('❌ WebDAV icon not found');
  }

  // Test 7: Check if WebDAV localization strings exist
  const localizationPath = path.join(__dirname, 'frontend/src/locales/en/common.js');
  if (fs.existsSync(localizationPath)) {
    const content = fs.readFileSync(localizationPath, 'utf8');
    if (content.includes('webdav:')) {
      console.log('✅ WebDAV localization strings exist');
    } else {
      console.log('❌ WebDAV localization strings not found');
    }
  }

  // Test 8: Check if WebDAV is added to connector list
  const connectorListPath = path.join(__dirname, 'frontend/src/components/Modals/ManageWorkspace/DataConnectors/index.jsx');
  if (fs.existsSync(connectorListPath)) {
    const content = fs.readFileSync(connectorListPath, 'utf8');
    if (content.includes('webdav:') && content.includes('WebDAVOptions')) {
      console.log('✅ WebDAV is added to connector list');
    } else {
      console.log('❌ WebDAV not found in connector list');
    }
  }

  // Test 9: Check if webdav package is in collector dependencies
  const collectorPackagePath = path.join(__dirname, 'collector/package.json');
  if (fs.existsSync(collectorPackagePath)) {
    const content = fs.readFileSync(collectorPackagePath, 'utf8');
    if (content.includes('"webdav"')) {
      console.log('✅ WebDAV package is in collector dependencies');
    } else {
      console.log('❌ WebDAV package not found in collector dependencies');
    }
  }

  console.log('\n🎉 WebDAV Connector Implementation Test Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Create a workspace');
  console.log('3. Go to "Manage Workspace" → "Data Connectors"');
  console.log('4. Look for the WebDAV connector in the list');
  console.log('5. Test the WebDAV connection form');
  console.log('\n🔧 Services Status:');
  console.log('- Frontend: http://localhost:3000');
  console.log('- Server: http://localhost:3001');
  console.log('- Collector: http://localhost:8888');
}

// Run the test
testWebDAVConnector().catch(console.error); 