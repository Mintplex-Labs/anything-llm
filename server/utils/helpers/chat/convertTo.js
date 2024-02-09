// Helpers that convert workspace chats to some supported format
// for external use by the user.

const { Workspace } = require("../../../models/workspace");
const { WorkspaceChats } = require("../../../models/workspaceChats");

// Todo: make this more useful for export by adding other columns about workspace, user, time, etc for post-filtering.
async function convertToCSV(preparedData) {
  const rows = ["id,username,workspace,prompt,response,sent_at"];
  for (const item of preparedData) {
    // Escape double quotes and wrap content in double quotes
    const escapedPrompt = `"${item.prompt
      .replace(/"/g, '""')
      .replace(/\n/g, " ")}"`;
    const escapedResponse = `"${item.response
      .replace(/"/g, '""')
      .replace(/\n/g, " ")}"`;
    const row = `"${item.id}","${item.username}","${item.workspace}",${escapedPrompt},${escapedResponse},"${item.sent_at}"`;
    rows.push(row);
  }
  return rows.join("\n");
}

async function convertToJSON(workspaceChatsMap) {
  const allMessages = [].concat.apply(
    [],
    Object.values(workspaceChatsMap).map((workspace) => workspace.messages)
  );
  return JSON.stringify(allMessages);
}

async function convertToJSONL(workspaceChatsMap) {
  return Object.values(workspaceChatsMap)
    .map((workspaceChats) => JSON.stringify(workspaceChats))
    .join("\n");
}

async function prepareWorkspaceChatsForExport(type = "jsonl") {
  const chats = await WorkspaceChats.whereWithData({}, null, null, {
    id: "asc",
  });

  if (type === "csv") {
    const preparedData = chats.map((chat) => {
      const responseJson = JSON.parse(chat.response);
      return {
        id: chat.id,
        username: chat.user ? chat.user.username : "unknown user",
        workspace: chat.workspace ? chat.workspace.name : "unknown workspace",
        prompt: chat.prompt,
        response: responseJson.text,
        sent_at: chat.createdAt,
      };
    });

    return preparedData;
  }

  const workspaceIds = [...new Set(chats.map((chat) => chat.workspaceId))];

  const workspacesWithPrompts = await Promise.all(
    workspaceIds.map((id) => Workspace.get({ id: Number(id) }))
  );

  const workspacePromptsMap = workspacesWithPrompts.reduce((acc, workspace) => {
    acc[workspace.id] = workspace.openAiPrompt;
    return acc;
  }, {});

  const workspaceChatsMap = chats.reduce((acc, chat) => {
    const { prompt, response, workspaceId } = chat;
    const responseJson = JSON.parse(response);

    if (!acc[workspaceId]) {
      acc[workspaceId] = {
        messages: [
          {
            role: "system",
            content:
              workspacePromptsMap[workspaceId] ||
              "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.",
          },
        ],
      };
    }

    acc[workspaceId].messages.push(
      {
        role: "user",
        content: prompt,
      },
      {
        role: "assistant",
        content: responseJson.text,
      }
    );

    return acc;
  }, {});

  return workspaceChatsMap;
}

const exportMap = {
  json: {
    contentType: "application/json",
    func: convertToJSON,
  },
  csv: {
    contentType: "text/csv",
    func: convertToCSV,
  },
  jsonl: {
    contentType: "application/jsonl",
    func: convertToJSONL,
  },
};

async function exportChatsAsType(workspaceChatsMap, format = "jsonl") {
  const { contentType, func } = exportMap.hasOwnProperty(format)
    ? exportMap[format]
    : exportMap.jsonl;
  return {
    contentType,
    data: await func(workspaceChatsMap),
  };
}

module.exports = {
  prepareWorkspaceChatsForExport,
  exportChatsAsType,
};
