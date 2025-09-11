// Test file for Azure DevOps integration
const { resolveRepoLoader, resolveRepoLoaderFunction } = require('./utils/extensions/RepoLoader');
const RESYNC_METHODS = require('./extensions/resync');

console.log('=== Azure DevOps Integration Test ===\n');

// Test 1: Check if Azure DevOps loader can be resolved
console.log('1. Testing RepoLoader resolution...');
try {
  const AzureDevOpsLoader = resolveRepoLoader('azuredevops');
  console.log('✅ Successfully resolved Azure DevOps RepoLoader class:', AzureDevOpsLoader.name);
} catch (e) {
  console.log('❌ Failed to resolve Azure DevOps RepoLoader:', e.message);
}

// Test 2: Check if Azure DevOps loader function can be resolved  
console.log('\n2. Testing RepoLoader function resolution...');
try {
  const azureDevOpsLoaderFunction = resolveRepoLoaderFunction('azuredevops');
  console.log('✅ Successfully resolved Azure DevOps loader function:', azureDevOpsLoaderFunction.name);
} catch (e) {
  console.log('❌ Failed to resolve Azure DevOps loader function:', e.message);
}

// Test 3: Check if Azure DevOps resync method is available
console.log('\n3. Testing resync method availability...');
try {
  const availableMethods = Object.keys(RESYNC_METHODS);
  console.log('Available resync methods:', availableMethods);
  if (availableMethods.includes('azuredevops')) {
    console.log('✅ Azure DevOps resync method is available');
  } else {
    console.log('❌ Azure DevOps resync method is NOT available');
  }
} catch (e) {
  console.log('❌ Failed to check resync methods:', e.message);
}

// Test 4: Test URL parsing for dev.azure.com format
console.log('\n4. Testing URL parsing (dev.azure.com format)...');
try {
  const AzureDevOpsLoader = resolveRepoLoader('azuredevops');
  const loader = new AzureDevOpsLoader({ 
    repo: 'https://dev.azure.com/myorganization/myproject/_git/myrepository' 
  });
  
  // Access the private method through reflection for testing
  const validUrl = loader._AzureDevOpsRepoLoader__validAzureDevOpsUrl();
  
  if (validUrl) {
    console.log('✅ Successfully parsed dev.azure.com URL');
    console.log('   Organization:', loader.organization);
    console.log('   Project:', loader.project);
    console.log('   Repository:', loader.repositoryId);
    console.log('   API Base:', loader.apiBase);
  } else {
    console.log('❌ Failed to parse dev.azure.com URL');
  }
} catch (e) {
  console.log('❌ Error testing dev.azure.com URL parsing:', e.message);
}

// Test 5: Test URL parsing for visualstudio.com format
console.log('\n5. Testing URL parsing (visualstudio.com format)...');
try {
  const AzureDevOpsLoader = resolveRepoLoader('azuredevops');
  const loader = new AzureDevOpsLoader({ 
    repo: 'https://myorganization.visualstudio.com/myproject/_git/myrepository' 
  });
  
  // Access the private method through reflection for testing
  const validUrl = loader._AzureDevOpsRepoLoader__validAzureDevOpsUrl();
  
  if (validUrl) {
    console.log('✅ Successfully parsed visualstudio.com URL');
    console.log('   Organization:', loader.organization);
    console.log('   Project:', loader.project);
    console.log('   Repository:', loader.repositoryId);
    console.log('   API Base:', loader.apiBase);
  } else {
    console.log('❌ Failed to parse visualstudio.com URL');
  }
} catch (e) {
  console.log('❌ Error testing visualstudio.com URL parsing:', e.message);
}

// Test 6: Test invalid URL handling
console.log('\n6. Testing invalid URL handling...');
try {
  const AzureDevOpsLoader = resolveRepoLoader('azuredevops');
  const loader = new AzureDevOpsLoader({ 
    repo: 'https://github.com/user/repo' // Invalid URL for Azure DevOps
  });
  
  const validUrl = loader._AzureDevOpsRepoLoader__validAzureDevOpsUrl();
  
  if (!validUrl) {
    console.log('✅ Correctly rejected invalid URL');
  } else {
    console.log('❌ Incorrectly accepted invalid URL');
  }
} catch (e) {
  console.log('❌ Error testing invalid URL handling:', e.message);
}

console.log('\n=== Test Complete ===');
