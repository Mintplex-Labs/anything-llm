const { v4: uuidv4 } = require("uuid");
const { Document } = require("../../../models/documents");
const { Telemetry } = require("../../../models/telemetry");
const { Workspace } = require("../../../models/workspace");
const {
  getLLMProvider,
  getEmbeddingEngineSelection,
} = require("../../../utils/helpers");
const { reqBody } = require("../../../utils/http");
const { validApiKey } = require("../../../utils/middleware/validApiKey");
const { EventLogs } = require("../../../models/eventLogs");
const {
  OpenAICompatibleChat,
} = require("../../../utils/chats/openaiCompatible");

/**
 * OpenAI 호환 API 엔드포인트를 정의하며,
 * 모델 관리, 채팅 완료, 임베딩, 벡터 저장소 관련 기능을 제공합니다.
 * @param {object} app - Express 애플리케이션 인스턴스.
 */
function apiOpenAICompatibleEndpoints(app) {
  if (!app) return;

  /**
   * GET /v1/openai/models
   * 사용 가능한 모든 모델(워크스페이스)을 가져옵니다.
   * 요청 및 응답 데이터를 로깅합니다.
   */
  app.get("/v1/openai/models", [validApiKey], async (request, response) => {
    try {
      const data = [];
      const workspaces = await Workspace.where();
      for (const workspace of workspaces) {
        const provider = workspace?.chatProvider ?? process.env.LLM_PROVIDER;
        let LLMProvider = getLLMProvider({
          provider,
          model: workspace?.chatModel,
        });
        data.push({
          name: workspace.name,
          model: workspace.slug,
          llm: {
            provider: provider,
            model: LLMProvider.model,
          },
        });
      }

      await EventLogs.logEvent("api_get_models", {
        request: {},
        response: { data },
      });

      return response.status(200).json({ data });
    } catch (e) {
      console.error(e.message, e);
      await EventLogs.logEvent("api_get_models_error", {
        request: {},
        error: e.message,
      });
      response.sendStatus(500).end();
    }
  });

  /**
   * POST /v1/openai/chat/completions
   * 지정된 워크스페이스와 채팅을 수행합니다.
   * 스트리밍 및 비스트리밍 모드를 지원합니다.
   * 요청 및 응답 데이터를 로깅합니다.
   */
  app.post(
    "/v1/openai/chat/completions",
    [validApiKey],
    async (request, response) => {
      try {
        const {
          model,
          messages = [],
          temperature,
          stream = false,
        } = reqBody(request);

        const workspace = await Workspace.get({ slug: String(model) });
        if (!workspace) {
          await EventLogs.logEvent("api_chat_invalid_workspace", {
            request: { model, messages, temperature, stream },
          });
          return response.status(401).end();
        }

        const userMessage = messages.pop();
        if (userMessage.role !== "user") {
          const errorResponse = {
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error:
              "No user prompt found. Must be last element in message array with 'user' role.",
          };
          await EventLogs.logEvent("api_chat_invalid_message", {
            request: { model, messages, temperature, stream },
            response: errorResponse,
          });
          return response.status(400).json(errorResponse);
        }

        const systemPrompt =
          messages.find((chat) => chat.role === "system")?.content ?? null;
        const history = messages.filter((chat) => chat.role !== "system") ?? [];

        if (!stream) {
          const chatResult = await OpenAICompatibleChat.chatSync({
            workspace,
            systemPrompt,
            history,
            prompt: userMessage.content,
            temperature: Number(temperature),
          });

          await EventLogs.logEvent("api_chat_completion", {
            request: { model, messages, temperature, stream },
            response: chatResult,
          });

          return response.status(200).json(chatResult);
        }

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Connection", "keep-alive");
        response.flushHeaders();

        await OpenAICompatibleChat.streamChat({
          workspace,
          systemPrompt,
          history,
          prompt: userMessage.content,
          temperature: Number(temperature),
          response,
        });

        await EventLogs.logEvent("api_chat_stream_completion", {
          request: { model, messages, temperature, stream },
        });
        response.end();
      } catch (e) {
        console.error(e.message, e);
        await EventLogs.logEvent("api_chat_error", {
          request: reqBody(request),
          error: e.message,
        });
        response.status(500).end();
      }
    }
  );

  /**
   * POST /v1/openai/embeddings
   * 주어진 텍스트 입력에 대한 임베딩을 생성합니다.
   * 요청 및 응답 데이터를 로깅합니다.
   */
  app.post(
    "/v1/openai/embeddings",
    [validApiKey],
    async (request, response) => {
      try {
        const { inputs = [] } = reqBody(request);
        const validArray = inputs.every((input) => typeof input === "string");
        if (!validArray)
          throw new Error("All inputs to be embedded must be strings.");

        const Embedder = getEmbeddingEngineSelection();
        const embeddings = await Embedder.embedChunks(inputs);
        const data = [];
        embeddings.forEach((embedding, index) => {
          data.push({
            object: "embedding",
            embedding,
            index,
          });
        });

        await EventLogs.logEvent("api_embeddings", {
          request: { inputs },
          response: { data, model: Embedder.model },
        });

        return response.status(200).json({
          object: "list",
          data,
          model: Embedder.model,
        });
      } catch (e) {
        console.error(e.message, e);
        await EventLogs.logEvent("api_embeddings_error", {
          request: reqBody(request),
          error: e.message,
        });
        response.status(500).end();
      }
    }
  );

  /**
   * GET /v1/openai/vector_stores
   * 모든 벡터 데이터베이스 컬렉션(워크스페이스)을 나열합니다.
   * 요청 및 응답 데이터를 로깅합니다.
   */
  app.get(
    "/v1/openai/vector_stores",
    [validApiKey],
    async (request, response) => {
      try {
        if (Object.keys(request?.query ?? {}).length !== 0) {
          const emptyResponse = { data: [], has_more: false };
          await EventLogs.logEvent("api_vector_stores_query", {
            request: request.query,
            response: emptyResponse,
          });
          return response.status(200).json(emptyResponse);
        }

        const data = [];
        const VectorDBProvider = process.env.VECTOR_DB || "lancedb";
        const workspaces = await Workspace.where();

        for (const workspace of workspaces) {
          data.push({
            id: workspace.slug,
            object: "vector_store",
            name: workspace.name,
            file_counts: {
              total: await Document.count({
                workspaceId: Number(workspace.id),
              }),
            },
            provider: VectorDBProvider,
          });
        }

        const responsePayload = {
          first_id: [...data].splice(0)?.[0]?.id,
          last_id: [...data].splice(-1)?.[0]?.id ?? data.splice(1)?.[0]?.id,
          data,
          has_more: false,
        };

        await EventLogs.logEvent("api_vector_stores", {
          request: {},
          response: responsePayload,
        });

        return response.status(200).json(responsePayload);
      } catch (e) {
        console.error(e.message, e);
        await EventLogs.logEvent("api_vector_stores_error", {
          request: {},
          error: e.message,
        });
        response.status(500).end();
      }
    }
  );
}

module.exports = { apiOpenAICompatibleEndpoints };
