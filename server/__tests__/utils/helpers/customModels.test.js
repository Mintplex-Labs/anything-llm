const { getOllamaTags, getCustomModels } = require('../../../utils/helpers/customModels');

// Mock global fetch
global.fetch = jest.fn();

describe('Ollama Model Discovery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getOllamaTags', () => {
    test('should surface a mocked response containing mxbai-embed-large', async () => {
      const mockTagsResponse = {
        models: [
          { name: 'mxbai-embed-large', details: { modality: 'embedding' } },
          { name: 'bert-large-uncased', details: { modality: 'nlp' } },
          { name: 'text-embedding-ada-002', details: { modality: 'embedding' } },
          { name: 'llama-2-7b', details: { modality: 'chat' } },
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTagsResponse),
      });

      const models = await getOllamaTags('http://localhost:11434', null);
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/tags',
        { headers: {} }
      );
      
      expect(models).toHaveLength(4);
      expect(models.map(m => m.name)).toContain('mxbai-embed-large');
      expect(models.find(m => m.name === 'mxbai-embed-large').details.modality).toBe('embedding');
    });

    test('should handle fetch errors gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));
      
      const models = await getOllamaTags('http://localhost:11434', null);
      
      expect(models).toEqual([]);
    });
  });

  describe('ollama embedding model filtering', () => {
    test('should filter embedding models using new logic and fallback to BERT filter', async () => {
      const mockTagsResponse = {
        models: [
          // Should be included: has embedding modality
          { name: 'mxbai-embed-large', details: { modality: 'embedding' } },
          { name: 'text-embedding-3-small', details: { modality: 'embedding' } },
          
          // Should be included: name contains 'embed'
          { name: 'all-minilm-l6-v2-embed', details: { modality: 'nlp' } },
          { name: 'sentence-transformers-embed', details: { modality: 'nlp' } },
          
          // Should be included: name contains 'bert' (fallback)
          { name: 'bert-base-uncased', details: { modality: 'nlp' } },
          { name: 'distilbert-base', details: { modality: 'nlp' } },
          
          // Should NOT be included: neither embedding modality nor embed/bert in name
          { name: 'llama-2-7b', details: { modality: 'chat' } },
          { name: 'mistral-7b', details: { modality: 'chat' } },
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTagsResponse),
      });

      const result = await getCustomModels('ollama', null, 'http://localhost:11434');
      
      expect(result.error).toBeNull();
      expect(result.models).toHaveLength(6); // 6 embedding models should be found
      
      const modelNames = result.models.map(m => m.id);
      
      // Test that mxbai-embed-large is surfaced
      expect(modelNames).toContain('mxbai-embed-large');
      expect(modelNames).toContain('text-embedding-3-small');
      expect(modelNames).toContain('all-minilm-l6-v2-embed');
      expect(modelNames).toContain('sentence-transformers-embed');
      expect(modelNames).toContain('bert-base-uncased');
      expect(modelNames).toContain('distilbert-base');
      
      // Should not include chat models
      expect(modelNames).not.toContain('llama-2-7b');
      expect(modelNames).not.toContain('mistral-7b');
    });

    test('should handle duplicate models correctly', async () => {
      const mockTagsResponse = {
        models: [
          // This model matches both embedding modality AND name pattern
          { name: 'mxbai-embed-large', details: { modality: 'embedding' } },
          // This model matches both bert pattern AND embed pattern
          { name: 'bert-embed-model', details: { modality: 'nlp' } },
        ]
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTagsResponse),
      });

      const result = await getCustomModels('ollama', null, 'http://localhost:11434');
      
      expect(result.error).toBeNull();
      expect(result.models).toHaveLength(2); // Should not have duplicates
      
      const modelNames = result.models.map(m => m.id);
      expect(modelNames).toContain('mxbai-embed-large');
      expect(modelNames).toContain('bert-embed-model');
      
      // Verify no duplicates
      const uniqueNames = [...new Set(modelNames)];
      expect(modelNames.length).toBe(uniqueNames.length);
    });

    test('should handle empty response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ models: [] }),
      });

      const result = await getCustomModels('ollama', null, 'http://localhost:11434');
      
      expect(result.error).toBeNull();
      expect(result.models).toEqual([]);
    });

    test('should handle server errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Ollama server not responding'));

      const result = await getCustomModels('ollama', null, 'http://localhost:11434');
      
      expect(result.error).toBe('Ollama server not responding');
      expect(result.models).toEqual([]);
    });
  });
});

