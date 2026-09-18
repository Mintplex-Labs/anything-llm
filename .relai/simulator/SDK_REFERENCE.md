# RELAI TypeScript Simulator SDK Reference

Use this reference instead of reading RELAI SDK source while scaffolding a
TypeScript project simulator.

## Learning Environments

- Load a TypeScript learning environment with `loadLearningEnvironment(path)`.
- Agent environments use `FixedInput` or `PersonaInput`.
- Component environments use `new ComponentTarget({ module: "path.ts", exportName: "exportName" })`
  plus `new FixedComponentInput({ args: [...] })`,
  `new FixedComponentInput({ input: { ... } })`, or
  `new GeneratedComponentInput({ instructions, model, mode: "args" | "input" })`.
  Generated calls must produce `{ args: [...] }` for `mode: "args"` or
  `{ input: { ... } }` for `mode: "input"`.
- Every `RELAIEnvironment`, `CodeEvaluator`, and `LLMJudgeEvaluator` needs a
  short `description`.

## Runner And Adapter Contract

Implement `.relai/simulator/src/relai_simulator/adapter.ts`.

`buildAgentAdapter(options)` must return an object with:

- `capabilities`: a set containing `run_turn` and any behaviorally verified
  optional capabilities: `named_targets`, `tool_overrides`, `tool_events`, or
  `run_component`.
- `runTurn(userInput, runtime)`: sync or async method. `userInput` is the
  JSON-serializable fixed-turn content value. It may be a string, object, array,
  number, boolean, or null.

When a learning environment uses `new AgentTarget({ agentTarget: "support" })`,
the runner calls `buildAgentAdapter({ agentTarget: "support", runtime })`. Use that
optional selector to construct the appropriate logical agent from a shared
runtime. Environments without an `agentTarget` omit that field.

The runner supplies `options.runtime` and also passes it to each turn. Named
tool replacements are available through `runtime.toolOverrides`. Prefer
construction-time injection and call
`await runtime.invokeToolOverride(name, input, context)` from generated wrappers.
Any after-construction replacement belongs in the project adapter. Adapters
declaring optional capabilities must implement `selfCheck(runtime)` and return
`{ capability: true }` only after a behavioral check succeeds. Keep the check
deterministic and local: use sentinels or RELAI overrides, without provider
calls, credentials, or project mutations.

Use `inspect_dependency` to resolve installed packages and inspect bounded
declarations or source for the exact version. Do not infer integration behavior
from a framework name.

`runTurn` may return:

- `new AgentTurnResult({ assistantMessage, metadata, toolCalls, toolResults })`
- a plain string
- an object with `assistantMessage`, `assistant_message`, `finalOutput`, or
  `final_output`

## Init Smoke Validation

Write `.relai/simulator/smoke_learning_env.ts` as a minimal
`RELAIEnvironment` that runs one representative, project-valid fixed turn
through the generated adapter. Use the same public input shape that normal
learning environments should use.

## Dependency Edits

Do not manually add `@relai-ai/relai` registry or local-path logic. The CLI owns
RELAI SDK installation in `.relai/package.json` so both simulator files and
`.relai/learning-envs/*.ts` can import `@relai-ai/relai`. The CLI also installs
the root project's declared dependencies with its existing package manager and
runs its `build` script when present. If the project needs extra setup beyond
that baseline, edit only the `BEGIN PROJECT DEPENDENCY INSTALL` section of
`.relai/simulator/install.sh`. Do not replace the CLI-owned root install or
build blocks.
