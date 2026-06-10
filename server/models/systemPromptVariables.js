const prisma = require("../utils/prisma");
const moment = require("moment");

// MCP variable substitution. All values in ms. Tuned for chat-loop usage:
//   - success: long enough to absorb burst messages, short enough to feel live.
//   - failure: shorter so a recovered server resumes quickly, non-zero so a
//              permanently-broken variable doesn't spam logs every turn.
//   - schema:  long because tool schemas only change on server restart.
//   - timeout: short enough not to stall a chat turn, long enough for a healthy roundtrip.
const MCP_TTL = {
  success: 30_000,
  failure: 10_000,
  schema: 5 * 60_000,
  timeout: 3_000,
};

const _mcpCache = new Map(); // cacheKey -> { value, expiresAt }
const _mcpSchemas = new Map(); // "server:tool" -> { value: inputSchema, expiresAt }

const _cacheHit = (map, key) => {
  const entry = map.get(key);
  return entry && entry.expiresAt > Date.now() ? entry : null;
};
const _cacheSet = (map, key, value, ttl) =>
  map.set(key, { value, expiresAt: Date.now() + ttl });

// Race a promise against a hard timeout; the loser timer is always cleared
// so successful resolutions don't leak setTimeouts into the event loop.
async function _withTimeout(fn, ms, message) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(message)), ms);
  });
  try {
    return await Promise.race([fn(), timeout]);
  } finally {
    clearTimeout(timer);
  }
}

// Resolve a single MCP arg: either a literal string or the key of another
// prompt variable. mcp.* keys are passed through as literals (no recursion).
async function _resolveArg(arg, allVariables, userId, workspaceId) {
  if (arg.startsWith("mcp.")) return arg;
  const v = allVariables.find((x) => x.key === arg);
  if (!v) return arg;
  if (typeof v.value !== "function") return String(v.value ?? "");
  const ctx = arg.startsWith("workspace.")
    ? workspaceId
    : arg.startsWith("user.")
      ? userId
      : undefined;
  try {
    return String((await v.value(ctx)) ?? "");
  } catch {
    return "";
  }
}

// Map positional arg values to the tool's required (or first declared)
// parameter names. Schemas cached per server+tool at MCP_TTL.schema.
async function _mapArgs(mcp, server, tool, args) {
  if (!args.length) return {};
  const key = `${server}:${tool}`;
  let entry = _cacheHit(_mcpSchemas, key);
  if (!entry) {
    const { tools } = await mcp.listTools();
    const schema = tools.find((t) => t.name === tool)?.inputSchema ?? {};
    _cacheSet(_mcpSchemas, key, schema, MCP_TTL.schema);
    entry = { value: schema };
  }
  const names = entry.value.required?.length
    ? entry.value.required
    : Object.keys(entry.value.properties ?? {});
  return Object.fromEntries(
    args.map((v, i) => [names[i], v]).filter(([n]) => n)
  );
}

// Extract a readable string from an MCP callTool result.
function _extractMcpText(result) {
  if (!result) return "";
  if (typeof result === "string") return result;
  const text = Array.isArray(result.content)
    ? result.content
        .filter((c) => c?.type === "text" && typeof c.text === "string")
        .map((c) => c.text)
        .join("\n")
    : "";
  if (text) return text;
  try {
    return JSON.stringify(result);
  } catch {
    return "";
  }
}

/**
 * Resolve {mcp.<server>.<tool>[:<arg1>,<arg2>,...]}.
 * Each arg is a literal or another variable key (resolved before the call).
 * Returns "" on any failure so a broken MCP variable can never block a chat.
 */
async function _resolveMcpVariable(key, context = {}) {
  const { userId = null, workspaceId = null, allVariables = [] } = context;

  const sub = key.substring(4); // strip "mcp."
  const colon = sub.indexOf(":");
  const path = colon === -1 ? sub : sub.substring(0, colon);
  const rawArgs = colon === -1 ? "" : sub.substring(colon + 1);

  const dot = path.indexOf(".");
  if (dot === -1) return "";
  const server = path.substring(0, dot);
  const tool = path.substring(dot + 1);
  if (!server || !tool) return "";

  const args = rawArgs
    ? rawArgs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const resolved = args.length
    ? await Promise.all(
        args.map((a) => _resolveArg(a, allVariables, userId, workspaceId))
      )
    : [];

  // Cache key folds in user/workspace context only when args are present;
  // zero-arg calls have no context dependency.
  const cacheKey = resolved.length
    ? `${path}:${resolved.join(",")}:u=${userId ?? ""}:w=${workspaceId ?? ""}`
    : path;
  const hit = _cacheHit(_mcpCache, cacheKey);
  if (hit) return hit.value;

  try {
    // Lazy-required to avoid a circular dependency at module load.
    const MCPCompatibilityLayer = require("../utils/MCP");
    const mcpLayer = new MCPCompatibilityLayer();
    await mcpLayer.bootMCPServers(); // idempotent; needed for cold start
    const mcp = mcpLayer.mcps[server];
    if (!mcp) {
      console.warn(`[MCP Variable] Server "${server}" not running`);
      _cacheSet(_mcpCache, cacheKey, "", MCP_TTL.failure);
      return "";
    }
    const result = await _withTimeout(
      async () =>
        mcp.callTool({
          name: tool,
          arguments: await _mapArgs(mcp, server, tool, resolved),
        }),
      MCP_TTL.timeout,
      "MCP variable resolver timed out"
    );
    const value = _extractMcpText(result);
    _cacheSet(_mcpCache, cacheKey, value, MCP_TTL.success);
    return value;
  } catch (error) {
    console.warn(`[MCP Variable] Failed to resolve {${key}}:`, error.message);
    _cacheSet(_mcpCache, cacheKey, "", MCP_TTL.failure);
    return "";
  }
}

/**
 * @typedef {Object} SystemPromptVariable
 * @property {number} id
 * @property {string} key
 * @property {string|function} value
 * @property {string} description
 * @property {'system'|'user'|'workspace'|'static'} type
 * @property {number} userId
 * @property {boolean} multiUserRequired
 */

const SystemPromptVariables = {
  VALID_TYPES: ["user", "workspace", "system", "static"],
  DEFAULT_VARIABLES: [
    {
      key: "time",
      value: () => moment().format("LTS"),
      description: "Current time",
      type: "system",
      multiUserRequired: false,
    },
    {
      key: "time_24",
      value: () => moment().format("HH:mm:ss"),
      description: "Current time (24-hour format)",
      type: "system",
      multiUserRequired: false,
    },
    {
      key: "date",
      value: () => moment().format("LL"),
      description: "Current date",
      type: "system",
      multiUserRequired: false,
    },
    {
      key: "datetime",
      value: () => moment().format("LLLL"),
      description: "Current date and time",
      type: "system",
      multiUserRequired: false,
    },
    {
      key: "datetime_24",
      value: () => moment().format("YYYY-MM-DD HH:mm:ss"),
      description: "Current date and time (24-hour format)",
      type: "system",
      multiUserRequired: false,
    },
    {
      key: "user.id",
      value: (userId = null) => {
        if (!userId) return "[User ID]";
        return userId;
      },
      description: "Current user's ID",
      type: "user",
      multiUserRequired: true,
    },
    {
      key: "user.name",
      value: async (userId = null) => {
        if (!userId) return "[User name]";
        try {
          const user = await prisma.users.findUnique({
            where: { id: Number(userId) },
            select: { username: true },
          });
          return user?.username || "[User name is empty or unknown]";
        } catch (error) {
          console.error("Error fetching user name:", error);
          return "[User name is empty or unknown]";
        }
      },
      description: "Current user's username",
      type: "user",
      multiUserRequired: true,
    },
    {
      key: "user.bio",
      value: async (userId = null) => {
        if (!userId) return "[User bio]";
        try {
          const user = await prisma.users.findUnique({
            where: { id: Number(userId) },
            select: { bio: true },
          });
          return user?.bio || "[User bio is empty]";
        } catch (error) {
          console.error("Error fetching user bio:", error);
          return "[User bio is empty]";
        }
      },
      description: "Current user's bio field from their profile",
      type: "user",
      multiUserRequired: true,
    },
    {
      key: "workspace.id",
      value: (workspaceId = null) => {
        if (!workspaceId) return "[Workspace ID]";
        return workspaceId;
      },
      description: "Current workspace's ID",
      type: "workspace",
      multiUserRequired: false,
    },
    {
      key: "workspace.name",
      value: async (workspaceId = null) => {
        if (!workspaceId) return "[Workspace name]";
        const workspace = await prisma.workspaces.findUnique({
          where: { id: Number(workspaceId) },
          select: { name: true },
        });
        return workspace?.name || "[Workspace name is empty or unknown]";
      },
      description: "Current workspace's name",
      type: "workspace",
      multiUserRequired: false,
    },
  ],

  /**
   * Gets a system prompt variable by its key
   * @param {string} key
   * @returns {Promise<SystemPromptVariable>}
   */
  get: async function (key = null) {
    if (!key) return null;
    const variable = await prisma.system_prompt_variables.findUnique({
      where: { key: String(key) },
    });
    return variable;
  },

  /**
   * Retrieves all system prompt variables with dynamic variables as well
   * as user defined variables
   * @param {number|null} userId - the current user ID (determines if in multi-user mode)
   * @returns {Promise<SystemPromptVariable[]>}
   */
  getAll: async function (userId = null) {
    // All user-defined system variables are available to everyone globally since only admins can create them.
    const userDefinedSystemVariables =
      await prisma.system_prompt_variables.findMany();
    const formattedDbVars = userDefinedSystemVariables.map((v) => ({
      id: v.id,
      key: v.key,
      value: v.value,
      description: v.description,
      type: v.type,
      userId: v.userId,
    }));

    // If userId is not provided, filter the default variables to only include non-multiUserRequired variables
    // since we wont be able to dynamically inject user-related content.
    const defaultSystemVariables = !userId
      ? this.DEFAULT_VARIABLES.filter((v) => !v.multiUserRequired)
      : this.DEFAULT_VARIABLES;

    return [...defaultSystemVariables, ...formattedDbVars];
  },

  /**
   * Creates a new system prompt variable
   * @param {{ key: string, value: string, description: string, type: string, userId: number }} data
   * @returns {Promise<SystemPromptVariable>}
   */
  create: async function ({
    key,
    value,
    description = null,
    type = "static",
    userId = null,
  }) {
    await this._checkVariableKey(key, true);
    return await prisma.system_prompt_variables.create({
      data: {
        key: String(key),
        value: String(value),
        description: description ? String(description) : null,
        type: type ? String(type) : "static",
        userId: userId ? Number(userId) : null,
      },
    });
  },

  /**
   * Updates a system prompt variable by its unique database ID
   * @param {number} id
   * @param {{ key: string, value: string, description: string }} data
   * @returns {Promise<SystemPromptVariable>}
   */
  update: async function (id, { key, value, description = null }) {
    if (!id || !key || !value) return null;
    const existingRecord = await prisma.system_prompt_variables.findFirst({
      where: { id: Number(id) },
    });
    if (!existingRecord) throw new Error("System prompt variable not found");
    await this._checkVariableKey(key, false);

    return await prisma.system_prompt_variables.update({
      where: { id: existingRecord.id },
      data: {
        key: String(key),
        value: String(value),
        description: description ? String(description) : null,
      },
    });
  },

  /**
   * Deletes a system prompt variable by its unique database ID
   * @param {number} id
   * @returns {Promise<boolean>}
   */
  delete: async function (id = null) {
    try {
      await prisma.system_prompt_variables.delete({
        where: { id: Number(id) },
      });
      return true;
    } catch (error) {
      console.error("Error deleting variable:", error);
      return false;
    }
  },

  /**
   * Injects variables into a string based on the user ID and workspace ID (if provided) and the variables available
   * @param {string} str - the input string to expand variables into
   * @param {number|null} userId - the user ID to use for dynamic variables
   * @param {number|null} workspaceId - the workspace ID to use for workspace variables
   * @returns {Promise<string>}
   */
  expandSystemPromptVariables: async function (
    str,
    userId = null,
    workspaceId = null
  ) {
    if (!str) return str;

    try {
      const allVariables = await this.getAll(userId);
      let result = str;

      // Find all variable patterns in the string
      const matches = str.match(/\{([^}]+)\}/g) || [];

      // Process each match
      for (const match of matches) {
        const key = match.substring(1, match.length - 1); // Remove { and }

        // Determine if the variable is a class-based variable (workspace.X or user.X)
        const isWorkspaceOrUserVariable = ["workspace.", "user."].some(
          (prefix) => key.startsWith(prefix)
        );

        // Handle MCP server variables: {mcp.<serverName>.<toolName>[:<arg1>,<arg2>,...]}
        if (key.startsWith("mcp.")) {
          const value = await _resolveMcpVariable(key, {
            userId,
            workspaceId,
            allVariables,
          });
          result = result.replace(match, value);
          continue;
        }

        // Handle class-based variables with current workspace's or user's data
        if (isWorkspaceOrUserVariable) {
          let variableTypeDisplay;
          if (key.startsWith("workspace.")) variableTypeDisplay = "Workspace";
          else if (key.startsWith("user.")) variableTypeDisplay = "User";
          else throw new Error(`Invalid class-based variable: ${key}`);

          // Get the property name after the prefix
          const prop = key.split(".")[1];
          const variable = allVariables.find((v) => v.key === key);

          // If the variable is a function, call it to get the current value
          if (variable && typeof variable.value === "function") {
            // If the variable is an async function, call it to get the current value
            if (variable.value.constructor.name === "AsyncFunction") {
              let value;
              try {
                if (variableTypeDisplay === "Workspace")
                  value = await variable.value(workspaceId);
                else if (variableTypeDisplay === "User")
                  value = await variable.value(userId);
                else throw new Error(`Invalid class-based variable: ${key}`);
              } catch (error) {
                console.error(
                  `Error processing ${variableTypeDisplay} variable ${key}:`,
                  error
                );
                value = `[${variableTypeDisplay} ${prop}]`;
              }
              result = result.replace(match, value);
            } else {
              let value;
              try {
                // Call the variable function with the appropriate workspace or user ID
                if (variableTypeDisplay === "Workspace")
                  value = variable.value(workspaceId);
                else if (variableTypeDisplay === "User")
                  value = variable.value(userId);
                else throw new Error(`Invalid class-based variable: ${key}`);
              } catch (error) {
                console.error(
                  `Error processing ${variableTypeDisplay} variable ${key}:`,
                  error
                );
                value = `[${variableTypeDisplay} ${prop}]`;
              }
              result = result.replace(match, value);
            }
          } else {
            // If the variable is not a function, replace the match with the variable value
            result = result.replace(match, `[${variableTypeDisplay} ${prop}]`);
          }
          continue;
        }

        // Handle regular variables (static types)
        const variable = allVariables.find((v) => v.key === key);
        if (!variable) continue;

        // For dynamic and system variables, call the function to get the current value
        if (
          ["system"].includes(variable.type) &&
          typeof variable.value === "function"
        ) {
          try {
            if (variable.value.constructor.name === "AsyncFunction") {
              const value = await variable.value(userId);
              result = result.replace(match, value);
            } else {
              const value = variable.value();
              result = result.replace(match, value);
            }
          } catch (error) {
            console.error(`Error processing dynamic variable ${key}:`, error);
            result = result.replace(match, match);
          }
        } else {
          result = result.replace(match, variable.value || match);
        }
      }
      return result;
    } catch (error) {
      console.error("Error in expandSystemPromptVariables:", error);
      return str;
    }
  },

  /**
   * Internal function to check if a variable key is valid
   * @param {string} key
   * @param {boolean} checkExisting
   * @returns {Promise<boolean>}
   */
  _checkVariableKey: async function (key = null, checkExisting = true) {
    if (!key) throw new Error("Key is required");
    if (typeof key !== "string") throw new Error("Key must be a string");
    if (!/^[a-zA-Z0-9_]+$/.test(key))
      throw new Error("Key must contain only letters, numbers and underscores");
    if (key.length > 255)
      throw new Error("Key must be less than 255 characters");
    if (key.length < 3) throw new Error("Key must be at least 3 characters");
    if (key.startsWith("user."))
      throw new Error("Key cannot start with 'user.'");
    if (key.startsWith("system."))
      throw new Error("Key cannot start with 'system.'");
    if (checkExisting && (await this.get(key)) !== null)
      throw new Error("System prompt variable with this key already exists");

    return true;
  },
};

module.exports = { SystemPromptVariables };
