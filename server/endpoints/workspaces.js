const { reqBody } = require("../utils/http");
const { Workspace } = require("../models/workspace");
const { Document } = require("../models/documents");
const { DocumentVectors } = require("../models/vectors");
const { WorkspaceChats } = require("../models/workspaceChats");
const { convertToChatHistory } = require("../utils/chats");
const { getVectorDbClass } = require("../utils/helpers");

function workspaceEndpoints(app) {
  if (!app) return;

  app.post("/workspace/new", async (request, response) => {
    const { name = null } = reqBody(request);
    const { workspace, message } = await Workspace.new(name);
    response.status(200).json({ workspace, message });
  });

  app.post("/workspace/:slug/update-embeddings", async (request, response) => {
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
  });

  app.delete("/workspace/:slug", async (request, response) => {
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
  });

  app.get("/workspaces", async (_, response) => {
    const workspaces = await Workspace.where();
    response.status(200).json({ workspaces });
  });

  app.get("/workspace/:slug", async (request, response) => {
    const { slug } = request.params;
    const workspace = await Workspace.get(`slug = '${slug}'`);
    response.status(200).json({ workspace });
  });

  app.get("/workspace/:slug/chats", async (request, response) => {
    const { slug } = request.params;
    const workspace = await Workspace.get(`slug = '${slug}'`);
    if (!workspace) {
      response.sendStatus(400).end();
      return;
    }

    const history = await WorkspaceChats.forWorkspace(workspace.id);
    response.status(200).json({ history: convertToChatHistory(history) });
  });
}

module.exports = { workspaceEndpoints };
