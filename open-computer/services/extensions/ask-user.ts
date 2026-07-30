import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "ask_user",
    label: "Ask User",
    description:
      "Send a question or message to the user and wait for their reply. " +
      "This is your ONLY channel to communicate with the user — they cannot see your text output. " +
      "Use this for ANY question: filenames, choices, preferences, clarifications, confirmations, progress updates that need a decision, etc. " +
      "The user will see a prompt in the UI and can type a response.",
    parameters: Type.Object({
      message: Type.String({
        description:
          "The question or message to show the user. Be specific and actionable. " +
          "If offering choices, list them clearly (e.g. '1. Option A  2. Option B  3. Option C').",
      }),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const response = await ctx.ui.input("Agent Question", params.message);

      if (!response || response === "") {
        return {
          content: [
            {
              type: "text",
              text: "The user dismissed the question without responding. Proceed with your best judgment or try a reasonable default.",
            },
          ],
          details: {},
        };
      }

      return {
        content: [{ type: "text", text: `User response: ${response}` }],
        details: {},
      };
    },
  });
}
