// Helpers that convert workspace chats to some supported format
// for external use by the user.

const { WorkspaceChats } = require("../../../models/workspaceChats");
const { EmbedChats } = require("../../../models/embedChats");
const { safeJsonParse } = require("../../http");

async function convertToCSV(preparedData) {
  const headers = new Set(["id", "workspace", "prompt", "response", "sent_at"]);
  preparedData.forEach((item) =>
    Object.keys(item).forEach((key) => headers.add(key))
  );

  const rows = [Array.from(headers).join(",")];

  for (const item of preparedData) {
    const record = Array.from(headers)
      .map((header) => {
        const value = item[header] ?? "";
        return escapeCsv(String(value));
      })
      .join(",");
    rows.push(record);
  }
  return rows.join("\n");
}

async function convertToJSON(preparedData) {
  return JSON.stringify(preparedData, null, 4);
}

// ref: https://raw.githubusercontent.com/gururise/AlpacaDataCleaned/main/alpaca_data.json
async function convertToJSONAlpaca(preparedData) {
  return JSON.stringify(preparedData, null, 4);
}

async function convertToJSONL(workspaceChatsMap) {
  return Object.values(workspaceChatsMap)
    .map((workspaceChats) => JSON.stringify(workspaceChats))
    .join("\n");
}

async function prepareChatsForExport(format = "jsonl", chatType = "workspace") {
  if (!exportMap.hasOwnProperty(format))
    throw new Error(`Invalid export type: ${format}`);

  let chats;
  if (chatType === "workspace") {
    chats = await WorkspaceChats.whereWithData({}, null, null, {
      id: "asc",
    });
  } else if (chatType === "embed") {
    chats = await EmbedChats.whereWithEmbedAndWorkspace(
      {},
      null,
      {
        id: "asc",
      },
      null
    );
  } else {
    throw new Error(`Invalid chat type: ${chatType}`);
  }

  if (format === "csv" || format === "json") {
    const preparedData = chats.map((chat) => {
      const responseJson = JSON.parse(chat.response);
      const baseData = {
        id: chat.id,
        prompt: chat.prompt,
        response: responseJson.text,
        sent_at: chat.createdAt,
      };

      if (chatType === "embed") {
        return {
          ...baseData,
          workspace: chat.embed_config
            ? chat.embed_config.workspace.name
            : "unknown workspace",
        };
      }

      return {
        ...baseData,
        workspace: chat.workspace ? chat.workspace.name : "unknown workspace",
        username: chat.user
          ? chat.user.username
          : chat.api_session_id !== null
            ? "API"
            : "unknown user",
        rating:
          chat.feedbackScore === null
            ? "--"
            : chat.feedbackScore
              ? "GOOD"
              : "BAD",
      };
    });

    return preparedData;
  }

  if (format === "jsonAlpaca") {
    const preparedData = chats.map((chat) => {
      const responseJson = JSON.parse(chat.response);
      return {
        instruction: buildSystemPrompt(
          chat,
          chat.workspace ? chat.workspace.openAiPrompt : null
        ),
        input: chat.prompt,
        output: responseJson.text,
      };
    });

    return preparedData;
  }

  const workspaceChatsMap = chats.reduce((acc, chat) => {
    const { prompt, response, workspaceId } = chat;
    const responseJson = JSON.parse(response);

    if (!acc[workspaceId]) {
      acc[workspaceId] = {
        messages: [
          {
            role: "system",
            content:
              chat.workspace?.openAiPrompt ||
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
  jsonAlpaca: {
    contentType: "application/json",
    func: convertToJSONAlpaca,
  },
};

function escapeCsv(str) {
  if (str === null || str === undefined) return '""';
  return `"${str.replace(/"/g, '""').replace(/\n/g, " ")}"`;
}

async function exportChatsAsType(format = "jsonl", chatType = "workspace") {
  const { contentType, func } = exportMap.hasOwnProperty(format)
    ? exportMap[format]
    : exportMap.jsonl;
  const chats = await prepareChatsForExport(format, chatType);
  return {
    contentType,
    data: await func(chats),
  };
}

const STANDARD_PROMPT =
  "Given the following conversation, relevant context, and a follow up question, reply with an answer to the current question the user is asking. Return only your response to the question given the above information following the users instructions as needed.";
function buildSystemPrompt(chat, prompt = null) {
  const sources = safeJsonParse(chat.response)?.sources || [];
  const contextTexts = sources.map((source) => source.text);
  const context =
    sources.length > 0
      ? "\nContext:\n" +
        contextTexts
          .map((text, i) => {
            return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
          })
          .join("")
      : "";
  return `${prompt ?? STANDARD_PROMPT}${context}`;
}

module.exports = {
  prepareChatsForExport,
  exportChatsAsType,
};
