// Helpers that convert workspace chats to some supported format
// for external use by the user.

const { Workspace } = require("../../../models/workspace");
const { WorkspaceChats } = require("../../../models/workspaceChats");

// Todo: make this more useful for export by adding other columns about workspace, user, time, etc for post-filtering.
async function convertToCSV(workspaceChatsMap) {
  const rows = ["role,content"];
  for (const workspaceChats of Object.values(workspaceChatsMap)) {
    for (const message of workspaceChats.messages) {
      // Escape double quotes and wrap content in double quotes
      const escapedContent = `"${message.content
        .replace(/"/g, '""')
        .replace(/\n/g, " ")}"`;
      rows.push(`${message.role},${escapedContent}`);
    }
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

async function prepareWorkspaceChatsForExport() {
  const chats = await WorkspaceChats.whereWithData({}, null, null, {
    id: "asc",
  });
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
