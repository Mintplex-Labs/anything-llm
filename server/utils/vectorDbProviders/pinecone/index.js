const { PineconeClient } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("langchain/vectorstores/pinecone");
const { OpenAI } = require("langchain/llms/openai");
const { VectorDBQAChain, LLMChain } = require("langchain/chains");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { VectorStoreRetrieverMemory } = require("langchain/memory");
const { PromptTemplate } = require("langchain/prompts");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { Configuration, OpenAIApi } = require("openai");
const { v4: uuidv4 } = require("uuid");
const { toChunks, curateSources } = require("../../helpers");

const Pinecone = {
  name: "Pinecone",
  connect: async function () {
    if (process.env.VECTOR_DB !== "pinecone")
      throw new Error("Pinecone::Invalid ENV settings");

    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
    });
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
    const { status } = await client.describeIndex({
      indexName: process.env.PINECONE_INDEX,
    });

    if (!status.ready) throw new Error("Pinecode::Index not ready.");
    return { client, pineconeIndex, indexName: process.env.PINECONE_INDEX };
  },
  embedder: function () {
    return new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_AI_KEY });
  },
  openai: function () {
    const config = new Configuration({ apiKey: process.env.OPEN_AI_KEY });
    const openai = new OpenAIApi(config);
    return openai;
  },
  embedChunk: async function (openai, textChunk) {
    const {
      data: { data },
    } = await openai.createEmbedding({
      model: "text-embedding-ada-002",
      input: textChunk,
    });
    return data.length > 0 && data[0].hasOwnProperty("embedding")
      ? data[0].embedding
      : null;
  },
  llm: function ({ temperature = 0.7 }) {
    const model = process.env.OPEN_MODEL_PREF || "gpt-3.5-turbo";
    return new OpenAI({
      openAIApiKey: process.env.OPEN_AI_KEY,
      modelName: model,
      temperature,
    });
  },
  totalIndicies: async function () {
    const { pineconeIndex } = await this.connect();
    const { namespaces } = await pineconeIndex.describeIndexStats1();
    return Object.values(namespaces).reduce(
      (a, b) => a + (b?.vectorCount || 0),
      0
    );
  },
  namespace: async function (index, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const { namespaces } = await index.describeIndexStats1();
    return namespaces.hasOwnProperty(namespace) ? namespaces[namespace] : null;
  },
  hasNamespace: async function (namespace = null) {
    if (!namespace) return false;
    const { pineconeIndex } = await this.connect();
    return await this.namespaceExists(pineconeIndex, namespace);
  },
  namespaceExists: async function (index, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const { namespaces } = await index.describeIndexStats1();
    return namespaces.hasOwnProperty(namespace);
  },
  deleteVectorsInNamespace: async function (index, namespace = null) {
    await index.delete1({ namespace, deleteAll: true });
    return true;
  },
  addDocumentToNamespace: async function (
    namespace,
    documentData = {},
    fullFilePath = null
  ) {
    const { DocumentVectors } = require("../../../models/vectors");
    try {
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      console.log("Adding new vectorized document into namespace", namespace);
      const cacheResult = await cachedVectorInformation(fullFilePath);
      if (cacheResult.exists) {
        const { pineconeIndex } = await this.connect();
        const { chunks } = cacheResult;
        const documentVectors = [];

        for (const chunk of chunks) {
          // Before sending to Pinecone and saving the records to our db
          // we need to assign the id of each chunk that is stored in the cached file.
          const newChunks = chunk.map((chunk) => {
            const id = uuidv4();
            documentVectors.push({ docId, vectorId: id });
            return { ...chunk, id };
          });

          // Push chunks with new ids to pinecone.
          await pineconeIndex.upsert({
            upsertRequest: {
              vectors: [...newChunks],
              namespace,
            },
          });
        }

        await DocumentVectors.bulkInsert(documentVectors);
        return true;
      }

      // If we are here then we are going to embed and store a novel document.
      // We have to do this manually as opposed to using LangChains `PineconeStore.fromDocuments`
      // because we then cannot atomically control our namespace to granularly find/remove documents
      // from vectordb.
      // https://github.com/hwchase17/langchainjs/blob/2def486af734c0ca87285a48f1a04c057ab74bdf/langchain/src/vectorstores/pinecone.ts#L167
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 20,
      });
      const textChunks = await textSplitter.splitText(pageContent);

      console.log("Chunks created from document:", textChunks.length);
      const documentVectors = [];
      const vectors = [];
      const openai = this.openai();
      for (const textChunk of textChunks) {
        const vectorValues = await this.embedChunk(openai, textChunk);

        if (!!vectorValues) {
          const vectorRecord = {
            id: uuidv4(),
            values: vectorValues,
            // [DO NOT REMOVE]
            // LangChain will be unable to find your text if you embed manually and dont include the `text` key.
            // https://github.com/hwchase17/langchainjs/blob/2def486af734c0ca87285a48f1a04c057ab74bdf/langchain/src/vectorstores/pinecone.ts#L64
            metadata: { ...metadata, text: textChunk },
          };
          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord.id });
        } else {
          console.error(
            "Could not use OpenAI to embed document chunk! This document will not be recorded."
          );
        }
      }

      if (vectors.length > 0) {
        const chunks = [];
        const { pineconeIndex } = await this.connect();
        console.log("Inserting vectorized chunks into Pinecone.");
        for (const chunk of toChunks(vectors, 100)) {
          chunks.push(chunk);
          await pineconeIndex.upsert({
            upsertRequest: {
              vectors: [...chunk],
              namespace,
            },
          });
        }
        await storeVectorResult(chunks, fullFilePath);
      }

      await DocumentVectors.bulkInsert(documentVectors);
      return true;
    } catch (e) {
      console.error("addDocumentToNamespace", e.message);
      return false;
    }
  },
  deleteDocumentFromNamespace: async function (namespace, docId) {
    const { DocumentVectors } = require("../../../models/vectors");
    const { pineconeIndex } = await this.connect();
    if (!(await this.namespaceExists(pineconeIndex, namespace))) return;

    const knownDocuments = await DocumentVectors.where(`docId = '${docId}'`);
    if (knownDocuments.length === 0) return;

    const vectorIds = knownDocuments.map((doc) => doc.vectorId);
    await pineconeIndex.delete1({
      ids: vectorIds,
      namespace,
    });

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);
    return true;
  },
  "namespace-stats": async function (reqBody = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("namespace required");
    const { pineconeIndex } = await this.connect();
    if (!(await this.namespaceExists(pineconeIndex, namespace)))
      throw new Error("Namespace by that name does not exist.");
    const stats = await this.namespace(pineconeIndex, namespace);
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB" };
  },
  "delete-namespace": async function (reqBody = {}) {
    const { namespace = null } = reqBody;
    const { pineconeIndex } = await this.connect();
    if (!(await this.namespaceExists(pineconeIndex, namespace)))
      throw new Error("Namespace by that name does not exist.");

    const details = await this.namespace(pineconeIndex, namespace);
    await this.deleteVectorsInNamespace(pineconeIndex, namespace);
    return {
      message: `Namespace ${namespace} was deleted along with ${details.vectorCount} vectors.`,
    };
  },
  query: async function (reqBody = {}) {
    const { namespace = null, input, workspace = {} } = reqBody;
    if (!namespace || !input) throw new Error("Invalid request body");

    const { pineconeIndex } = await this.connect();
    if (!(await this.namespaceExists(pineconeIndex, namespace))) {
      return {
        response: null,
        sources: [],
        message: "Invalid query - no documents found for workspace!",
      };
    }

    const vectorStore = await PineconeStore.fromExistingIndex(this.embedder(), {
      pineconeIndex,
      namespace,
    });

    const model = this.llm({
      temperature: workspace?.openAiTemp,
    });
    const chain = VectorDBQAChain.fromLLM(model, vectorStore, {
      k: 5,
      returnSourceDocuments: true,
    });
    const response = await chain.call({ query: input });
    return {
      response: response.text,
      sources: curateSources(response.sourceDocuments),
      message: false,
    };
  },
  // This implementation of chat also expands the memory of the chat itself
  // and adds more tokens to the PineconeDB instance namespace
  chat: async function (reqBody = {}) {
    const { namespace = null, input, workspace = {} } = reqBody;
    if (!namespace || !input) throw new Error("Invalid request body");

    const { pineconeIndex } = await this.connect();
    if (!(await this.namespaceExists(pineconeIndex, namespace)))
      throw new Error(
        "Invalid namespace - has it been collected and seeded yet?"
      );

    const vectorStore = await PineconeStore.fromExistingIndex(this.embedder(), {
      pineconeIndex,
      namespace,
    });

    const memory = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: vectorStore.asRetriever(1),
      memoryKey: "history",
    });

    const model = this.llm({
      temperature: workspace?.openAiTemp,
    });
    const prompt =
      PromptTemplate.fromTemplate(`The following is a friendly conversation between a human and an AI. The AI is very casual and talkative and responds with a friendly tone. If the AI does not know the answer to a question, it truthfully says it does not know.
  Relevant pieces of previous conversation:
  {history}
  
  Current conversation:
  Human: {input}
  AI:`);

    const chain = new LLMChain({ llm: model, prompt, memory });
    const response = await chain.call({ input });
    return { response: response.text, sources: [], message: false };
  },
};

module.exports.Pinecone = Pinecone;
