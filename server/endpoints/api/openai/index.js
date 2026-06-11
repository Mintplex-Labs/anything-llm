const { v4: uuidv4 } = require("uuid");
const { Document } = require("../../../models/documents");
const { Telemetry } = require("../../../models/telemetry");
const { Workspace } = require("../../../models/workspace");
const { WorkspaceChats } = require("../../../models/workspaceChats");
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
const { getModelTag } = require("../../utils");
const {
  extractTextContent,
  extractAttachments,
  validateAdjustmentRequest,
} = require("./helpers");
const {
  WorkspaceMessageAdjustments,
} = require("../../../models/workspaceMessageAdjustments");

/**
 * Builds the standardized quota/limit payload for a workspace.
 * Shared by GET /limits and the quota adjustment endpoints so callers always
 * see the same shape (mirrors the billing tab + chat/completions injection).
 * @param {Object} workspace - The workspace object
 * @returns {Promise<Object>} - Limits payload
 */
async function buildWorkspaceLimitsPayload(workspace) {
  const { getMessageLimitInfo } = require("../../../utils/helpers");
  const {
    messageCount,
    messagesLimit,
    contingent,
    adjustmentsTotal,
    cycleInfo,
  } = await getMessageLimitInfo(workspace);

  const messagesRemaining =
    messagesLimit !== null && messagesLimit !== undefined
      ? Math.max(0, messagesLimit - messageCount)
      : null;
  const unlimited = messagesLimit === null || messagesLimit === undefined;

  return {
    workspace_slug: workspace.slug,
    workspace_name: workspace.name,
    messageCount,
    messagesLimit,
    messagesRemaining,
    contingent,
    adjustmentsTotal,
    messages_limit: messagesLimit,
    unlimited,
    limitReached: !unlimited && messageCount >= messagesLimit,
    cycleInfo: cycleInfo
      ? {
          cycleNumber: cycleInfo.cycleNumber,
          cycleDurationMonths: cycleInfo.cycleDurationMonths,
          currentCycleStart: cycleInfo.currentCycleStart,
          currentCycleEnd: cycleInfo.currentCycleEnd,
          nextReset: cycleInfo.nextReset,
          daysRemaining: cycleInfo.daysRemaining,
        }
      : null,
  };
}

/**
 * Resolves the current billing window for a workspace — the active cycle when
 * cycle fields are set, otherwise the current calendar month. End date is
 * clamped to end-of-day, mirroring countMessagesInDateRange.
 * @param {Object} workspace - The workspace object
 * @returns {{startDate: Date, endDate: Date}}
 */
function getCurrentBillingWindow(workspace) {
  const now = new Date();
  let startDate, endDate;
  if (workspace.cycleStartDate) {
    const { getCycleInfo } = require("../../../utils/helpers/cycleHelpers");
    const cycleInfo = getCycleInfo(workspace);
    startDate = new Date(cycleInfo.currentCycleStart);
    endDate = new Date(cycleInfo.currentCycleEnd);
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  }
  endDate.setHours(23, 59, 59, 999);
  return { startDate, endDate };
}

function apiOpenAICompatibleEndpoints(app) {
  if (!app) return;

  app.get("/v1/openai/models", [validApiKey], async (_, response) => {
    /*
    #swagger.tags = ['OpenAI Compatible Endpoints']
    #swagger.description = 'Get all available "models" which are workspaces you can use for chatting.'
    #swagger.responses[200] = {
      content: {
        "application/json": {
          "schema": {
            "type": "object",
            "example": {
              "object": "list",
              "data": [
                {
                  "id": "model-id-0",
                  "object": "model",
                  "created": 1686935002,
                  "owned_by": "organization-owner"
                },
                {
                  "id": "model-id-1",
                  "object": "model",
                  "created": 1686935002,
                  "owned_by": "organization-owner"
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
      const data = [];
      const workspaces = await Workspace.where();
      for (const workspace of workspaces) {
        const provider = workspace?.chatProvider ?? process.env.LLM_PROVIDER;
        let LLMProvider = getLLMProvider({
          provider,
          model: workspace?.chatModel,
        });
        data.push({
          id: workspace.slug,
          object: "model",
          created: Math.floor(Number(new Date(workspace.createdAt)) / 1000),
          owned_by: `${provider}-${LLMProvider.model}`,
        });
      }
      return response.status(200).json({
        object: "list",
        data,
      });
    } catch (e) {
      console.error(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.post(
    "/v1/openai/chat/completions",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['OpenAI Compatible Endpoints']
      #swagger.description = 'Execute a chat with a workspace using an OpenAI-compatible request shape. Supports streaming.<br><br><b>Required fields</b><ul><li><code>model</code> — workspace slug from <code>/v1/openai/models</code></li><li><code>messages</code> — array of OpenAI-style chat messages</li></ul><b>Multimodal (image description)</b><br>Pass the user message <code>content</code> as an array with a text item and one <code>image_url</code> item. <code>image_url.url</code> accepts either a public <code>https://…</code> URL <b>or</b> an inline <code>data:image/&lt;type&gt;;base64,…</code> data URL. Requires a workspace whose chat model supports vision — e.g. <b>Mistral-Small-3.2-24B</b>, <b>Qwen2-VL</b>, <b>GPT-4o</b>, <b>Claude 3.x</b>. See the request-body examples below for the exact shape.<br><br><b>Limitations</b> (subset of the official OpenAI spec):<ul><li><code>image_url.detail</code> is ignored</li><li>non-image content types (<code>input_audio</code>, <code>file</code>, …) are ignored</li></ul>'
      #swagger.requestBody = {
          description: 'Send a prompt to the workspace with full use of documents as if sending a chat in AnythingLLM. The dropdown below offers ready-to-use payloads for plain text, image description via URL, and image description via base64.',
          required: true,
          content: {
            "application/json": {
              examples: {
                text_chat: {
                  summary: "Plain text chat",
                  value: {
                    model: "sample-workspace",
                    stream: true,
                    temperature: 0.7,
                    messages: [
                      { role: "system", content: "You are a helpful assistant" },
                      { role: "user", content: "What is AnythingLLM?" },
                      { role: "assistant", content: "AnythingLLM is...." },
                      { role: "user", content: "Follow up question..." }
                    ]
                  }
                },
                image_description_via_url: {
                  summary: "Image description — public https URL",
                  value: {
                    model: "sample-workspace",
                    stream: false,
                    temperature: 0.2,
                    messages: [
                      {
                        role: "user",
                        content: [
                          { type: "text", text: "Describe the image in one short paragraph." },
                          { type: "image_url", image_url: { url: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Cat03.jpg" } }
                        ]
                      }
                    ]
                  }
                },
                image_description_via_base64: {
                  summary: "Image description — inline base64 data URL",
                  value: {
                    model: "sample-workspace",
                    stream: false,
                    temperature: 0.2,
                    messages: [
                      {
                        role: "user",
                        content: [
                          { type: "text", text: "Beschreibe das Bild als Alternativtext für eine barrierefreie Webseite." },
                          { type: "image_url", image_url: { url: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD…<truncated>" } }
                        ]
                      }
                    ]
                  }
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
        const {
          model,
          messages = [],
          temperature,
          stream = false,
        } = reqBody(request);
        const workspace = await Workspace.get({ slug: String(model) });
        if (!workspace) return response.status(401).end();

        // Get message count for limit check (now handled in the handler)

        const userMessage = messages.pop();
        if (userMessage.role !== "user") {
          return response.status(400).json({
            id: uuidv4(),
            type: "abort",
            textResponse: null,
            sources: [],
            close: true,
            error:
              "No user prompt found. Must be last element in message array with 'user' role.",
          });
        }

        const systemPrompt =
          messages.find((chat) => chat.role === "system")?.content ?? null;
        const history = messages.filter((chat) => chat.role !== "system") ?? [];

        // Determine final temperature: Priority is request -> workspace -> 0.7
        const finalTemperature = temperature !== undefined && temperature !== null
          ? Number(temperature)
          : workspace?.openAiTemp ?? 0.7;

        // Get message limit info using the helper function
        const { getMessageLimitInfo } = require("../../../utils/helpers");
        const { messageCount, messagesLimit } = await getMessageLimitInfo(workspace);
        
        if (!stream) {
          const chatResult = await OpenAICompatibleChat.chatSync({
            messagesLimit, // Pass down for contingent
            messageCount, // Pass down for contingent 
            workspace,
            systemPrompt,
            history,
            prompt: extractTextContent(userMessage.content),
            attachments: extractAttachments(userMessage.content),
            temperature: finalTemperature,

          });

          await Telemetry.sendTelemetry("sent_chat", {
            LLMSelection:
              workspace.chatProvider ?? process.env.LLM_PROVIDER ?? "openai",
            Embedder: process.env.EMBEDDING_ENGINE || "inherit",
            VectorDbSelection: process.env.VECTOR_DB || "lancedb",
            TTSSelection: process.env.TTS_PROVIDER || "native",
          });
          await EventLogs.logEvent("api_sent_chat", {
            workspaceName: workspace?.name,
            chatModel: workspace?.chatModel || "System Default",
          });
          // Add finalTemperature to the response
          chatResult.finalTemperature = finalTemperature;
          
          // Check if the result contains a specific HTTP status code flag
          if (chatResult.httpStatusCode) {
            // Use the specified status code (like 429 for rate limiting)
            return response.status(chatResult.httpStatusCode).json(chatResult);
          } else {
            // Default to 200 OK for normal responses
            // The chatResult already contains the updated contingent and messages_limit values
            return response.status(200).json(chatResult);
          }
        }

        response.setHeader("Cache-Control", "no-cache");
        response.setHeader("Content-Type", "text/event-stream");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Connection", "keep-alive");
        response.flushHeaders();

        await OpenAICompatibleChat.streamChat({
          messageCount,
          messagesLimit, // Pass down for contingent (can be null)
          workspace,
          response,
          systemPrompt,
          history,
          prompt: extractTextContent(userMessage.content),
          attachments: extractAttachments(userMessage.content),
          temperature: finalTemperature,
          response,
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
        });
        response.end();
      } catch (e) {
        console.error(e.message, e);
        response.status(500).end();
      }
    }
  );

  app.post(
    "/v1/openai/embeddings",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['OpenAI Compatible Endpoints']
      #swagger.description = 'Get the embeddings of any arbitrary text string. This will use the embedder provider set in the system. Please ensure the token length of each string fits within the context of your embedder model.'
      #swagger.requestBody = {
          description: 'The input string(s) to be embedded. If the text is too long for the embedder model context, it will fail to embed. The vector and associated chunk metadata will be returned in the array order provided',
          required: true,
          content: {
            "application/json": {
              example: {
                input: [
                "This is my first string to embed",
                "This is my second string to embed",
                ],
                model: null,
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
        const body = reqBody(request);
        // Support input or "inputs" (for backwards compatibility) as an array of strings or a single string
        // TODO: "inputs" key support will eventually be fully removed.
        let input = body?.input || body?.inputs || [];
        // if input is not an array, make it an array and force to string content
        if (!Array.isArray(input)) input = [String(input)];

        if (Array.isArray(input)) {
          if (input.length === 0)
            throw new Error("Input array cannot be empty.");
          const validArray = input.every((text) => typeof text === "string");
          if (!validArray)
            throw new Error("All inputs to be embedded must be strings.");
        }

        const Embedder = getEmbeddingEngineSelection();
        const embeddings = await Embedder.embedChunks(input);
        const data = [];
        embeddings.forEach((embedding, index) => {
          data.push({
            object: "embedding",
            embedding,
            index,
          });
        });

        return response.status(200).json({
          object: "list",
          data,
          model: Embedder.model,
        });
      } catch (e) {
        console.error(e.message, e);
        response.status(500).end();
      }
    }
  );

  app.get(
    "/v1/openai/vector_stores",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['OpenAI Compatible Endpoints']
      #swagger.description = 'List all the vector database collections connected to AnythingLLM. These are essentially workspaces but return their unique vector db identifier - this is the same as the workspace slug.'
      #swagger.responses[200] = {
        content: {
          "application/json": {
            "schema": {
              "type": "object",
              "example": {
                "data": [
                  {
                    "id": "slug-here",
                    "object": "vector_store",
                    "name": "My workspace",
                    "file_counts": {
                      "total": 3
                    },
                    "provider": "LanceDB"
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
        // We dump all in the first response and despite saying there is
        // not more data the library still checks with a query param so if
        // we detect one - respond with nothing.
        if (Object.keys(request?.query ?? {}).length !== 0) {
          return response.status(200).json({
            data: [],
            has_more: false,
          });
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
        return response.status(200).json({
          first_id: [...data].splice(0)?.[0]?.id,
          last_id: [...data].splice(-1)?.[0]?.id ?? data.splice(1)?.[0]?.id,
          data,
          has_more: false,
        });
      } catch (e) {
        console.error(e.message, e);
        response.status(500).end();
      }
    }
  );

  app.get(
    "/v1/openai/workspace/:slug/limits",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['OpenAI Compatible Endpoints']
      #swagger.description = 'Reads the current message-limit / contingent for a workspace WITHOUT consuming a message. Mirrors the data shown in the billing tab plus the contingent / messages_limit fields injected into chat/completions responses.'
      #swagger.parameters['slug'] = {
        in: 'path',
        description: 'Workspace slug',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            "schema": {
              "type": "object",
              "example": {
                "workspace_slug": "kufersql",
                "workspace_name": "KuferSQL",
                "messageCount": 12,
                "messagesLimit": 600,
                "messagesRemaining": 588,
                "contingent": "12/600",
                "messages_limit": 600,
                "unlimited": false,
                "limitReached": false,
                "cycleInfo": {
                  "cycleNumber": 1,
                  "cycleDurationMonths": 1,
                  "currentCycleStart": "2026-05-01T00:00:00.000Z",
                  "currentCycleEnd": "2026-05-31T23:59:59.999Z",
                  "nextReset": "2026-06-01T00:00:00.000Z",
                  "daysRemaining": 27
                }
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
      #swagger.responses[404] = {
        description: 'Workspace not found.'
      }
      */
      try {
        const { slug } = request.params;
        const workspace = await Workspace.get({ slug: String(slug) });
        if (!workspace) {
          return response.status(404).json({ error: "Workspace not found." });
        }

        return response
          .status(200)
          .json(await buildWorkspaceLimitsPayload(workspace));
      } catch (e) {
        console.error(e.message, e);
        response.status(500).end();
      }
    }
  );

  app.post(
    "/v1/openai/workspace/:slug/limits/adjustments",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['OpenAI Compatible Endpoints']
      #swagger.description = 'Books a manual quota adjustment against the workspace message contingent. Sign convention: amount > 0 DEDUCTS messages from the contingent (consumed quota increases, messagesRemaining decreases) — use this when an external system consumes messages from the same package. amount < 0 credits messages back (e.g. refunds). Adjustments are counted inside the current billing window exactly like real chat messages and therefore expire automatically with the next cycle reset. Note: bookings are not idempotent — retrying a request books twice. createdAt is always now (no backdating). Overdrawing is allowed; limitReached then becomes true and chats are blocked.'
      #swagger.parameters['slug'] = {
        in: 'path',
        description: 'Workspace slug',
        required: true,
        type: 'string'
      }
      #swagger.requestBody = {
        description: 'amount: non-zero integer (positive = deduct, negative = credit), max ±1000000. reason: optional audit note, max 500 characters.',
        required: true,
        content: {
          "application/json": {
            example: {
              "amount": 250,
              "reason": "Telefon-KI Verbrauch Mai"
            }
          }
        }
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            "schema": {
              "type": "object",
              "example": {
                "adjustment": {
                  "id": 1,
                  "amount": 250,
                  "reason": "Telefon-KI Verbrauch Mai",
                  "createdAt": "2026-06-11T08:00:00.000Z"
                },
                "workspace_slug": "kufersql",
                "workspace_name": "KuferSQL",
                "messageCount": 262,
                "messagesLimit": 600,
                "messagesRemaining": 338,
                "contingent": "262/600",
                "adjustmentsTotal": 250,
                "messages_limit": 600,
                "unlimited": false,
                "limitReached": false,
                "cycleInfo": {
                  "cycleNumber": 1,
                  "cycleDurationMonths": 1,
                  "currentCycleStart": "2026-06-01T00:00:00.000Z",
                  "currentCycleEnd": "2026-06-30T23:59:59.999Z",
                  "nextReset": "2026-07-01T00:00:00.000Z",
                  "daysRemaining": 19
                }
              }
            }
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Invalid amount or reason.'
      }
      #swagger.responses[403] = {
        schema: {
          "$ref": "#/definitions/InvalidAPIKey"
        }
      }
      #swagger.responses[404] = {
        description: 'Workspace not found.'
      }
      */
      try {
        const { slug } = request.params;
        const workspace = await Workspace.get({ slug: String(slug) });
        if (!workspace) {
          return response.status(404).json({ error: "Workspace not found." });
        }

        const validation = validateAdjustmentRequest(reqBody(request), {
          maxAbsAmount: WorkspaceMessageAdjustments.MAX_ABS_AMOUNT,
          maxReasonLength: WorkspaceMessageAdjustments.MAX_REASON_LENGTH,
        });
        if (!validation.valid) {
          return response.status(400).json({ error: validation.error });
        }

        const { adjustment, message } = await WorkspaceMessageAdjustments.new({
          workspaceId: workspace.id,
          amount: validation.amount,
          reason: validation.reason,
        });
        if (!adjustment) {
          return response
            .status(500)
            .json({ error: message ?? "Failed to create adjustment." });
        }

        await EventLogs.logEvent("api_message_quota_adjustment", {
          workspaceSlug: workspace.slug,
          workspaceName: workspace.name,
          adjustmentId: adjustment.id,
          amount: adjustment.amount,
          reason: adjustment.reason,
        });

        return response.status(200).json({
          adjustment: {
            id: adjustment.id,
            amount: adjustment.amount,
            reason: adjustment.reason,
            createdAt: adjustment.createdAt,
          },
          ...(await buildWorkspaceLimitsPayload(workspace)),
        });
      } catch (e) {
        console.error(e.message, e);
        response.status(500).end();
      }
    }
  );

  app.get(
    "/v1/openai/workspace/:slug/limits/adjustments",
    [validApiKey],
    async (request, response) => {
      /*
      #swagger.tags = ['OpenAI Compatible Endpoints']
      #swagger.description = 'Lists manual quota adjustments for a workspace (audit trail), newest first. amount > 0 = deduction, amount < 0 = credit.'
      #swagger.parameters['slug'] = {
        in: 'path',
        description: 'Workspace slug',
        required: true,
        type: 'string'
      }
      #swagger.parameters['currentCycle'] = {
        in: 'query',
        description: 'When true, only returns adjustments inside the current billing window (active cycle, or current calendar month when no cycle is configured). Default: all adjustments.',
        required: false,
        type: 'boolean'
      }
      #swagger.parameters['limit'] = {
        in: 'query',
        description: 'Maximum number of adjustments to return (default 100, max 1000).',
        required: false,
        type: 'integer'
      }
      #swagger.parameters['offset'] = {
        in: 'query',
        description: 'Number of adjustments to skip for pagination (default 0).',
        required: false,
        type: 'integer'
      }
      #swagger.responses[200] = {
        content: {
          "application/json": {
            "schema": {
              "type": "object",
              "example": {
                "workspace_slug": "kufersql",
                "adjustments": [
                  {
                    "id": 1,
                    "workspaceId": 5,
                    "amount": 250,
                    "reason": "Telefon-KI Verbrauch Mai",
                    "createdAt": "2026-06-11T08:00:00.000Z"
                  }
                ],
                "totalCount": 1,
                "adjustmentsTotal": 250,
                "limit": 100,
                "offset": 0,
                "currentCycle": false
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
      #swagger.responses[404] = {
        description: 'Workspace not found.'
      }
      */
      try {
        const { slug } = request.params;
        const workspace = await Workspace.get({ slug: String(slug) });
        if (!workspace) {
          return response.status(404).json({ error: "Workspace not found." });
        }

        const limit = Math.min(
          Math.max(Number(request.query?.limit ?? 100) || 100, 1),
          1000
        );
        const offset = Math.max(Number(request.query?.offset ?? 0) || 0, 0);
        const currentCycle = String(request.query?.currentCycle) === "true";

        const clause = { workspaceId: workspace.id };
        if (currentCycle) {
          const { startDate, endDate } = getCurrentBillingWindow(workspace);
          clause.createdAt = { gte: startDate, lte: endDate };
        }

        const [adjustments, totalCount, adjustmentsTotal] = await Promise.all([
          WorkspaceMessageAdjustments.where(clause, limit, offset),
          WorkspaceMessageAdjustments.count(clause),
          WorkspaceMessageAdjustments.sumAmount(clause),
        ]);

        return response.status(200).json({
          workspace_slug: workspace.slug,
          adjustments,
          totalCount,
          adjustmentsTotal,
          limit,
          offset,
          currentCycle,
        });
      } catch (e) {
        console.error(e.message, e);
        response.status(500).end();
      }
    }
  );
}

module.exports = { apiOpenAICompatibleEndpoints };
