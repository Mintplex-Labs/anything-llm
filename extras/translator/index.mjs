import fs from 'fs';
import {resources} from '../../frontend/src/locales/resources.js';
import "../../server/node_modules/dotenv/lib/main.js";

function getNestedValue(obj, path) {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result == null) return undefined;
      result = result[key];
    }
    return result;
  }

function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let result = obj;
    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];
      if (result[key] == null) result[key] = {};
      result = result[key];
    }
    result[keys[keys.length - 1]] = value;
}

/**
 * Extract {{variableName}} placeholders from text and replace with tokens.
 * Returns the modified text and a map to restore the originals.
 * @param {string} text
 * @returns {{ text: string, placeholders: string[] }}
 */
function extractPlaceholders(text) {
    const placeholders = [];
    const modifiedText = text.replace(/\{\{([^}]+)\}\}/g, (match) => {
        const index = placeholders.length;
        placeholders.push(match);
        return `__PLACEHOLDER_${index}__`;
    });
    return { text: modifiedText, placeholders };
}

/**
 * Restore original {{variableName}} placeholders from tokens.
 * @param {string} text
 * @param {string[]} placeholders
 * @returns {string}
 */
function restorePlaceholders(text, placeholders) {
    return text.replace(/__PLACEHOLDER_(\d+)__/g, (_, index) => {
        return placeholders[parseInt(index, 10)] || `__PLACEHOLDER_${index}__`;
    });
}

/**
 * Validate that all placeholders from source exist in translated text.
 * @param {string} sourceText
 * @param {string} translatedText
 * @returns {{ valid: boolean, missing: string[] }}
 */
function validatePlaceholders(sourceText, translatedText) {
    const sourceMatches = sourceText.match(/\{\{([^}]+)\}\}/g) || [];
    const translatedMatches = translatedText.match(/\{\{([^}]+)\}\}/g) || [];
    const missing = sourceMatches.filter(p => !translatedMatches.includes(p));
    return { valid: missing.length === 0, missing };
}

class Translator {
    static modelTag = 'translategemma:4b'
    constructor() {
        this.localeObj = new Intl.DisplayNames(Object.keys(resources), { type: 'language' });
    }

    getLanguageName(localeCode) {
        try {
          return this.localeObj.of(localeCode);
        } catch (error) {
          console.error("Error getting language name:", error);
          return null;
        }
      }
   
    #log(text, ...args) {
        console.log(`\x1b[32m[Translator]\x1b[0m ${text}`, ...args);
    }

    static slog(text, ...args) {
        console.log(`\x1b[32m[Translator]\x1b[0m ${text}`, ...args);
    }

    buildPrompt(text, sourceLangCode, targetLangCode, hasPlaceholders = false) {
        const sourceLanguage = this.getLanguageName(sourceLangCode);
        const targetLanguage = this.getLanguageName(targetLangCode);
        const placeholderInstruction = hasPlaceholders 
            ? `\nIMPORTANT: The text contains placeholders like __PLACEHOLDER_0__, __PLACEHOLDER_1__, etc. You MUST keep these placeholders exactly as they are in the translation - do not translate, modify, or remove them.`
            : '';
        return `You are a professional ${sourceLanguage} (${sourceLangCode.toLowerCase()}) to ${targetLanguage} (${targetLangCode.toLowerCase()}) translator. Your goal is to accurately convey the meaning and nuances of the original ${sourceLanguage} text while adhering to ${targetLanguage} grammar, vocabulary, and cultural sensitivities.${placeholderInstruction}
Produce only the ${targetLanguage} translation, without any additional explanations or commentary. Please translate the following ${sourceLanguage} text into ${targetLanguage}:


${text}`
    }

    /**
     * Clean the output text from the model
     * Output text: `在助手回复中呈现 HTML 响应。这可以显著提高回复的质量，但也可能带来潜在的安全风险。<|im_end|>`
     * We want to remove the <|im_end|> or im_start tags
     * @param {*} text 
     * @returns 
     */
    cleanOutputText(text) {
        return text.replace(/<\|im_end\|>|<\|im_start\|>/g, '').trim();
    }

    async translate(text, sourceLangCode, targetLangCode) {
        // Extract placeholders like {{variableName}} and replace with tokens
        const { text: textWithTokens, placeholders } = extractPlaceholders(text);
        const hasPlaceholders = placeholders.length > 0;
        
        const prompt = this.buildPrompt(textWithTokens, sourceLangCode, targetLangCode, hasPlaceholders);
        const response = await fetch(`http://localhost:11434/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: Translator.modelTag,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.1,
                stream: false,
            }),
        });
        
        if(!response.ok) throw new Error(`Failed to translate: ${response.statusText}`);
        const data = await response.json();
        let translatedText = this.cleanOutputText(data.message.content);
        
        // Restore original placeholders
        if (hasPlaceholders) {
            translatedText = restorePlaceholders(translatedText, placeholders);
            
            // Validate all placeholders were preserved
            const validation = validatePlaceholders(text, translatedText);
            if (!validation.valid) {
                console.warn(`Warning: Missing placeholders in translation: ${validation.missing.join(', ')}`);
                // Attempt to fix by checking if tokens remain untranslated
                for (let i = 0; i < placeholders.length; i++) {
                    if (!translatedText.includes(placeholders[i])) {
                        console.warn(`  Placeholder ${placeholders[i]} was lost in translation`);
                    }
                }
            }
        }
        
        return translatedText;
    }

    writeTranslations(langCode, translations) {
        let langFilename = langCode.toLowerCase();
        // Special cases
        if(langCode === 'pt') langFilename = 'pt_BR';
        if(langCode === 'zh-tw') langFilename = 'zh_TW';
        if(langCode === 'vi') langFilename = 'vn';

        fs.writeFileSync(
            `../../frontend/src/locales/${langFilename}/common.js`,
            `// Anything with "null" requires a translation. Contribute to translation via a PR!
const TRANSLATIONS = ${JSON.stringify(translations, null, 2)}

export default TRANSLATIONS;`
        );
        console.log(`Updated ${langCode} translations file`);
    }
}


// Deep traverse the english translations and get all the path to any all keys
const translator = new Translator();
const englishTranslations = resources.en.common;
const allKeys = [];
function traverseTranslations(translations, parentKey = '') {
    for(const [key, value] of Object.entries(translations)) {
        const fullKey = !parentKey ? key : `${parentKey}.${key}`;
        if(typeof value === 'object' && value !== null) {
            traverseTranslations(value, fullKey);
        } else {
            allKeys.push(fullKey);
        }
    }
}
traverseTranslations(englishTranslations);
delete resources.en;

async function translateAllLanguages() {
    for(const [langCode, { common }] of Object.entries(resources)) {
        console.log(`Translating ${translator.getLanguageName(langCode)}(${langCode}) to all languages`);
        await translateSingleLanguage(langCode);
    }
}

async function translateSingleLanguage(langCode) {
    let totalTranslations = 0;
    for(const key of allKeys) {
        const sourceText = getNestedValue(englishTranslations, key);
        if(!sourceText) continue;

        // If the source text is @agent, set the translation to @agent - this has no
        // direct translation and must be handled manually
        if(sourceText === '@agent') {
            setNestedValue(resources[langCode].common, key, '@agent');
            continue;
        }
        if(sourceText === '/reset') {
            setNestedValue(resources[langCode].common, key, '/reset');
            continue;
        }

        const value = getNestedValue(resources[langCode].common, key);
        if(!!value) continue; // If the translation is already present, skip it

        console.log(`Translation not found for ${translator.getLanguageName(langCode)}(${langCode})`, {
            key,
            sourceText,
        });
        const outputText = await translator.translate(sourceText, 'en', langCode);
        if(!outputText) {
            console.log('No output text - skipping');
            continue;
        }

        console.log(`Output text: ${outputText}`);
        setNestedValue(resources[langCode].common, key, outputText);
        console.log(`--------------------------------`);
        totalTranslations++;
    }

    if(totalTranslations === 0) return console.log('No translations performed!');
    console.log(`--------------------------------`);
    console.log(`Translated ${totalTranslations} translations for ${langCode}`);
    translator.writeTranslations(langCode, resources[langCode].common);
    console.log(`--------------------------------`);
}

let langArg = process.argv[2];
if(langArg) {
    if(langArg.toLowerCase() === '--all') await translateAllLanguages();
    else {
        if(!Object.keys(resources).includes(langArg)) throw new Error(`Language ${langArg} not found in resources`);
        await translateSingleLanguage(langArg);
    }
} else {
    throw new Error('Please provide a language code as an argument or --all to translate all languages');
}