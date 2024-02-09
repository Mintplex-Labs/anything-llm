const { v4: uuidv4 } = require("uuid");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { resetMemory } = require("./commands/reset");
const moment = require("moment");
const { getVectorDbClass, getLLMProvider } = require("../helpers");

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

  const LLMConnector = getLLMProvider(workspace?.chatModel);
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
    if (chatMode === "query") {
      return {
        id: uuid,
        type: "textResponse",
        sources: [],
        close: true,
        error: null,
        textResponse:
          "There is no relevant information in this workspace to answer your query.",
      };
    }

    // If there are no embeddings - chat like a normal LLM chat interface.
    return await emptyEmbeddingChat({
      uuid,
      user,
      message,
      workspace,
      messageLimit,
      LLMConnector,
    });
  }

  const { rawHistory, chatHistory } = await recentChatHistory(
    user,
    workspace,
    messageLimit,
    chatMode
  );
  const {
    contextTexts = [],
    sources = [],
    message: error,
  } = await VectorDb.performSimilaritySearch({
    namespace: workspace.slug,
    input: message,
    LLMConnector,
    similarityThreshold: workspace?.similarityThreshold,
    topN: workspace?.topN,
  });

  // Failed similarity search.
  if (!!error) {
    return {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error,
    };
  }

  // If in query mode and no sources are found, do not
  // let the LLM try to hallucinate a response or use general knowledge
  if (chatMode === "query" && sources.length === 0) {
    return {
      id: uuid,
      type: "textResponse",
      sources: [],
      close: true,
      error: null,
      textResponse:
        "There is no relevant information in this workspace to answer your query.",
    };
  }

  // Compress message to ensure prompt passes token limit with room for response
  // and build system messages based on inputs and history.
  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: chatPrompt(workspace),
      userPrompt: message,
      contextTexts,
      chatHistory,
    },
    rawHistory
  );

  // Send the text completion.
  const textResponse = await LLMConnector.getChatCompletion(messages, {
    temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
  });

  if (!textResponse) {
    return {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error: "No text completion could be completed with this input.",
    };
  }

  await WorkspaceChats.new({
    workspaceId: workspace.id,
    prompt: message,
    response: { text: textResponse, sources, type: chatMode },
    user,
  });
  return {
    id: uuid,
    type: "textResponse",
    close: true,
    textResponse,
    sources,
    error,
  };
}

// On query we dont return message history. All other chat modes and when chatting
// with no embeddings we return history.
// TODO: Refactor to just run a .where on WorkspaceChat to simplify what is going on here.
// see recentThreadChatHistory
async function recentChatHistory(
  user = null,
  workspace,
  messageLimit = 20,
  chatMode = null
) {
  if (chatMode === "query") return [];
  const rawHistory = (
    user
      ? await WorkspaceChats.forWorkspaceByUser(
          workspace.id,
          user.id,
          messageLimit,
          { id: "desc" }
        )
      : await WorkspaceChats.forWorkspace(workspace.id, messageLimit, {
          id: "desc",
        })
  ).reverse();
  return { rawHistory, chatHistory: convertToPromptHistory(rawHistory) };
}

// Extension of recentChatHistory that supports threads
async function recentThreadChatHistory(
  user = null,
  workspace,
  thread,
  messageLimit = 20,
  chatMode = null
) {
  if (chatMode === "query") return [];
  const rawHistory = (
    await WorkspaceChats.where(
      {
        workspaceId: workspace.id,
        user_id: user?.id || null,
        thread_id: thread?.id || null,
        include: true,
      },
      messageLimit,
      { id: "desc" }
    )
  ).reverse();
  return { rawHistory, chatHistory: convertToPromptHistory(rawHistory) };
}

async function emptyEmbeddingChat({
  uuid,
  user,
  message,
  workspace,
  messageLimit,
  LLMConnector,
}) {
  const { rawHistory, chatHistory } = await recentChatHistory(
    user,
    workspace,
    messageLimit
  );
  const textResponse = await LLMConnector.sendChat(
    chatHistory,
    message,
    workspace,
    rawHistory
  );
  await WorkspaceChats.new({
    workspaceId: workspace.id,
    prompt: message,
    response: { text: textResponse, sources: [], type: "chat" },
    user,
  });
  return {
    id: uuid,
    type: "textResponse",
    sources: [],
    close: true,
    error: null,
    textResponse,
  };
}

function chatPrompt(workspace) {
  return (
    workspace?.openAiPrompt ??
    "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
  );
}

module.exports = {
  recentChatHistory,
  recentThreadChatHistory,
  convertToPromptHistory,
  convertToChatHistory,
  chatWithWorkspace,
  chatPrompt,
  grepCommand,
  VALID_COMMANDS,
};
