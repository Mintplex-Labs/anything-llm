const { reqBody } = require("../http");

/**
 * Runtime settings are used to configure the collector per-request.
 * These settings are persisted across requests, but can be overridden per-request.
 *
 * The settings are passed in the request body via `options.runtimeSettings`
 * which is set in the backend #attachOptions function in CollectorApi.
 *
 * We do this so that the collector and backend can share the same ENV variables
 * but only pass the relevant settings to the collector per-request and be able to
 * access them across the collector via a single instance of RuntimeSettings.
 *
 * TODO: We may want to set all options passed from backend to collector here,
 * but for now - we are only setting the runtime settings specifically for backwards
 * compatibility with existing CollectorApi usage.
 */
class RuntimeSettings {
  static _instance = null;
  settings = {};

  // Any settings here will be persisted across requests
  // and must be explicitly defined here.
  settingConfigs = {
    seenAnyIpWarning: {
      default: false,
      validate: (value) => String(value) === "true",
    },
    allowAnyIp: {
      default: false,
      // Value must be explicitly "true" or "false" as a string
      validate: (value) => String(value) === "true",
    },
    browserLaunchArgs: {
      default: [],
      validate: (value) => {
        let args = [];
        if (Array.isArray(value)) args = value.map((arg) => String(arg.trim()));
        if (typeof value === "string")
          args = value.split(",").map((arg) => arg.trim());
        return args;
      },
    },
  };

  constructor() {
    if (RuntimeSettings._instance) return RuntimeSettings._instance;
    RuntimeSettings._instance = this;
    return this;
  }

  /**
   * Parse the runtime settings from the request body options body
   * see #attachOptions https://github.com/Mintplex-Labs/anything-llm/blob/ebf112007e0d579af3d2b43569db95bdfc59074b/server/utils/collectorApi/index.js#L18
   * @param {import('express').Request} request
   * @returns {void}
   */
  parseOptionsFromRequest(request = {}) {
    const options = reqBody(request)?.options?.runtimeSettings || {};
    for (const [key, value] of Object.entries(options)) {
      if (!this.settingConfigs.hasOwnProperty(key)) continue;
      this.set(key, value);
    }
    return;
  }

  /**
   * Get a runtime setting
   * - Will throw an error if the setting requested is not a supported runtime setting key
   * - Will return the default value if the setting requested is not set at all
   * @param {string} key
   * @returns {any}
   */
  get(key) {
    if (!this.settingConfigs[key])
      throw new Error(`Invalid runtime setting: ${key}`);
    return this.settings.hasOwnProperty(key)
      ? this.settings[key]
      : this.settingConfigs[key].default;
  }

  /**
   * Set a runtime setting
   * - Will throw an error if the setting requested is not a supported runtime setting key
   * - Will validate the value against the setting's validate function
   * @param {string} key
   * @param {any} value
   * @returns {void}
   */
  set(key, value = null) {
    if (!this.settingConfigs[key])
      throw new Error(`Invalid runtime setting: ${key}`);
    this.settings[key] = this.settingConfigs[key].validate(value);
  }
}

module.exports = RuntimeSettings;
