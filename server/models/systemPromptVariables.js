const prisma = require("../utils/prisma");
const moment = require("moment");

// TTL cache for MCP variable results to avoid hammering MCP servers on every message.
// Failures are cached at a shorter TTL so a broken variable doesn't spam logs every turn.
const _mcpVariableCache = new Map();
// Schema cache for MCP tool inputSchemas, used to map positional args to named parameters.
const _mcpSchemaCache = new Map();
const MCP_VARIABLE_TTL_MS = 30_000;
const MCP_VARIABLE_FAILURE_TTL_MS = 10_000;
const MCP_SCHEMA_TTL_MS = 5 * 60_000; // schemas change rarely; 5-minute TTL is fine
const MCP_VARIABLE_TIMEOUT_MS = 3_000;

/**
 * Resolve a single arg token from an MCP variable expression.
 * If the token matches a key in allVariables it is resolved like any other
 * prompt variable; otherwise it is treated as a literal string.
 * MCP variable keys ("mcp.*") are intentionally excluded to prevent recursion.
 * @param {string} rawArg
 * @param {import('./systemPromptVariables').SystemPromptVariable[]} allVariables
 * @param {number|null} userId
 * @param {number|null} workspaceId
 * @returns {Promise<string>}
 */
async function _resolveArg(rawArg, allVariables, userId, workspaceId) {
  if (rawArg.startsWith("mcp.")) return rawArg; // no recursion
  const variable = allVariables.find((v) => v.key === rawArg);
  if (!variable) return rawArg; // literal

  if (typeof variable.value !== "function") return String(variable.value ?? "");

  try {
    if (rawArg.startsWith("workspace."))
      return String((await variable.value(workspaceId)) ?? "");
    if (rawArg.startsWith("user."))
      return String((await variable.value(userId)) ?? "");
    // system variables: time, date, datetime
    const val =
      variable.value.constructor.name === "AsyncFunction"
        ? await variable.value()
        : variable.value();
    return String(val ?? "");
  } catch {
    return "";
  }
}

/**
 * Map positional arg values to named parameters using the tool's inputSchema.
 * Results are cached at MCP_SCHEMA_TTL_MS to avoid repeated listTools calls.
 * All arg values are strings; MCP servers are expected to coerce types if needed.
 * @param {object} mcp - MCP client instance
 * @param {string} serverName
 * @param {string} toolName
 * @param {string[]} positionalArgs - already-resolved arg values
 * @returns {Promise<Record<string, string>>}
 */
async function _buildMcpToolArguments(
  mcp,
  serverName,
  toolName,
  positionalArgs
) {
  if (!positionalArgs.length) return {};

  const cacheKey = `${serverName}:${toolName}`;
  let schemaEntry = _mcpSchemaCache.get(cacheKey);
  if (!schemaEntry || schemaEntry.expiresAt <= Date.now()) {
    const { tools } = await mcp.listTools();
    const tool = tools.find((t) => t.name === toolName);
    const schema = tool?.inputSchema ?? {};
    schemaEntry = { schema, expiresAt: Date.now() + MCP_SCHEMA_TTL_MS };
    _mcpSchemaCache.set(cacheKey, schemaEntry);
  }

  const { schema } = schemaEntry;
  const paramNames =
    Array.isArray(schema.required) && schema.required.length
      ? schema.required
      : Object.keys(schema.properties ?? {});

  const args = {};
  positionalArgs.forEach((val, i) => {
    if (paramNames[i]) args[paramNames[i]] = val;
  });
  return args;
}

/**
 * Parse and resolve an {mcp.<server>.<tool>[:<arg1>,<arg2>,...]} variable.
 * Args are either literal strings or other variable keys (e.g. "workspace.city",
 * "user.id") resolved before the tool is called. The cache key includes resolved
 * arg values plus userId/workspaceId so different contexts don't share stale entries.
 * Returns empty string on any failure so a broken MCP server never 500s a chat request.
 * @param {string} key - e.g. "mcp.lastfm.get_now_playing" or "mcp.weather.forecast:workspace.city,7"
 * @param {{ userId: number|null, workspaceId: number|null, allVariables: object[] }} context
 * @returns {Promise<string>}
 */
async function _resolveMcpVariable(key, context = {}) {
  const { userId = null, workspaceId = null, allVariables = [] } = context;

  // Parse "mcp.<serverName>.<toolName>[:<rawArg1>,<rawArg2>,...]"
  const withoutPrefix = key.substring(4); // strip "mcp."
  const colonIndex = withoutPrefix.indexOf(":");
  const toolPath =
    colonIndex === -1 ? withoutPrefix : withoutPrefix.substring(0, colonIndex);
  const rawArgsString =
    colonIndex === -1 ? "" : withoutPrefix.substring(colonIndex + 1);

  const dotIndex = toolPath.indexOf(".");
  if (dotIndex === -1) return "";
  const serverName = toolPath.substring(0, dotIndex);
  const toolName = toolPath.substring(dotIndex + 1);
  if (!serverName || !toolName) return "";

  const rawArgs = rawArgsString
    ? rawArgsString
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  // Resolve any variable-reference args before building the cache key so that
  // "workspace.city" → "Paris" is what ends up in the key (context-specific).
  const resolvedArgs = rawArgs.length
    ? await Promise.all(
        rawArgs.map((a) => _resolveArg(a, allVariables, userId, workspaceId))
      )
    : [];

  // Cache key: tool path + resolved args + user/workspace context (only when args
  // are present, since zero-arg tools have no user/workspace dependency).
  const cacheKey = resolvedArgs.length
    ? `${toolPath}:${resolvedArgs.join(",")}:u=${userId ?? ""}:w=${workspaceId ?? ""}`
    : toolPath;

  const cached = _mcpVariableCache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) return cached.value;

  try {
    // Lazy require avoids circular dependency issues at module load time.
    const MCPCompatibilityLayer = require("../utils/MCP");
    const mcpLayer = new MCPCompatibilityLayer();
    // Boot is idempotent — early-returns when servers are already running — but is
    // required for the cold-start case where the user has an mcp variable but has
    // never invoked an agent or opened the MCP admin page.
    await mcpLayer.bootMCPServers();
    const mcp = mcpLayer.mcps[serverName];
    if (!mcp) {
      console.warn(
        `[MCP Variable] Server "${serverName}" not found or not running`
      );
      _mcpVariableCache.set(cacheKey, {
        value: "",
        expiresAt: Date.now() + MCP_VARIABLE_FAILURE_TTL_MS,
      });
      return "";
    }

    // Race the tool call against a hard timeout. Clearing the timer on the
    // success path matters: otherwise each successful resolution leaves a
    // 3-second dangling setTimeout that keeps the event loop alive (which
    // surfaces as "Jest did not exit" in tests and as wasted timer slots
    // under chat load in production).
    let timeoutHandle;
    const timeoutPromise = new Promise((_, reject) => {
      timeoutHandle = setTimeout(
        () => reject(new Error("MCP variable resolver timed out")),
        MCP_VARIABLE_TIMEOUT_MS
      );
    });
    let result;
    try {
      result = await Promise.race([
        (async () => {
          const args = await _buildMcpToolArguments(
            mcp,
            serverName,
            toolName,
            resolvedArgs
          );
          return mcp.callTool({ name: toolName, arguments: args });
        })(),
        timeoutPromise,
      ]);
    } finally {
      clearTimeout(timeoutHandle);
    }

    const value = _extractMcpText(result);
    _mcpVariableCache.set(cacheKey, {
      value,
      expiresAt: Date.now() + MCP_VARIABLE_TTL_MS,
    });
    return value;
  } catch (error) {
    console.warn(`[MCP Variable] Failed to resolve {${key}}:`, error.message);
    _mcpVariableCache.set(cacheKey, {
      value: "",
      expiresAt: Date.now() + MCP_VARIABLE_FAILURE_TTL_MS,
    });
    return "";
  }
}

/**
 * Extract a human-readable string from an MCP callTool result.
 * Prefers concatenated text content blocks; falls back to JSON.
 * @param {*} result
 * @returns {string}
 */
function _extractMcpText(result) {
  if (!result) return "";
  if (typeof result === "string") return result;
  if (Array.isArray(result?.content)) {
    const parts = result.content
      .filter((item) => item?.type === "text" && typeof item.text === "string")
      .map((item) => item.text);
    if (parts.length > 0) return parts.join("\n");
  }
  try {
    return JSON.stringify(result);
  } catch {
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
