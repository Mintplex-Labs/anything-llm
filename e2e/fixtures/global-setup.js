const { spawn } = require('child_process');
const { OllamaTestClient } = require('../utils/ollama-client');

async function globalSetup() {
  console.log('🔧 Setting up test environment...');
  
  try {
    // Start mock Ollama server
    await startMockOllamaServer();
    
    // Seed with dummy models
    await seedOllamaModels();
    
    console.log('✅ Test environment setup complete');
  } catch (error) {
    console.error('❌ Failed to setup test environment:', error);
    throw error;
  }
}

async function startMockOllamaServer() {
  console.log('Starting mock Ollama server...');
  
  return new Promise((resolve, reject) => {
    // Use docker-compose to start a mock Ollama instance
    const dockerProcess = spawn('docker-compose', [
      '-f', 'docker/docker-compose.test.yml',
      'up', '-d', 'ollama-mock'
    ], {
      cwd: __dirname + '/..',
      stdio: 'inherit'
    });
    
    dockerProcess.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Mock Ollama server started');
        // Wait a bit for the server to be ready
        setTimeout(resolve, 2000);
      } else {
        reject(new Error(`Docker compose failed with code ${code}`));
      }
    });
    
    dockerProcess.on('error', reject);
  });
}

async function seedOllamaModels() {
  console.log('Seeding Ollama with dummy models...');
  
  const client = new OllamaTestClient('http://localhost:11434');
  
  // Define dummy embedding models for testing
  const dummyModels = [
    {
      name: 'mxbai-embed-large:latest',
      size: 1234567890,
      digest: 'sha256:dummy1',
      details: {
        modality: 'embedding',
        family: 'bert',
        parameter_size: '334M'
      }
    },
    {
      name: 'all-minilm:latest',
      size: 987654321,
      digest: 'sha256:dummy2',
      details: {
        modality: 'embedding',
        family: 'bert',
        parameter_size: '22M'
      }
    },
    {
      name: 'nomic-embed-text:latest',
      size: 555666777,
      digest: 'sha256:dummy3',
      details: {
        modality: 'embedding',
        family: 'nomic-bert',
        parameter_size: '137M'
      }
    },
    {
      name: 'e5-large:latest',
      size: 888999000,
      digest: 'sha256:dummy4',
      details: {
        modality: 'embedding',
        family: 'bert',
        parameter_size: '335M'
      }
    }
  ];
  
  try {
    await client.seedModels(dummyModels);
    console.log('✅ Ollama models seeded successfully');
  } catch (error) {
    console.error('❌ Failed to seed Ollama models:', error);
    throw error;
  }
}

module.exports = globalSetup;
