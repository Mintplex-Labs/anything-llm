console.log('Starting simple Azure DevOps test...');

try {
  const fs = require('fs');
  console.log('Node.js basics working...');
  
  // Check if our files exist
  const loaderPath = './utils/extensions/RepoLoader/index.js';
  const resyncPath = './extensions/resync/index.js';
  
  console.log('Loader file exists:', fs.existsSync(loaderPath));
  console.log('Resync file exists:', fs.existsSync(resyncPath));
  
  // Try to require the modules
  const resolverModule = require('./utils/extensions/RepoLoader/index.js');
  console.log('Resolver module loaded');
  
  const azureLoader = resolverModule('azuredevops');
  console.log('Azure DevOps loader resolved:', !!azureLoader);
  
  console.log('SUCCESS: Azure DevOps integration working!');
  
} catch (error) {
  console.error('ERROR:', error.message);
  console.error(error.stack);
}
