const lancedb = require("vectordb");
const { toChunks, curateSources } = require('../helpers')
// const { ChromaClient, OpenAIEmbeddingFunction } = require("chromadb");
// const { Chroma: ChromaStore } = require("langchain/vectorstores/chroma");
// const { OpenAI } = require("langchain/llms/openai");
// const { ChatOpenAI } = require("langchain/chat_models/openai");
// const {
//   VectorDBQAChain,
//   LLMChain,
//   RetrievalQAChain,
//   ConversationalRetrievalQAChain,
// } = require("langchain/chains");
// const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
// const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
// const { storeVectorResult, cachedVectorInformation } = require("../files");
// const { Configuration, OpenAIApi } = require("openai");
// const { v4: uuidv4 } = require("uuid");

const LanceDb = {
  uri: `${!!process.env.STORAGE_DIR ? `${process.env.STORAGE_DIR}/` : "./"}lancedb`,
  name: 'LanceDb',
  connect: async function () {
    const client = await lancedb.connect(this.uri);
    return { client };
  },
  heartbeat: async function () {
    await this.connect();
    return { heartbeat: Number(new Date()) };
  },
};

module.exports = {
  LanceDb,
};
