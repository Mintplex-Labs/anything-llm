const { ChromaClient, OpenAIEmbeddingFunction } = require("chromadb");
const { Chroma: ChromaStore } = require("langchain/vectorstores/chroma");
const { OpenAI } = require("langchain/llms/openai");
const { VectorDBQAChain } = require("langchain/chains");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { Configuration, OpenAIApi } = require("openai");
const { v4: uuidv4 } = require("uuid");
const { toChunks, curateSources } = require("../../helpers");
const { chatPrompt } = require("../../chats");

const Chroma = {
  name: "Chroma",
  connect: async function () {
    if (process.env.VECTOR_DB !== "chroma")
      throw new Error("Chroma::Invalid ENV settings");

    const client = new ChromaClient({
      path: process.env.CHROMA_ENDPOINT, // if not set will fallback to localhost:8000
    });

    const isAlive = await client.heartbeat();
    if (!isAlive)
      throw new Error(
        "ChromaDB::Invalid Heartbeat received - is the instance online?"
      );
    return { client };
  },
  heartbeat: async function () {
    const { client } = await this.connect();
    return { heartbeat: await client.heartbeat() };
  },
  totalIndicies: async function () {
    const { client } = await this.connect();
    const collections = await client.listCollections();
    var totalVectors = 0;
    for (const collectionObj of collections) {
      const collection = await client
        .getCollection({ name: collectionObj.name })
        .catch(() => null);
      if (!collection) continue;
      totalVectors += await collection.count();
    }
    return totalVectors;
  },
  embeddingFunc: function () {
    return new OpenAIEmbeddingFunction({
      openai_api_key: process.env.OPEN_AI_KEY,
    });
  },
  embedder: function () {
    return new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_AI_KEY });
  },
  openai: function () {
    const config = new Configuration({ apiKey: process.env.OPEN_AI_KEY });
    const openai = new OpenAIApi(config);
    return openai;
  },
  getChatCompletion: async function (
    openai,
    messages = [],
    { temperature = 0.7 }
  ) {
    const model = process.env.OPEN_MODEL_PREF || "gpt-3.5-turbo";
    const { data } = await openai.createChatCompletion({
      model,
      messages,
      temperature,
    });

    if (!data.hasOwnProperty("choices")) return null;
    return data.choices[0].message.content;
  },
  llm: function ({ temperature = 0.7 }) {
    const model = process.env.OPEN_MODEL_PREF || "gpt-3.5-turbo";
    return new OpenAI({
      openAIApiKey: process.env.OPEN_AI_KEY,
      modelName: model,
      temperature,
    });
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
  similarityResponse: async function (client, namespace, queryVector) {
    const collection = await client.getCollection({ name: namespace });
    const result = {
      contextTexts: [],
      sourceDocuments: [],
    };

    const response = await collection.query({
      queryEmbeddings: queryVector,
      nResults: 4,
    });
    response.ids[0].forEach((_, i) => {
      result.contextTexts.push(response.documents[0][i]);
      result.sourceDocuments.push(response.metadatas[0][i]);
    });

    return result;
  },
  namespace: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client
      .getCollection({ name: namespace })
      .catch(() => null);
    if (!collection) return null;

    return {
      ...collection,
      vectorCount: await collection.count(),
    };
  },
  hasNamespace: async function (namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await this.namespaceExists(client, namespace);
  },
  namespaceExists: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const collection = await client
      .getCollection({ name: namespace })
      .catch((e) => {
        console.error("ChromaDB::namespaceExists", e.message);
        return null;
      });
    return !!collection;
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    await client.deleteCollection({ name: namespace });
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
        const { client } = await this.connect();
        const collection = await client.getOrCreateCollection({
          name: namespace,
          metadata: { "hnsw:space": "cosine" },
          embeddingFunction: this.embeddingFunc(),
        });
        const { chunks } = cacheResult;
        const documentVectors = [];

        for (const chunk of chunks) {
          const submission = {
            ids: [],
            embeddings: [],
            metadatas: [],
            documents: [],
          };

          // Before sending to Chroma and saving the records to our db
          // we need to assign the id of each chunk that is stored in the cached file.
          chunk.forEach((chunk) => {
            const id = uuidv4();
            const { id: _id, ...metadata } = chunk.metadata;
            documentVectors.push({ docId, vectorId: id });
            submission.ids.push(id);
            submission.embeddings.push(chunk.values);
            submission.metadatas.push(metadata);
            submission.documents.push(metadata.text);
          });

          const additionResult = await collection.add(submission);
          if (!additionResult)
            throw new Error("Error embedding into ChromaDB", additionResult);
        }

        await DocumentVectors.bulkInsert(documentVectors);
        return true;
      }

      // If we are here then we are going to embed and store a novel document.
      // We have to do this manually as opposed to using LangChains `Chroma.fromDocuments`
      // because we then cannot atomically control our namespace to granularly find/remove documents
      // from vectordb.
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 20,
      });
      const textChunks = await textSplitter.splitText(pageContent);

      console.log("Chunks created from document:", textChunks.length);
      const documentVectors = [];
      const vectors = [];
      const openai = this.openai();

      const submission = {
        ids: [],
        embeddings: [],
        metadatas: [],
        documents: [],
      };

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

          submission.ids.push(vectorRecord.id);
          submission.embeddings.push(vectorRecord.values);
          submission.metadatas.push(metadata);
          submission.documents.push(textChunk);

          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord.id });
        } else {
          console.error(
            "Could not use OpenAI to embed document chunk! This document will not be recorded."
          );
        }
      }

      const { client } = await this.connect();
      const collection = await client.getOrCreateCollection({
        name: namespace,
        metadata: { "hnsw:space": "cosine" },
        embeddingFunction: this.embeddingFunc(),
      });

      if (vectors.length > 0) {
        const chunks = [];

        console.log("Inserting vectorized chunks into Chroma collection.");
        for (const chunk of toChunks(vectors, 500)) chunks.push(chunk);

        const additionResult = await collection.add(submission);
        if (!additionResult)
          throw new Error("Error embedding into ChromaDB", additionResult);

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
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace))) return;
    const collection = await client.getCollection({
      name: namespace,
      embeddingFunction: this.embeddingFunc(),
    });

    const knownDocuments = await DocumentVectors.where(`docId = '${docId}'`);
    if (knownDocuments.length === 0) return;

    const vectorIds = knownDocuments.map((doc) => doc.vectorId);
    await collection.delete({ ids: vectorIds });

    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);
    return true;
  },
  query: async function (reqBody = {}) {
    const { namespace = null, input, workspace = {} } = reqBody;
    if (!namespace || !input) throw new Error("Invalid request body");

    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace))) {
      return {
        response: null,
        sources: [],
        message: "Invalid query - no documents found for workspace!",
      };
    }

    const vectorStore = await ChromaStore.fromExistingCollection(
      this.embedder(),
      { collectionName: namespace, url: process.env.CHROMA_ENDPOINT }
    );
    const model = this.llm({
      temperature: workspace?.openAiTemp ?? 0.7,
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
  // This implementation of chat uses the chat history and modifies the system prompt at execution
  // this is improved over the regular langchain implementation so that chats do not directly modify embeddings
  // because then multi-user support will have all conversations mutating the base vector collection to which then
  // the only solution is replicating entire vector databases per user - which will very quickly consume space on VectorDbs
  chat: async function (reqBody = {}) {
    const {
      namespace = null,
      input,
      workspace = {},
      chatHistory = [],
    } = reqBody;
    if (!namespace || !input) throw new Error("Invalid request body");

    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace))) {
      return {
        response: null,
        sources: [],
        message: "Invalid query - no documents found for workspace!",
      };
    }

    const queryVector = await this.embedChunk(this.openai(), input);
    const { contextTexts, sourceDocuments } = await this.similarityResponse(
      client,
      namespace,
      queryVector
    );
    const prompt = {
      role: "system",
      content: `${chatPrompt(workspace)}
    Context:
    ${contextTexts
      .map((text, i) => {
        return `[CONTEXT ${i}]:\n${text}\n[END CONTEXT ${i}]\n\n`;
      })
      .join("")}`,
    };
    const memory = [prompt, ...chatHistory, { role: "user", content: input }];
    const responseText = await this.getChatCompletion(this.openai(), memory, {
      temperature: workspace?.openAiTemp ?? 0.7,
    });

    return {
      response: responseText,
      sources: curateSources(sourceDocuments),
      message: false,
    };
  },
  "namespace-stats": async function (reqBody = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("namespace required");
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace)))
      throw new Error("Namespace by that name does not exist.");
    const stats = await this.namespace(client, namespace);
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB for namespace" };
  },
  "delete-namespace": async function (reqBody = {}) {
    const { namespace = null } = reqBody;
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace)))
      throw new Error("Namespace by that name does not exist.");

    const details = await this.namespace(client, namespace);
    await this.deleteVectorsInNamespace(client, namespace);
    return {
      message: `Namespace ${namespace} was deleted along with ${details?.vectorCount} vectors.`,
    };
  },
  reset: async function () {
    const { client } = await this.connect();
    await client.reset();
    return { reset: true };
  },
};

module.exports.Chroma = Chroma;
