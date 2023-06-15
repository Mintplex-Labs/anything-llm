const { reqBody } = require("../utils/http");
const { Workspace } = require("../models/workspace");
const { Document } = require("../models/documents");
const { DocumentVectors } = require("../models/vectors");
const { WorkspaceChats } = require("../models/workspaceChats");
const { convertToChatHistory } = require("../utils/chats");
const { getVectorDbClass } = require("../utils/helpers");
const { setupMulter } = require("../utils/files/multer");
const {
  fileUploadProgress,
} = require("../utils/middleware/fileUploadProgress");
const {
  checkPythonAppAlive,
  processDocument,
} = require("../utils/files/documentProcessor");
const { handleUploads } = setupMulter();

function workspaceEndpoints(app) {
  if (!app) return;

  app.post("/workspace/new", async (request, response) => {
    try {
      const { name = null } = reqBody(request);
      const { workspace, message } = await Workspace.new(name);
      response.status(200).json({ workspace, message });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.post("/workspace/:slug/update", async (request, response) => {
    try {
      const { slug = null } = request.params;
      const data = reqBody(request);
      const currWorkspace = await Workspace.get(`slug = '${slug}'`);

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
  });

  app.post(
    "/workspace/:slug/upload",
    fileUploadProgress,
    handleUploads.single("file"),
    async function (request, _) {
      const { originalname } = request.file;
      const processingOnline = await checkPythonAppAlive();

      if (!processingOnline) {
        console.log(
          `Python processing API is not online. Document ${originalname} will not be processed automatically.`
        );
        return;
      }

      const { success, reason } = await processDocument(originalname);
      if (!success) {
        console.log(
          `Python processing API was not able to process document ${originalname}. Reason: ${reason}`
        );
        return false;
      }

      console.log(
        `Document ${originalname} uploaded processed and successfully. It is now available in documents.`
      );
      return;
    }
  );

  app.post("/workspace/:slug/update-embeddings", async (request, response) => {
    try {
      const { slug = null } = request.params;
      const { adds = [], deletes = [] } = reqBody(request);
      const currWorkspace = await Workspace.get(`slug = '${slug}'`);

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
  });

  app.delete("/workspace/:slug", async (request, response) => {
    try {
      const VectorDb = getVectorDbClass();
      const { slug = "" } = request.params;
      const workspace = await Workspace.get(`slug = '${slug}'`);

      if (!workspace) {
        response.sendStatus(400).end();
        return;
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
  });

  app.get("/workspaces", async (_, response) => {
    try {
      const workspaces = await Workspace.where();
      response.status(200).json({ workspaces });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/workspace/:slug", async (request, response) => {
    try {
      const { slug } = request.params;
      const workspace = await Workspace.get(`slug = '${slug}'`);
      response.status(200).json({ workspace });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });

  app.get("/workspace/:slug/chats", async (request, response) => {
    try {
      const { slug } = request.params;
      const workspace = await Workspace.get(`slug = '${slug}'`);
      if (!workspace) {
        response.sendStatus(400).end();
        return;
      }

      const history = await WorkspaceChats.forWorkspace(workspace.id);
      response.status(200).json({ history: convertToChatHistory(history) });
    } catch (e) {
      console.log(e.message, e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { workspaceEndpoints };
