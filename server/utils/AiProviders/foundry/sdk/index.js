const { parseFoundryBasePath } = require("../index");
const { humanFileSize } = require("../../../helpers");

class FoundrySDK {
  basePath = "";
  fetchTimeout = 10 * 60_000;

  constructor(basePath = process.env.FOUNDRY_BASE_PATH) {
    this.basePath = parseFoundryBasePath(
      basePath || process.env.FOUNDRY_BASE_PATH,
      "none"
    );
  }

  get name() {
    return this.name;
  }

  #fetch(input, init = {}) {
    const { Agent } = require("undici");
    return fetch(input, {
      ...init,
      dispatcher: new Agent({ headersTimeout: this.timeout }),
    });
  }

  /**
   * Get the list of models from the Foundry API that are installed on the system.
   * @param {string} task - The task to list models for.
   * @returns {Promise<Array<{id: string, name: string, deviceType: string, size: string, organization: string, downloaded: boolean}>>}
   */
  async listModels(task = "chat-completion") {
    const remoteModels = await this.#remoteModels(task);
    const installedModels = await this.#installedModels();
    return remoteModels.map((model) => ({
      ...model,
      downloaded: installedModels.includes(model.id),
    }));
  }

  async #rawModelDefinition(modelId) {
    return await fetch(`${this.basePath}/foundry/list`)
      .then((res) => res.json())
      .then((data) => data.find((model) => model.name === modelId))
      .catch((_) => null);
  }

  async #remoteModels(task = "chat-completion") {
    return await fetch(`${this.basePath}/foundry/list`)
      .then((res) => res.json())
      .then((data) =>
        data
          .filter((model) => model.task === task)
          .map((model) => ({
            id: model.name,
            name: model.displayName,
            deviceType: model.runtime.deviceType,
            size: humanFileSize(model.fileSizeMb * 1024 * 1024),
            organization: model.alias,
            downloaded: false,
          }))
      )
      .catch((_) => []);
  }

  /**
   * Get the list of model ids from the Foundry API that are installed on the system.
   * - not the same as the openai/v1/models endpoint
   * @returns {Promise<Array<string>>}
   */
  async #installedModels() {
    return await fetch(`${this.basePath}/openai/models`)
      .then((res) => res.json())
      .catch((_) => []);
  }

  /**
   * Download a model from the catalog to local storage.
   * @param {string} modelId - The model ID to download.
   * @param {Function} progressCallback - Callback for progress updates: (progress: number) => void
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async downloadModel(modelId, progressCallback = () => {}) {
    try {
      const modelDefinition = await this.#rawModelDefinition(modelId);
      if (!modelDefinition)
        throw new Error(`Model ${modelId} not defined in the catalog`);

      const model = {
        Uri: modelDefinition.uri,
        Name: modelDefinition.name,
        ProviderType: "AzureFoundryLocal",
        Publisher: modelDefinition.publisher || "",
        PromptTemplate: modelDefinition.promptTemplate || {},
      };
      const response = await this.#fetch(`${this.basePath}/openai/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error: ${response.status} - ${errorText}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalResult = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;

        // Parse streaming progress updates in format: "Total X% Downloading path/filename"
        const progressRegex = /Total ([\d.]+)% Downloading ([^\n]+)/g;
        let match;
        while ((match = progressRegex.exec(chunk)) !== null) {
          const progress = parseInt(parseFloat(match[1]).toFixed(0));
          progressCallback(progress);
        }

        // Try to parse the final JSON response (lowercase keys from actual API)
        const jsonMatch = buffer.match(/\{\s*"success"[\s\S]*?\}/i);
        if (jsonMatch) {
          try {
            const json = JSON.parse(jsonMatch[0]);
            finalResult = {
              success: json.success === true,
              error: json.errorMessage || undefined,
            };
          } catch {
            // JSON not complete yet, continue reading
          }
        }
      }

      // Handle any remaining buffer content
      buffer += decoder.decode();

      if (!finalResult) {
        // Try one more time to parse final result from complete buffer
        const jsonMatch = buffer.match(/\{\s*"success"[\s\S]*?\}/i);
        if (jsonMatch) {
          try {
            const json = JSON.parse(jsonMatch[0]);
            finalResult = {
              success: json.success === true,
              error: json.errorMessage || undefined,
            };
          } catch {
            return {
              success: false,
              error: "Failed to parse download response",
            };
          }
        }
      }

      return finalResult || { success: false, error: "No response received" };
    } catch (error) {
      return {
        success: false,
        error: error.message || "An error occurred while downloading the model",
      };
    }
  }
}

module.exports = FoundrySDK;
