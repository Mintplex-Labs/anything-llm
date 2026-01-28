const { supportedLLM } = require("../helpers/updateENV");
const { getProcessEnvValue } = require("../helpers");
const LLM_PROVIDER_DEFAULT = null;
const VECTOR_DB_DEFAULT = null;
const EMBEDDING_ENGINE_DEFAULT = "native";

function getStartupDefaults() {
    validateLLMQuickSetup();
   
    return {
        llmProvider: process.env.LLM_PROVIDER ?? LLM_PROVIDER_DEFAULT,
        vectorDB: process.env.VECTOR_DB ?? VECTOR_DB_DEFAULT,
        embeddingEngine: process.env.EMBEDDING_ENGINE ?? EMBEDDING_ENGINE_DEFAULT,
    };
}

function validateLLMQuickSetup() {
    try {
        if(!!process.env.LLM_PROVIDER) return;
        if(!process.env.LLM_QUICKSETUP) return;
        
        const quickSetupString = process.env.LLM_QUICKSETUP;
        let [provider, model] = [quickSetupString.slice(0, quickSetupString.indexOf(':')), quickSetupString.slice(quickSetupString.indexOf(':') + 1)];
        if(!provider || !model) throw new Error("Invalid LLM quick setup string. Format: provider:model_tag. eg: dmr:ai/qwen3:4B-UD-Q4_K_XL");
        
        // Aliases for quick setup
        switch(provider) {
            case "dmr":
                provider = "docker-model-runner";
                break;
            default:
                break;
        }

        if(supportedLLM(provider) !== null) throw new Error(`Invalid LLM provider: ${provider}`);
        process.env.LLM_PROVIDER = provider;
        const expectedModelPrefKey = getProcessEnvValue(provider);
        if (model && expectedModelPrefKey) process.env[expectedModelPrefKey] = model;
    } catch (error) {
        console.error("Error validating LLM quick setup: " + error.message);
    } finally {
        if(process.env.LLM_QUICKSETUP) delete process.env.LLM_QUICKSETUP;
    }
}

module.exports = {
    getStartupDefaults,
}