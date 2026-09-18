import {
  CodeEvaluator,
  EvaluationResult,
  FixedInput,
  FixedTurn,
  RELAIEnvironment,
} from "@relai-ai/relai";

const request = "Summarize the RELAI evaluation goal in one concise response.";
const prefix = "Simulated workspace-agent response:";

export const environment = new RELAIEnvironment({
  id: "anythingllm-baseline-response",
  name: "anythingllm-baseline-response",
  description: "Checks that the workspace agent returns a baseline response.",
  tags: ["end-to-end", "baseline-response"],
  input: new FixedInput({ turns: [new FixedTurn(request)] }),
  evaluators: [
    new CodeEvaluator({
      id: "deterministic-workspace-response",
      name: "deterministic workspace response",
      description:
        "Verifies the deterministic workspace-agent response is present and preserves the request.",
      evaluate: (result) => {
        const output = result.finalOutput;
        const isNonEmptyString =
          typeof output === "string" && output.trim().length > 0;
        const hasPrefix = isNonEmptyString && output.startsWith(prefix);
        const includesRequest = isNonEmptyString && output.includes(request);

        if (isNonEmptyString && hasPrefix && includesRequest) {
          return new EvaluationResult({
            score: 1,
            feedback:
              "Passed: the assistant produced a non-empty deterministic response with the required prefix and original request.",
          });
        }

        const failures = [
          !isNonEmptyString ? "missing or empty assistant response" : null,
          isNonEmptyString && !hasPrefix
            ? `response does not begin with '${prefix}'`
            : null,
          isNonEmptyString && !includesRequest
            ? "response does not contain the original request"
            : null,
        ].filter((failure): failure is string => failure !== null);

        return new EvaluationResult({
          score: 0,
          feedback: `Failed: ${failures.join("; ")}. Observed: ${JSON.stringify(output)}.`,
        });
      },
    }),
  ],
});
