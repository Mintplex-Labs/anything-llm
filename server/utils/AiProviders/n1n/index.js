const { NativeEmbedder } = require("../../EmbeddingEngines/native");
const {
    LLMPerformanceMonitor,
} = require("../../helpers/chat/LLMPerformanceMonitor");
const { MODEL_MAP } = require("../modelMap");

class N1nLLM {
    constructor(embedder = null, modelPreference = null) {
        if (!process.env.N1N_API_KEY)
            throw new Error("No n1n API key was set.");
        this.className = "N1nLLM";
        const { OpenAI: OpenAIApi } = require("openai");

        this.openai = new OpenAIApi({
            apiKey: process.env.N1N_API_KEY,
            baseURL: "https://api.n1n.ai/v1",
        });
        this.model =
            modelPreference || process.env.N1N_MODEL_PREF || "gpt-3.5-turbo";
        this.limits = {
            history: this.promptWindowLimit() * 0.15,
            system: this.promptWindowLimit() * 0.15,
            user: this.promptWindowLimit() * 0.7,
        };

        this.embedder = embedder ?? new NativeEmbedder();
        this.defaultTemp = 0.7;
        this.log(
            `Initialized ${this.model} with context window ${this.promptWindowLimit()}`
        );
    }

    log(text, ...args) {
        console.log(`\x1b[36m[${this.className}]\x1b[0m ${text}`, ...args);
    }

    #appendContext(contextTexts = []) {
        if (!contextTexts || !contextTexts.length) return "";
        return (
            "\nContext:\n" +
            contextTexts
                .map((text, i) => {
                    return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
                })
                .join("")
        );
    }

    streamingEnabled() {
        return "streamGetChatCompletion" in this;
    }

    static promptWindowLimit(modelName) {
        return MODEL_MAP.get("n1n", modelName) ?? 8192;
    }

    promptWindowLimit() {
        return MODEL_MAP.get("n1n", this.model) ?? 8192;
    }

    async isValidChatCompletionModel(modelName = "") {
        const models = await this.openai.models.list().catch(() => ({ data: [] }));
        return models.data.some((model) => model.id === modelName);
    }

    constructPrompt({
        systemPrompt = "",
        contextTexts = [],
        chatHistory = [],
        userPrompt = "",
    }) {
        const prompt = {
            role: "system",
            content: `${systemPrompt}${this.#appendContext(contextTexts)}`,
        };
        return [prompt, ...chatHistory, { role: "user", content: userPrompt }];
    }

    async getChatCompletion(messages = null, { temperature = 0.7 }) {
        if (!(await this.isValidChatCompletionModel(this.model)))
            throw new Error(
                `n1n chat: ${this.model} is not valid for chat completion!`
            );

        const result = await LLMPerformanceMonitor.measureAsyncFunction(
            this.openai.chat.completions
                .create({
                    model: this.model,
                    messages,
                    temperature,
                })
                .catch((e) => {
                    throw new Error(e.message);
                })
        );

        if (
            !result?.output?.hasOwnProperty("choices") ||
            result?.output?.choices?.length === 0
        )
            throw new Error(
                `Invalid response body returned from n1n: ${JSON.stringify(result.output)}`
            );

        return {
            textResponse: result.output.choices[0].message.content,
            metrics: {
                prompt_tokens: result.output.usage.prompt_tokens || 0,
                completion_tokens: result.output.usage.completion_tokens || 0,
                total_tokens: result.output.usage.total_tokens || 0,
                outputTps: result.output.usage.completion_tokens / result.duration,
                duration: result.duration,
                model: this.model,
                timestamp: new Date(),
            },
        };
    }

    async streamGetChatCompletion(messages = null, { temperature = 0.7 }) {
        if (!(await this.isValidChatCompletionModel(this.model)))
            throw new Error(
                `n1n chat: ${this.model} is not valid for chat completion!`
            );

        const measuredStreamRequest = await LLMPerformanceMonitor.measureStream({
            func: this.openai.chat.completions.create({
                model: this.model,
                stream: true,
                messages,
                temperature,
            }),
            messages,
            runPromptTokenCalculation: false,
            modelTag: this.model,
        });

        return measuredStreamRequest;
    }

    handleStream(response, stream, responseProps) {
        const { handleStream: genericHandleStream } = require("../../helpers/chat/responses");
        return genericHandleStream(response, stream, responseProps);
    }

    async embedTextInput(textInput) {
        return await this.embedder.embedTextInput(textInput);
    }
    async embedChunks(textChunks = []) {
        return await this.embedder.embedChunks(textChunks);
    }

    async compressMessages(promptArgs = {}, rawHistory = []) {
        const { messageArrayCompressor } = require("../../helpers/chat");
        const messageArray = this.constructPrompt(promptArgs);
        return await messageArrayCompressor(this, messageArray, rawHistory);
    }
}

module.exports = {
    N1nLLM,
};
