const { Workspace } = require("../../../models/workspace");
const { WorkspaceChats } = require("../../../models/workspaceChats");
const { WorkspaceThread } = require("../../../models/workspaceThread");
const { ApiChatHandler } = require("../../../utils/chats/apiChatHandler");
const { reqBody } = require("../../../utils/http");
const prisma = require("../../../utils/prisma");
const { getModelTag } = require("../../utils");
const { MobileDevice } = require("../../../models/mobileDevice");

/**
 *
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @returns
 */
async function handleMobileCommand(request, response) {
  const { command } = request.params;
  const user = response.locals.user ?? null;
  const body = reqBody(request);

  if (command === "workspaces") {
    const workspaces = user
      ? await Workspace.whereWithUser(user, {})
      : await Workspace.where({});
    for (const workspace of workspaces) {
      const [threadCount, chatCount] = await Promise.all([
        prisma.workspace_threads.count({
          where: {
            workspace_id: workspace.id,
            ...(user ? { user_id: user.id } : {}),
          },
        }),
        prisma.workspace_chats.count({
          where: {
            workspaceId: workspace.id,
            include: true,
            ...(user ? { user_id: user.id } : {}),
          },
        }),
      ]);
      workspace.threadCount = threadCount;
      workspace.chatCount = chatCount;
      workspace.platform = MobileDevice.platform;
    }
    return response.status(200).json({ workspaces });
  }

  if (command === "workspace-content") {
    const workspace = user
      ? await Workspace.getWithUser(user, { slug: String(body.workspaceSlug) })
      : await Workspace.get({ slug: String(body.workspaceSlug) });

    if (!workspace)
      return response.status(400).json({ error: "Workspace not found" });
    const threads = [
      {
        id: 0,
        name: "Default Thread",
        slug: "default-thread",
        workspace_id: workspace.id,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      },
      ...(await prisma.workspace_threads.findMany({
        where: {
          workspace_id: workspace.id,
          ...(user ? { user_id: user.id } : {}),
        },
      })),
    ];
    const chats = (
      await prisma.workspace_chats.findMany({
        where: {
          workspaceId: workspace.id,
          include: true,
          ...(user ? { user_id: user.id } : {}),
        },
      })
    ).map((chat) => ({
      ...chat,
      // Create a dummy thread_id for the default thread so the chats can be mapped correctly.
      ...(chat.thread_id === null ? { thread_id: 0 } : {}),
      createdAt: chat.createdAt.toISOString(),
      lastUpdatedAt: chat.lastUpdatedAt.toISOString(),
    }));
    return response.status(200).json({ threads, chats });
  }

  // Get the model for this workspace (workspace -> system)
  if (command === "model-tag") {
    const { workspaceSlug } = body;
    const workspace = user
      ? await Workspace.getWithUser(user, { slug: String(workspaceSlug) })
      : await Workspace.get({ slug: String(workspaceSlug) });

    if (!workspace)
      return response.status(400).json({ error: "Workspace not found" });
    if (workspace.chatModel)
      return response.status(200).json({ model: workspace.chatModel });
    else return response.status(200).json({ model: getModelTag() });
  }

  if (command === "reset-chat") {
    const { workspaceSlug, threadSlug } = body;
    const workspace = user
      ? await Workspace.getWithUser(user, { slug: String(workspaceSlug) })
      : await Workspace.get({ slug: String(workspaceSlug) });

    if (!workspace)
      return response.status(400).json({ error: "Workspace not found" });
    const threadId = threadSlug
      ? await prisma.workspace_threads.findFirst({
          where: {
            workspace_id: workspace.id,
            slug: String(threadSlug),
            ...(user ? { user_id: user.id } : {}),
          },
        })?.id
      : null;

    await WorkspaceChats.markThreadHistoryInvalidV2({
      workspaceId: workspace.id,
      ...(user ? { user_id: user.id } : {}),
      thread_id: threadId, // if threadId is null, this will reset the default thread.
    });
    return response.status(200).json({ success: true });
  }

  if (command === "new-thread") {
    const { workspaceSlug } = body;
    const workspace = user
      ? await Workspace.getWithUser(user, { slug: String(workspaceSlug) })
      : await Workspace.get({ slug: String(workspaceSlug) });

    if (!workspace)
      return response.status(400).json({ error: "Workspace not found" });
    const { thread } = await WorkspaceThread.new(workspace, user?.id);
    return response.status(200).json({ thread });
  }

  if (command === "stream-chat") {
    const { workspaceSlug = null, threadSlug = null, message } = body;
    if (!workspaceSlug)
      return response.status(400).json({ error: "Workspace ID is required" });
    else if (!message)
      return response.status(400).json({ error: "Message is required" });

    const workspace = user
      ? await Workspace.getWithUser(user, { slug: String(workspaceSlug) })
      : await Workspace.get({ slug: String(workspaceSlug) });

    if (!workspace)
      return response.status(400).json({ error: "Workspace not found" });
    const thread = threadSlug
      ? await prisma.workspace_threads.findFirst({
          where: {
            workspace_id: workspace.id,
            slug: String(threadSlug),
            ...(user ? { user_id: user.id } : {}),
          },
        })
      : null;

    response.setHeader("Cache-Control", "no-cache");
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Connection", "keep-alive");
    response.flushHeaders();
    await ApiChatHandler.streamChat({
      response,
      workspace,
      thread,
      message,
      mode: "chat",
      user: user,
      sessionId: null,
      attachments: [],
      reset: false,
    });
    return response.end();
  }

  if (command === "unregister-device") {
    if (!response.locals.device)
      return response.status(200).json({ success: true });
    await MobileDevice.delete(response.locals.device.id);
    return response.status(200).json({ success: true });
  }

  return response.status(400).json({ error: "Invalid command" });
}

module.exports = {
  handleMobileCommand,
};
