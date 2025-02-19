const { v4: uuidv4 } = require("uuid");
const { DocumentManager } = require("../DocumentManager");
const { WorkspaceChats } = require("../../models/workspaceChats");
const { getVectorDbClass, getLLMProvider } = require("../helpers");
const { writeResponseChunk } = require("../helpers/chat/responses");
const { chatPrompt, sourceIdentifier, recentChatHistory } = require("./index");
const {
  EphemeralAgentHandler,
  EphemeralEventListener,
} = require("../agents/ephemeral");
const { Telemetry } = require("../../models/telemetry");
const { EventLogs } = require("../../models/eventLogs");
const { Document } = require("../../models/documents");
const { DocumentVectors } = require("../../models/vectors");

// Initialize GoogleDocsLoader instance with better error handling
let googleDocsInstance = null;
try {
  // Check required environment variables before initialization
  const requiredVars = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn("GoogleDocsLoader initialization skipped - Missing environment variables:", missingVars.join(", "));
  } else {
    // Use the exported instance directly instead of trying to create a new one
    googleDocsInstance = require("../extensions/GoogleDocs");
    console.log("GoogleDocsLoader initialized successfully");
  }
} catch (error) {
  console.warn("Failed to initialize GoogleDocsLoader:", {
    error: error.message,
    stack: error.stack,
    cause: error.cause
  });
}

/**
 * @typedef ResponseObject
 * @property {string} id - uuid of response
 * @property {string} type - Type of response
 * @property {string|null} textResponse - full text response
 * @property {object[]} sources
 * @property {boolean} close
 * @property {string|null} error
 * @property {object} metrics
 */

/**
 * Handle synchronous chats with your workspace via the developer API endpoint
 * @param {{
 *  workspace: import("@prisma/client").workspaces,
 *  message:string,
 *  mode: "chat"|"query",
 *  user: import("@prisma/client").users|null,
 *  thread: import("@prisma/client").workspace_threads|null,
 *  sessionId: string|null,
 *  attachments: { name: string; mime: string; contentString: string }[],
 * }} parameters
 * @returns {Promise<ResponseObject>}
 */
async function chatSync({
  workspace,
  message = null,
  mode = "chat",
  user = null,
  thread = null,
  sessionId = null,
  attachments = [],
}) {
  try {
    // Check and update Google Docs before proceeding
    await checkAndUpdateGoogleDocs(workspace);

    const uuid = uuidv4();
    const chatMode = mode ?? "chat";

    if (EphemeralAgentHandler.isAgentInvocation({ message })) {
      await Telemetry.sendTelemetry("agent_chat_started");

      // Initialize the EphemeralAgentHandler to handle non-continuous
      // conversations with agents since this is over REST.
      const agentHandler = new EphemeralAgentHandler({
        uuid,
        workspace,
        prompt: message,
        userId: user?.id || null,
        threadId: thread?.id || null,
        sessionId,
      });

      // Establish event listener that emulates websocket calls
      // in Aibitat so that we can keep the same interface in Aibitat
      // but use HTTP.
      const eventListener = new EphemeralEventListener();
      await agentHandler.init();
      await agentHandler.createAIbitat({ handler: eventListener });
      agentHandler.startAgentCluster();

      // The cluster has started and now we wait for close event since
      // this is a synchronous call for an agent, so we return everything at once.
      // After this, we conclude the call as we normally do.
      return await eventListener
        .waitForClose()
        .then(async ({ thoughts, textResponse }) => {
          await WorkspaceChats.new({
            workspaceId: workspace.id,
            prompt: String(message),
            response: {
              text: textResponse,
              sources: [],
              type: chatMode,
              thoughts,
            },
            include: false,
            apiSessionId: sessionId,
          });
          return {
            id: uuid,
            type: "textResponse",
            sources: [],
            close: true,
            error: null,
            textResponse,
            thoughts,
          };
        });
    }

    const LLMConnector = getLLMProvider({
      provider: workspace?.chatProvider,
      model: workspace?.chatModel,
    });
    const VectorDb = getVectorDbClass();
    const messageLimit = workspace?.openAiHistory || 20;
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
        prompt: String(message),
        response: {
          text: textResponse,
          sources: [],
          type: chatMode,
          metrics: {},
        },
        include: false,
        apiSessionId: sessionId,
      });

      return {
        id: uuid,
        type: "textResponse",
        sources: [],
        close: true,
        error: null,
        textResponse,
        metrics: {},
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
      apiSessionId: sessionId,
    });

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
            rerank: workspace?.vectorSearchMode === "rerank",
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
        metrics: {},
      };
    }

    const { fillSourceWindow } = require("../helpers/chat");
    const filledSources = fillSourceWindow({
      nDocs: workspace?.topN || 4,
      searchResults: vectorSearchResults.sources,
      history: rawHistory,
      filterIdentifiers: pinnedDocIdentifiers,
    });

    // Why does contextTexts get all the info, but sources only get current search?
    // This is to give the ability of the LLM to "comprehend" a contextual response without
    // populating the Citations under a response with documents the user "thinks" are irrelevant
    // due to how we manage backfilling of the context to keep chats with the LLM more correct in responses.
    // If a past citation was used to answer the question - that is visible in the history so it logically makes sense
    // and does not appear to the user that a new response used information that is otherwise irrelevant for a given prompt.
    // TLDR; reduces GitHub issues for "LLM citing document that has no answer in it" while keep answers highly accurate.
    contextTexts = [...contextTexts, ...filledSources.contextTexts];
    sources = [...sources, ...vectorSearchResults.sources];

    // If in query mode and no context chunks are found from search, backfill, or pins -  do not
    // let the LLM try to hallucinate a response or use general knowledge and exit early
    if (chatMode === "query" && contextTexts.length === 0) {
      const textResponse =
        workspace?.queryRefusalResponse ??
        "There is no relevant information in this workspace to answer your query.";

      await WorkspaceChats.new({
        workspaceId: workspace.id,
        prompt: message,
        response: {
          text: textResponse,
          sources: [],
          type: chatMode,
          metrics: {},
        },
        threadId: thread?.id || null,
        include: false,
        apiSessionId: sessionId,
        user,
      });

      return {
        id: uuid,
        type: "textResponse",
        sources: [],
        close: true,
        error: null,
        textResponse,
        metrics: {},
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
        attachments,
      },
      rawHistory
    );

    // Send the text completion.
    const { textResponse, metrics: performanceMetrics } =
      await LLMConnector.getChatCompletion(messages, {
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
        metrics: performanceMetrics,
      };
    }

    const { chat } = await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message,
      response: {
        text: textResponse,
        sources,
        type: chatMode,
        metrics: performanceMetrics,
      },
      threadId: thread?.id || null,
      apiSessionId: sessionId,
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
      metrics: performanceMetrics,
    };
  } catch (error) {
    console.error("Chat Error:", error);
    return {
      id: uuidv4(),
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error: error.message,
    };
  }
}

/**
 * Handle streamable HTTP chunks for chats with your workspace via the developer API endpoint
 * @param {{
 * response: import("express").Response,
 *  workspace: import("@prisma/client").workspaces,
 *  message:string,
 *  mode: "chat"|"query",
 *  user: import("@prisma/client").users|null,
 *  thread: import("@prisma/client").workspace_threads|null,
 *  sessionId: string|null,
 *  attachments: { name: string; mime: string; contentString: string }[],
 * }} parameters
 * @returns {Promise<VoidFunction>}
 */
async function streamChat({
  response,
  workspace,
  message = null,
  mode = "chat",
  user = null,
  thread = null,
  sessionId = null,
  attachments = [],
}) {
  try {
    // Check and update Google Docs before proceeding
    await checkAndUpdateGoogleDocs(workspace);

    const uuid = uuidv4();
    const chatMode = mode ?? "chat";

    if (EphemeralAgentHandler.isAgentInvocation({ message })) {
      await Telemetry.sendTelemetry("agent_chat_started");

      // Initialize the EphemeralAgentHandler to handle non-continuous
      // conversations with agents since this is over REST.
      const agentHandler = new EphemeralAgentHandler({
        uuid,
        workspace,
        prompt: message,
        userId: user?.id || null,
        threadId: thread?.id || null,
        sessionId,
      });

      // Establish event listener that emulates websocket calls
      // in Aibitat so that we can keep the same interface in Aibitat
      // but use HTTP.
      const eventListener = new EphemeralEventListener();
      await agentHandler.init();
      await agentHandler.createAIbitat({ handler: eventListener });
      agentHandler.startAgentCluster();

      // The cluster has started and now we wait for close event since
      // and stream back any results we get from agents as they come in.
      return eventListener
        .streamAgentEvents(response, uuid)
        .then(async ({ thoughts, textResponse }) => {
          console.log({ thoughts, textResponse });
          await WorkspaceChats.new({
            workspaceId: workspace.id,
            prompt: String(message),
            response: {
              text: textResponse,
              sources: [],
              type: chatMode,
              thoughts,
            },
            include: false,
            apiSessionId: sessionId,
          });
          writeResponseChunk(response, {
            uuid,
            type: "finalizeResponseStream",
            textResponse,
            thoughts,
            close: true,
            error: false,
          });
        });
    }

    const LLMConnector = getLLMProvider({
      provider: workspace?.chatProvider,
      model: workspace?.chatModel,
    });

    const VectorDb = getVectorDbClass();
    const messageLimit = workspace?.openAiHistory || 20;
    const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
    const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);

    // User is trying to query-mode chat a workspace that has no data in it - so
    // we should exit early as no information can be found under these conditions.
    if ((!hasVectorizedSpace || embeddingsCount === 0) && chatMode === "query") {
      const textResponse =
        workspace?.queryRefusalResponse ??
        "There is no relevant information in this workspace to answer your query.";
      writeResponseChunk(response, {
        id: uuid,
        type: "textResponse",
        textResponse,
        sources: [],
        attachments: [],
        close: true,
        error: null,
        metrics: {},
      });
      await WorkspaceChats.new({
        workspaceId: workspace.id,
        prompt: message,
        response: {
          text: textResponse,
          sources: [],
          type: chatMode,
          attachments: [],
          metrics: {},
        },
        threadId: thread?.id || null,
        apiSessionId: sessionId,
        include: false,
        user,
      });
      return;
    }

    // If we are here we know that we are in a workspace that is:
    // 1. Chatting in "chat" mode and may or may _not_ have embeddings
    // 2. Chatting in "query" mode and has at least 1 embedding
    let completeText;
    let metrics = {};
    let contextTexts = [];
    let sources = [];
    let pinnedDocIdentifiers = [];
    const { rawHistory, chatHistory } = await recentChatHistory({
      user,
      workspace,
      thread,
      messageLimit,
      apiSessionId: sessionId,
    });

    // Look for pinned documents and see if the user decided to use this feature. We will also do a vector search
    // as pinning is a supplemental tool but it should be used with caution since it can easily blow up a context window.
    // However we limit the maximum of appended context to 80% of its overall size, mostly because if it expands beyond this
    // it will undergo prompt compression anyway to make it work. If there is so much pinned that the context here is bigger than
    // what the model can support - it would get compressed anyway and that really is not the point of pinning. It is really best
    // suited for high-context models.
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
            rerank: workspace?.vectorSearchMode === "rerank",
          })
        : {
            contextTexts: [],
            sources: [],
            message: null,
          };

    // Failed similarity search if it was run at all and failed.
    if (!!vectorSearchResults.message) {
      writeResponseChunk(response, {
        id: uuid,
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: vectorSearchResults.message,
        metrics: {},
      });
      return;
    }

    const { fillSourceWindow } = require("../helpers/chat");
    const filledSources = fillSourceWindow({
      nDocs: workspace?.topN || 4,
      searchResults: vectorSearchResults.sources,
      history: rawHistory,
      filterIdentifiers: pinnedDocIdentifiers,
    });

    // Why does contextTexts get all the info, but sources only get current search?
    // This is to give the ability of the LLM to "comprehend" a contextual response without
    // populating the Citations under a response with documents the user "thinks" are irrelevant
    // due to how we manage backfilling of the context to keep chats with the LLM more correct in responses.
    // If a past citation was used to answer the question - that is visible in the history so it logically makes sense
    // and does not appear to the user that a new response used information that is otherwise irrelevant for a given prompt.
    // TLDR; reduces GitHub issues for "LLM citing document that has no answer in it" while keep answers highly accurate.
    contextTexts = [...contextTexts, ...filledSources.contextTexts];
    sources = [...sources, ...vectorSearchResults.sources];

    // If in query mode and no context chunks are found from search, backfill, or pins -  do not
    // let the LLM try to hallucinate a response or use general knowledge and exit early
    if (chatMode === "query" && contextTexts.length === 0) {
      const textResponse =
        workspace?.queryRefusalResponse ??
        "There is no relevant information in this workspace to answer your query.";
      writeResponseChunk(response, {
        id: uuid,
        type: "textResponse",
        textResponse,
        sources: [],
        close: true,
        error: null,
        metrics: {},
      });

      await WorkspaceChats.new({
        workspaceId: workspace.id,
        prompt: message,
        response: {
          text: textResponse,
          sources: [],
          type: chatMode,
          attachments: [],
          metrics: {},
        },
        threadId: thread?.id || null,
        apiSessionId: sessionId,
        include: false,
        user,
      });
      return;
    }

    // Compress & Assemble message to ensure prompt passes token limit with room for response
    // and build system messages based on inputs and history.
    const messages = await LLMConnector.compressMessages(
      {
        systemPrompt: chatPrompt(workspace),
        userPrompt: message,
        contextTexts,
        chatHistory,
        attachments,
      },
      rawHistory
    );

    // If streaming is not explicitly enabled for connector
    // we do regular waiting of a response and send a single chunk.
    if (LLMConnector.streamingEnabled() !== true) {
      console.log(
        `\x1b[31m[STREAMING DISABLED]\x1b[0m Streaming is not available for ${LLMConnector.constructor.name}. Will use regular chat method.`
      );
      const { textResponse, metrics: performanceMetrics } =
        await LLMConnector.getChatCompletion(messages, {
          temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
        });
      completeText = textResponse;
      metrics = performanceMetrics;
      writeResponseChunk(response, {
        uuid,
        sources,
        type: "textResponseChunk",
        textResponse: completeText,
        close: true,
        error: false,
        metrics,
      });
    } else {
      const stream = await LLMConnector.streamGetChatCompletion(messages, {
        temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
      });
      completeText = await LLMConnector.handleStream(response, stream, {
        uuid,
        sources,
      });
      metrics = stream.metrics;
    }

    if (completeText?.length > 0) {
      const { chat } = await WorkspaceChats.new({
        workspaceId: workspace.id,
        prompt: message,
        response: { text: completeText, sources, type: chatMode, metrics },
        threadId: thread?.id || null,
        apiSessionId: sessionId,
        user,
      });

      writeResponseChunk(response, {
        uuid,
        type: "finalizeResponseStream",
        close: true,
        error: false,
        chatId: chat.id,
        metrics,
      });
      return;
    }

    writeResponseChunk(response, {
      uuid,
      type: "finalizeResponseStream",
      close: true,
      error: false,
    });
    return;
  } catch (error) {
    console.error("Chat Error:", error);
    writeResponseChunk(response, {
      id: uuidv4(),
      type: "abort",
      textResponse: null,
      sources: [],
      close: true,
      error: error.message,
    });
  }
}

async function checkAndUpdateGoogleDocs(workspace) {
  try {
    console.log(`\n=== Starting Google Docs Update Check for Workspace ${workspace.id} ===`);
    
    if (!googleDocsInstance) {
      console.log('GoogleDocs not initialized, skipping update check');
      return { success: true, message: 'GoogleDocs not initialized' };
    }

    const isAuthorized = await googleDocsInstance.checkAuth();
    console.log('Google Docs authorization status:', isAuthorized);
    
    if (!isAuthorized.authorized) {
      console.warn('Google Docs not authorized, skipping updates');
      return { success: false, error: 'Google Docs not authorized' };
    }
    
    const documents = await Document.where({ workspaceId: workspace.id });
    console.log(`Found ${documents.length} total documents in workspace`);
    
    const googleDocs = documents.filter(doc => {
      try {
        // Parse metadata if it's a string
        let metadata = doc.metadata;
        if (typeof metadata === 'string') {
          try {
            metadata = JSON.parse(metadata);
          } catch (e) {
            console.log(`Failed to parse metadata for doc ${doc.id}:`, e.message);
            return false;
          }
        }

        // Check if this is a Google Doc by looking at multiple indicators
        const isGoogleDoc = (
          doc.type === 'google_document' ||
          metadata?.type === 'google_document' ||
          metadata?.documentType === 'google_document' ||
          doc.url?.startsWith('googledocs://') ||
          metadata?.source === 'googledocs' ||
          (doc.docId && (
            doc.docId.startsWith('googledoc-') ||
            metadata?.docId?.startsWith('googledoc-')
          ))
        );

        if (!isGoogleDoc) {
          return false;
        }

        // Extract the Google Doc ID
        let googleDocId = null;

        // Try different locations for the ID
        if (doc.url?.startsWith('googledocs://')) {
          googleDocId = doc.url.replace('googledocs://', '');
        } else if (doc.docId?.startsWith('googledoc-')) {
          googleDocId = doc.docId.replace('googledoc-', '');
        } else if (metadata?.originalId) {
          googleDocId = metadata.originalId;
        } else if (metadata?.docId?.startsWith('googledoc-')) {
          googleDocId = metadata.docId.replace('googledoc-', '');
        }

        if (!googleDocId) {
          console.log(`No Google Doc ID found for doc ${doc.id}`);
          return false;
        }

        console.log('Found Google Doc:', {
          id: doc.id,
          title: doc.title || metadata?.title,
          googleDocId,
          type: doc.type,
          metadataType: metadata?.type
        });

        return true;
      } catch (error) {
        console.error(`Error processing doc ${doc.id}:`, error);
        return false;
      }
    });

    console.log(`\nFound ${googleDocs.length} valid Google Docs in workspace`);

    if (googleDocs.length === 0) {
      console.log('No valid Google Docs found, skipping update check');
      return { success: true, message: 'No valid Google Docs found' };
    }

    const updateResults = [];
    
    for (const doc of googleDocs) {
      try {
        console.log(`\nProcessing document: ${doc.title} (${doc.id})`);
        
        // Extract clean Google Doc ID
        let docId = null;
        
        // Try URL first
        if (doc.url?.startsWith('googledocs://')) {
          docId = doc.url.replace('googledocs://', '');
        } 
        // Try metadata
        else {
          const metadata = typeof doc.metadata === 'string' 
            ? JSON.parse(doc.metadata)
            : doc.metadata;
            
          docId = metadata.originalId || 
                 (metadata.docId?.startsWith('googledoc-') ? 
                   metadata.docId.replace('googledoc-', '') : null);
        }

        if (!docId) {
          console.warn(`Skipping document ${doc.id} - Could not extract Google Doc ID`);
          updateResults.push({
            id: doc.id,
            success: false,
            error: 'Could not extract Google Doc ID'
          });
          continue;
        }

        console.log(`Fetching latest version of Google Doc: ${docId}`);
        const result = await googleDocsInstance.checkAndUpdateDocument(docId);
        
        if (result.success) {
          console.log(`Updating vectors for document ${doc.id}`);
          const VectorDb = getVectorDbClass();
          
          try {
            // Delete existing vectors - ensure docId is a string
            const vectors = await DocumentVectors.where({ docId: String(doc.id) });
            if (vectors.length > 0) {
              console.log(`Deleting ${vectors.length} existing vectors...`);
              await DocumentVectors.delete({ docId: String(doc.id) });
            }
            
            console.log('Creating new vectors...');
            await VectorDb.addDocumentToNamespace(workspace.id, result.docInfo);
            console.log(`Successfully updated vectors for document ${doc.id}`);
            
            updateResults.push({
              id: doc.id,
              success: true,
              vectorsUpdated: true
            });
          } catch (vectorError) {
            console.error(`Error updating vectors for document ${doc.id}:`, vectorError);
            updateResults.push({
              id: doc.id,
              success: true,
              vectorsUpdated: false,
              vectorError: vectorError.message
            });
          }
        } else {
          updateResults.push({
            id: doc.id,
            success: false,
            error: result.error
          });
        }
      } catch (docError) {
        console.error(`Error processing document ${doc.id}:`, docError);
        updateResults.push({
          id: doc.id,
          success: false,
          error: docError.message
        });
        continue;
      }
    }

    console.log('\n=== Completed Google Docs Update Check ===');
    console.log('Update results:', updateResults);
    
    return { 
      success: true, 
      results: updateResults,
      totalDocs: googleDocs.length,
      successfulUpdates: updateResults.filter(r => r.success).length
    };
  } catch (error) {
    console.error('Error in checkAndUpdateGoogleDocs:', error);
    return { 
      success: false, 
      error: error.message
    };
  }
}

module.exports.ApiChatHandler = {
  chatSync,
  streamChat,
};
