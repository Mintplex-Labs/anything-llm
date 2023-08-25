const { reqBody, multiUserMode, userFromSession } = require("../utils/http");
const { Workspace } = require("../models/workspace");
const { Document } = require("../models/documents");
const { DocumentVectors } = require("../models/vectors");
const { WorkspaceChats } = require("../models/workspaceChats");
const { convertToChatHistory } = require("../utils/chats");
const { getVectorDbClass } = require("../utils/helpers");
const { setupMulter } = require("../utils/files/multer");
const {
  checkPythonAppAlive,
  processDocument,
} = require("../utils/files/documentProcessor");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { SystemSettings } = require("../models/systemSettings");
const { Telemetry } = require("../models/telemetry");
const { handleUploads } = setupMulter();

function workspaceEndpoints(app) {
  if (!app) return;

  app.post("/workspace/new", [validatedRequest], async (request, response) => {
    try {
      const user = await userFromSession(request, response);
      const { name = null } = reqBody(request);
      const { workspace, message } = await Workspace.new(name, user?.id);
      await Telemetry.sendTelemetry("workspace_created", {
        multiUserMode: multiUserMode(response),
        LLMSelection: process.env.LLM_PROVIDER || "openai",
        VectorDbSelection: process.env.VECTOR_DB || "pinecone",
      });
      response.status(200).json({ workspace, message });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.post(
    "/workspace/:slug/update",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { slug = null } = request.params;
        const data = reqBody(request);
        const currWorkspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, `slug = '${slug}'`)
          : await Workspace.get(`slug = '${slug}'`);

        if (!currWorkspace) {
          response.sendStatus(400).end();
          return;
        }

        const { workspace, message } = await Workspace.update(
          currWorkspace.id,
          data
        );
        response.status(200).json({ workspace, message });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.post(
    "/workspace/:slug/upload",
    handleUploads.single("file"),
    async function (request, response) {
      const { originalname } = request.file;
      const processingOnline = await checkPythonAppAlive();

      if (!processingOnline) {
        response
          .status(500)
          .json({
            success: false,
            error: `Python processing API is not online. Document ${originalname} will not be processed automatically.`,
          })
          .end();
        return;
      }

      const { success, reason } = await processDocument(originalname);
      if (!success) {
        response.status(500).json({ success: false, error: reason }).end();
        return;
      }

      console.log(
        `Document ${originalname} uploaded processed and successfully. It is now available in documents.`
      );
      await Telemetry.sendTelemetry("document_uploaded");
      response.status(200).json({ success: true, error: null });
    }
  );

  app.post(
    "/workspace/:slug/update-embeddings",
    [validatedRequest],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { slug = null } = request.params;
        const { adds = [], deletes = [] } = reqBody(request);
        const currWorkspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, `slug = '${slug}'`)
          : await Workspace.get(`slug = '${slug}'`);

        if (!currWorkspace) {
          response.sendStatus(400).end();
          return;
        }

        await Document.removeDocuments(currWorkspace, deletes);
        await Document.addDocuments(currWorkspace, adds);
        const updatedWorkspace = await Workspace.get(`slug = '${slug}'`);
        response.status(200).json({ workspace: updatedWorkspace });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/workspace/:slug",
    [validatedRequest],
    async (request, response) => {
      try {
        const { slug = "" } = request.params;
        const user = await userFromSession(request, response);
        const VectorDb = getVectorDbClass();
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, `slug = '${slug}'`)
          : await Workspace.get(`slug = '${slug}'`);

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        if (multiUserMode(response) && user.role !== "admin") {
          const canDelete =
            (await SystemSettings.get(`label = 'users_can_delete_workspaces'`))
              ?.value === "true";
          if (!canDelete) {
            response.sendStatus(500).end();
            return;
          }
        }

        await Workspace.delete(`slug = '${slug.toLowerCase()}'`);
        await DocumentVectors.deleteForWorkspace(workspace.id);
        await Document.delete(`workspaceId = ${Number(workspace.id)}`);
        await WorkspaceChats.delete(`workspaceId = ${Number(workspace.id)}`);
        try {
          await VectorDb["delete-namespace"]({ namespace: slug });
        } catch (e) {
          console.error(e.message);
        }
        response.sendStatus(200).end();
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );

  app.get("/workspaces", [validatedRequest], async (request, response) => {
    try {
      const user = await userFromSession(request, response);
      const workspaces = multiUserMode(response)
        ? await Workspace.whereWithUser(user)
        : await Workspace.where();

      response.status(200).json({ workspaces });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/workspace/:slug", [validatedRequest], async (request, response) => {
    try {
      const { slug } = request.params;
      const user = await userFromSession(request, response);
      const workspace = multiUserMode(response)
        ? await Workspace.getWithUser(user, `slug = '${slug}'`)
        : await Workspace.get(`slug = '${slug}'`);

      response.status(200).json({ workspace });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get(
    "/workspace/:slug/chats",
    [validatedRequest],
    async (request, response) => {
      try {
        const { slug } = request.params;
        const user = await userFromSession(request, response);
        const workspace = multiUserMode(response)
          ? await Workspace.getWithUser(user, `slug = '${slug}'`)
          : await Workspace.get(`slug = '${slug}'`);

        if (!workspace) {
          response.sendStatus(400).end();
          return;
        }

        const history = multiUserMode(response)
          ? await WorkspaceChats.forWorkspaceByUser(workspace.id, user.id)
          : await WorkspaceChats.forWorkspace(workspace.id);

        response.status(200).json({ history: convertToChatHistory(history) });
      } catch (e) {
        console.log(e.message, e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { workspaceEndpoints };
