/* eslint-env jest */
const { prepareChatsForExport } = require("../../../utils/helpers/chat/convertTo");

// Mock the database models
jest.mock("../../../models/workspaceChats");
jest.mock("../../../models/embedChats");
jest.mock("../../../models/workspace");
jest.mock("../../../models/embedConfig");

const { WorkspaceChats } = require("../../../models/workspaceChats");
const { EmbedChats } = require("../../../models/embedChats");
const { Workspace } = require("../../../models/workspace");
const { EmbedConfig } = require("../../../models/embedConfig");

const mockWorkspace = { id: 1, openAiPrompt: "Test OpenAI Prompt" };

const mockChat = (withImages = false) => {
  return {
    id: 1,
    workspaceId: 1,
    prompt: "Test prompt",
    response: JSON.stringify({
      text: "Test response",
      attachments: withImages ? [
        { mime: "image/png", name: "image.png", contentString: "data:image/png;base64,iVBORw0KGg....=" },
        { mime: "image/jpeg", name: "image2.jpeg", contentString: "data:image/jpeg;base64,iVBORw0KGg....=" }
      ] : [],
      sources: [],
      metrics: {},
    }),
    createdAt: new Date(),
    workspace: { name: "Test Workspace" },
    user: { username: "testuser" },
    feedbackScore: 1,
  }
};

describe("prepareChatsForExport", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    WorkspaceChats.whereWithData = jest.fn().mockResolvedValue([]);
    EmbedChats.whereWithEmbedAndWorkspace = jest.fn().mockResolvedValue([]);
    Workspace.get = jest.fn().mockResolvedValue(mockWorkspace);
    EmbedConfig.getWithWorkspace = jest.fn().mockResolvedValue(null);
  });

  test("should throw error for invalid chat type", async () => {
    await expect(prepareChatsForExport("json", "invalid"))
      .rejects
      .toThrow("Invalid chat type: invalid");
  });

  test("should throw error for invalid export type", async () => {
    await expect(prepareChatsForExport("invalid", "workspace"))
      .rejects
      .toThrow("Invalid export type: invalid");
  });

  // CSV and JSON are the same format, so we can test them together
  test("should return prepared data in csv and json format for workspace chat type", async () => {
    const chatExample = mockChat();
    WorkspaceChats.whereWithData.mockResolvedValue([chatExample]);
    const result = await prepareChatsForExport("json", "workspace");

    const responseJson = JSON.parse(chatExample.response);
    expect(result).toBeDefined();
    expect(result).toEqual([{
      id: chatExample.id,
      prompt: chatExample.prompt,
      response: responseJson.text,
      sent_at: chatExample.createdAt,
      rating: chatExample.feedbackScore ? "GOOD" : "BAD",
      username: chatExample.user.username,
      workspace: chatExample.workspace.name,
      attachments: [],
    }]);
  });

  test("Should handle attachments for workspace chat type when json format is selected", async () => {
    const chatExample = mockChat(true);
    WorkspaceChats.whereWithData.mockResolvedValue([chatExample]);
    const result = await prepareChatsForExport("json", "workspace");

    const responseJson = JSON.parse(chatExample.response);
    expect(result).toBeDefined();
    expect(result).toEqual([{
      id: chatExample.id,
      prompt: chatExample.prompt,
      response: responseJson.text,
      sent_at: chatExample.createdAt,
      rating: chatExample.feedbackScore ? "GOOD" : "BAD",
      username: chatExample.user.username,
      workspace: chatExample.workspace.name,
      attachments: [
        {
          type: "image",
          image: responseJson.attachments[0].contentString,
        },
        {
          type: "image",
          image: responseJson.attachments[1].contentString,
        },
      ]
    }]);
  });

  test("Should ignore attachments for workspace chat type when csv format is selected", async () => {
    const chatExample = mockChat(true);
    WorkspaceChats.whereWithData.mockResolvedValue([chatExample]);
    const result = await prepareChatsForExport("csv", "workspace");

    const responseJson = JSON.parse(chatExample.response);
    expect(result).toBeDefined();
    expect(result.attachments).not.toBeDefined();
    expect(result).toEqual([{
      id: chatExample.id,
      prompt: chatExample.prompt,
      response: responseJson.text,
      sent_at: chatExample.createdAt,
      rating: chatExample.feedbackScore ? "GOOD" : "BAD",
      username: chatExample.user.username,
      workspace: chatExample.workspace.name,
    }]);
  });

  test("should return prepared data in jsonAlpaca format for workspace chat type", async () => {
    const chatExample = mockChat();
    const imageChatExample = mockChat(true);
    WorkspaceChats.whereWithData.mockResolvedValue([chatExample, imageChatExample]);
    const result = await prepareChatsForExport("jsonAlpaca", "workspace");

    const responseJson1 = JSON.parse(chatExample.response);
    const responseJson2 = JSON.parse(imageChatExample.response);
    expect(result).toBeDefined();

    // Alpaca format does not support attachments - so they are not included
    expect(result[0].attachments).not.toBeDefined();
    expect(result[1].attachments).not.toBeDefined();
    expect(result).toEqual([{
      instruction: mockWorkspace.openAiPrompt,
      input: chatExample.prompt,
      output: responseJson1.text,
    },
    {
      instruction: mockWorkspace.openAiPrompt,
      input: imageChatExample.prompt,
      output: responseJson2.text,
    }]);
  });

  test("should return prepared data in jsonl format for workspace chat type", async () => {
    const chatExample = mockChat();
    const responseJson = JSON.parse(chatExample.response);
    WorkspaceChats.whereWithData.mockResolvedValue([chatExample]);
    const result = await prepareChatsForExport("jsonl", "workspace");
    expect(result).toBeDefined();
    expect(result).toEqual(
      {
        [chatExample.workspaceId]: {
          messages: [
            {
              role: "system",
              content: [{
                type: "text",
                text: mockWorkspace.openAiPrompt,
              }],
            },
            {
              role: "user",
              content: [{
                type: "text",
                text: chatExample.prompt,
              }],
            },
            {
              role: "assistant",
              content: [{
                type: "text",
                text: responseJson.text,
              }],
            },
          ],
        },
      },
    );
  });

  test("should return prepared data in jsonl format for workspace chat type with attachments", async () => {
    const chatExample = mockChat();
    const imageChatExample = mockChat(true);
    const responseJson = JSON.parse(chatExample.response);
    const imageResponseJson = JSON.parse(imageChatExample.response);

    WorkspaceChats.whereWithData.mockResolvedValue([chatExample, imageChatExample]);
    const result = await prepareChatsForExport("jsonl", "workspace");
    expect(result).toBeDefined();
    expect(result).toEqual(
      {
        [chatExample.workspaceId]: {
          messages: [
            {
              role: "system",
              content: [{
                type: "text",
                text: mockWorkspace.openAiPrompt,
              }],
            },
            {
              role: "user",
              content: [{
                type: "text",
                text: chatExample.prompt,
              }],
            },
            {
              role: "assistant",
              content: [{
                type: "text",
                text: responseJson.text,
              }],
            },
            {
              role: "user",
              content: [{
                type: "text",
                text: imageChatExample.prompt,
              }, {
                type: "image",
                image: imageResponseJson.attachments[0].contentString,
              }, {
                type: "image",
                image: imageResponseJson.attachments[1].contentString,
              }],
            },
            {
              role: "assistant",
              content: [{
                type: "text",
                text: imageResponseJson.text,
              }],
            },
          ],
        },
      },
    );
  });

  test("should keep embed chats from different workspaces apart in jsonl format", async () => {
    const workspaces = {
      10: { id: 1, openAiPrompt: "Prompt A" },
      20: { id: 2, openAiPrompt: "Prompt B" },
    };
    EmbedConfig.getWithWorkspace.mockImplementation(async ({ id }) => ({
      id,
      workspace: workspaces[id],
    }));
    const embedChat = (id, embed_id) => ({
      id,
      embed_id,
      prompt: "Test prompt",
      response: JSON.stringify({ text: "Test response", sources: [] }),
      createdAt: new Date(),
      embed_config: { workspace: { name: "Test Workspace" } },
    });
    EmbedChats.whereWithEmbedAndWorkspace.mockResolvedValue([
      embedChat(1, 10),
      embedChat(2, 20),
    ]);
    const result = await prepareChatsForExport("jsonl", "embed");
    expect(Object.keys(result)).toEqual(["1", "2"]);
    expect(result[1].messages[0].content[0].text).toBe("Prompt A");
    expect(result[2].messages[0].content[0].text).toBe("Prompt B");
  });
});