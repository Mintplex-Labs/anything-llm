const { spawn } = require('child_process');

async function globalTeardown() {
  console.log('🧹 Cleaning up test environment...');
  
  try {
    // Stop mock Ollama server
    await stopMockOllamaServer();
    
    console.log('✅ Test environment cleanup complete');
  } catch (error) {
    console.error('❌ Failed to cleanup test environment:', error);
    // Don't throw error during teardown to avoid masking test failures
  }
}

async function stopMockOllamaServer() {
  console.log('Stopping mock Ollama server...');
  
  return new Promise((resolve, reject) => {
    const dockerProcess = spawn('docker-compose', [
      '-f', 'docker/docker-compose.test.yml',
      'down', '-v'
    ], {
      cwd: __dirname + '/..',
      stdio: 'inherit'
    });
    
    dockerProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Mock Ollama server stopped');
        resolve();
      } else {
        console.warn(`Docker compose down exited with code ${code}`);
        resolve(); // Don't fail teardown
      }
    });
    
    dockerProcess.on('error', (error) => {
      console.warn('Error stopping Docker containers:', error);
      resolve(); // Don't fail teardown
    });
  });
}

module.exports = globalTeardown;
