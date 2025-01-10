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

function apiWorkspaceThreadEndpoints(app) {
  if (!app) return;

  app.post(
    "/v1/workspace/:slug/thread/new",
    [validApiKey],
    async (request, response) => {
      try {
        const wslug = request.params.slug;
        let { userId = null, name = null, slug = null } = reqBody(request);
        const workspace = await Workspace.get({ slug: wslug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        if (!response.locals.multiUserMode && !!userId) userId = null;

        const { thread, message } = await WorkspaceThread.new(
          workspace,
          userId ? Number(userId) : null,
          { name, slug }
        );

        await Telemetry.sendTelemetry("workspace_thread_created", {
          multiUserMode: multiUserMode(response),
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          TTSSelection: process.env.TTS_PROVIDER || "native",
        });

        // EventLogs.logEvent 호출 시 입력과 출력 데이터를 포함하도록 수정
        await EventLogs.logEvent("api_workspace_thread_created", {
          workspaceName: workspace?.name || "Unknown Workspace",
          input: { userId, name, slug }, // 입력 데이터 기록
          output: { thread, message }, // 출력 데이터 기록
        });

        response.status(200).json({ thread, message });
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

        // EventLogs.logEvent 호출 시 입력과 출력 데이터를 포함하도록 수정
        await EventLogs.logEvent("api_workspace_thread_updated", {
          workspaceName: workspace?.name || "Unknown Workspace",
          input: { threadSlug, name }, // 입력 데이터 기록
          output: { updatedThread, message }, // 출력 데이터 기록
        });

        response.status(200).json({ thread: updatedThread, message });
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/v1/workspace/:slug/thread/:threadSlug",
    [validApiKey],
    async (request, response) => {
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

        // EventLogs.logEvent 호출 시 입력 데이터를 포함하도록 수정
        await EventLogs.logEvent("api_workspace_thread_deleted", {
          workspaceName: workspace?.name || "Unknown Workspace",
          input: { threadSlug }, // 입력 데이터 기록
        });

        response.sendStatus(200).end();
      } catch (e) {
        console.error(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/v1/workspace/:slug/thread/:threadSlug/chats",
    [validApiKey],
    async (request, response) => {
      try {
        const { slug, threadSlug } = request.params;
        const workspace = await Workspace.get({ slug });
        const thread = await WorkspaceThread.get({
          slug: threadSlug,
          workspace_id: workspace.id,
        });

        if (!workspace || !thread) {
          response.sendStatus(400).end();
          return;
        }

        const history = await WorkspaceChats.where(
          {
            workspaceId: workspace.id,
            thread_id: thread.id,
            api_session_id: null, // API 세션 채팅 제외
            include: true,
          },
          null,
          { id: "asc" }
        );

        // EventLogs.logEvent 호출 시 입력과 출력 데이터를 포함하도록 수정
        await EventLogs.logEvent("api_workspace_thread_chats_retrieved", {
          workspaceName: workspace?.name || "Unknown Workspace",
          input: { threadSlug }, // 입력 데이터 기록
          output: { history: convertToChatHistory(history) }, // 출력 데이터 기록
        });

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
      try {
        const { slug, threadSlug } = request.params;
        const {
          message,
          mode = "query",
          userId,
          attachments = [],
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

        if (!message?.length || !VALID_CHAT_MODE.includes(mode)) {
          response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error: !message?.length
              ? "message parameter cannot be empty."
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
        });

        await Telemetry.sendTelemetry("sent_chat", {
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          TTSSelection: process.env.TTS_PROVIDER || "native",
        });

        // EventLogs.logEvent 호출 시 입력과 출력 데이터를 포함하도록 수정
        await EventLogs.logEvent("api_sent_chat", {
          workspaceName: workspace?.name,
          chatModel: workspace?.chatModel || "System Default",
          threadName: thread?.name,
          userId: user?.id,
          input: { message, mode, userId, attachments }, // 입력 데이터 기록
          output: result, // 출력 데이터 기록
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
    "/v1/workspace/:slug/thread/:threadSlug/stream-chat",
    [validApiKey],
    async (request, response) => {
      try {
        const { slug, threadSlug } = request.params;
        const {
          message,
          mode = "query",
          userId,
          attachments = [],
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

        if (!message?.length || !VALID_CHAT_MODE.includes(mode)) {
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

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Connection", "keep-alive");
        response.flushHeaders();

        await ApiChatHandler.streamChat({
          response,
          workspace,
          message,
          mode,
          user,
          thread,
          attachments,
        });

        await Telemetry.sendTelemetry("sent_chat", {
          LLMSelection: process.env.LLM_PROVIDER || "openai",
          Embedder: process.env.EMBEDDING_ENGINE || "inherit",
          VectorDbSelection: process.env.VECTOR_DB || "lancedb",
          TTSSelection: process.env.TTS_PROVIDER || "native",
        });

        // EventLogs.logEvent 호출 시 입력과 출력 데이터를 포함하도록 수정
        await EventLogs.logEvent("api_sent_chat_stream", {
          workspaceName: workspace?.name,
          chatModel: workspace?.chatModel || "System Default",
          threadName: thread?.name,
          userId: user?.id,
          input: { message, mode, userId, attachments }, // 입력 데이터 기록
          output: "Stream started successfully", // 출력 데이터 기록
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

module.exports = { apiWorkspaceThreadEndpoints };
