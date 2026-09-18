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

type AnythingLLMLiveInput = {
  kind: "anythingllm-rag";
  prompt: string;
  mode?: "automatic" | "chat" | "query";
  workspaceSlug?: string;
};

type AnythingLLMChatResponse = {
  error?: string | null;
  sources?: Array<{ title?: unknown }>;
  textResponse?: unknown;
  type?: unknown;
};

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
    if (isAnythingLLMLiveInput(userInput)) {
      return runAnythingLLMLiveTurn(userInput);
    }

    if (typeof userInput !== "string") {
      throw new TypeError(
        "AnythingLLM simulator turns must be strings or anythingllm-rag inputs.",
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

function isAnythingLLMLiveInput(value: unknown): value is AnythingLLMLiveInput {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const input = value as Record<string, unknown>;
  return input.kind === "anythingllm-rag" && typeof input.prompt === "string";
}

async function runAnythingLLMLiveTurn(
  input: AnythingLLMLiveInput,
): Promise<AgentTurnResult> {
  const apiKey = process.env.ANYTHINGLLM_API_KEY?.trim();
  const workspaceSlug =
    input.workspaceSlug ?? process.env.ANYTHINGLLM_WORKSPACE_SLUG?.trim();
  const apiBase = (
    process.env.ANYTHINGLLM_API_BASE ?? "http://127.0.0.1:3101/api"
  ).replace(/\/$/, "");

  if (!apiKey) {
    throw new Error(
      "ANYTHINGLLM_API_KEY is required for anythingllm-rag simulation turns.",
    );
  }
  if (!workspaceSlug) {
    throw new Error(
      "ANYTHINGLLM_WORKSPACE_SLUG is required for anythingllm-rag simulation turns.",
    );
  }

  const response = await fetch(
    `${apiBase}/v1/workspace/${encodeURIComponent(workspaceSlug)}/chat`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input.prompt,
        mode: input.mode ?? "query",
        reset: true,
      }),
    },
  );
  const body = (await response.json()) as AnythingLLMChatResponse;

  if (!response.ok || body.error) {
    throw new Error(
      `AnythingLLM chat failed (${response.status}): ${body.error ?? "unknown error"}`,
    );
  }
  if (typeof body.textResponse !== "string") {
    throw new TypeError("AnythingLLM chat response did not contain textResponse.");
  }

  const sourceTitles = (body.sources ?? [])
    .map((source) => source.title)
    .filter((title): title is string => typeof title === "string");
  return new AgentTurnResult({
    assistantMessage: body.textResponse,
    metadata: {
      simulation_provider: "anythingllm-api",
      response_type: typeof body.type === "string" ? body.type : "unknown",
      source_count: sourceTitles.length,
      source_titles: sourceTitles,
    },
  });
}

export function buildAgentAdapter(
  options: AgentAdapterBuildOptions,
): AgentAdapter {
  if (options.agentTarget) {
    throw new Error("AnythingLLM does not expose named logical agent targets.");
  }
  return new ProjectAgentAdapter();
}
