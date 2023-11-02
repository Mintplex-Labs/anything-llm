const { v4: uuidv4 } = require("uuid");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { resetMemory } = require("./commands/reset");
const moment = require("moment");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { CacheData } = require("../../models/cacheData");

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

async function chatWithWorkspace(
  workspace,
  message,
  chatMode = "chat",
  user = null
) {
  const uuid = uuidv4();
  const command = grepCommand(message);

  if (!!command && Object.keys(VALID_COMMANDS).includes(command)) {
    return await VALID_COMMANDS[command](workspace, message, uuid, user);
  }

  const LLMConnector = getLLMProvider();
  const VectorDb = getVectorDbClass();
  const { safe, reasons = [] } = await LLMConnector.isSafe(message);
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

  const messageLimit = workspace?.openAiHistory || 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);
  if (!hasVectorizedSpace || embeddingsCount === 0) {
    const _rawRecentHistory = (
      await WorkspaceChats.forWorkspace(workspace.id, messageLimit, {
        id: "desc",
      })
    ).reverse();
    const recentChats = await compressRawHistory(_rawRecentHistory);
    const chatHistory = convertToPromptHistory(recentChats);
    const response = await LLMConnector.sendChat(
      chatHistory,
      message,
      workspace,
      recentChats
    );
    const data = { text: response, sources: [], type: "chat" };

    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: data,
      user,
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
    const rawHistory = await WorkspaceChats.forWorkspace(
      workspace.id,
      messageLimit
    );
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
      user,
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

async function compressRawHistory(rawHistory = []) {
  if (rawHistory.length === 0) return rawHistory;

  const caches = await CacheData.where({
    belongsTo: "workspace_chats",
    byId: { in: rawHistory.map((h) => h.id) },
  });
  if (caches.length === 0) return rawHistory;

  const mostRecentSummary = caches.slice(-1)[0];
  const idxOfSummary = rawHistory.findIndex(
    (history) => history.id === mostRecentSummary.byId
  );
  const { response, ...chatLog } = rawHistory[idxOfSummary];
  const resData = JSON.parse(response);
  return [
    {
      ...chatLog,
      prompt: "What is the summary of our conversation so far?",
      response: JSON.stringify({ ...resData, text: mostRecentSummary.data }),
      isSummary: true,
    },
    ...rawHistory.slice(idxOfSummary + 1),
  ];
}

function chatPrompt(workspace) {
  return (
    workspace?.openAiPrompt ??
    "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
  );
}

module.exports = {
  convertToChatHistory,
  chatWithWorkspace,
  chatPrompt,
};
