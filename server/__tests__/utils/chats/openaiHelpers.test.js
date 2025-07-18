/* eslint-env jest, node */
const { extractTextContent, extractAttachments } = require('../../../endpoints/api/openai/helpers');

describe('OpenAI Helper Functions', () => {
  describe('extractTextContent', () => {
    test('should return string content as-is when not an array', () => {
      const content = 'Hello world';
      expect(extractTextContent(content)).toBe('Hello world');
    });

    test('should extract text from multi-modal content array', () => {
      const content = [
        {
          type: 'text',
          text: 'What do you see in this image?'
        },
        {
          type: 'image_url',
          image_url: {
            url: 'data:image/png;base64,abc123',
            detail: 'low'
          }
        },
        {
          type: 'text',
          text: 'And what about this part?'
        }
      ];
      expect(extractTextContent(content)).toBe('What do you see in this image?\nAnd what about this part?');
    });

    test('should handle empty array', () => {
      expect(extractTextContent([])).toBe('');
    });

    test('should handle array with no text content', () => {
      const content = [
        {
          type: 'image_url',
          image_url: {
            url: 'data:image/png;base64,abc123',
            detail: 'low'
          }
        }
      ];
      expect(extractTextContent(content)).toBe('');
    });
  });

  describe('extractAttachments', () => {
    test('should return empty array for string content', () => {
      const content = 'Hello world';
      expect(extractAttachments(content)).toEqual([]);
    });

    test('should extract image attachments with correct mime types', () => {
      const content = [
        {
          type: 'image_url',
          image_url: {
            url: 'data:image/png;base64,abc123',
            detail: 'low'
          }
        },
        {
          type: 'text',
          text: 'Between images'
        },
        {
          type: 'image_url',
          image_url: {
            url: 'data:image/jpeg;base64,def456',
            detail: 'high'
          }
        }
      ];
      expect(extractAttachments(content)).toEqual([
        {
          name: 'uploaded_image_0',
          mime: 'image/png',
          contentString: 'data:image/png;base64,abc123'
        },
        {
          name: 'uploaded_image_1',
          mime: 'image/jpeg',
          contentString: 'data:image/jpeg;base64,def456'
        }
      ]);
    });

    test('should handle invalid data URLs with PNG fallback', () => {
      const content = [
        {
          type: 'image_url',
          image_url: {
            url: 'invalid-data-url',
            detail: 'low'
          }
        }
      ];
      expect(extractAttachments(content)).toEqual([
        {
          name: 'uploaded_image_0',
          mime: 'image/png',
          contentString: 'invalid-data-url'
        }
      ]);
    });

    test('should handle empty array', () => {
      expect(extractAttachments([])).toEqual([]);
    });

    test('should handle array with no image content', () => {
      const content = [
        {
          type: 'text',
          text: 'Just some text'
        },
        {
          type: 'text',
          text: 'More text'
        }
      ];
      expect(extractAttachments(content)).toEqual([]);
    });
  });
});