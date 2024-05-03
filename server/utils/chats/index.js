const { v4: uuidv4 } = require("uuid");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { resetMemory } = require("./commands/reset");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { convertToPromptHistory } = require("../helpers/chat/responses");
const { DocumentManager } = require("../DocumentManager");

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
  user = null,
  thread = null
) {
  const uuid = uuidv4();
  const command = grepCommand(message);

  if (!!command && Object.keys(VALID_COMMANDS).includes(command)) {
    return await VALID_COMMANDS[command](workspace, message, uuid, user);
  }

  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    model: workspace?.chatModel,
  });
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

  // User is trying to query-mode chat a workspace that has no data in it - so
  // we should exit early as no information can be found under these conditions.
  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
    return {
      id: uuid,
      type: "textResponse",
      sources: [],
      close: true,
      error: null,
      textResponse:
        workspace?.queryRefusalResponse ??
        "There is no relevant information in this workspace to answer your query.",
    };
  }

  // If we are here we know that we are in a workspace that is:
  // 1. Chatting in "chat" mode and may or may _not_ have embeddings
  // 2. Chatting in "query" mode and has at least 1 embedding
  let contextTexts = [];
  let sources = [];
  let pinnedDocIdentifiers = [];
  const { rawHistory, chatHistory } = await recentChatHistory({
    user,
    workspace,
    thread,
    messageLimit,
    chatMode,
  });

  // See stream.js comment for more information on this implementation.
  await new DocumentManager({
    workspace,
    maxTokens: LLMConnector.promptWindowLimit(),
  })
    .pinnedDocs()
    .then((pinnedDocs) => {
      pinnedDocs.forEach((doc) => {
        const { pageContent, ...metadata } = doc;
        pinnedDocIdentifiers.push(sourceIdentifier(doc));
        contextTexts.push(doc.pageContent);
        sources.push({
          text:
            pageContent.slice(0, 1_000) +
            "...continued on in source document...",
          ...metadata,
        });
      });
    });

  const vectorSearchResults =
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearch({
          namespace: workspace.slug,
          input: message,
          LLMConnector,
          similarityThreshold: workspace?.similarityThreshold,
          topN: workspace?.topN,
          filterIdentifiers: pinnedDocIdentifiers,
        })
      : {
          contextTexts: [],
          sources: [],
          message: null,
        };

  // Failed similarity search if it was run at all and failed.
  if (!!vectorSearchResults.message) {
    return {
      id: uuid,
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error: vectorSearchResults.message,
    };
  }

  contextTexts = [...contextTexts, ...vectorSearchResults.contextTexts];
  sources = [...sources, ...vectorSearchResults.sources];

  // If in query mode and no sources are found from the vector search and no pinned documents, do not
  // let the LLM try to hallucinate a response or use general knowledge and exit early
  if (
    chatMode === "query" &&
    vectorSearchResults.sources.length === 0 &&
    pinnedDocIdentifiers.length === 0
  ) {
    return {
      id: uuid,
      type: "textResponse",
      sources: [],
      close: true,
      error: null,
      textResponse:
        workspace?.queryRefusalResponse ??
        "There is no relevant information in this workspace to answer your query.",
    };
  }

  // Compress & Assemble message to ensure prompt passes token limit with room for response
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

  const { chat } = await WorkspaceChats.new({
    workspaceId: workspace.id,
    prompt: message,
    response: { text: textResponse, sources, type: chatMode },
    threadId: thread?.id || null,
    user,
  });
  return {
    id: uuid,
    type: "textResponse",
    close: true,
    error: null,
    chatId: chat.id,
    textResponse,
    sources,
  };
}

async function recentChatHistory({
  user = null,
  workspace,
  thread = null,
  messageLimit = 20,
  chatMode = null,
}) {
  if (chatMode === "query") return { rawHistory: [], chatHistory: [] };
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

function chatPrompt(workspace) {
  return (
    workspace?.openAiPrompt ??
    "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed."
  );
}

// We use this util function to deduplicate sources from similarity searching
// if the document is already pinned.
// Eg: You pin a csv, if we RAG + full-text that you will get the same data
// points both in the full-text and possibly from RAG - result in bad results
// even if the LLM was not even going to hallucinate.
function sourceIdentifier(sourceDocument) {
  if (!sourceDocument?.title || !sourceDocument?.published) return uuidv4();
  return `title:${sourceDocument.title}-timestamp:${sourceDocument.published}`;
}

module.exports = {
  sourceIdentifier,
  recentChatHistory,
  chatWithWorkspace,
  chatPrompt,
  grepCommand,
  VALID_COMMANDS,
};
