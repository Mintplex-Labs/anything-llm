const { v4: uuidv4 } = require("uuid");
const { OpenAi } = require("../openAi");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { resetMemory } = require("./commands/reset");
const moment = require("moment");
const { getVectorDbClass } = require("../helpers");

function convertToChatHistory(history = []) {
  const formattedHistory = [];
  history.forEach((history) => {
    const { prompt, response, createdAt } = history;
    const data = JSON.parse(response);
    formattedHistory.push([
      {
        role: "user",
        content: prompt,
        sentAt: moment(createdAt).unix(),
      },
      {
        role: "assistant",
        content: data.text,
        sources: data.sources || [],
        sentAt: moment(createdAt).unix(),
      },
    ]);
  });

  return formattedHistory.flat();
}

function convertToPromptHistory(history = []) {
  const formattedHistory = [];
  history.forEach((history) => {
    const { prompt, response } = history;
    const data = JSON.parse(response);
    formattedHistory.push([
      { role: "user", content: prompt },
      { role: "assistant", content: data.text },
    ]);
  });
  return formattedHistory.flat();
}

const VALID_COMMANDS = {
  "/reset": resetMemory,
};

function grepCommand(message) {
  const availableCommands = Object.keys(VALID_COMMANDS);

  for (let i = 0; i < availableCommands.length; i++) {
    const cmd = availableCommands[i];
    const re = new RegExp(`^(${cmd})`, "i");
    if (re.test(message)) {
      return cmd;
    }
  }

  return null;
}

async function chatWithWorkspace(workspace, message, chatMode = "chat") {
  const uuid = uuidv4();
  const openai = new OpenAi();
  const VectorDb = getVectorDbClass();
  const command = grepCommand(message);

  if (!!command && Object.keys(VALID_COMMANDS).includes(command)) {
    return await VALID_COMMANDS[command](workspace, message, uuid);
  }

  // AC: this is written so that the existing code base can stay in place, and the bypass still
  // has to be explicitly stated as true. If it's not set at all in the ENV it should still function.
  if (!(process.env.BYPASS_MODERATION == "true"))
  {
    const { safe, reasons = [] } = await openai.isSafe(message);
    if (!safe) {
      return {
        id: uuid,
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: `This message was moderated and will not be allowed. Violations for ${reasons.join(
          ", "
        )} found.`,
      };
    }
  }

  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
  if (!hasVectorizedSpace) {
    const rawHistory = await WorkspaceChats.forWorkspace(workspace.id);
    const chatHistory = convertToPromptHistory(rawHistory);
    const response = await openai.sendChat(chatHistory, message, workspace);
    const data = { text: response, sources: [], type: "chat" };

    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: data,
    });
    return {
      id: uuid,
      type: "textResponse",
      textResponse: response,
      sources: [],
      close: true,
      error: null,
    };
  } else {
    var chat_memory = workspace?.openAiHistory;
    console.debug(chat_memory);
    const rawHistory = await WorkspaceChats.forWorkspace(workspace.id, chat_memory);
    const chatHistory = convertToPromptHistory(rawHistory);
    const {
      response,
      sources,
      message: error,
    } = await VectorDb[chatMode]({
      namespace: workspace.slug,
      input: message,
      workspace,
      chatHistory,
    });
    if (!response) {
      return {
        id: uuid,
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error,
      };
    }

    const data = { text: response, sources, type: chatMode };
    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: data,
    });
    return {
      id: uuid,
      type: "textResponse",
      textResponse: response,
      sources,
      close: true,
      error,
    };
  }
}
module.exports = {
  convertToChatHistory,
  chatWithWorkspace,
};
