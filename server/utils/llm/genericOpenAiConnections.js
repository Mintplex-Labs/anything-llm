const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { safeJsonParse } = require("../http");
const { updateENV } = require("../helpers/updateENV");

const CONFIG_FILENAME = "generic-openai-connections.json";

/**
 * @typedef {Object} GenericOpenAiConnection
 * @property {string} id
 * @property {string} name
 * @property {string} basePath
 * @property {string} [apiKey]
 * @property {string} modelPref
 * @property {number} tokenLimit
 * @property {number} maxTokens
 */

/**
 * Manages saved Generic OpenAI endpoint profiles in storage.
 * Resolves #3871 — quick switching between multiple OpenAI-compatible endpoints.
 */
class GenericOpenAiConnections {
  static _instance;

  constructor() {
    if (GenericOpenAiConnections._instance)
      return GenericOpenAiConnections._instance;
    GenericOpenAiConnections._instance = this;
    this.configPath = this.#resolveConfigPath();
    this.#ensureConfigFile();
    return this;
  }

  #resolveConfigPath() {
    if (process.env.NODE_ENV === "development") {
      return path.resolve(__dirname, `../../storage/config/${CONFIG_FILENAME}`);
    }
    const storageDir =
      process.env.STORAGE_DIR ?? path.resolve(__dirname, `../../storage`);
    return path.resolve(storageDir, `config/${CONFIG_FILENAME}`);
  }

  #ensureConfigFile() {
    if (!fs.existsSync(this.configPath)) {
      fs.mkdirSync(path.dirname(this.configPath), { recursive: true });
      fs.writeFileSync(
        this.configPath,
        JSON.stringify({ connections: [], activeConnectionId: null }, null, 2),
        "utf8"
      );
    }
  }

  #readConfig() {
    return safeJsonParse(fs.readFileSync(this.configPath, "utf8"), {
      connections: [],
      activeConnectionId: null,
    });
  }

  #writeConfig(config) {
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2), "utf8");
  }

  /**
   * @returns {GenericOpenAiConnection[]}
   */
  listConnections() {
    const config = this.#readConfig();
    return Array.isArray(config.connections) ? config.connections : [];
  }

  /**
   * Public summary for settings API — never exposes API keys.
   */
  listSummaries() {
    const config = this.#readConfig();
    const activeId = config.activeConnectionId ?? null;
    return this.listConnections().map((connection) => ({
      id: connection.id,
      name: connection.name,
      basePath: connection.basePath,
      modelPref: connection.modelPref,
      tokenLimit: connection.tokenLimit,
      maxTokens: connection.maxTokens,
      hasApiKey: !!connection.apiKey,
      isActive: connection.id === activeId,
    }));
  }

  getActiveConnectionId() {
    return this.#readConfig().activeConnectionId ?? null;
  }

  /**
   * @param {string} id
   * @returns {GenericOpenAiConnection|null}
   */
  getConnection(id) {
    return this.listConnections().find((c) => c.id === id) ?? null;
  }

  /**
   * @param {Object} input
   * @returns {{ connection: GenericOpenAiConnection|null, error: string|null }}
   */
  upsertConnection(input = {}) {
    const name = String(input.name || "").trim();
    const basePath = String(input.basePath || "").trim();
    const modelPref = String(input.modelPref || "").trim();
    const tokenLimit = Number(input.tokenLimit);
    const maxTokens = Number(input.maxTokens);

    if (!name)
      return { connection: null, error: "Connection name is required." };
    if (!basePath) return { connection: null, error: "Base URL is required." };
    if (!modelPref) return { connection: null, error: "Model is required." };
    if (!Number.isFinite(tokenLimit) || tokenLimit <= 0) {
      return {
        connection: null,
        error: "Model context window must be greater than 0.",
      };
    }
    if (!Number.isFinite(maxTokens) || maxTokens <= 0) {
      return { connection: null, error: "Max tokens must be greater than 0." };
    }

    const config = this.#readConfig();
    const connections = this.listConnections();
    const id = input.id ? String(input.id) : uuidv4();
    const existingIndex = connections.findIndex((c) => c.id === id);

    let apiKey = "";
    if (typeof input.apiKey === "string" && input.apiKey.trim().length > 0) {
      apiKey = input.apiKey.trim();
    } else if (existingIndex >= 0) {
      apiKey = connections[existingIndex].apiKey || "";
    }

    const connection = {
      id,
      name,
      basePath,
      apiKey,
      modelPref,
      tokenLimit,
      maxTokens,
    };

    if (existingIndex >= 0) {
      connections[existingIndex] = connection;
    } else {
      connections.push(connection);
    }

    config.connections = connections;
    config.activeConnectionId = id;
    this.#writeConfig(config);

    return { connection, error: null };
  }

  /**
   * @param {string} id
   * @returns {{ success: boolean, error: string|null }}
   */
  deleteConnection(id) {
    const config = this.#readConfig();
    const connections = this.listConnections();
    const index = connections.findIndex((c) => c.id === id);
    if (index < 0) return { success: false, error: "Connection not found." };

    connections.splice(index, 1);
    config.connections = connections;
    if (config.activeConnectionId === id) {
      config.activeConnectionId = null;
    }
    this.#writeConfig(config);
    return { success: true, error: null };
  }

  /**
   * Apply a saved connection to the active Generic OpenAI ENV settings.
   * @param {string} id
   * @returns {Promise<{ success: boolean, error: string|null }>}
   */
  async activateConnection(id) {
    const connection = this.getConnection(id);
    if (!connection) return { success: false, error: "Connection not found." };

    const payload = {
      LLMProvider: "generic-openai",
      GenericOpenAiBasePath: connection.basePath,
      GenericOpenAiModelPref: connection.modelPref,
      GenericOpenAiTokenLimit: String(connection.tokenLimit),
      GenericOpenAiMaxTokens: String(connection.maxTokens),
    };

    if (connection.apiKey) {
      payload.GenericOpenAiKey = connection.apiKey;
    }

    const { error } = await updateENV(payload, false);
    if (error) return { success: false, error };

    const config = this.#readConfig();
    config.activeConnectionId = id;
    this.#writeConfig(config);

    return { success: true, error: null };
  }
}

module.exports = { GenericOpenAiConnections };
