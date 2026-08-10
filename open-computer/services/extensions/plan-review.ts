import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "propose_plan",
    label: "Propose Plan",
    description:
      "Submit a structured execution plan for user review. " +
      "This is the only planning tool available in planning mode. " +
      "Do not perform desktop, browser, filesystem, or native app actions.",
    parameters: Type.Object({
      title: Type.String({
        description: "Short title for the plan, usually 3-8 words.",
      }),
      reason: Type.String({
        description: "Brief reason this task needs a plan before execution.",
      }),
      items: Type.Array(
        Type.String({
          description: "One editable plan item. Keep each item concrete and action-oriented.",
        }),
        {
          description: "Plan items to show the user for editing and approval.",
          minItems: 1,
          maxItems: 8,
        },
      ),
      questions: Type.Optional(
        Type.Array(
          Type.String({
            description: "Optional clarification question that may affect the workflow or output.",
          }),
          {
            description:
              "Questions for the user, only when the plan cannot safely proceed without the answer.",
            maxItems: 3,
          },
        ),
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const payload = {
        title: String(params.title || "Execution Plan").trim(),
        reason: String(params.reason || "").trim(),
        items: Array.isArray(params.items)
          ? params.items.map((item: string) => String(item || "").trim()).filter(Boolean)
          : [],
        questions: Array.isArray(params.questions)
          ? params.questions.map((q: string) => String(q || "").trim()).filter(Boolean)
          : [],
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(payload),
          },
        ],
        details: payload,
      };
    },
  });
}
