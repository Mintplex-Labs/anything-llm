const { WorkspaceChats } = require("../../../../models/workspaceChats");

/**
 * Plugin to save chat history to AnythingLLM DB.
 */
const chatHistory = {
  name: "chat-history",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup: function (aibitat) {
        aibitat.onMessage(async () => {
          try {
            const lastResponses = aibitat.chats.slice(-2);
            if (lastResponses.length !== 2) return;
            const [prev, last] = lastResponses;

            // We need a full conversation reply with prev being from
            // the USER and the last being from anyone other than the user.
            if (prev.from !== "USER" || last.from === "USER") return;
            await this._store(aibitat, {
              prompt: prev.content,
              response: last.content,
            });
          } catch {}
        });
      },
      _store: async function (aibitat, { prompt, response } = {}) {
        const invocation = aibitat.handlerProps.invocation;
        await WorkspaceChats.new({
          workspaceId: Number(invocation.workspace_id),
          prompt,
          response: {
            text: response,
            sources: [],
            type: "chat",
          },
          user: { id: invocation?.user_id || null },
          threadId: invocation?.thread_id || null,
        });
      },
    };
  },
};

module.exports = { chatHistory };
