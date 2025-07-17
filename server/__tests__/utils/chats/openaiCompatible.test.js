/* eslint-env jest, node */
const { OpenAICompatibleChat } = require('../../../utils/chats/openaiCompatible');
const { WorkspaceChats } = require('../../../models/workspaceChats');
const { getVectorDbClass, getLLMProvider } = require('../../../utils/helpers');

// Mock dependencies
jest.mock('../../../models/workspaceChats');
jest.mock('../../../utils/helpers');
jest.mock('../../../utils/DocumentManager', () => ({
  DocumentManager: class {
    constructor() {
      this.pinnedDocs = jest.fn().mockResolvedValue([]);
    }
  }
}));

describe('OpenAICompatibleChat', () => {
  let mockWorkspace;
  let mockVectorDb;
  let mockLLMConnector;
  let mockResponse;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock workspace
    mockWorkspace = {
      id: 1,
      slug: 'test-workspace',
      chatMode: 'chat',
      chatProvider: 'openai',
      chatModel: 'gpt-4',
    };

    // Setup mock VectorDb
    mockVectorDb = {
      hasNamespace: jest.fn().mockResolvedValue(true),
      namespaceCount: jest.fn().mockResolvedValue(1),
      performSimilaritySearch: jest.fn().mockResolvedValue({
        contextTexts: [],
        sources: [],
        message: null,
      }),
    };
    getVectorDbClass.mockReturnValue(mockVectorDb);

    // Setup mock LLM connector
    mockLLMConnector = {
      promptWindowLimit: jest.fn().mockReturnValue(4000),
      compressMessages: jest.fn().mockResolvedValue([]),
      getChatCompletion: jest.fn().mockResolvedValue({
        textResponse: 'Mock response',
        metrics: {},
      }),
      streamingEnabled: jest.fn().mockReturnValue(true),
      streamGetChatCompletion: jest.fn().mockResolvedValue({
        metrics: {},
      }),
      handleStream: jest.fn().mockResolvedValue('Mock streamed response'),
      defaultTemp: 0.7,
    };
    getLLMProvider.mockReturnValue(mockLLMConnector);

    // Setup WorkspaceChats mock
    WorkspaceChats.new.mockResolvedValue({ chat: { id: 'mock-chat-id' } });

    // Setup mock response object for streaming
    mockResponse = {
      write: jest.fn(),
    };
  });

  describe('chatSync', () => {
    test('should handle regular string prompts', async () => {
      const result = await OpenAICompatibleChat.chatSync({
        workspace: mockWorkspace,
        prompt: 'Hello world',
      });

      // Verify the prompt was passed correctly to vector search
      expect(mockVectorDb.performSimilaritySearch).toHaveBeenCalledWith(
        expect.objectContaining({
          input: 'Hello world',
        })
      );

      // Verify chat was saved correctly
      expect(WorkspaceChats.new).toHaveBeenCalledWith(
        expect.objectContaining({
          workspaceId: mockWorkspace.id,
          prompt: 'Hello world',
        })
      );

      // Verify response format
      expect(result).toEqual(
        expect.objectContaining({
          object: 'chat.completion',
          choices: expect.arrayContaining([
            expect.objectContaining({
              message: expect.objectContaining({
                role: 'assistant',
                content: 'Mock response',
              }),
            }),
          ]),
        })
      );
    });

    test('should handle multi-modal content array prompts', async () => {
      const multiModalPrompt = [
        {
          type: 'text',
          text: 'What is in this image?'
        },
        {
          type: 'image_url',
          image_url: {
            url: 'data:image/png;base64,abc123',
            detail: 'low'
          }
        }
      ];

      const result = await OpenAICompatibleChat.chatSync({
        workspace: mockWorkspace,
        prompt: multiModalPrompt,
      });

      // Verify the text was extracted correctly for vector search
      expect(mockVectorDb.performSimilaritySearch).toHaveBeenCalledWith(
        expect.objectContaining({
          input: 'What is in this image?',
        })
      );

      // Verify chat was saved with extracted text
      expect(WorkspaceChats.new).toHaveBeenCalledWith(
        expect.objectContaining({
          workspaceId: mockWorkspace.id,
          prompt: 'What is in this image?',
        })
      );

      // Verify response format remains unchanged
      expect(result).toEqual(
        expect.objectContaining({
          object: 'chat.completion',
          choices: expect.arrayContaining([
            expect.objectContaining({
              message: expect.objectContaining({
                role: 'assistant',
                content: 'Mock response',
              }),
            }),
          ]),
        })
      );
    });

    test('should handle empty content array', async () => {
      const result = await OpenAICompatibleChat.chatSync({
        workspace: mockWorkspace,
        prompt: [],
      });

      // Verify empty string is passed to vector search
      expect(mockVectorDb.performSimilaritySearch).toHaveBeenCalledWith(
        expect.objectContaining({
          input: '',
        })
      );

      // Verify chat was saved with empty string
      expect(WorkspaceChats.new).toHaveBeenCalledWith(
        expect.objectContaining({
          workspaceId: mockWorkspace.id,
          prompt: '',
        })
      );

      expect(result).toBeTruthy();
    });
  });

  describe('streamChat', () => {
    test('should handle regular string prompts in streaming mode', async () => {
      await OpenAICompatibleChat.streamChat({
        workspace: mockWorkspace,
        response: mockResponse,
        prompt: 'Hello world',
      });

      // Verify the prompt was passed correctly to vector search
      expect(mockVectorDb.performSimilaritySearch).toHaveBeenCalledWith(
        expect.objectContaining({
          input: 'Hello world',
        })
      );

      // Verify streaming was handled
      expect(mockLLMConnector.streamGetChatCompletion).toHaveBeenCalled();
      expect(mockLLMConnector.handleStream).toHaveBeenCalled();

      // Verify chat was saved with the streamed response
      expect(WorkspaceChats.new).toHaveBeenCalledWith(
        expect.objectContaining({
          workspaceId: mockWorkspace.id,
          prompt: 'Hello world',
          response: expect.objectContaining({
            text: 'Mock streamed response',
          }),
        })
      );
    });

    test('should handle multi-modal content array prompts in streaming mode', async () => {
      const multiModalPrompt = [
        {
          type: 'text',
          text: 'What is in this image?'
        },
        {
          type: 'image_url',
          image_url: {
            url: 'data:image/png;base64,abc123',
            detail: 'low'
          }
        }
      ];

      await OpenAICompatibleChat.streamChat({
        workspace: mockWorkspace,
        response: mockResponse,
        prompt: multiModalPrompt,
      });

      // Verify the text was extracted correctly for vector search
      expect(mockVectorDb.performSimilaritySearch).toHaveBeenCalledWith(
        expect.objectContaining({
          input: 'What is in this image?',
        })
      );

      // Verify streaming was handled
      expect(mockLLMConnector.streamGetChatCompletion).toHaveBeenCalled();
      expect(mockLLMConnector.handleStream).toHaveBeenCalled();

      // Verify chat was saved with extracted text and streamed response
      expect(WorkspaceChats.new).toHaveBeenCalledWith(
        expect.objectContaining({
          workspaceId: mockWorkspace.id,
          prompt: 'What is in this image?',
          response: expect.objectContaining({
            text: 'Mock streamed response',
          }),
        })
      );
    });
  });
});