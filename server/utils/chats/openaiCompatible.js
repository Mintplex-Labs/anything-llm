const { v4: uuidv4 } = require("uuid");
const { DocumentManager } = require("../DocumentManager");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { writeResponseChunk } = require("../helpers/chat/responses");
const { chatPrompt, sourceIdentifier } = require("./index");
const { rewriteQueryForSearch } = require("../helpers/chat/queryRewriter");

const { PassThrough } = require("stream");

async function chatSync({
  workspace,
  systemPrompt = null,
  history = [],
  prompt = null,
  attachments = [],
  temperature = null,
  messagesLimit, // Added: workspace messages limit (can be null)
  messageCount, // Added: Needed for contingent
}) {
  const uuid = uuidv4();
  const chatMode = workspace?.chatMode ?? "chat";
  
  // Since messageCount and messagesLimit are passed as parameters,
  // we're just checking if we're already at the limit
  if (messagesLimit !== null && messageCount >= messagesLimit) {
    // Get more detailed error message with reset date from helpers
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysRemaining = lastDayOfMonth.getDate() - now.getDate();
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    // Format the reset date in the same way as in checkWorkspaceMessagesLimit
    const formattedResetDate = new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(resetDate);
    
    const { getMessageLimitErrorText } = require("../helpers");
    const errorMessage = getMessageLimitErrorText(
      messagesLimit, 
      monthName, 
      daysRemaining, 
      formattedResetDate
    );
    
    return formatJSON(
      {
        id: uuid,
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: errorMessage,
        messages_limit: messagesLimit,
        contingent: `${messageCount}/${messagesLimit}`,
        httpStatusCode: 429 // Add this special flag for the handler to identify status code
      },
      { model: workspace.slug, finish_reason: "abort", messageCount, messagesLimit }
    );
  }
  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    model: workspace?.chatModel,
  });
  const VectorDb = getVectorDbClass();
  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);

  // User is trying to query-mode chat a workspace that has no data in it - so
  // we should exit early as no information can be found under these conditions.
  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
    const textResponse =
      workspace?.queryRefusalResponse ??
      "There is no relevant information in this workspace to answer your query.";

    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: String(prompt),
      response: {
        text: textResponse,
        sources: [],
        type: chatMode,
        attachments,
      },
      include: false,
    });

    return formatJSON(
      {
        id: uuid,
        type: "textResponse",
        sources: [],
        close: true,
        error: null,
        textResponse,
      },
      { model: workspace.slug, finish_reason: "abort", messageCount, messagesLimit }
    );
  }

  // If we are here we know that we are in a workspace that is:
  // 1. Chatting in "chat" mode and may or may _not_ have embeddings
  // 2. Chatting in "query" mode and has at least 1 embedding
  let contextTexts = [];
  let sources = [];
  let pinnedDocIdentifiers = [];
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

  const searchQuery = await rewriteQueryForSearch({
    userQuery: String(prompt),
    chatHistory: history,
    LLMConnector,
    workspace,
  });

  const vectorSearchResults =
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearch({
          namespace: workspace.slug,
          input: searchQuery,
          LLMConnector,
          similarityThreshold: workspace?.similarityThreshold,
          topN: workspace?.topN,
          filterIdentifiers: pinnedDocIdentifiers,
          rerank: workspace?.vectorSearchMode === "rerank",
        })
      : {
          contextTexts: [],
          sources: [],
          message: null,
        };

  // Failed similarity search if it was run at all and failed.
  if (!!vectorSearchResults.message) {
    // Get updated message limit info for consistency
    const { getMessageLimitInfo } = require("../helpers");
    const { messageCount: updatedCount, messagesLimit: updatedLimit } = await getMessageLimitInfo(workspace);
    
    return formatJSON(
      {
        id: uuid,
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: vectorSearchResults.message,
      },
      { model: workspace.slug, finish_reason: "abort", messageCount: updatedCount, messagesLimit: updatedLimit }
    );
  }

  // For OpenAI Compatible chats, we cannot do backfilling so we simply aggregate results here.
  contextTexts = [...contextTexts, ...vectorSearchResults.contextTexts];
  sources = [...sources, ...vectorSearchResults.sources];

  // If in query mode and no context chunks are found from search, backfill, or pins -  do not
  // let the LLM try to hallucinate a response or use general knowledge and exit early
  if (chatMode === "query" && contextTexts.length === 0) {
    const textResponse =
      workspace?.queryRefusalResponse ??
      "There is no relevant information in this workspace to answer your query.";

    const { chat } = await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: String(prompt),
      response: {
        text: textResponse,
        sources: [],
        type: chatMode,
        attachments,
      },
      include: false,
    });

    // Get updated message limit info after saving the message
    const { getMessageLimitInfo } = require("../helpers");
    const { messageCount: updatedCount, messagesLimit: updatedLimit } = await getMessageLimitInfo(workspace);

    return formatJSON(
      {
        id: uuid,
        type: "textResponse",
        sources: [],
        close: true,
        error: null,
        textResponse,
        chatId: chat.id,
      },
      { model: workspace.slug, finish_reason: "no_content", messageCount: updatedCount, messagesLimit: updatedLimit }
    );
  }

  // Compress & Assemble message to ensure prompt passes token limit with room for response
  // and build system messages based on inputs and history.
  const messages = await LLMConnector.compressMessages({
    systemPrompt: systemPrompt ?? (await chatPrompt(workspace)),
    userPrompt: String(prompt),
    contextTexts,
    chatHistory: history,
    attachments,
  });

  // Send the text completion.
  const { textResponse, metrics } = await LLMConnector.getChatCompletion(
    messages,
    {
      temperature:
        temperature ?? workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    }
  );

  if (!textResponse) {
    // Get updated message limit info for consistency
    const { getMessageLimitInfo } = require("../helpers");
    const { messageCount: updatedCount, messagesLimit: updatedLimit } = await getMessageLimitInfo(workspace);
    
    return formatJSON(
      {
        id: uuid,
        type: "textResponse",
        sources: [],
        close: true,
        error: "No text completion could be completed with this input.",
        textResponse: null,
      },
      { model: workspace.slug, finish_reason: "no_content", usage: metrics, messageCount: updatedCount, messagesLimit: updatedLimit }
    );
  }

  const { chat } = await WorkspaceChats.new({
    workspaceId: workspace.id,
    prompt: String(prompt),
    response: {
      text: textResponse,
      sources,
      type: chatMode,
      metrics,
      attachments,
    },
  });

  // Get updated message limit info after saving the message
  const { getMessageLimitInfo } = require("../helpers");
  const { messageCount: updatedCount, messagesLimit: updatedLimit } = await getMessageLimitInfo(workspace);

  return formatJSON(
    {
      id: uuid,
      type: "textResponse",
      close: true,
      error: null,
      chatId: chat.id,
      textResponse,
      sources,
    },
    { model: workspace.slug, finish_reason: "stop", usage: metrics, messageCount: updatedCount, messagesLimit: updatedLimit }
  );
}

async function streamChat({
  workspace,
  response,
  messageCount,
  messagesLimit, // Changed from limit for consistency
  systemPrompt = null,
  history = [],
  prompt = null,
  attachments = [],
  temperature = null,
  finalTemperature = null,
}) {
  const uuid = uuidv4();
  const chatMode = workspace?.chatMode ?? "chat";
  
  // Since messageCount and messagesLimit are passed as parameters,
  // we check if we're already at the limit
  if (messagesLimit !== null && messageCount >= messagesLimit) {
    // Get more detailed error message with reset date from helpers
    const now = new Date();
    const monthName = now.toLocaleString('default', { month: 'long' });
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const daysRemaining = lastDayOfMonth.getDate() - now.getDate();
    const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    // Format the reset date in the same way as in checkWorkspaceMessagesLimit
    const formattedResetDate = new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(resetDate);
    
    const { getMessageLimitErrorText } = require("../helpers");
    const errorMessage = getMessageLimitErrorText(
      messagesLimit, 
      monthName, 
      daysRemaining, 
      formattedResetDate
    );
    
    const errorData = formatJSON(
      {
        id: uuid,
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: errorMessage,
        messages_limit: messagesLimit,
        contingent: `${messageCount}/${messagesLimit}`,
        httpStatusCode: 429 // Add this special flag for the handler to identify status code
      },
      { model: workspace.slug, finish_reason: "abort", messageCount, messagesLimit }
    );
    
    // Set HTTP status code to 429 before writing the response
    response.status(429);
    response.write(`data: ${JSON.stringify(errorData)}\n\n`);
    response.write("data: [DONE]\n\n");
    return;
  }
  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    model: workspace?.chatModel,
  });
  const VectorDb = getVectorDbClass();
  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);

  // We don't want to write a new method for every LLM to support openAI calls
  // via the `handleStreamResponseV2` method handler. So here we create a passthrough
  // that on writes to the main response, transforms the chunk to OpenAI format.
  // The chunk is coming in the format from `writeResponseChunk` but in the AnythingLLM
  // response chunk schema, so we here we mutate each chunk.
  const responseInterceptor = new PassThrough({});
  responseInterceptor.on("data", (chunk) => {
    try {
      const originalData = JSON.parse(chunk.toString().split("data: ")[1]);
      const modified = formatJSON(originalData, {
        chunked: true,
        model: workspace.slug,
        messageCount, // Pass down for contingent
        messagesLimit, // Pass down for contingent
        finalTemperature, // Pass finalTemperature to the formatter
      }); // rewrite to OpenAI format
      response.write(`data: ${JSON.stringify(modified)}\n\n`);
    } catch (e) {
      console.error(e);
    }
  });

  // User is trying to query-mode chat a workspace that has no data in it - so
  // we should exit early as no information can be found under these conditions.
  if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
    const textResponse =
      workspace?.queryRefusalResponse ??
      "There is no relevant information in this workspace to answer your query.";

    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: String(prompt),
      response: {
        text: textResponse,
        sources: [],
        type: chatMode,
        attachments,
      },
      include: false,
    });

    writeResponseChunk(
      response,
      formatJSON(
        {
          id: uuid,
          type: "textResponse",
          sources: [],
          close: true,
          error: null,
          textResponse,
        },
        { chunked: true, model: workspace.slug, finish_reason: "abort" }
      )
    );
    return;
  }

  // If we are here we know that we are in a workspace that is:
  // 1. Chatting in "chat" mode and may or may _not_ have embeddings
  // 2. Chatting in "query" mode and has at least 1 embedding
  let contextTexts = [];
  let sources = [];
  let pinnedDocIdentifiers = [];
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

  const searchQuery = await rewriteQueryForSearch({
    userQuery: String(prompt),
    chatHistory: history,
    LLMConnector,
    workspace,
  });

  const vectorSearchResults =
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearch({
          namespace: workspace.slug,
          input: searchQuery,
          LLMConnector,
          similarityThreshold: workspace?.similarityThreshold,
          topN: workspace?.topN,
          filterIdentifiers: pinnedDocIdentifiers,
          rerank: workspace?.vectorSearchMode === "rerank",
        })
      : {
          contextTexts: [],
          sources: [],
          message: null,
        };

  // Failed similarity search if it was run at all and failed.
  if (!!vectorSearchResults.message) {
    writeResponseChunk(
      response,
      formatJSON(
        {
          id: uuid,
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: vectorSearchResults.message,
        },
        { chunked: true, model: workspace.slug, finish_reason: "abort" }
      )
    );
    return;
  }

  // For OpenAI Compatible chats, we cannot do backfilling so we simply aggregate results here.
  contextTexts = [...contextTexts, ...vectorSearchResults.contextTexts];
  sources = [...sources, ...vectorSearchResults.sources];

  // If in query mode and no context chunks are found from search, backfill, or pins -  do not
  // let the LLM try to hallucinate a response or use general knowledge and exit early
  if (chatMode === "query" && contextTexts.length === 0) {
    const textResponse =
      workspace?.queryRefusalResponse ??
      "There is no relevant information in this workspace to answer your query.";

    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: String(prompt),
      response: {
        text: textResponse,
        sources: [],
        type: chatMode,
        attachments,
      },
      include: false,
    });

    writeResponseChunk(
      response,
      formatJSON(
        {
          id: uuid,
          type: "textResponse",
          sources: [],
          close: true,
          error: null,
          textResponse,
        },
        { chunked: true, model: workspace.slug, finish_reason: "no_content" }
      )
    );
    return;
  }

  // Compress & Assemble message to ensure prompt passes token limit with room for response
  // and build system messages based on inputs and history.
  const messages = await LLMConnector.compressMessages({
    systemPrompt: systemPrompt ?? (await chatPrompt(workspace)),
    userPrompt: String(prompt),
    contextTexts,
    chatHistory: history,
    attachments,
  });

  if (!LLMConnector.streamingEnabled()) {
    writeResponseChunk(
      response,
      formatJSON(
        {
          id: uuid,
          type: "textResponse",
          sources: [],
          close: true,
          error: "Streaming is not available for the connected LLM Provider",
          textResponse: null,
        },
        {
          chunked: true,
          model: workspace.slug,
          finish_reason: "streaming_disabled",
        }
      )
    );
    return;
  }

  const stream = await LLMConnector.streamGetChatCompletion(messages, {
    temperature:
      temperature ?? workspace?.openAiTemp ?? LLMConnector.defaultTemp,
  });
  const completeText = await LLMConnector.handleStream(
    responseInterceptor,
    stream,
    {
      uuid,
      sources,
    }
  );

  if (completeText?.length > 0) {
    const { chat } = await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: String(prompt),
      response: {
        text: completeText,
        sources,
        type: chatMode,
        metrics: stream.metrics,
        attachments,
      },
    });

    // Get updated message limit info after saving the message
    const { getMessageLimitInfo } = require("../helpers");
    const { messageCount: updatedCount, messagesLimit: updatedLimit } = await getMessageLimitInfo(workspace);

    writeResponseChunk(
      response,
      formatJSON(
        {
          uuid,
          type: "finalizeResponseStream",
          close: true,
          error: false,
          chatId: chat.id,
          textResponse: "",
        },
        {
          chunked: true,
          model: workspace.slug,
          finish_reason: "stop",
          usage: stream.metrics,
          messageCount: updatedCount, // Pass updated message count
          messagesLimit: updatedLimit // Pass message limit
        }
      )
    );
    return;
  }

  // Get updated message limit info
  const { getMessageLimitInfo } = require("../helpers");
  const { messageCount: updatedCount, messagesLimit: updatedLimit } = await getMessageLimitInfo(workspace);

  writeResponseChunk(
    response,
    formatJSON(
      {
        uuid,
        type: "finalizeResponseStream",
        close: true,
        error: false,
        textResponse: "",
      },
      {
        chunked: true,
        model: workspace.slug,
        finish_reason: "stop",
        usage: stream.metrics,
        messageCount: updatedCount, // Pass updated message count
        messagesLimit: updatedLimit // Pass updated message limit
      }
    )
  );
  return;
}

function formatJSON(
  chat,
  {
    chunked = false,
    model,
    finish_reason = null,
    usage = {},
    messageCount,
    messagesLimit, // Changed from limit to match parameter naming in other functions
    finalTemperature, // Add finalTemperature parameter
  }
) {
  const data = {
    id: chat.uuid ?? chat.id,
    object: "chat.completion",
    created: Math.floor(Number(new Date()) / 1000),
    model: model,
    choices: [
      {
        index: 0,
        [chunked ? "delta" : "message"]: {
          role: "assistant",
          content: chat.textResponse,
        },
        logprobs: null,
        finish_reason: finish_reason,
      },
    ],
    usage,
  };

  // Always include contingent and messages_limit regardless of finish_reason
  if (messageCount !== undefined) { // messagesLimit can be null
    data.contingent = `${messageCount}/${messagesLimit ?? 'Unlimited'}`;
    data.messages_limit = messagesLimit; // Add raw messages limit value
  }
  
  // Include finalTemperature in the response if provided
  if (finalTemperature !== undefined && finalTemperature !== null) {
    data.finalTemperature = finalTemperature;
  }
  
  // Include finalTemperature from chat object if it exists there (for non-streaming responses)
  if (chat.finalTemperature !== undefined && chat.finalTemperature !== null) {
    data.finalTemperature = chat.finalTemperature;
  }
  
  // Preserve the httpStatusCode if it exists in the original chat response
  // This is critical for the endpoint to know when to return a 429 status
  if (chat.httpStatusCode) {
    data.httpStatusCode = chat.httpStatusCode;
  }

  return data;
}

module.exports.OpenAICompatibleChat = {
  chatSync,
  streamChat,
};
