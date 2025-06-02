const path = require("path");
const fs = require("fs");

// Lazy load SystemSettings to avoid dependency issues during testing
let SystemSettings = null;
try {
  SystemSettings = require("../models/systemSettings").SystemSettings;
} catch (error) {
  // SystemSettings not available (e.g., during testing)
  console.warn("Backend localization: SystemSettings not available, using fallback language detection");
}

class BackendLocalization {
  constructor() {
    this.translations = {};
    this.defaultLanguage = "en";
    this.currentLanguage = "en";
    this.loadedLanguages = new Set();
    this.init();
  }

  init() {
    // Load default language (English) on startup
    this.loadLanguage(this.defaultLanguage);
  }

  /**
   * Load translations for a specific language
   * @param {string} language - Language code (e.g., 'en', 'de')
   */
  loadLanguage(language) {
    if (this.loadedLanguages.has(language)) {
      return;
    }

    const languagePath = path.join(__dirname, language);
    
    if (!fs.existsSync(languagePath)) {
      console.warn(`Backend localization: Language '${language}' not found, falling back to '${this.defaultLanguage}'`);
      if (language !== this.defaultLanguage) {
        this.loadLanguage(this.defaultLanguage);
      }
      return;
    }

    try {
      this.translations[language] = {};
      
      // Load all translation files for this language
      const files = fs.readdirSync(languagePath).filter(file => file.endsWith('.js'));
      
      for (const file of files) {
        const namespace = path.basename(file, '.js');
        const translationPath = path.join(languagePath, file);
        delete require.cache[require.resolve(translationPath)]; // Clear cache for hot reloading
        this.translations[language][namespace] = require(translationPath);
      }
      
      this.loadedLanguages.add(language);
      console.log(`Backend localization: Loaded language '${language}' with namespaces: ${files.map(f => path.basename(f, '.js')).join(', ')}`);
    } catch (error) {
      console.error(`Backend localization: Error loading language '${language}':`, error.message);
      if (language !== this.defaultLanguage) {
        this.loadLanguage(this.defaultLanguage);
      }
    }
  }

  /**
   * Get the current language preference
   * @param {Object} options - Options for language detection
   * @param {Object} options.user - User object with language preference
   * @param {Object} options.request - Express request object
   * @returns {string} Language code
   */
  async getCurrentLanguage(options = {}) {
    const { user, request } = options;

    // 1. Check user preference (if user is logged in)
    if (user && user.language) {
      return user.language;
    }

    // 2. Check system settings
    try {
      const systemLanguage = await SystemSettings.get({ label: "default_language" });
      if (systemLanguage?.value) {
        return systemLanguage.value;
      }
    } catch (error) {
      // System settings not available, continue with other methods
    }

    // 3. Check Accept-Language header from request
    if (request && request.headers && request.headers['accept-language']) {
      const acceptLanguage = request.headers['accept-language'];
      const languages = acceptLanguage.split(',').map(lang => {
        const [code] = lang.trim().split(';');
        return code.toLowerCase();
      });

      // Find first supported language
      for (const lang of languages) {
        const langCode = lang.split('-')[0]; // Convert 'en-US' to 'en'
        if (this.isLanguageSupported(langCode)) {
          return langCode;
        }
      }
    }

    // 4. Fall back to default language
    return this.defaultLanguage;
  }

  /**
   * Check if a language is supported
   * @param {string} language - Language code
   * @returns {boolean}
   */
  isLanguageSupported(language) {
    const languagePath = path.join(__dirname, language);
    return fs.existsSync(languagePath);
  }

  /**
   * Get available languages
   * @returns {Array<string>} Array of language codes
   */
  getAvailableLanguages() {
    try {
      return fs.readdirSync(__dirname)
        .filter(item => {
          const itemPath = path.join(__dirname, item);
          return fs.statSync(itemPath).isDirectory();
        });
    } catch (error) {
      console.error("Backend localization: Error getting available languages:", error.message);
      return [this.defaultLanguage];
    }
  }

  /**
   * Translate a key with interpolation support
   * @param {string} key - Translation key in format 'namespace.key' or 'namespace.nested.key'
   * @param {Object} options - Translation options
   * @param {Object} options.interpolation - Variables for interpolation
   * @param {string} options.language - Override language
   * @param {Object} options.user - User object for language preference
   * @param {Object} options.request - Express request object
   * @returns {Promise<string>} Translated string
   */
  async translate(key, options = {}) {
    const { interpolation = {}, language: overrideLanguage, user, request } = options;
    
    // Determine language to use
    const targetLanguage = overrideLanguage || await this.getCurrentLanguage({ user, request });
    
    // Ensure target language is loaded
    this.loadLanguage(targetLanguage);
    
    // Parse the key (e.g., 'agents.web_browsing.searching')
    const keyParts = key.split('.');
    if (keyParts.length < 2) {
      console.warn(`Backend localization: Invalid key format '${key}'. Expected 'namespace.key'.`);
      return key;
    }

    const [namespace, ...nestedKeys] = keyParts;
    
    // Try to get translation from target language
    let translation = this.getNestedTranslation(targetLanguage, namespace, nestedKeys);
    
    // Fall back to default language if not found
    if (!translation && targetLanguage !== this.defaultLanguage) {
      translation = this.getNestedTranslation(this.defaultLanguage, namespace, nestedKeys);
    }
    
    // If still not found, return the key as fallback
    if (!translation) {
      console.warn(`Backend localization: Translation not found for key '${key}' in language '${targetLanguage}'`);
      return key;
    }
    
    // Perform interpolation
    return this.interpolate(translation, interpolation);
  }

  /**
   * Get nested translation from loaded translations
   * @param {string} language - Language code
   * @param {string} namespace - Namespace
   * @param {Array<string>} nestedKeys - Array of nested keys
   * @returns {string|null} Translation string or null if not found
   */
  getNestedTranslation(language, namespace, nestedKeys) {
    if (!this.translations[language] || !this.translations[language][namespace]) {
      return null;
    }
    
    let current = this.translations[language][namespace];
    
    for (const key of nestedKeys) {
      if (current && typeof current === 'object' && current.hasOwnProperty(key)) {
        current = current[key];
      } else {
        return null;
      }
    }
    
    return typeof current === 'string' ? current : null;
  }

  /**
   * Interpolate variables into translation string
   * @param {string} translation - Translation string with placeholders
   * @param {Object} variables - Variables for interpolation
   * @returns {string} Interpolated string
   */
  interpolate(translation, variables) {
    if (!variables || Object.keys(variables).length === 0) {
      return translation;
    }
    
    return translation.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables.hasOwnProperty(key) ? variables[key] : match;
    });
  }

  /**
   * Create a translation function bound to specific context
   * @param {Object} context - Context for translation
   * @param {Object} context.user - User object
   * @param {Object} context.request - Express request object
   * @returns {Function} Translation function
   */
  createTranslator(context = {}) {
    return async (key, interpolation = {}) => {
      return this.translate(key, {
        interpolation,
        user: context.user,
        request: context.request
      });
    };
  }
}

// Create singleton instance
const backendLocalization = new BackendLocalization();

/**
 * Global translation function
 * @param {string} key - Translation key
 * @param {Object} options - Translation options
 * @returns {Promise<string>} Translated string
 */
const t = async (key, options = {}) => {
  return backendLocalization.translate(key, options);
};

/**
 * Create context-bound translation function
 * @param {Object} context - Context for translation
 * @returns {Function} Translation function
 */
const createT = (context = {}) => {
  return backendLocalization.createTranslator(context);
};

module.exports = {
  BackendLocalization,
  backendLocalization,
  t,
  createT
};
