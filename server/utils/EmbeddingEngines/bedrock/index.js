const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime");
const { toChunks, reportEmbeddingProgress } = require("../../helpers");
const { fromStatic } = require("@aws-sdk/token-providers");

class AWSBedrockEmbedder {
  constructor() {
    this.authMethod =
      process.env.AWS_BEDROCK_EMBEDDING_CONNECTION_METHOD || "iam";
    this.region = process.env.AWS_BEDROCK_EMBEDDING_REGION;
    if (!this.region)
      throw new Error("AWS Bedrock Embedding requires a region");

    this.model =
      process.env.EMBEDDING_MODEL_PREF || "amazon.titan-embed-text-v2:0";

    this.maxConcurrentChunks = 1; // Default to 1 chunk concurrent to avoid strict rate limiting
    this.embeddingMaxChunkLength = 8000;

    // Auto-detect provider prefix based on the model string
    this.providerType = this.model.startsWith("cohere.") ? "cohere" : "titan";

    this.bedrockClient = this.createBedrockRuntimeClient();
  }

  createBedrockCredentials() {
    switch (this.authMethod) {
      case "iam":
        return {
          accessKeyId: process.env.AWS_BEDROCK_EMBEDDING_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_BEDROCK_EMBEDDING_ACCESS_KEY,
        };
      case "sessionToken":
        return {
          accessKeyId: process.env.AWS_BEDROCK_EMBEDDING_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_BEDROCK_EMBEDDING_ACCESS_KEY,
          sessionToken: process.env.AWS_BEDROCK_EMBEDDING_SESSION_TOKEN,
        };
      case "iam_role":
        return undefined; // Handled by standard AWS SDK environment
      case "apiKey":
        return fromStatic({
          token: { token: process.env.AWS_BEDROCK_EMBEDDING_ACCESS_KEY },
        });
      default:
        return undefined;
    }
  }

  createBedrockRuntimeClient() {
    const clientOpts = { region: this.region };

    if (this.authMethod === "apiKey") {
      clientOpts.token = this.createBedrockCredentials();
      clientOpts.authSchemePreference = ["httpBearerAuth"];
    } else {
      clientOpts.credentials = this.createBedrockCredentials();
    }

    return new BedrockRuntimeClient(clientOpts);
  }

  async embedTextInput(textInput) {
    const result = await this.embedChunks(
      Array.isArray(textInput) ? textInput : [textInput]
    );
    return result?.[0] || [];
  }

  async embedChunks(textChunks = []) {
    const embeddingRequests = [];
    let chunksProcessed = 0;

    for (const chunk of toChunks(textChunks, this.maxConcurrentChunks)) {
      embeddingRequests.push(
        new Promise((resolve) => {
          let reqBody;

          if (this.providerType === "cohere") {
            reqBody = {
              texts: chunk,
              input_type: "search_document",
            };
          } else {
            // Assume Titan format for others (e.g. titan-embed-text)
            reqBody = {
              inputText: chunk[0],
            };
          }

          const command = new InvokeModelCommand({
            modelId: this.model,
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(reqBody),
          });

          this.bedrockClient
            .send(command)
            .then((res) => {
              chunksProcessed += chunk.length;
              reportEmbeddingProgress(chunksProcessed, textChunks.length);

              const resultBody = JSON.parse(new TextDecoder().decode(res.body));
              let embeddingsObj;

              if (this.providerType === "cohere") {
                embeddingsObj = resultBody.embeddings;
              } else {
                embeddingsObj = resultBody.embedding
                  ? [resultBody.embedding]
                  : [];
              }

              resolve({ data: embeddingsObj, error: null });
            })
            .catch((e) => {
              chunksProcessed += chunk.length;
              reportEmbeddingProgress(chunksProcessed, textChunks.length);
              const errorType =
                e?.response?.data?.error?.code ||
                e?.response?.status ||
                "failed_to_embed";
              const errorMessage =
                e?.response?.data?.error?.message || e.message;
              resolve({ data: [], error: `[${errorType}] ${errorMessage}` });
            });
        })
      );
    }

    const { data = [], error = null } = await Promise.all(
      embeddingRequests
    ).then((results) => {
      const errors = results
        .filter((res) => !!res.error)
        .map((res) => res.error)
        .flat();

      if (errors.length > 0) {
        let uniqueErrors = new Set();
        errors.map((error) => uniqueErrors.add(error));
        return { data: [], error: Array.from(uniqueErrors).join(", ") };
      }

      return {
        data: results.map((res) => res?.data || []).flat(),
        error: null,
      };
    });

    if (error) throw new Error(`AWS Bedrock Failed to embed: ${error}`);

    return data.length > 0 ? data : null;
  }
}

module.exports = {
  AWSBedrockEmbedder,
};
