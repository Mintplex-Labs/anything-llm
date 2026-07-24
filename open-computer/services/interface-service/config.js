const path = require("path");
const { envFlag, loadAgentEnv, loadDotEnv } = require("./utils/env");

// Resolve to the service tree root: one level above interface-service/ when
// running from source, or the bundle directory in production.
const SERVICE_ROOT =
  path.basename(__dirname) === "interface-service"
    ? path.join(__dirname, "..")
    : __dirname;

const serviceEnv = loadDotEnv(__dirname);
if (serviceEnv.path)
  console.log(`[open-computer] Loaded .env from ${serviceEnv.path}`);

const agentEnvPath = loadAgentEnv(null, serviceEnv.keys);
if (agentEnvPath)
  console.log(
    `[open-computer] Loaded agent .env from ${agentEnvPath} (overrides service/.env)`,
  );

// ─── Fixed constants ───────────────────────────────────────────────────────

const HEADLESS =
  process.env.HEADLESS === "1" || process.env.HEADLESS === "true";
const AGENT_NAME = process.env.AGENT_NAME || "agent";
const DELIVERABLES_DIR = "/home/agent/deliverables";
const LOGS_DIR = "/home/agent/logs";
const EXTENSIONS_DIR = path.join(SERVICE_ROOT, "extensions");
const PORT = process.env.PORT || 8080;

const LOG_BUFFER_MAX = 500;
const VM_LOG_BUFFER_MAX = 500;

// LLM proxy guardrails for local models that fail to stop generating
const LLM_PROXY_DEFAULT_MAX_TOKENS =
  parseInt(process.env.LLM_PROXY_DEFAULT_MAX_TOKENS) || 8192;
const LLM_PROXY_STREAM_MAX_BYTES =
  parseInt(process.env.LLM_PROXY_STREAM_MAX_BYTES) || 1024 * 1024;

// Preflight classifier timeouts
const PROMPT_PREFLIGHT_TIMEOUT_MS =
  parseInt(process.env.PROMPT_PREFLIGHT_TIMEOUT_MS) || 8000;
const PROMPT_PREFLIGHT_MAX_TOKENS =
  parseInt(process.env.PROMPT_PREFLIGHT_MAX_TOKENS) || 300;
const PROMPT_PREFLIGHT_TOOL_NAME = "choose_execution_mode";

// Subagent routing mode
const SUBAGENTS_MODE = process.env.SUBAGENTS_MODE || "auto";
const PARALLEL_SUBAGENTS = envFlag("PARALLEL_SUBAGENTS");

// ─── Runtime-mutable settings ─────────────────────────────────────────────
// All modules share this object so updates via POST /api/v1/config and
// writeModelsJson propagate everywhere without re-requiring.

const settings = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_MODEL: process.env.OPENAI_MODEL || "gpt-4o",
  OPENAI_BASE_URL: process.env.OPENAI_BASE_URL || "",
  CONTEXT_WINDOW: parseInt(process.env.CONTEXT_WINDOW) || 32000,
  PARALLEL_TOOL_CALLS: process.env.ENABLE_PARALLEL_TOOL_CALLS === "true",
  LLM_PROXY_TARGET: "",
};

module.exports = {
  SERVICE_ROOT,
  HEADLESS,
  AGENT_NAME,
  DELIVERABLES_DIR,
  LOGS_DIR,
  EXTENSIONS_DIR,
  PORT,
  LOG_BUFFER_MAX,
  VM_LOG_BUFFER_MAX,
  LLM_PROXY_DEFAULT_MAX_TOKENS,
  LLM_PROXY_STREAM_MAX_BYTES,
  PROMPT_PREFLIGHT_TIMEOUT_MS,
  PROMPT_PREFLIGHT_MAX_TOKENS,
  PROMPT_PREFLIGHT_TOOL_NAME,
  SUBAGENTS_MODE,
  PARALLEL_SUBAGENTS,
  settings,
};
