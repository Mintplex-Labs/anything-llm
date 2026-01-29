import fs from 'fs';
import {resources} from '../../frontend/src/locales/resources.js';
import "../../server/node_modules/dotenv/lib/main.js";
import DMRModule from '../../server/utils/AiProviders/dockerModelRunner/index.js';
const { DockerModelRunnerLLM, getDockerModels } = DMRModule;

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

class Translator {
    static modelTag = 'mintplexlabs/translategemma4b:Q4_K_M'
    constructor(provider = "dmr") {
        switch (provider) {
        case "dmr":
            this.provider = new DockerModelRunnerLLM(null, Translator.modelTag);
            break;
        default:
            throw new Error(`Unsupported provider: ${provider}`);
        }

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

    buildPrompt(text, sourceLangCode, targetLangCode) {
        const sourceLanguage = this.getLanguageName(sourceLangCode);
        const targetLanguage = this.getLanguageName(targetLangCode);
        return `You are a professional ${sourceLanguage} (${sourceLangCode.toLowerCase()}) to ${targetLanguage} (${sourceLangCode.toLowerCase()}) translator. Your goal is to accurately convey the meaning and nuances of the original ${sourceLanguage} text while adhering to ${targetLanguage} grammar, vocabulary, and cultural sensitivities.
Produce only the ${targetLanguage} translation, without any additional explanations or commentary. Please translate the following ${sourceLanguage} text into ${targetLanguage}:


${text}`
    }

    async verifyReady() {
        const models = await getDockerModels(process.env.DOCKER_MODEL_RUNNER_BASE_PATH);
        if(!models.find(m => m.id.toLowerCase() === Translator.modelTag.toLowerCase())) throw new Error(`Model ${Translator.modelTag} not found. Pull with docker model pull ${Translator.modelTag}`);
        return true;
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
        await this.verifyReady();
        const prompt = this.buildPrompt(text, sourceLangCode, targetLangCode);
        const response = await this.provider.getChatCompletion([{ role: 'user', content: prompt }], { temperature: 0.1 });
        return this.cleanOutputText(response.textResponse);
    }

    writeTranslations(langCode, translations) {
        let langFilename = langCode.toLowerCase();
        // Special cases
        if(langCode === 'pt') langFilename = 'pt_BR';
        if(langCode === 'zh-tw') langFilename = 'zh_TW';

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
const translator = new Translator("dmr");
const englishTranslations = resources.en.common;
const allKeys = [];
function traverseTranslations(translations, parentKey = '') {
    for(const [key, value] of Object.entries(translations)) {
        if(typeof value === 'object') {
            const newKey = !parentKey ? key : `${parentKey}.${key}`;
            traverseTranslations(value, newKey);
        } else {
            allKeys.push(`${parentKey}.${key}`);
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