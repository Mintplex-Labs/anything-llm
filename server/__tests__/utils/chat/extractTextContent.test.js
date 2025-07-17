/* eslint-env jest, node */
const { extractTextContent } = require('../../../utils/helpers/chat');

describe('extractTextContent', () => {
  test('should return string content as-is', () => {
    const content = 'Hello world';
    expect(extractTextContent(content)).toBe('Hello world');
  });

  test('should extract text from multi-modal content array', () => {
    const content = [
      {
        type: 'text',
        text: 'First text'
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
        text: 'Second text'
      }
    ];
    expect(extractTextContent(content)).toBe('First text\nSecond text');
  });

  test('should handle empty array', () => {
    const content = [];
    expect(extractTextContent(content)).toBe('');
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

  test('should handle array with mixed content types', () => {
    const content = [
      {
        type: 'text',
        text: 'Text content'
      },
      {
        type: 'other',
        data: 'Some other data'
      },
      {
        type: 'image_url',
        image_url: {
          url: 'data:image/png;base64,abc123'
        }
      }
    ];
    expect(extractTextContent(content)).toBe('Text content');
  });
});