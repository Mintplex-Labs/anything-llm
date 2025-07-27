class OllamaTestClient {
  constructor(baseUrl = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  /**
   * Seed Ollama with dummy models for testing
   * @param {Array} models - Array of model objects to seed
   */
  async seedModels(models) {
    // In a real implementation, this would interact with a mock Ollama server
    // For now, we'll implement a simple HTTP-based approach
    
    try {
      // First, check if Ollama is available
      await this.checkHealth();
      
      // Store models in mock server
      const response = await fetch(`${this.baseUrl}/api/test/seed-models`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ models })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to seed models: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error seeding Ollama models:', error);
      throw error;
    }
  }

  /**
   * Check if the Ollama test server is healthy
   */
  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/version`, {
        method: 'GET',
        timeout: 5000
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error('Ollama health check failed:', error);
      throw error;
    }
  }

  /**
   * Get all models from the test Ollama instance
   */
  async getModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      
      if (!response.ok) {
        throw new Error(`Failed to get models: ${response.status}`);
      }
      
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Error getting Ollama models:', error);
      throw error;
    }
  }

  /**
   * Clear all models from the test instance
   */
  async clearModels() {
    try {
      const response = await fetch(`${this.baseUrl}/api/test/clear-models`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to clear models: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error clearing Ollama models:', error);
      throw error;
    }
  }
}

module.exports = { OllamaTestClient };
