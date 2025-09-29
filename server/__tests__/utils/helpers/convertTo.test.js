/* eslint-env jest */
const { prepareChatsForExport } = require("../../../utils/helpers/chat/convertTo");

// Mock the database models
jest.mock("../../../models/workspaceChats");
jest.mock("../../../models/embedChats");

const { WorkspaceChats } = require("../../../models/workspaceChats");
const { EmbedChats } = require("../../../models/embedChats");

const mockChat = (withImages = false) => {
  return {
    id: 1,
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
    workspace: { name: "Test Workspace", openAiPrompt: "Test OpenAI Prompt" },
    user: { username: "testuser" },
    feedbackScore: 1,
  }
};

describe("prepareChatsForExport", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    WorkspaceChats.whereWithData = jest.fn().mockResolvedValue([]);
    EmbedChats.whereWithEmbedAndWorkspace = jest.fn().mockResolvedValue([]);
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
      instruction: chatExample.workspace.openAiPrompt,
      input: chatExample.prompt,
      output: responseJson1.text,
    },
    {
      instruction: chatExample.workspace.openAiPrompt,
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
        [chatExample.workspace.id]: {
          messages: [
            {
              role: "system",
              content: [{
                type: "text",
                text: chatExample.workspace.openAiPrompt,
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
        [chatExample.workspace.id]: {
          messages: [
            {
              role: "system",
              content: [{
                type: "text",
                text: chatExample.workspace.openAiPrompt,
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
});