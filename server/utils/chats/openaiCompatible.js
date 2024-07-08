const { v4: uuidv4 } = require("uuid");
const { DocumentManager } = require("../DocumentManager");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { writeResponseChunk } = require("../helpers/chat/responses");
const { chatPrompt, sourceIdentifier } = require("./index");

const { PassThrough } = require("stream");

async function chatSync({
  workspace,
  systemPrompt = null,
  history = [],
  prompt = null,
  temperature = null,
}) {
  const uuid = uuidv4();
  const chatMode = workspace?.chatMode ?? "chat";
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
      { model: workspace.slug, finish_reason: "abort" }
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

  const vectorSearchResults =
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearch({
          namespace: workspace.slug,
          input: prompt,
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
    return formatJSON(
      {
        id: uuid,
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: vectorSearchResults.message,
      },
      { model: workspace.slug, finish_reason: "abort" }
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

    await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: prompt,
      response: {
        text: textResponse,
        sources: [],
        type: chatMode,
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
      { model: workspace.slug, finish_reason: "no_content" }
    );
  }

  // Compress & Assemble message to ensure prompt passes token limit with room for response
  // and build system messages based on inputs and history.
  const messages = await LLMConnector.compressMessages({
    systemPrompt: systemPrompt ?? chatPrompt(workspace),
    userPrompt: prompt,
    contextTexts,
    chatHistory: history,
  });

  // Send the text completion.
  const textResponse = await LLMConnector.getChatCompletion(messages, {
    temperature:
      temperature ?? workspace?.openAiTemp ?? LLMConnector.defaultTemp,
  });

  if (!textResponse) {
    return formatJSON(
      {
        id: uuid,
        type: "textResponse",
        sources: [],
        close: true,
        error: "No text completion could be completed with this input.",
        textResponse: null,
      },
      { model: workspace.slug, finish_reason: "no_content" }
    );
  }

  const { chat } = await WorkspaceChats.new({
    workspaceId: workspace.id,
    prompt: prompt,
    response: { text: textResponse, sources, type: chatMode },
  });

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
    { model: workspace.slug, finish_reason: "stop" }
  );
}

async function streamChat({
  workspace,
  response,
  systemPrompt = null,
  history = [],
  prompt = null,
  temperature = null,
}) {
  const uuid = uuidv4();
  const chatMode = workspace?.chatMode ?? "chat";
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

  const vectorSearchResults =
    embeddingsCount !== 0
      ? await VectorDb.performSimilaritySearch({
          namespace: workspace.slug,
          input: prompt,
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
      prompt: prompt,
      response: {
        text: textResponse,
        sources: [],
        type: chatMode,
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
    systemPrompt: systemPrompt ?? chatPrompt(workspace),
    userPrompt: prompt,
    contextTexts,
    chatHistory: history,
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
      prompt: prompt,
      response: { text: completeText, sources, type: chatMode },
    });

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
        { chunked: true, model: workspace.slug, finish_reason: "stop" }
      )
    );
    return;
  }

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
      { chunked: true, model: workspace.slug, finish_reason: "stop" }
    )
  );
  return;
}

function formatJSON(chat, { chunked = false, model, finish_reason = null }) {
  const data = {
    id: chat.uuid ?? chat.id,
    object: "chat.completion",
    created: Number(new Date()),
    model: model,
    choices: [
      {
        [chunked ? "delta" : "message"]: {
          role: "assistant",
          content: chat.textResponse,
        },
        logprobs: null,
        finish_reason: finish_reason,
      },
    ],
  };

  return data;
}

module.exports.OpenAICompatibleChat = {
  chatSync,
  streamChat,
};
