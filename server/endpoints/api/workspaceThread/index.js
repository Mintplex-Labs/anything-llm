const { v4: uuidv4 } = require("uuid");
const { WorkspaceThread } = require("../../../models/workspaceThread");
const { Workspace } = require("../../../models/workspace");
const { validApiKey } = require("../../../utils/middleware/validApiKey");
const { reqBody, multiUserMode } = require("../../../utils/http");
const { VALID_CHAT_MODE } = require("../../../utils/chats/stream");
const { Telemetry } = require("../../../models/telemetry");
const { EventLogs } = require("../../../models/eventLogs");
const {
  writeResponseChunk,
  convertToChatHistory,
} = require("../../../utils/helpers/chat/responses");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { User } = require("../../../models/user");
const { ApiChatHandler } = require("../../../utils/chats/apiChatHandler");
const { getModelTag } = require("../../utils");
const { createSessionForEngines } = require("../../../aiapplications_utils/sessionManagement");
const { getEngineResponse, pareseRelatedQuestions, generateRelatedQuestions, generateAllRelatedQuestions } = require("../../../aiapplications_utils/responseGenerator");
const { parseEngineResponses } = require("../../../aiapplications_utils/referenceHandler");
const { performance } = require('perf_hooks');
const { serve } = require("swagger-ui-express");
const { fetchAndProcessRAGData } = require("../../../aiapplications_utils/docRag");
const { recentChatHistory, chatPrompt } = require("../../../utils/chats/index");
const { getLLMProvider } = require("../../../utils/helpers");
const { getVectorDbClass } = require("../../../utils/helpers");

function apiWorkspaceThreadEndpoints(app) {
  if (!app) return;

  app.post(
    "/v1/workspace/:slug/thread/new",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Workspace Threads']
      #swagger.description = 'Create a new workspace thread'
      #swagger.parameters['slug'] = {
          in: 'path',
          description: 'Unique slug of workspace',
          required: true,
          type: 'string'
      }
      #swagger.requestBody = {
        description: 'Optional userId associated with the thread, thread slug and thread name',
        required: false,
        content: {
          "application/json": {
            example: {
              userId: 1,
              name: 'Name',
              slug: 'thread-slug'
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                thread: {
                  "id": 1,
                  "name": "Thread",
                  "slug": "thread-uuid",
                  "user_id": 1,
                  "workspace_id": 1
                },
                message: null
              }
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const wslug = request.params.slug;
        let { userId = null, name = null, slug = null, user_pseudo_id = null } = reqBody(request);
        const workspace = await Workspace.get({ slug: wslug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        // If the system is not multi-user and you pass in a userId
        // it needs to be nullified as no users exist. This can still fail validation
        // as we don't check if the userID is valid.
        if (!response.locals.multiUserMode && !!userId) userId = null;

        const engines_session_ids = await createSessionForEngines(user_pseudo_id);

        const { thread, message } = await WorkspaceThread.new(
          workspace,
          userId ? Number(userId) : null,
          { name, slug },
          user_pseudo_id,
          engines_session_ids
        );

        await Telemetry.sendTelemetry("workspace_thread_created", {
          multiUserMode: multiUserMode(response),
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          TTSSelection: process.env.TTS_PROVIDER || "native",
        });
        await EventLogs.logEvent("api_workspace_thread_created", {
          workspaceName: workspace?.name || "Unknown Workspace",
        });
        
        response.status(201).json({ thread, message });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/workspace/:slug/thread/:threadSlug/update",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Workspace Threads']
      #swagger.description = 'Update thread name by its unique slug.'
      #swagger.parameters['slug'] = {
          in: 'path',
          description: 'Unique slug of workspace',
          required: true,
          type: 'string'
      }
      #swagger.parameters['threadSlug'] = {
          in: 'path',
          description: 'Unique slug of thread',
          required: true,
          type: 'string'
      }
      #swagger.requestBody = {
        description: 'JSON object containing new name to update the thread.',
        required: true,
        content: {
          "application/json": {
            example: {
              "name": 'Updated Thread Name'
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                thread: {
                  "id": 1,
                  "name": "Updated Thread Name",
                  "slug": "thread-uuid",
                  "user_id": 1,
                  "workspace_id": 1
                },
                message: null,
              }
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const { slug, threadSlug } = request.params;
        const { name } = reqBody(request);
        const workspace = await Workspace.get({ slug });
        const thread = await WorkspaceThread.get({
          slug: threadSlug,
          workspace_id: workspace.id,
        });

        if (!workspace || !thread) {
          response.sendStatus(400).end();
          return;
        }

        const { thread: updatedThread, message } = await WorkspaceThread.update(
          thread,
          { name }
        );
        response.status(200).json({ thread: updatedThread, message });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  // get workspace threads
  app.get(
    "/v1/workspace/:slug/threads/:user_pseudo_id",
    [validApiKey],
    async (request, response) => {
      const { slug, user_pseudo_id } = request.params;
      const workspace = await Workspace.get({ slug });
      const threads = await WorkspaceThread.where({
        workspace_id: workspace.id,
        user_pseudo_id: user_pseudo_id,
      });
      response.status(200).json({ threads });
    }
  )

  app.delete(
    "/v1/workspace/:slug/thread/:threadSlug",
    [validApiKey],
    async (request, response) => {
      /*
    #swagger.tags = ['Workspace Threads']
    #swagger.description = 'Delete a workspace thread'
    #swagger.parameters['slug'] = {
        in: 'path',
        description: 'Unique slug of workspace',
        required: true,
        type: 'string'
    }
    #swagger.parameters['threadSlug'] = {
        in: 'path',
        description: 'Unique slug of thread',
        required: true,
        type: 'string'
    }
    #swagger.responses[200] = {
      description: 'Thread deleted successfully'
    }
    #swagger.responses[403] = {
      schema: {
        "$ref": "#/definitions/InvalidAPIKey"
      }
    }
    */
      try {
        const { slug, threadSlug } = request.params;
        const workspace = await Workspace.get({ slug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        await WorkspaceThread.delete({
          slug: threadSlug,
          workspace_id: workspace.id,
        });
        response.sendStatus(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/v1/workspace/:slug/thread/:threadSlug/chats/:user_pseudo_id",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Workspace Threads']
      #swagger.description = 'Get chats for a workspace thread'
      #swagger.parameters['slug'] = {
          in: 'path',
          description: 'Unique slug of workspace',
          required: true,
          type: 'string'
      }
      #swagger.parameters['threadSlug'] = {
          in: 'path',
          description: 'Unique slug of thread',
          required: true,
          type: 'string'
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                history: [
                  {
                    "role": "user",
                    "content": "What is AnythingLLM?",
                    "sentAt": 1692851630
                  },
                  {
                    "role": "assistant",
                    "content": "AnythingLLM is a platform that allows you to convert notes, PDFs, and other source materials into a chatbot. It ensures privacy, cites its answers, and allows multiple people to interact with the same documents simultaneously. It is particularly useful for businesses to enhance the visibility and readability of various written communications such as SOPs, contracts, and sales calls. You can try it out with a free trial to see if it meets your business needs.",
                    "sources": [{"source": "object about source document and snippets used"}]
                  }
                ]
              }
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const { slug, threadSlug, user_pseudo_id } = request.params;
        const workspace = await Workspace.get({ slug });
        const thread = await WorkspaceThread.get({
          slug: threadSlug,
          workspace_id: workspace.id,
          user_pseudo_id: user_pseudo_id,
        });

        if (!workspace || !thread) {
          response.sendStatus(400).end();
          return;
        }

        const history = await WorkspaceChats.where(
          {
            workspaceId: workspace.id,
            thread_id: thread.id,
            api_session_id: null, // Do not include API session chats.
            include: true,
          },
          null,
          { id: "asc" }
        );

        response.status(200).json({ history: convertToChatHistory(history) });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/v1/workspace/:slug/thread/:threadSlug/chat",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Workspace Threads']
      #swagger.description = 'Chat with a workspace thread'
      #swagger.parameters['slug'] = {
          in: 'path',
          description: 'Unique slug of workspace',
          required: true,
          type: 'string'
      }
      #swagger.parameters['threadSlug'] = {
          in: 'path',
          description: 'Unique slug of thread',
          required: true,
          type: 'string'
      }
      #swagger.requestBody = {
        description: 'Send a prompt to the workspace thread and the type of conversation (query or chat).',
        required: true,
        content: {
          "application/json": {
            example: {
              message: "What is AnythingLLM?",
              mode: "query | chat",
              userId: 1,
              attachments: [
               {
                 name: "image.png",
                 mime: "image/png",
                 contentString: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
               }
              ],
              reset: false
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                id: 'chat-uuid',
                type: "abort | textResponse",
                textResponse: "Response to your query",
                sources: [{title: "anythingllm.txt", chunk: "This is a context chunk used in the answer of the prompt by the LLM."}],
                close: true,
                error: "null | text string of the failure mode."
              }
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const { slug, threadSlug } = request.params;
        const {
          message,
          mode = "query",
          userId,
          attachments = [],
          reset = false,
        } = reqBody(request);
        const workspace = await Workspace.get({ slug });
        const thread = await WorkspaceThread.get({
          slug: threadSlug,
          workspace_id: workspace.id,
        });

        if (!workspace || !thread) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: `Workspace ${slug} or thread ${threadSlug} is not valid.`,
          });
          return;
        }

        if ((!message?.length || !VALID_CHAT_MODE.includes(mode)) && !reset) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: !message?.length
              ? "Message is empty"
              : `${mode} is not a valid mode.`,
          });
          return;
        }

        const user = userId ? await User.get({ id: Number(userId) }) : null;
        const result = await ApiChatHandler.chatSync({
          workspace,
          message,
          mode,
          user,
          thread,
          attachments,
          reset,
        });
        await Telemetry.sendTelemetry("sent_chat", {
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          TTSSelection: process.env.TTS_PROVIDER || "native",
          LLMModel: getModelTag(),
        });
        await EventLogs.logEvent("api_sent_chat", {
          workspaceName: workspace?.name,
          chatModel: workspace?.chatModel || "System Default",
          threadName: thread?.name,
          userId: user?.id,
        });
        response.status(200).json({ ...result });
      } catch (e) {
        console.error(e.message, e);
        response.status(500).json({
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
      }
    }
  );

  app.post(
    "/v1/workspace/:slug/thread/shared",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Workspace Threads']
      #swagger.description = 'Create a new workspace thread'
      #swagger.parameters['slug'] = {
          in: 'path',
          description: 'Unique slug of workspace',
          required: true,
          type: 'string'
      }
      #swagger.requestBody = {
        description: 'Optional userId associated with the thread, thread slug and thread name',
        required: false,
        content: {
          "application/json": {
            example: {
              userId: 1,
              name: 'Name',
              slug: 'thread-slug'
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                thread: {
                  "id": 1,
                  "name": "Thread",
                  "slug": "thread-uuid",
                  "user_id": 1,
                  "workspace_id": 1
                },
                message: null
              }
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const wslug = request.params.slug;
        let { userId = null, name = null, slug = null, user_pseudo_id = null, chatId = null, share_uuid = null } = reqBody(request);
        const chatIdNumber = Number(chatId);

        // check if chat with chatId is shared, return error if not
        const chat = await WorkspaceChats.get({ id: chatIdNumber, share_uuid: share_uuid });
        if ( !chat) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: `Chat ${chatId} is not shared or the url is not valid.`,
          });
          return;
        }

        const workspace = await Workspace.get({ slug: wslug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        // If the system is not multi-user and you pass in a userId
        // it needs to be nullified as no users exist. This can still fail validation
        // as we don't check if the userID is valid.
        if (!response.locals.multiUserMode && !!userId) userId = null;

        // create new thread
        const engines_session_ids = await createSessionForEngines(user_pseudo_id);

        const { thread, message } = await WorkspaceThread.new(
          workspace,
          userId ? Number(userId) : null,
          { name, slug },
          user_pseudo_id,
          engines_session_ids
        );

        await Telemetry.sendTelemetry("workspace_thread_created", {
          multiUserMode: multiUserMode(response),
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          TTSSelection: process.env.TTS_PROVIDER || "native",
        });
        await EventLogs.logEvent("api_workspace_thread_created", {
          workspaceName: workspace?.name || "Unknown Workspace",
        });

        // add user's and model's messages to the thread
        await WorkspaceChats.new({
          workspaceId: workspace.id,
          thread_id: thread.id,
          prompt: chat.prompt,
          response: JSON.parse(chat.response)
        });

        // send the user message to engines
        const user_message = chat.prompt;
        const model_message = JSON.parse(chat.response).text;
        const engine_ids = Object.keys(engines_session_ids);
        const promises = engine_ids.map(engine_id => {
          const session_id = engines_session_ids[engine_id];
          return getEngineResponse(engine_id, user_message, session_id);
        });
        const responses = await Promise.all(promises);
        
        response.status(201).json({ thread, user_message, model_message });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  // mark chat as shared
  app.post(
    "/v1/workspace/:slug/thread/:threadSlug/chat/:chatId/share",
    [validApiKey],
    async (request, response) => {
      const { slug, threadSlug, chatId } = request.params;
      const { user_pseudo_id } = reqBody(request);
      const thread = await WorkspaceThread.get({ slug: threadSlug, user_pseudo_id: user_pseudo_id });
      if (!thread) {
        response.status(400).json({
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: `Thread ${threadSlug} is not valid.`,
        });
        return;
      }
      const chatIdNumber = Number(chatId);
      const chat = await WorkspaceChats.get({ id: chatIdNumber });
      if (!chat) {
        response.status(400).json({
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: `Chat ${chatId} is not valid.`,
        });
        return;
      }
      const share_uuid = uuidv4();
      await WorkspaceChats._update(chatIdNumber, { share_uuid: share_uuid });
      response.status(200).json({ share_uuid: share_uuid });
    }
  )

  app.post(
    "/v1/workspace/:slug/thread/:threadSlug/stream-chat",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Workspace Threads']
      #swagger.description = 'Stream chat with a workspace thread'
      #swagger.parameters['slug'] = {
          in: 'path',
          description: 'Unique slug of workspace',
          required: true,
          type: 'string'
      }
      #swagger.parameters['threadSlug'] = {
          in: 'path',
          description: 'Unique slug of thread',
          required: true,
          type: 'string'
      }
      #swagger.requestBody = {
        description: 'Send a prompt to the workspace thread and the type of conversation (query or chat).',
        required: true,
        content: {
          "application/json": {
            example: {
              message: "What is AnythingLLM?",
              mode: "query | chat",
              userId: 1,
              attachments: [
               {
                 name: "image.png",
                 mime: "image/png",
                 contentString: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
               }
              ],
              reset: false
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "text/event-stream": {
            schema: {
              type: 'array',
              items: {
                  type: 'string',
              },
              example: [
                {
                  id: 'uuid-123',
                  type: "abort | textResponseChunk",
                  textResponse: "First chunk",
                  sources: [],
                  close: false,
                  error: "null | text string of the failure mode."
                },
                {
                  id: 'uuid-123',
                  type: "abort | textResponseChunk",
                  textResponse: "chunk two",
                  sources: [],
                  close: false,
                  error: "null | text string of the failure mode."
                },
                {
                  id: 'uuid-123',
                  type: "abort | textResponseChunk",
                  textResponse: "final chunk of LLM output!",
                  sources: [{title: "anythingllm.txt", chunk: "This is a context chunk used in the answer of the prompt by the LLM. This will only return in the final chunk."}],
                  close: true,
                  error: "null | text string of the failure mode."
                }
              ]
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const { slug, threadSlug } = request.params;
        const {
          message,
          mode = "query",
          userId,
          user_pseudo_id,
          attachments = [],
          reset = false,
        } = reqBody(request);
        const workspace = await Workspace.get({ slug });
        const thread = await WorkspaceThread.get({
          slug: threadSlug,
          workspace_id: workspace.id,
        });

        if (!workspace || !thread) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: `Workspace ${slug} or thread ${threadSlug} is not valid.`,
          });
          return;
        }

        if ((!message?.length || !VALID_CHAT_MODE.includes(mode)) && !reset) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: !message?.length
              ? "Message is empty"
              : `${mode} is not a valid mode.`,
          });
          return;
        }

        const user = userId ? await User.get({ id: Number(userId) }) : null;
        const engines_session_ids = thread.engines_session_ids || {};

        const start_engines = performance.now();
        // get responses from ai applications engines
        const engine_ids = Object.keys(engines_session_ids);
        const promises = engine_ids.map(engine_id => {
          const session_id = engines_session_ids[engine_id];
          return getEngineResponse(engine_id, message, session_id);
        });
        const responses = await Promise.all(promises);
        const end_engines = performance.now();
        console.log(`Time taken to get responses from engines: ${((end_engines - start_engines) / 1000).toFixed(2)} seconds`);

        const start_parse = performance.now();
        const data = await parseEngineResponses(responses);
        const answers = data.answers;
        const citationsMapping = data.referencesSignedUrls;
        let related_questions = data.related_questions;
        const bestReferences = data.bestReferences;
        // allow only questions that are not related to metabolic
        related_questions = pareseRelatedQuestions(related_questions);
        const end_parse = performance.now();
        console.log(`Time taken to parse responses from engines: ${((end_parse - start_parse) / 1000).toFixed(2)} seconds`);
        if (related_questions.length < 3) {
          try {
            const startRelatedQuestions = performance.now();
            const aiGeneratedQuestions = await generateRelatedQuestions(message, JSON.stringify(answers), related_questions);
            const numQuestions = 3 - related_questions.length;
            related_questions = related_questions.concat(aiGeneratedQuestions.slice(0, numQuestions));
            const endRelatedQuestions = performance.now();
            console.log(`Time taken to generate related questions: ${((endRelatedQuestions - startRelatedQuestions) / 1000).toFixed(2)} seconds`);
          } catch (e) {
            console.error(e.message, e);
          }
        }

        answers["user_query"] = message;
        const main_llm_query = JSON.stringify(answers);

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Connection", "keep-alive");
        response.flushHeaders();

        await ApiChatHandler.streamChat({
          response,
          workspace,
          message: main_llm_query,
          message_db_save: message,
          mode,
          user,
          user_pseudo_id,
          thread,
          attachments,
          reset,
          related_questions: related_questions,
          engine_sources: citationsMapping,
          bestReferences: bestReferences,
        });
        await Telemetry.sendTelemetry("sent_chat", {
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          TTSSelection: process.env.TTS_PROVIDER || "native",
          LLMModel: getModelTag(),
        });
        await EventLogs.logEvent("api_sent_chat", {
          workspaceName: workspace?.name,
          chatModel: workspace?.chatModel || "System Default",
          threadName: thread?.name,
          userId: user?.id,
        });
        response.end();
      } catch (e) {
        console.error(e.message, e);
        writeResponseChunk(response, {
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
        response.end();
      }
    }
  );



  // +++++++++++++++++++++++++++++++++++++++++++++
  // for RAG service front
  // +++++++++++++++++++++++++++++++++++++++++++++

  app.post(
    "/v1/workspace/:slug/thread/docs-rag/new",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Workspace Threads']
      #swagger.description = 'Create a new workspace thread'
      #swagger.parameters['slug'] = {
          in: 'path',
          description: 'Unique slug of workspace',
          required: true,
          type: 'string'
      }
      #swagger.requestBody = {
        description: 'Optional userId associated with the thread, thread slug and thread name',
        required: false,
        content: {
          "application/json": {
            example: {
              userId: 1,
              name: 'Name',
              slug: 'thread-slug'
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            schema: {
              type: 'object',
              example: {
                thread: {
                  "id": 1,
                  "name": "Thread",
                  "slug": "thread-uuid",
                  "user_id": 1,
                  "workspace_id": 1
                },
                message: null
              }
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const wslug = request.params.slug;
        let { userId = null, name = null, slug = null, user_pseudo_id = null } = reqBody(request);
        const workspace = await Workspace.get({ slug: wslug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        // If the system is not multi-user and you pass in a userId
        // it needs to be nullified as no users exist. This can still fail validation
        // as we don't check if the userID is valid.
        if (!response.locals.multiUserMode && !!userId) userId = null;

        const { thread, message } = await WorkspaceThread.new(
          workspace,
          userId ? Number(userId) : null,
          { name, slug },
          user_pseudo_id
        );

        await Telemetry.sendTelemetry("workspace_thread_created", {
          multiUserMode: multiUserMode(response),
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          TTSSelection: process.env.TTS_PROVIDER || "native",
        });
        await EventLogs.logEvent("api_workspace_thread_created", {
          workspaceName: workspace?.name || "Unknown Workspace",
        });
        
        response.status(201).json({ thread, message });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );


  app.post(
    "/v1/workspace/:slug/thread/:threadSlug/docs-rag/stream-chat",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['Workspace Threads']
      #swagger.description = 'Stream chat with a workspace thread'
      #swagger.parameters['slug'] = {
          in: 'path',
          description: 'Unique slug of workspace',
          required: true,
          type: 'string'
      }
      #swagger.parameters['threadSlug'] = {
          in: 'path',
          description: 'Unique slug of thread',
          required: true,
          type: 'string'
      }
      #swagger.requestBody = {
        description: 'Send a prompt to the workspace thread and the type of conversation (query or chat).',
        required: true,
        content: {
          "application/json": {
            example: {
              message: "What is AnythingLLM?",
              mode: "query | chat",
              userId: 1,
              attachments: [
               {
                 name: "image.png",
                 mime: "image/png",
                 contentString: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
               }
              ],
              reset: false
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "text/event-stream": {
            schema: {
              type: 'array',
              items: {
                  type: 'string',
              },
              example: [
                {
                  id: 'uuid-123',
                  type: "abort | textResponseChunk",
                  textResponse: "First chunk",
                  sources: [],
                  close: false,
                  error: "null | text string of the failure mode."
                },
                {
                  id: 'uuid-123',
                  type: "abort | textResponseChunk",
                  textResponse: "chunk two",
                  sources: [],
                  close: false,
                  error: "null | text string of the failure mode."
                },
                {
                  id: 'uuid-123',
                  type: "abort | textResponseChunk",
                  textResponse: "final chunk of LLM output!",
                  sources: [{title: "anythingllm.txt", chunk: "This is a context chunk used in the answer of the prompt by the LLM. This will only return in the final chunk."}],
                  close: true,
                  error: "null | text string of the failure mode."
                }
              ]
            }
          }
        }
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      */
      try {
        const { slug, threadSlug } = request.params;
        const {
          message,
          mode = "query",
          userId,
          user_pseudo_id,
          attachments = [],
          reset = false,
        } = reqBody(request);
        const workspace = await Workspace.get({ slug });
        const thread = await WorkspaceThread.get({
          slug: threadSlug,
          workspace_id: workspace.id,
        });

        if (!workspace || !thread) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: `Workspace ${slug} or thread ${threadSlug} is not valid.`,
          });
          return;
        }

        if ((!message?.length || !VALID_CHAT_MODE.includes(mode)) && !reset) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: !message?.length
              ? "Message is empty"
              : `${mode} is not a valid mode.`,
          });
          return;
        }

        const user = userId ? await User.get({ id: Number(userId) }) : null;

        // front needs:
        // followup questions
        // real links to documents
        // best references (documents)

        // get chunks from doc-rag service
        const data = {
          query: message,
          limit: 10
        };
        const documents = await fetchAndProcessRAGData(data);

        // build document data for LLM (without summaries ect)
        let ragData = {};

        // build best references
        let bestReferences = {};
        for (const key in documents) {
          if (Object.prototype.hasOwnProperty.call(documents, key)) {
            const list = documents[key];

            if (Array.isArray(list) && list.length > 0) {
              const element = list[0];
              const source = element.hasOwnProperty("doi") ? `https://dx.doi.org/${element.doi}` : element.sourceUrl;
              bestReferences[key] = {
                title: element.title,
                url: source,
                summary: element.summary
              };
            } else {
              bestReferences[key] = undefined;
            }
          }
        }

        // build citations mapping - a dict with id->real_doc_url, title, summary
        let citationsMapping = {};

        let idx = 0;
        for (const key of Object.keys(documents)) {
          const docsList = documents[key];
          for (const source of docsList) {
            ragData[`source_${idx}_chunks`] = {};
            citationsMapping[idx] = {
              title: source.title,
              summary: source.summary,
              url: source.hasOwnProperty("doi") ? `https://dx.doi.org/${source.doi}` : source.sourceUrl
            }
            for (const chunk of source.chunks) {
              ragData[`source_${idx}_chunks`][`chunkId_${chunk.id}`] = chunk.chunkText;
            }
            idx++;
          }
        }

        const answers = {
          "grounding_data": ragData,
          "user_query": message
        };
        const main_llm_query = JSON.stringify(answers);

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Connection", "keep-alive");
        response.flushHeaders();

        // Custom stream chat for docs-rag that generates related questions after completion
        await streamChatWithRelatedQuestions({
          response,
          workspace,
          message: main_llm_query,
          message_db_save: message,
          mode,
          user,
          user_pseudo_id,
          thread,
          attachments,
          reset,
          engine_sources: citationsMapping,
          bestReferences: bestReferences,
        });
        
        await Telemetry.sendTelemetry("sent_chat", {
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          TTSSelection: process.env.TTS_PROVIDER || "native",
          LLMModel: getModelTag(),
        });
        await EventLogs.logEvent("api_sent_chat", {
          workspaceName: workspace?.name,
          chatModel: workspace?.chatModel || "System Default",
          threadName: thread?.name,
          userId: user?.id,
        });
        response.end();
      } catch (e) {
        console.error(e.message, e);
        writeResponseChunk(response, {
          id: uuidv4(),
          type: "abort",
          textResponse: null,
          sources: [],
          close: true,
          error: e.message,
        });
        response.end();
      }
    }
  );
}

// Custom stream chat function for docs-rag that generates related questions after streaming completion
async function streamChatWithRelatedQuestions({
  response,
  workspace,
  message = null,
  message_db_save = null,
  mode = "chat",
  user = null,
  user_pseudo_id = null,
  thread = null,
  attachments = [],
  reset = false,
  engine_sources = {},
  bestReferences = {},
}) {
  const uuid = uuidv4();
  const chatMode = mode ?? "chat";

  // If the user wants to reset the chat history we do so pre-flight
  if (reset) {
    await WorkspaceChats.markThreadHistoryInvalidV2({
      workspaceId: workspace.id,
      user_id: user?.id,
      thread_id: thread?.id,
      api_session_id: null,
    });
    if (!message?.length) {
      writeResponseChunk(response, {
        id: uuid,
        type: "textResponse",
        textResponse: "Chat history was reset!",
        sources: [],
        attachments: [],
        close: true,
        error: null,
        metrics: {},
      });
      return;
    }
  }

  const LLMConnector = getLLMProvider({
    provider: workspace?.chatProvider,
    model: workspace?.chatModel,
  });

  const VectorDb = getVectorDbClass();
  const messageLimit = workspace?.openAiHistory || 20;
  const hasVectorizedSpace = await VectorDb.hasNamespace(workspace.slug);
  const embeddingsCount = await VectorDb.namespaceCount(workspace.slug);

  // For docs-rag we skip vectorized search and use the provided RAG data
  const { rawHistory, chatHistory } = await recentChatHistory({
    user,
    workspace,
    thread,
    messageLimit,
    apiSessionId: null,
  });

  // Since we're using RAG data, we'll use empty contextTexts and sources
  const contextTexts = [];
  const sources = [];

  // Compress & Assemble message to ensure prompt passes token limit with room for response
  const messages = await LLMConnector.compressMessages(
    {
      systemPrompt: await chatPrompt(workspace, user),
      userPrompt: message,
      contextTexts,
      chatHistory,
      attachments,
    },
    rawHistory
  );

  let completeText;
  let metrics = {};

  // Stream the response with empty related_questions initially
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
      related_questions: [],
      engine_sources,
      bestReferences,
    });
  } else {
    const stream = await LLMConnector.streamGetChatCompletion(messages, {
      temperature: workspace?.openAiTemp ?? LLMConnector.defaultTemp,
    });
    
    // Use custom handleStream that doesn't include related_questions during streaming
    completeText = await handleStreamWithoutRelatedQuestions(response, stream, {
      uuid,
      sources,
      engine_sources,
      bestReferences,
    });
    metrics = stream.metrics;
  }

  if (completeText?.length > 0) {
    // Save the chat to database
    const { chat } = await WorkspaceChats.new({
      workspaceId: workspace.id,
      prompt: message_db_save,
      response: {
        text: completeText,
        sources,
        type: chatMode,
        metrics,
        attachments,
      },
      threadId: thread?.id || null,
      apiSessionId: null,
      user,
    });

    try {
      // Generate related questions after completion
      console.log("Generating related questions...");
      const relatedQuestions = await generateAllRelatedQuestions(message_db_save, completeText);
      
      // Send related questions in a separate chunk
      writeResponseChunk(response, {
        uuid,
        type: "relatedQuestions",
        textResponse: "",
        sources: [],
        close: false,
        error: false,
        related_questions: relatedQuestions,
        engine_sources,
        bestReferences,
      });
    } catch (e) {
      console.error("Error generating related questions:", e);
      // If related questions generation fails, send empty array
      writeResponseChunk(response, {
        uuid,
        type: "relatedQuestions",
        textResponse: "",
        sources: [],
        close: false,
        error: false,
        related_questions: [],
        engine_sources,
        bestReferences,
      });
    }

    // Final chunk to close the stream
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
}

// Custom handleStream function that doesn't include related_questions during streaming
async function handleStreamWithoutRelatedQuestions(response, stream, responseProps) {
  const {
    uuid = uuidv4(),
    sources = [],
    engine_sources = {},
    bestReferences = {},
  } = responseProps;

  let hasUsageMetrics = false;
  let usage = {
    completion_tokens: 0,
  };

  return new Promise(async (resolve) => {
    let fullText = "";

    const handleAbort = () => {
      stream?.endMeasurement(usage);
      resolve(fullText);
    };
    response.on("close", handleAbort);

    try {
      for await (const chunk of stream) {
        const message = chunk?.choices?.[0];
        const token = message?.delta?.content;

        if (
          chunk.hasOwnProperty("usage") &&
          !!chunk.usage &&
          Object.values(chunk.usage).length > 0
        ) {
          if (chunk.usage.hasOwnProperty("prompt_tokens")) {
            usage.prompt_tokens = Number(chunk.usage.prompt_tokens);
          }

          if (chunk.usage.hasOwnProperty("completion_tokens")) {
            hasUsageMetrics = true;
            usage.completion_tokens = Number(chunk.usage.completion_tokens);
          }
        }

        if (token) {
          fullText += token;
          if (!hasUsageMetrics) usage.completion_tokens++;
          writeResponseChunk(response, {
            uuid,
            sources: [],
            type: "textResponseChunk",
            textResponse: token,
            close: false,
            error: false,
            related_questions: [], // Empty during streaming
            engine_sources,
            bestReferences,
          });
        }

        if (
          message?.hasOwnProperty("finish_reason") &&
          message.finish_reason !== "" &&
          message.finish_reason !== null
        ) {
          // Don't send final chunk here - we'll handle it after generating related questions
          response.removeListener("close", handleAbort);
          stream?.endMeasurement(usage);
          resolve(fullText);
          break;
        }
      }
    } catch (e) {
      console.log(`\x1b[43m\x1b[34m[STREAMING ERROR]\x1b[0m ${e.message}`);
      writeResponseChunk(response, {
        uuid,
        type: "abort",
        textResponse: null,
        sources: [],
        close: true,
        error: e.message,
      });
      stream?.endMeasurement(usage);
      resolve(fullText);
    }
  });
}

module.exports = { apiWorkspaceThreadEndpoints };
