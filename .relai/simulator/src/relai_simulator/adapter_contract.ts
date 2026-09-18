export type JSONValue =
  string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

import {
  AgentTurnResult,
  type AdapterCapability,
  type AdapterRuntime,
  type ToolCallRecord,
  type ToolResultRecord,
} from "@relai-ai/relai";

export { AgentTurnResult };
export type { AdapterRuntime, ToolCallRecord, ToolResultRecord };

export type AgentAdapter = {
  capabilities: ReadonlySet<AdapterCapability>;
  runTurn(
    userInput: JSONValue,
    runtime: AdapterRuntime,
  ): AgentTurnResult | unknown | Promise<AgentTurnResult | unknown>;
  selfCheck?(
    runtime: AdapterRuntime,
  ): Record<string, boolean> | Promise<Record<string, boolean>>;
  runComponent?(
    target: unknown,
    input: unknown,
    runtime: AdapterRuntime,
  ): unknown | Promise<unknown>;
};

export type AgentAdapterBuildOptions = {
  /** The named agent target selected by the learning environment, if any. */
  agentTarget?: string;
  runtime: AdapterRuntime;
};

export function normalizeAgentTurnResult(result: unknown): AgentTurnResult {
  if (result instanceof AgentTurnResult) return result;
  if (typeof result === "string" || result === null || result === undefined) {
    return new AgentTurnResult({
      assistantMessage: result == null ? null : result,
    });
  }
  if (typeof result === "object") {
    const record = result as Record<string, unknown>;
    const message =
      record.assistantMessage ??
      record.assistant_message ??
      record.finalOutput ??
      record.final_output ??
      null;
    return new AgentTurnResult({
      assistantMessage: message == null ? null : String(message),
      metadata: objectRecord(record.metadata),
      toolCalls: arrayRecord(record.toolCalls ?? record.tool_calls),
      toolResults: arrayRecord(record.toolResults ?? record.tool_results),
    });
  }
  return new AgentTurnResult({ assistantMessage: String(result) });
}

function objectRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function arrayRecord<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}
