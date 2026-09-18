import { createRequire } from "node:module";
import {
  AgentTurnResult,
  type AdapterRuntime,
  type AgentAdapter,
  type AgentAdapterBuildOptions,
} from "./adapter_contract.js";

const require = createRequire(import.meta.url);

type AIbitatSession = {
  agent(name: string, definition: Record<string, unknown>): AIbitatSession;
  start(message: { from: string; to: string; content: string }): Promise<unknown>;
  chats: Array<{ from?: string; content?: unknown }>;
};

type AIbitatConstructor = new (props: {
  provider: unknown;
  model: string;
  maxRounds: number;
  chats: unknown[];
}) => AIbitatSession;

/**
 * Locally injected provider that exercises AIbitat's production agent loop
 * without contacting a configured AnythingLLM provider.
 */
class LocalSimulationProvider {
  readonly supportsAgentStreaming = false;

  attachHandlerProps(): void {}
  attachAbortSignal(): void {}
  resetCumulativeUsage(): void {}
  getCumulativeUsage(): Record<string, number> {
    return {};
  }

  async complete(messages: Array<{ role?: string; content?: unknown }>) {
    const prompt = [...messages]
      .reverse()
      .find((message) => message.role === "user")?.content;
    return {
      functionCall: null,
      textResponse: `Simulated workspace-agent response: ${String(prompt ?? "")}`,
    };
  }
}

class ProjectAgentAdapter implements AgentAdapter {
  readonly capabilities = new Set(["run_turn"] as const);

  async runTurn(
    userInput: unknown,
    _runtime: AdapterRuntime,
  ): Promise<AgentTurnResult> {
    if (typeof userInput !== "string") {
      throw new TypeError(
        "AnythingLLM workspace-agent simulator turns must be strings.",
      );
    }

    // AgentHandler creates this custom runtime after loading workspace-specific
    // database state. Invoke its underlying public session API with a local,
    // deterministic provider instead of constructing persistent application state.
    // AnythingLLM 1.16 includes a transitive legacy JWT package that expects
    // Buffer.SlowBuffer, which Node 26 no longer exports. Restore its old alias
    // before the project runtime is loaded; this does not alter agent behavior.
    const nodeBuffer = require("node:buffer") as {
      Buffer: unknown;
      SlowBuffer?: unknown;
    };
    nodeBuffer.SlowBuffer ??= nodeBuffer.Buffer;
    const AIbitat = require(
      "../../../../server/utils/agents/aibitat/index.js",
    ) as AIbitatConstructor;
    const session = new AIbitat({
      provider: "openai",
      model: "relai-local-simulation",
      maxRounds: 1,
      chats: [],
    });
    // AIbitat reserves its public `provider` property for a provider slug,
    // while its reply path accepts a provider instance in defaultProvider.
    (session as AIbitatSession & { defaultProvider: { provider: unknown } }).defaultProvider.provider =
      new LocalSimulationProvider();
    session.agent("USER", { interrupt: "ALWAYS" });
    session.agent("@agent", {
      role: "You are the AnythingLLM workspace agent.",
      functions: [],
    });
    await session.start({ from: "USER", to: "@agent", content: userInput });
    const reply = [...session.chats]
      .reverse()
      .find((message) => message.from === "@agent")?.content;
    return new AgentTurnResult({
      assistantMessage: reply == null ? null : String(reply),
      metadata: { simulation_provider: "local" },
    });
  }
}

export function buildAgentAdapter(
  options: AgentAdapterBuildOptions,
): AgentAdapter {
  if (options.agentTarget) {
    throw new Error("AnythingLLM does not expose named logical agent targets.");
  }
  return new ProjectAgentAdapter();
}
