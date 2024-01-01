const { v4: uuidv4 } = require("uuid");
const { reqBody, userFromSession, multiUserMode } = require("../utils/http");
const { Workspace } = require("../models/workspace");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { Telemetry } = require("../models/telemetry");
const { Threads} = require("../models/threads");

function threadEndpoints(app) {
  if (!app) return;

  app.post(
    "/workspace/:slug/thread/new",
    [validatedRequest],
    async (request, response) => {
      try {
        const { slug } = request.params;
        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { slug })
          : await Workspace.get({ slug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        const { name = null } = reqBody(request);
        const { thread, message } = await Threads.new({
          workspaceId: workspace.id,
          userId: user?.id,
          name: name,
        });

        await Telemetry.sendTelemetry(
          "thread_created",
          {
            multiUserMode: multiUserMode(response),
            LLMSelection: process.env.LLM_PROVIDER || "openai",
            Embedder: process.env.EMBEDDING_ENGINE || "inherit",
            VectorDbSelection: process.env.VECTOR_DB || "pinecone",
          },
          user?.id
        );
        response.status(201).json({ thread, message });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/workspace/:slug/thread/:threadId/update",
    [validatedRequest],
    async (request, response) => {
      try {
        const { slug, threadId } = request.params;
        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { slug })
          : await Workspace.get({ slug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        const thread = await Threads.get({
          id: Number(threadId),
          workspace_id: workspace.id,
          user_id: user?.id
        });

        if (!thread) {
          response.sendStatus(400).end();
          return;
        }

        const data = reqBody(request);
        const { thread: updatedThread, message } = await Threads.update(
          thread.id,
          data
        );

        await Telemetry.sendTelemetry(
          "thread_updated",
          {
            multiUserMode: multiUserMode(response),
            LLMSelection: process.env.LLM_PROVIDER || "openai",
            Embedder: process.env.EMBEDDING_ENGINE || "inherit",
            VectorDbSelection: process.env.VECTOR_DB || "pinecone",
          },
          user?.id
        );
        response.status(200).json({ thread: updatedThread, message });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get(
    "/workspace/:slug/threads",
    [validatedRequest],
    async (request, response) => {
      try {
        const { slug } = request.params;
        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, { slug })
          : await Workspace.get({ slug });

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        const threads = multiUserMode(response)
          ? await Threads.forWorkspaceByUser(workspace.id, user.id)
          : await Threads.forWorkspaceByUser(workspace.id, null);

        response.status(200).json({ threads: threads });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { threadEndpoints };
