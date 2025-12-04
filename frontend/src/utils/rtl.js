/**
 * RTL Language Detection Utility
 * Provides functions to identify Right-to-Left languages
 */

// List of supported RTL language codes
export const RTL_LANGUAGES = ['he', 'ar', 'fa'];

/**
 * Check if a given language code is an RTL language
 * @param {string} lang - Language code (e.g., 'he', 'ar', 'en')
 * @returns {boolean} - True if the language is RTL, false otherwise
 */
export function isRTLLanguage(lang) {
    if (!lang) return false;
    // Normalize to lowercase and extract base language code (e.g., 'en-US' -> 'en')
    const baseLang = lang.toLowerCase().split('-')[0];
    return RTL_LANGUAGES.includes(baseLang);
}
