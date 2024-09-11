const fs = require("fs");
const path = require("path");
const { safeJsonParse } = require("../http");
const { isWithin, normalizePath } = require("../files");
const pluginsPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, "../../storage/plugins/agent-skills")
    : path.resolve(process.env.STORAGE_DIR, "plugins", "agent-skills");

class ImportedPlugin {
  constructor(config) {
    this.config = config;
    this.handlerLocation = path.resolve(
      pluginsPath,
      this.config.hubId,
      "handler.js"
    );
    delete require.cache[require.resolve(this.handlerLocation)];
    this.handler = require(this.handlerLocation);
    this.name = config.hubId;
    this.startupConfig = {
      params: {},
    };
  }

  /**
   * Gets the imported plugin handler.
   * @param {string} hubId - The hub ID of the plugin.
   * @returns {ImportedPlugin} - The plugin handler.
   */
  static loadPluginByHubId(hubId) {
    const configLocation = path.resolve(
      pluginsPath,
      normalizePath(hubId),
      "plugin.json"
    );
    if (!this.isValidLocation(configLocation)) return;
    const config = safeJsonParse(fs.readFileSync(configLocation, "utf8"));
    return new ImportedPlugin(config);
  }

  static isValidLocation(pathToValidate) {
    if (!isWithin(pluginsPath, pathToValidate)) return false;
    if (!fs.existsSync(pathToValidate)) return false;
    return true;
  }

  /**
   * Loads plugins from `plugins` folder in storage that are custom loaded and defined.
   * only loads plugins that are active: true.
   * @returns {Promise<string[]>} - array of plugin names to be loaded later.
   */
  static async activeImportedPlugins() {
    const plugins = [];
    const folders = fs.readdirSync(path.resolve(pluginsPath));
    for (const folder of folders) {
      const configLocation = path.resolve(
        pluginsPath,
        normalizePath(folder),
        "plugin.json"
      );
      if (!this.isValidLocation(configLocation)) continue;
      const config = safeJsonParse(fs.readFileSync(configLocation, "utf8"));
      if (config.active) plugins.push(`@@${config.hubId}`);
    }
    return plugins;
  }

  /**
   * Lists all imported plugins.
   * @returns {Array} - array of plugin configurations (JSON).
   */
  static listImportedPlugins() {
    const plugins = [];
    if (!fs.existsSync(pluginsPath)) return plugins;

    const folders = fs.readdirSync(path.resolve(pluginsPath));
    for (const folder of folders) {
      const configLocation = path.resolve(
        pluginsPath,
        normalizePath(folder),
        "plugin.json"
      );
      if (!this.isValidLocation(configLocation)) continue;
      const config = safeJsonParse(fs.readFileSync(configLocation, "utf8"));
      plugins.push(config);
    }
    return plugins;
  }

  /**
   * Updates a plugin configuration.
   * @param {string} hubId - The hub ID of the plugin.
   * @param {object} config - The configuration to update.
   * @returns {object} - The updated configuration.
   */
  static updateImportedPlugin(hubId, config) {
    const configLocation = path.resolve(
      pluginsPath,
      normalizePath(hubId),
      "plugin.json"
    );
    if (!this.isValidLocation(configLocation)) return;

    const currentConfig = safeJsonParse(
      fs.readFileSync(configLocation, "utf8"),
      null
    );
    if (!currentConfig) return;

    const updatedConfig = { ...currentConfig, ...config };
    fs.writeFileSync(configLocation, JSON.stringify(updatedConfig, null, 2));
    return updatedConfig;
  }

  /**
   * Validates if the handler.js file exists for the given plugin.
   * @param {string} hubId - The hub ID of the plugin.
   * @returns {boolean} - True if the handler.js file exists, false otherwise.
   */
  static validateImportedPluginHandler(hubId) {
    const handlerLocation = path.resolve(
      pluginsPath,
      normalizePath(hubId),
      "handler.js"
    );
    return this.isValidLocation(handlerLocation);
  }

  parseCallOptions() {
    const callOpts = {};
    if (!this.config.setup_args || typeof this.config.setup_args !== "object") {
      return callOpts;
    }
    for (const [param, definition] of Object.entries(this.config.setup_args)) {
      if (definition.required && !definition?.value) {
        console.log(
          `'${param}' required value for '${this.name}' plugin is missing. Plugin may not function or crash agent.`
        );
        continue;
      }
      callOpts[param] = definition.value || definition.default || null;
    }
    return callOpts;
  }

  plugin(runtimeArgs = {}) {
    const customFunctions = this.handler.runtime;
    return {
      runtimeArgs,
      name: this.name,
      config: this.config,
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          config: this.config,
          runtimeArgs: this.runtimeArgs,
          description: this.config.description,
          logger: aibitat?.handlerProps?.log || console.log, // Allows plugin to log to the console.
          introspect: aibitat?.introspect || console.log, // Allows plugin to display a "thought" the chat window UI.
          examples: this.config.examples ?? [],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: this.config.entrypoint.params ?? {},
            additionalProperties: false,
          },
          ...customFunctions,
        });
      },
    };
  }
}

module.exports = ImportedPlugin;
