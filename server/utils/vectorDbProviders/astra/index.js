const { AstraDB: AstraClient } = require("@datastax/astra-db-ts");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { storeVectorResult, cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { sourceIdentifier } = require("../../chats");
const { VectorDatabase } = require("../base");

class AstraDB extends VectorDatabase {
  constructor() {
    super();
  }

  get name() {
    return "AstraDB";
  }

  sanitizeNamespace(namespace) {
    // If namespace already starts with ns_, don't add it again
    if (namespace.startsWith("ns_")) return namespace;

    // Remove any invalid characters, ensure starts with letter
    return `ns_${namespace.replace(/[^a-zA-Z0-9_]/g, "_")}`;
  }

  // Helper method to check if collection exists more reliably
  async collectionExists(client, namespace) {
    try {
      const collections = await this.allNamespaces(client);
      if (collections) {
        return collections.includes(namespace);
      }
    } catch (error) {
      console.log(
        "Astra::collectionExists check error",
        error?.message || error
      );
      return false; // Return false for any error to allow creation attempt
    }
  }

  async connect() {
    if (process.env.VECTOR_DB !== "astra")
      throw new Error("AstraDB::Invalid ENV settings");

    const client = new AstraClient(
      process?.env?.ASTRA_DB_APPLICATION_TOKEN,
      process?.env?.ASTRA_DB_ENDPOINT
    );
    return { client };
  }

  async heartbeat() {
    return { heartbeat: Number(new Date()) };
  }

  // Astra interface will return a valid collection object even if the collection
  // does not actually exist. So we run a simple check which will always throw
  // when the table truly does not exist. Faster than iterating all collections.
  async isRealCollection(astraCollection = null) {
    if (!astraCollection) return false;
    return await astraCollection
      .countDocuments()
      .then(() => true)
      .catch(() => false);
  }

  async totalVectors() {
    const { client } = await this.connect();
    const collectionNames = await this.allNamespaces(client);
    var totalVectors = 0;
    for (const name of collectionNames) {
      const collection = await client.collection(name).catch(() => null);
      const count = await collection.countDocuments().catch(() => 0);
      totalVectors += count ? count : 0;
    }
    return totalVectors;
  }

  async namespaceCount(_namespace = null) {
    const { client } = await this.connect();
    const namespace = await this.namespace(client, _namespace);
    return namespace?.vectorCount || 0;
  }

  async namespace(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const sanitizedNamespace = this.sanitizeNamespace(namespace);
    const collection = await client
      .collection(sanitizedNamespace)
      .catch(() => null);
    if (!(await this.isRealCollection(collection))) return null;

    const count = await collection.countDocuments().catch((e) => {
      console.error("Astra::namespaceExists", e.message);
      return null;
    });

    return {
      name: namespace,
      ...collection,
      vectorCount: typeof count === "number" ? count : 0,
    };
  }

  async namespaceExists(client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const sanitizedNamespace = this.sanitizeNamespace(namespace);
    const collection = await client.collection(sanitizedNamespace);
    return await this.isRealCollection(collection);
  }

  async deleteVectorsInNamespace(client, namespace = null) {
    const sanitizedNamespace = this.sanitizeNamespace(namespace);
    await client.dropCollection(sanitizedNamespace);
    return true;
  }

  async deleteVectorsByIds(client, namespace, vectorIds) {
    const sanitizedNamespace = this.sanitizeNamespace(namespace);
    const collection = await client.collection(sanitizedNamespace);
    for (const id of vectorIds) {
      await collection.deleteMany({ _id: id });
    }
  }

  // AstraDB requires a dimension aspect for collection creation
  // we pass this in from the first chunk to infer the dimensions like other
  // providers do.
  async getOrCreateCollection(client, namespace, dimensions = null) {
    const sanitizedNamespace = this.sanitizeNamespace(namespace);
    try {
      const exists = await this.collectionExists(client, sanitizedNamespace);

      if (!exists) {
        if (!dimensions) {
          throw new Error(
            `AstraDB:getOrCreateCollection Unable to infer vector dimension from input. Open an issue on Github for support.`
          );
        }

        // Create new collection
        await client.createCollection(sanitizedNamespace, {
          vector: {
            dimension: dimensions,
            metric: "cosine",
          },
        });

        // Get the newly created collection
        return await client.collection(sanitizedNamespace);
      }

      return await client.collection(sanitizedNamespace);
    } catch (error) {
      console.error(
        "Astra::getOrCreateCollection error",
        error?.message || error
      );
      throw error;
    }
  }

  async addDocumentToNamespace(
    namespace,
    documentData = {},
    fullFilePath = null,
    skipCache = false
  ) {
    const { DocumentVectors } = require("../../../models/vectors");
    try {
      let vectorDimension = null;
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      console.log("Adding new vectorized document into namespace", namespace);
      if (!skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { client } = await this.connect();
          const { chunks } = cacheResult;
          const documentVectors = [];
          vectorDimension = chunks[0][0].values.length || null;

          const collection = await this.getOrCreateCollection(
            client,
            namespace,
            vectorDimension
          );
          if (!(await this.isRealCollection(collection)))
            throw new Error("Failed to create new AstraDB collection!", {
              namespace,
            });

          for (const chunk of chunks) {
            // Before sending to Astra and saving the records to our db
            // we need to assign the id of each chunk that is stored in the cached file.
            const newChunks = chunk.map((chunk) => {
              const _id = uuidv4();
              documentVectors.push({ docId, vectorId: _id });
              return {
                _id: _id,
                $vector: chunk.values,
                metadata: chunk.metadata || {},
              };
            });

            await collection.insertMany(newChunks);
          }
          await DocumentVectors.bulkInsert(documentVectors);
          return { vectorized: true, error: null };
        }
      }

      const EmbedderEngine = getEmbeddingEngineSelection();
      const textSplitter = new TextSplitter({
        chunkSize: Math.min(
          7500,
          TextSplitter.determineMaxChunkSize(
            await SystemSettings.getValueOrFallback({
              label: "text_splitter_chunk_size",
            }),
            EmbedderEngine?.embeddingMaxChunkLength
          )
        ),
        chunkOverlap: await SystemSettings.getValueOrFallback(
          { label: "text_splitter_chunk_overlap" },
          20
        ),
        chunkHeaderMeta: TextSplitter.buildHeaderMeta(metadata),
        chunkPrefix: EmbedderEngine?.embeddingPrefix,
      });
      const textChunks = await textSplitter.splitText(pageContent);

      console.log("Snippets created from document:", textChunks.length);
      const documentVectors = [];
      const vectors = [];
      const vectorValues = await EmbedderEngine.embedChunks(textChunks);

      if (!!vectorValues && vectorValues.length > 0) {
        for (const [i, vector] of vectorValues.entries()) {
          if (!vectorDimension) vectorDimension = vector.length;
          const vectorRecord = {
            _id: uuidv4(),
            $vector: vector,
            metadata: { ...metadata, text: textChunks[i] },
          };

          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord._id });
        }
      } else {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }
      const { client } = await this.connect();
      const collection = await this.getOrCreateCollection(
        client,
        namespace,
        vectorDimension
      );
      if (!(await this.isRealCollection(collection)))
        throw new Error("Failed to create new AstraDB collection!", {
          namespace,
        });

      if (vectors.length > 0) {
        const chunks = [];

        console.log("Inserting vectorized chunks into Astra DB.");

        // AstraDB has maximum upsert size of 20 records per-request so we have to use a lower chunk size here
        // in order to do the queries - this takes a lot more time than other providers but there
        // is no way around it. This will save the vector-cache with the same layout, so we don't
        // have to chunk again for cached files.
        for (const chunk of toChunks(vectors, 20)) {
          chunks.push(
            chunk.map((c) => {
              return { id: c._id, values: c.$vector, metadata: c.metadata };
            })
          );
          await collection.insertMany(chunk);
        }
        await storeVectorResult(chunks, fullFilePath);
      }

      await DocumentVectors.bulkInsert(documentVectors);
      return { vectorized: true, error: null };
    } catch (e) {
      console.error("addDocumentToNamespace", e.message);
      return { vectorized: false, error: e.message };
    }
  }

  async similarityResponse({
    client,
    namespace,
    queryVector,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }) {
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: [],
    };
    // Namespace should already be sanitized, but let's be defensive
    const sanitizedNamespace = this.sanitizeNamespace(namespace);
    const collection = await client.collection(sanitizedNamespace);
    const responses = await collection
      .find(
        {},
        {
          sort: { $vector: queryVector },
          limit: topN,
          includeSimilarity: true,
        }
      )
      .toArray();

    responses.forEach((response) => {
      if (response.$similarity < similarityThreshold) return;
      if (filterIdentifiers.includes(sourceIdentifier(response.metadata))) {
        console.log(
          "AstraDB: A source was filtered from context as it's parent document is pinned."
        );
        return;
      }
      result.contextTexts.push(response.metadata.text);
      result.sourceDocuments.push(response);
      result.scores.push(response.$similarity);
    });
    return result;
  }

  async allNamespaces(client) {
    try {
      let header = new Headers();
      header.append("Token", client?.httpClient?.applicationToken);
      header.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        findCollections: {},
      });

      let requestOptions = {
        method: "POST",
        headers: header,
        body: raw,
        redirect: "follow",
      };

      const call = await fetch(client?.httpClient?.baseUrl, requestOptions);
      const resp = await call?.text();
      const collections = resp ? JSON.parse(resp)?.status?.collections : [];
      return collections;
    } catch (e) {
      console.error("Astra::AllNamespace", e);
      return [];
    }
  }
}

module.exports.AstraDB = AstraDB;
