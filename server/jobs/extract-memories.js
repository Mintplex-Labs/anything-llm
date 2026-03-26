const { log, conclude } = require("./helpers/index.js");
const { SystemSettings } = require("../models/systemSettings.js");
const { Memory } = require("../models/memory.js");
const { WorkspaceChats } = require("../models/workspaceChats.js");
const { Workspace } = require("../models/workspace.js");
const { getLLMProvider } = require("../utils/helpers/index.js");
const { safeJsonParse } = require("../utils/http/index.js");

const IDLE_THRESHOLD_MS = 20 * 60 * 1000; // 20 minutes

const EXTRACTION_SYSTEM_PROMPT = `You are a memory extraction system for a personalized AI assistant. You manage a list of memories about the user that will be injected into future conversations to provide personalized responses.

Instructions:
- Review the conversations and extract any useful facts, preferences, or context about the user
- Return an updated list of memories (max 20) that combines existing memories with any new information
- If new information contradicts an old memory, keep only the updated version
- If an existing memory is still relevant, keep it
- Each memory should be a single, concise statement (1 sentence max)
- Focus on: names, preferences, projects, deadlines, relationships, expertise, communication style
- Skip small talk, pleasantries, and anything not useful for future personalization
- If nothing worth remembering was said, return the existing memories unchanged

Respond with ONLY a JSON array of strings. No other text.
Example: ["User's name is Sarah", "User prefers Python over JavaScript", "User works on the Phoenix project"]`;

function buildExtractionUserMessage(currentMemories, chats) {
  const memoriesList =
    currentMemories.length > 0
      ? currentMemories.map((m, i) => `${i + 1}. ${m.content}`).join("\n")
      : "None yet.";

  const formattedChats = chats
    .map((chat) => {
      const lines = [`User: ${chat.prompt}`];
      const parsed = safeJsonParse(chat.response);
      if (parsed?.text) lines.push(`Assistant: ${parsed.text}`);
      return lines.join("\n");
    })
    .join("\n\n");

  return `Current memories for this workspace:\n${memoriesList}\n\nRecent conversations:\n${formattedChats}`;
}

function parseMemoriesResponse(text) {
  const filterStrings = (arr) =>
    Array.isArray(arr)
      ? arr.filter((m) => typeof m === "string" && m.trim().length > 0)
      : null;

  const parsed = safeJsonParse(text.trim());
  if (parsed) return filterStrings(parsed);

  // Try to extract JSON array from the response if wrapped in other text
  const match = text.match(/\[[\s\S]*\]/);
  if (match) return filterStrings(safeJsonParse(match[0]));

  return null;
}

(async () => {
  try {
    const enabled = await SystemSettings.getValueOrFallback(
      { label: "memory_enabled" },
      "off"
    );
    if (enabled !== "on") {
      log("Memory extraction is disabled. Exiting.");
      return;
    }

    const lastChat = await WorkspaceChats.get(
      {},
      null,
      { createdAt: "desc" }
    );
    if (lastChat) {
      const msSinceLastChat =
        Date.now() - new Date(lastChat.createdAt).getTime();
      if (msSinceLastChat < IDLE_THRESHOLD_MS) {
        log("User is still active. Skipping extraction.");
        return;
      }
    }

    const unprocessedPairs = await WorkspaceChats.unprocessedMemoryGroups();
    if (unprocessedPairs.length === 0) {
      log("No unprocessed chats found. Exiting.");
      return;
    }

    log(
      `Found ${unprocessedPairs.length} user/workspace pair(s) with unprocessed chats.`
    );

    for (const { user_id: userId, workspaceId } of unprocessedPairs) {
      try {
        const unprocessedChats = await WorkspaceChats.where(
          { user_id: userId, workspaceId, memoryProcessed: false },
          null,
          { createdAt: "asc" }
        );
        if (unprocessedChats.length === 0) continue;

        const workspace = await Workspace.get({ id: workspaceId });
        if (!workspace) {
          log(`Workspace ${workspaceId} not found. Skipping.`);
          continue;
        }

        const currentMemories = await Memory.forUserWorkspace(
          userId,
          workspaceId
        );

        const userMessage = buildExtractionUserMessage(
          currentMemories,
          unprocessedChats
        );

        const LLMConnector = getLLMProvider({
          provider: workspace.chatProvider,
          model: workspace.chatModel,
        });

        const { textResponse } = await LLMConnector.getChatCompletion(
          [
            { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
            { role: "user", content: userMessage },
          ],
          { temperature: 0.2 }
        );

        const memories = parseMemoriesResponse(textResponse);
        if (!memories) {
          log(
            `Failed to parse LLM response for user ${userId}, workspace ${workspaceId}. Skipping.`
          );
          continue;
        }

        await Memory.replaceWorkspaceMemories(userId, workspaceId, memories);

        const chatIds = unprocessedChats.map((c) => c.id);
        await WorkspaceChats.markMemoryProcessed(chatIds);

        log(
          `Extracted ${memories.length} memories for user ${userId} in workspace "${workspace.name}". Processed ${chatIds.length} chats.`
        );
      } catch (pairError) {
        log(
          `Error processing user ${userId}, workspace ${workspaceId}: ${pairError.message}`
        );
      }
    }

    log("Memory extraction complete.");
  } catch (e) {
    console.error(e);
    log(`errored with ${e.message}`);
  } finally {
    conclude();
  }
})();
