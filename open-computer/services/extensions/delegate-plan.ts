import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";

export default function (pi: ExtensionAPI) {
  pi.registerTool({
    name: "propose_delegation",
    label: "Propose Delegation",
    description:
      "Submit a sequential list of focused child-agent work units. " +
      "This is the only tool available in delegation planning mode. " +
      "Do not execute the task or perform desktop/browser/filesystem actions.",
    parameters: Type.Object({
      title: Type.String({
        description: "Short title for the delegated run.",
      }),
      reason: Type.String({
        description: "Brief reason this task benefits from sequential child agents.",
      }),
      units: Type.Array(
        Type.Object({
          id: Type.Optional(Type.String({
            description: "Stable short id for this work unit, e.g. scout-1.",
          })),
          title: Type.String({
            description: "Short label shown in the UI.",
          }),
          role: Type.String({
            description: "Focused role such as scout, researcher, worker, reviewer, or synthesizer.",
          }),
          objective: Type.String({
            description: "The concrete subtask for the child agent.",
          }),
          allowed_tools: Type.Optional(Type.Array(Type.String(), {
            description: "Optional tool names or categories the child is expected to use.",
            maxItems: 8,
          })),
          expected_output: Type.String({
            description: "The specific text/artifact handoff expected from the child.",
          }),
          depends_on: Type.Optional(Type.Array(Type.String(), {
            description: "Optional ids this unit depends on. Keep sequential ordering simple.",
            maxItems: 5,
          })),
          requires_user_approval: Type.Optional(Type.Boolean({
            description: "True only if this unit should pause for user approval before running.",
          })),
        }),
        {
          description: "Sequential child-agent work units.",
          minItems: 1,
          maxItems: 8,
        },
      ),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, _ctx) {
      const payload = {
        title: String(params.title || "Delegated Run").trim(),
        reason: String(params.reason || "").trim(),
        units: Array.isArray(params.units)
          ? params.units.map((unit: any, idx: number) => ({
              id: String(unit.id || `step-${idx + 1}`).trim(),
              title: String(unit.title || `Step ${idx + 1}`).trim(),
              role: String(unit.role || "worker").trim(),
              objective: String(unit.objective || "").trim(),
              allowed_tools: Array.isArray(unit.allowed_tools)
                ? unit.allowed_tools.map((tool: string) => String(tool || "").trim()).filter(Boolean)
                : [],
              expected_output: String(unit.expected_output || "").trim(),
              depends_on: Array.isArray(unit.depends_on)
                ? unit.depends_on.map((dep: string) => String(dep || "").trim()).filter(Boolean)
                : [],
              requires_user_approval: unit.requires_user_approval === true,
            })).filter((unit: any) => unit.objective)
          : [],
      };

      return {
        content: [{ type: "text", text: JSON.stringify(payload) }],
        details: payload,
      };
    },
  });
}
