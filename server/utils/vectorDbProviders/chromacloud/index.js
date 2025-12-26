const { CloudClient } = require("chromadb");
const { Chroma } = require("../chroma");
const { toChunks } = require("../../helpers");

/**
 * ChromaCloud works nearly the same as Chroma so we can just extend the
 * Chroma class and override the connect method to use the CloudClient for major differences in API functionality.
 */
const ChromaCloud = {
  ...Chroma,
  name: "ChromaCloud",
  /**
   * Basic quota/limitations for Chroma Cloud for accounts. Does not lookup client-specific limits.
   * @see https://docs.trychroma.com/cloud/quotas-limits
   */
  limits: {
    maxEmbeddingDim: 4_096,
    maxDocumentBytes: 16_384,
    maxMetadataBytes: 4_096,
    maxRecordsPerWrite: 300,
  },
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
  /**
   * Chroma Cloud has some basic limitations on upserts to protect performance and latency.
   * Local deployments do not have these limitations since they are self-hosted.
   *
   * This method, if cloud, will do some simple logic/heuristics to ensure that the upserts are not too large.
   * Otherwise, it may throw a 422.
   * @param {import("chromadb").Collection} collection
   * @param {{ids: string[], embeddings: number[], metadatas: Record<string, any>[], documents: string[]}[]} submissions
   * @returns {Promise<boolean>} True if the upsert was successful, false otherwise.
   * If the upsert was not successful, the error message will be returned.
   */
  smartAdd: async function (collection, submission) {
    const testSubmission = {
      id: submission.ids[0],
      embedding: submission.embeddings[0],
      metadata: submission.metadatas[0],
      document: submission.documents[0],
    };

    if (testSubmission.embedding.length > this.limits.maxEmbeddingDim)
      console.warn(
        `ChromaCloud::Embedding dimension too large (default max is ${this.limits.maxEmbeddingDim}). Got ${testSubmission.embedding.length}. Upsert may fail!`
      );
    if (testSubmission.document.length > this.limits.maxDocumentBytes)
      console.warn(
        `ChromaCloud::Document length too large (default max is ${this.limits.maxDocumentBytes}). Got ${testSubmission.document.length}. Upsert may fail!`
      );
    if (
      JSON.stringify(testSubmission.metadata).length >
      this.limits.maxMetadataBytes
    )
      console.warn(
        `ChromaCloud::Metadata length too large (default max is ${this.limits.maxMetadataBytes}). Got ${JSON.stringify(testSubmission.metadata).length}. Upsert may fail!`
      );

    // If the submissions are not too large, just add them directly.
    if (submission.ids.length <= this.limits.maxRecordsPerWrite) {
      await collection.add(submission);
      return true;
    }

    console.log(
      `ChromaCloud::Upsert Payload is too large (max is ${this.limits.maxRecordsPerWrite} records). Splitting into chunks of ${this.limits.maxRecordsPerWrite} records.`
    );
    const chunks = [];
    let chunkedSubmission = {
      ids: [],
      embeddings: [],
      metadatas: [],
      documents: [],
    };
    for (let i = 0; i < submission.ids.length; i++) {
      chunkedSubmission.ids.push(submission.ids[i]);
      chunkedSubmission.embeddings.push(submission.embeddings[i]);
      chunkedSubmission.metadatas.push(submission.metadatas[i]);
      chunkedSubmission.documents.push(submission.documents[i]);
      if (chunkedSubmission.ids.length === this.limits.maxRecordsPerWrite) {
        console.log(
          `ChromaCloud::Adding chunk payload ${chunks.length + 1} of ${Math.ceil(submission.ids.length / this.limits.maxRecordsPerWrite)}`
        );
        chunks.push(chunkedSubmission);
        chunkedSubmission = {
          ids: [],
          embeddings: [],
          metadatas: [],
          documents: [],
        };
      }
    }
    // Push remaining submissions to the last chunk
    if (chunkedSubmission.ids.length > 0) chunks.push(chunkedSubmission);

    let counter = 1;
    for (const chunk of chunks) {
      await collection.add(chunk);
      counter++;
    }
    return true;
  },
  /**
   * This method is a wrapper around the ChromaCollection.delete method.
   * It will return the result of the delete method directly.
   * Chroma Cloud has some basic limitations on deletes to protect performance and latency.
   * Local deployments do not have these limitations since they are self-hosted.
   *
   * This method, if cloud, will do some simple logic/heuristics to ensure that the deletes are not too large.
   * Otherwise, it may throw a 422.
   * @param {import("chromadb").Collection} collection
   * @param {string[]} vectorIds
   * @returns {Promise<boolean>} True if the delete was successful, false otherwise.
   */
  smartDelete: async function (collection, vectorIds) {
    if (vectorIds.length <= this.limits.maxRecordsPerWrite)
      return await collection.delete({ ids: vectorIds });

    console.log(
      `ChromaCloud::Delete Payload is too large (max is ${this.limits.maxRecordsPerWrite} records). Splitting into chunks of ${this.limits.maxRecordsPerWrite} records.`
    );
    const chunks = toChunks(vectorIds, this.limits.maxRecordsPerWrite);
    let counter = 1;
    for (const chunk of chunks) {
      console.log(`ChromaCloud::Deleting chunk ${counter} of ${chunks.length}`);
      await collection.delete({ ids: chunk });
      counter++;
    }
    return true;
  },
};

module.exports.ChromaCloud = ChromaCloud;
