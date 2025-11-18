const { EncryptionManager } = require("../EncryptionManager");

// Maps provider types to their sensitive field names that should be encrypted
const SENSITIVE_FIELDS = {
  litellm: ["apiKey"],
  ollama: [],
  openai: ["apiKey"],
  azure: ["apiKey"],
  anthropic: ["apiKey"],
  cohere: ["apiKey"],
  huggingface: ["apiKey"],
  gemini: ["apiKey"],
  groq: ["apiKey"],
  togetherai: ["apiKey"],
  mistral: ["apiKey"],
  perplexity: ["apiKey"],
  // Add more providers as needed
};

class LLMConfigEncryption {
  constructor() {
    this.encryptionManager = new EncryptionManager();
  }

  /**
   * Get sensitive field names for a provider
   * @param {string} provider - Provider type (e.g., "litellm")
   * @returns {string[]} Array of field names that should be encrypted
   */
  static getSensitiveFields(provider) {
    return SENSITIVE_FIELDS[provider] || [];
  }

  /**
   * Encrypt sensitive fields in a config object
   * @param {string} provider - Provider type
   * @param {Object} config - Configuration object
   * @returns {Object} Config with encrypted sensitive fields
   */
  encryptConfig(provider, config) {
    if (!config || typeof config !== "object") {
      return config;
    }

    const sensitiveFields = LLMConfigEncryption.getSensitiveFields(provider);
    const encrypted = { ...config };

    for (const field of sensitiveFields) {
      if (encrypted[field] && typeof encrypted[field] === "string") {
        const encryptedValue = this.encryptionManager.encrypt(encrypted[field]);
        if (encryptedValue) {
          encrypted[field] = encryptedValue;
          encrypted[`${field}_encrypted`] = true;
        }
      }
    }

    return encrypted;
  }

  /**
   * Decrypt sensitive fields in a config object
   * @param {string} provider - Provider type
   * @param {Object} config - Configuration object with encrypted fields
   * @returns {Object} Config with decrypted sensitive fields
   */
  decryptConfig(provider, config) {
    if (!config || typeof config !== "object") {
      return config;
    }

    const sensitiveFields = LLMConfigEncryption.getSensitiveFields(provider);
    const decrypted = { ...config };

    for (const field of sensitiveFields) {
      // Check if field is marked as encrypted
      if (decrypted[`${field}_encrypted`] && decrypted[field]) {
        const decryptedValue = this.encryptionManager.decrypt(decrypted[field]);
        if (decryptedValue) {
          decrypted[field] = decryptedValue;
        } else {
          console.warn(
            `Failed to decrypt ${field} for provider ${provider}. Using encrypted value.`
          );
        }
        // Remove encryption marker
        delete decrypted[`${field}_encrypted`];
      }
    }

    return decrypted;
  }

  /**
   * Sanitize config for API responses (redact sensitive fields)
   * @param {string} provider - Provider type
   * @param {Object} config - Configuration object
   * @returns {Object} Config with sensitive fields redacted
   */
  static sanitizeConfig(provider, config) {
    if (!config || typeof config !== "object") {
      return config;
    }

    const sensitiveFields = LLMConfigEncryption.getSensitiveFields(provider);
    const sanitized = { ...config };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = "***REDACTED***";
      }
      // Remove encryption markers from API responses
      delete sanitized[`${field}_encrypted`];
    }

    return sanitized;
  }
}

module.exports = { LLMConfigEncryption };
