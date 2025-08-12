const { CloudClient } = require("chromadb");
const { Chroma } = require("../chroma");

// ChromaCloud works exactly the same as Chroma so we can just extend the
// Chroma class and override the connect method to use CloudClient

const ChromaCloud = {
  ...Chroma,
  name: "ChromaCloud",
  connect: async function () {
    if (process.env.VECTOR_DB !== "chromacloud")
      throw new Error("ChromaCloud::Invalid ENV settings");

    const client = new CloudClient({
      apiKey: process.env.CHROMACLOUD_API_KEY,
      tenant: process.env.CHROMACLOUD_TENANT,
      database: process.env.CHROMACLOUD_DATABASE,
    });

    const isAlive = await client.heartbeat();
    if (!isAlive)
      throw new Error(
        "ChromaCloud::Invalid Heartbeat received - is the instance online?"
      );
    return { client };
  },
};

module.exports.ChromaCloud = ChromaCloud;
