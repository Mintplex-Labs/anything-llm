const { Workspace } = require("../../../models/workspace");
const { fileData } = require("../../../utils/files");
const { reqBody } = require("../../../utils/http");
const prisma = require("../../../utils/prisma");

/**
 *
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @returns
 */
async function handleMobileCommand(request, response) {
  const { command } = request.params;
  const body = reqBody(request);

  if (command === "get-workspaces") {
    const workspaces = await Workspace.where({});
    for (const workspace of workspaces) {
      const [threadCount, chatCount, documentCount] = await Promise.all([
        prisma.workspace_threads.count({
          where: { workspace_id: workspace.id },
        }),
        prisma.workspace_chats.count({
          where: { workspaceId: workspace.id, include: true },
        }),
        prisma.workspace_documents.count({
          where: { workspaceId: workspace.id },
        }),
      ]);
      workspace.threadCount = threadCount;
      workspace.chatCount = chatCount;
      workspace.documentCount = documentCount;
    }
    return response.status(200).json({ workspaces });
  }

  if (command === "pull-workspace-content") {
    const threads = [
      {
        id: 0,
        name: "Default Thread",
        slug: "default-thread",
        workspace_id: body.workspaceId,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      },
      ...(await prisma.workspace_threads.findMany({
        where: { workspace_id: body.workspaceId },
      })),
    ];
    const chats = (
      await prisma.workspace_chats.findMany({
        where: { workspaceId: body.workspaceId, include: true },
      })
    ).map((chat) => ({
      ...chat,
      // Create a dummy thread_id for the default thread so the chats can be mapped correctly.
      ...(chat.thread_id === null ? { thread_id: 0 } : {}),
      createdAt: chat.createdAt.toISOString(),
      lastUpdatedAt: chat.lastUpdatedAt.toISOString(),
    }));

    const documents = await prisma.workspace_documents.findMany({
      where: { workspaceId: body.workspaceId },
    });
    for (const document of documents)
      document.pageContent = (await fileData(document.docpath)).pageContent;
    return response.status(200).json({ threads, chats, documents });
  }

  return response.status(400).json({ error: "Invalid command" });
}

module.exports = {
  handleMobileCommand,
};
