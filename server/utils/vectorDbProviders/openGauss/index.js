const { Pool } = require("pg-opengauss");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { v4: uuidv4 } = require("uuid");
const {
  storeVectorResult,
  cachedVectorInformation,
  documentsPath,
} = require("../../files");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { sourceIdentifier } = require("../../chats");

const OpenGauss = {
  name: "openGauss",
  normalize: function (inputString) {
    return inputString.replace(/[^a-zA-Z0-9_]/g, "_");
  },
  connect: async function () {
    if (process.env.VECTOR_DB !== "openGauss") {
      throw new Error("openGauss::Invalid ENV settings");
    }
    const pool = new Pool({
      host: process.env.OPENGAUSS_HOST,
      port: process.env.OPENGAUSS_PORT,
      user: process.env.OPENGAUSS_USERNAME,
      password: process.env.OPENGAUSS_PASSWORD,
      database: process.env.OPENGAUSS_DATABASE,
    });
    try {
      const check_table = `CREATE TABLE IF NOT EXISTS namespaces
                (
                    namespace  TEXT,
                    rowcount   INTEGER,
                    DIMENSIONS INTEGER
                );
            `;
      await pool.query(check_table);
      return { client: pool };
    } catch (error) {
      throw new Error("openGauss::Connection error: ${error.message}");
    }
  },
  heartbeat: async function () {
    await this.connect();
    return { heartbeat: Number(new Date()) };
  },
  totalVectors: async function () {
    const { client } = await this.connect();
    const query = `SELECT SUM(rowcount) FROM namespaces`;
    const result = await client.query(query);
    return Number(result.rows[0].count);
  },
  namespaceCount: async function (_namespace = null) {
    if (!_namespace) {
      return 0;
    }
    const { client } = await this.connect();
    const query = "SELECT rowcount FROM namespaces WHERE namespace = $1";
    const result = await client.query(query, [this.normalize(_namespace)]);
    return result.rows.length > 0 ? Number(result.rows[0].count) : 0;
  },
  namespace: async function (client, namespace = null) {
    if (!namespace) {
      throw new Error("No namespace value provided.");
    }
    const query = "SELECT * FROM namespaces WHERE namespace = $1";
    const result = await client.query(query, [this.normalize(namespace)]);
    return result.rows.length > 0 ? result.rows[0] : null;
  },
  hasNamespace: async function (namespace = null) {
    if (!namespace) {
      return false;
    }
    const { client } = await this.connect();
    const query =
      "SELECT EXISTS(SELECT * FROM namespaces WHERE namespace = $1)";
    const result = await client.query(query, [this.normalize(namespace)]);
    return result.rows[0].exists;
  },
  deleteVectorsInNamespace: async function (client, namespace = null) {
    if (!namespace) {
      throw new Error("No namespace value provided.");
    }
    const query = "DELETE FROM ${this.normalize(namespace)}";
    await client.query(query);
    await client.query(
      "UPDATE namespaces SET rowcount = 0 WHERE namespace = $1",
      [this.normalize(namespace)]
    );
    return true;
  },
  getOrCreateCollection: async function (client, namespace, dimensions = null) {
    const isExists = await this.hasNamespace(namespace);
    if (!isExists) {
      if (!dimensions) {
        throw new Error(
          "openGauss::getOrCreateCollection Unable to infer vector dimension from input,"
        );
      }
      const createTableQuery = `
                CREATE TABLE IF NOT EXISTS ${namespace} (
                    id VARCHAR(255) PRIMARY KEY,
                    vector VECTOR(${dimensions}),
                    metadata JSONB
                );`;
      await client.query(createTableQuery);
      const insertStatQuery =
        "INSERT INTO namespaces (namespace, rowcount, dimensions) VALUES ($1, 0, $2)";
      await client.query(insertStatQuery, [namespace, dimensions]);
    }
  },
  addDocumentToNamespace: async function (
    namespace,
    documentData = {},
    fullFilePath = null,
    skipCache = false
  ) {
    const { DocumentVectors } = require("../../../models/vectors");
    try {
      let vectorDimension = null;
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length === 0) {
        return { vectorized: false, error: "No page content provided." };
      }
      if (skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { client } = await this.connect();
          const { chunks } = cacheResult;
          const documentVectors = [];
          vectorDimension = chunks[0][0].values.length || null;
          await this.getOrCreateCollection(client, namespace, vectorDimension);
          try {
            for (const chunk of chunks) {
              for (const chunkItem of chunk) {
                const id = uuidv4();
                documentVectors.push({ docId, vectorId: id });
                const insertQuery = `
                                    INSERT INTO ${this.normalize(namespace)} (id, vector, metadata)
                                    VALUES ('${id}', '[${chunkItem.values}]', '$1')
                                `;
                await client.query(insertQuery, [
                  JSON.stringify(chunkItem.metadata),
                ]);
                await client.query(
                  `UPDATE namespaces SET rowcount = rowcount + 1 WHERE namespace = '${namespace}'`
                );
              }
            }
            await DocumentVectors.bulkInsert(documentVectors);
            return { vectorized: true, error: null };
          } catch (insertError) {
            console.error(
              "Error inserting cached chunks:",
              insertError.message
            );
            return { vectorized: false, error: insertError.message };
          }
        }
      }
      const EmbedderEngine = getEmbeddingEngineSelection();
      const textSplitter = new TextSplitter({
        chunkSize: TextSplitter.determineMaxChunkSize(
          await SystemSettings.getValueOrFallback({
            label: "text_splitter_chunk_size",
          }),
          EmbedderEngine?.embeddingMaxChunkLength
        ),
        chunkOverlap: await SystemSettings.getValueOrFallback(
          { label: "text_splitter_chunk_overlap" },
          20
        ),
        chunkHeaderMeta: TextSplitter.buildHeaderMeta(metadata),
      });
      const textChunks = await textSplitter.splitText(pageContent);
      console.log("Chunks created from document:", textChunks.length);
      const documentVectors = [];
      const vectors = [];
      const vectorValues = await EmbedderEngine.embedChunks(textChunks);
      if (!!vectorValues && vectorValues.length > 0) {
        for (const [i, vector] of vectorValues.entries()) {
          if (!vectorDimension) {
            vectorDimension = vector.length;
          }
          const vectorRecord = {
            id: uuidv4(),
            values: vector,
            metadata: { ...metadata, text: textChunks[i] },
          };
          vectors.push(vectorRecord);
          documentVectors.push({ docId, vectorId: vectorRecord.id });
        }
      } else {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }
      if (vectors.length > 0) {
        const { client } = await this.connect();
        await this.getOrCreateCollection(client, namespace, vectorDimension);
        console.log("Inserting vectorized chunks into OpenGauss.");
        for (const vector of vectors) {
          const insertQuery = `
                        INSERT INTO ${this.normalize(namespace)} (id, vector, metadata)
                        VALUES ('${vector.id}', '[${vector.values}]', $1)
                    `;
          await client.query(insertQuery, [JSON.stringify(vector.metadata)]);
        }
        await storeVectorResult(vectors, fullFilePath);
      }
      await DocumentVectors.bulkInsert(documentVectors);
      return { vectorized: true, error: null };
    } catch (e) {
      console.error("addDocumentToNamespace", e);
      return { vectorized: false, error: e.message };
    }
  },
  deleteDocumentFromNamespace: async function (namespace, docId) {
    console.log("deleteDocumentFromNamespace", "\n");
    const { DocumentVectors } = require("../../../models/vectors");
    const { client } = await this.connect();
    if (!(await this.hasNamespace(namespace))) {
      return;
    }
    const knownDocuments = await DocumentVectors.where({ docId });
    if (knownDocuments.length === 0) {
      return;
    }
    const vectorIds = knownDocuments.map((doc) => doc.vectorId);
    const deleteQuery = "DELETE FROM ${namespace} WHERE id = ANY($2::text[])";
    await client.query(deleteQuery, [vectorIds]);
    const indexes = knownDocuments.map((doc) => doc.id);
    await DocumentVectors.deleteIds(indexes);
    return true;
  },
  performSimilaritySearch: async function ({
    namespace = null,
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }) {
    console.log("performSimilaritySearch", "\n");
    if (!namespace || !input || !LLMConnector) {
      throw new Error("Invalid request to performSimilaritySearch.");
    }
    const { client } = await this.connect();
    if (!(await this.hasNamespace(namespace))) {
      return {
        contextTexts: [],
        sources: [],
        message: "Invalid query - no documents found for workspace!",
      };
    }
    const queryVector = await LLMConnector.embedTextInput(input);
    const { contextTexts, sourceDocuments } = await this.similarityResponse({
      client,
      namespace,
      queryVector,
      similarityThreshold,
      topN,
      filterIdentifiers,
    });
    const sources = sourceDocuments.map((metadata, i) => {
      return { ...metadata, text: contextTexts[i] };
    });
    return {
      contextTexts,
      sources: this.curateSources(sources),
      message: false,
    };
  },
  similarityResponse: async function ({
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
    // using l2 distance to query
    const query = `
            SELECT metadata, vector, vector <-> '[${queryVector}]' as score
            FROM ${this.normalize(namespace)}
            ORDER BY score ASC
            LIMIT ${topN}
        `;
    const response = await client.query(query);
    response.rows.forEach((row) => {
      if (row.score < similarityThreshold) {
        return;
      }
      if (filterIdentifiers.includes(sourceIdentifier(row.metadata))) {
        console.log(
          "PostgreSQL: A source was filtered from context as it's parent document is pinned."
        );
        return;
      }
      result.contextTexts.push(row.metadata.text);
      result.sourceDocuments.push(row);
      result.scores.push(row.score);
    });
    return result;
  },
  "namespace-stats": async function (reqBody = {}) {
    console.log("namespace-stats", "\n");
    const { namespace = null } = reqBody;
    if (!namespace) {
      throw new Error("namespace required");
    }
    const { client } = await this.connect();
    if (!(await this.hasNamespace(namespace))) {
      throw new Error("Namespace by that name does not exist.");
    }
    const stats = await this.namespace(client, namespace);
    return stats
      ? stats
      : { message: "No stats were able to be fetched from DB for namespace" };
  },
  "delete-namespace": async function (reqBody = {}) {
    console.log("delete-namespace", "\n");
    const { namespace = null } = reqBody;
    const { client } = await this.connect();
    if (!(await this.hasNamespace(namespace))) {
      throw new Error("Namespace by that name does not exist.");
    }
    const statistics = await this.namespace(client, namespace);
    await this.deleteVectorsInNamespace(client, namespace);
    const vectorCount = await this.namespaceCount(namespace);
    return {
      message: `Namespace ${namespace} was deleted along with ${vectorCount} vectors.`,
    };
  },
  curateSources: function (sources = []) {
    const documents = [];
    for (const source of sources) {
      const { metadata = {} } = source;
      if (Object.keys(metadata).length > 0) {
        documents.push({
          ...metadata,
          ...(source.hasOwnProperty("pageContent")
            ? { text: source.pageContent }
            : {}),
        });
      }
    }
    return documents;
  },
};

module.exports.OpenGauss = OpenGauss;
