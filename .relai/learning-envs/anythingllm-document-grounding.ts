import {
  CodeEvaluator,
  EvaluationResult,
  FixedInput,
  FixedTurn,
  RELAIEnvironment,
} from "@relai-ai/relai";

const launchPrompt =
  "According only to the indexed documents, when is Project Meridian scheduled to launch? State the date and cite the document title.";
const archivePrompt =
  "Quote the exact sentence in the indexed documents about the north archive. Do not paraphrase it, and cite the document title.";
const budgetPrompt =
  "According only to the indexed documents, what is Project Meridian’s approved budget? If the documents do not state it, say so plainly and do not guess.";

export const environment = new RELAIEnvironment({
  id: "anythingllm-document-grounding",
  name: "anythingllm-document-grounding",
  description:
    "Verifies document-grounded answers about Project Meridian and the north archive.",
  tags: ["end-to-end", "document-grounding"],
  input: new FixedInput({
    turns: [
      new FixedTurn({
        kind: "anythingllm-rag",
        mode: "query",
        prompt: launchPrompt,
      }),
      new FixedTurn({
        kind: "anythingllm-rag",
        mode: "query",
        prompt: archivePrompt,
      }),
      new FixedTurn({
        kind: "anythingllm-rag",
        mode: "query",
        prompt: budgetPrompt,
      }),
    ],
  }),
  evaluators: [
    new CodeEvaluator({
      id: "document-grounding-canary",
      name: "document grounding canary",
      description:
        "Checks the requested grounded answers and retrieval-source metadata for all turns.",
      evaluate: (result) => {
        const agentMessages = result.events.filter(
          (event) => event.eventType === "agent_message",
        );
        const byTurn = new Map(
          agentMessages.map((event) => [event.turnIndex, event]),
        );
        const contentFor = (turnIndex: number): string => {
          const content = byTurn.get(turnIndex)?.data.content;
          return typeof content === "string" ? content : "";
        };

        const launchPassed = contentFor(0).includes("October 17, 2037");
        const archivePassed = contentFor(1).includes(
          "The north archive closes at violet dusk.",
        );
        const budgetOutput = contentFor(2);
        const budgetPassed =
          /budget/i.test(budgetOutput) &&
          /do(?:es)? not (?:state|specify)|not (?:stated|specified)|(?:is )?unstated|(?:is )?unspecified|no .{0,40}budget/i.test(
            budgetOutput,
          );
        const sourcesPassed =
          agentMessages.length === 3 &&
          agentMessages.every((event) => {
            const sourceCount = event.data.source_count;
            const sourceTitles = event.data.source_titles;
            return (
              typeof sourceCount === "number" &&
              sourceCount >= 1 &&
              Array.isArray(sourceTitles) &&
              sourceTitles.includes("relai-grounding-canary.txt")
            );
          });

        const criteria = [launchPassed, archivePassed, budgetPassed, sourcesPassed];
        const score = criteria.filter(Boolean).length / criteria.length;
        const failures = [
          !launchPassed
            ? `turn 0 missing 'October 17, 2037' (observed ${JSON.stringify(contentFor(0))})`
            : null,
          !archivePassed
            ? `turn 1 missing the exact north-archive sentence (observed ${JSON.stringify(contentFor(1))})`
            : null,
          !budgetPassed
            ? `turn 2 does not plainly state that the budget is not stated or specified (observed ${JSON.stringify(contentFor(2))})`
            : null,
          !sourcesPassed
            ? `source metadata invalid: expected three agent_message events, each with source_count >= 1 and source_titles including relai-grounding-canary.txt; observed ${JSON.stringify(agentMessages.map((event) => ({ turnIndex: event.turnIndex, source_count: event.data.source_count, source_titles: event.data.source_titles })))} `
            : null,
        ].filter((failure): failure is string => failure !== null);

        return new EvaluationResult({
          score,
          feedback:
            failures.length === 0
              ? "Passed: all three document-grounded answers and source metadata requirements were satisfied."
              : `Failed ${failures.length} of 4 criteria: ${failures.join("; ")}.`,
        });
      },
    }),
  ],
});
