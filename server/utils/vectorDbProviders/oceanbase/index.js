const mysql = require("mysql2/promise");
const { toChunks, getEmbeddingEngineSelection } = require("../../helpers");
const { TextSplitter } = require("../../TextSplitter");
const { v4: uuidv4 } = require("uuid");
const { sourceIdentifier } = require("../../chats");
const { VectorDatabase } = require("../base");

/**
 * OceanBase vector search via MySQL-compatible protocol.
 * Each workspace namespace is stored as a table `VTB_<slug>` with VECTOR column.
 * Connection env: OB_HOST, OB_PORT, OB_USER, OB_PASSWORD, OB_DATABASE
 */
class OceanBase extends VectorDatabase {
  constructor() {
    super();
  }

  get name() {
    return "OceanBase";
  }

  connectionTimeout = 30_000;

  static vTableName(namespace) {
    return `VTB_${namespace}`;
  }

  static connectionConfig() {
    return {
      host: process.env.OB_HOST,
      port: Number(process.env.OB_PORT) || 2881,
      user: process.env.OB_USER,
      password: process.env.OB_PASSWORD ?? "",
      database: process.env.OB_DATABASE,
    };
  }

  /**
   * @returns {Promise<import("mysql2/promise").Connection>}
   */
  async connect() {
    if (process.env.VECTOR_DB !== "oceanbase") {
      throw new Error("OceanBase::Invalid ENV settings");
    }
    const cfg = OceanBase.connectionConfig();
    if (!cfg.host || !cfg.user || !cfg.database) {
      throw new Error(
        "OceanBase::Missing OB_HOST, OB_USER, or OB_DATABASE in environment"
      );
    }
    const connection = await mysql.createConnection({
      ...cfg,
      connectTimeout: this.connectionTimeout,
    });
    await connection.ping();
    return connection;
  }

  /**
   * @returns {Promise<{ error: string | null, success: boolean }>}
   */
  async heartbeat() {
    let connection = null;
    try {
      connection = await this.connect();
      return { error: null, success: true };
    } catch (err) {
      return { error: err.message, success: false };
    } finally {
      if (connection) await connection.end();
    }
  }

  /**
   * @param {import("mysql2/promise").Connection} connection
   */
  async listVTables(connection) {
    const [rows] = await connection.query(
      `SELECT table_name AS t FROM information_schema.tables
       WHERE table_schema = DATABASE() AND table_name LIKE 'VTB\\_%'`
    );
    return rows.map((row) => row.t);
  }

  /**
   * @param {import("mysql2/promise").Connection} connection
   * @param {string} namespace
   */
  async tableExists(connection, namespace) {
    const t = OceanBase.vTableName(namespace);
    const [rows] = await connection.query(
      `SELECT table_name FROM information_schema.tables
       WHERE table_schema = DATABASE() AND table_name = ?`,
      [t]
    );
    return rows.length > 0;
  }

  async totalVectors() {
    let connection = null;
    try {
      connection = await this.connect();
      const tables = await this.listVTables(connection);
      let count = 0;
      for (const table of tables) {
        const [rows] = await connection.query(
          `SELECT COUNT(*) AS c FROM \`${table}\``
        );
        count += Number(rows[0]?.c || 0);
      }
      return count;
    } catch {
      return 0;
    } finally {
      if (connection) await connection.end();
    }
  }

  distanceToSimilarity(distance = null) {
    if (distance === null || typeof distance !== "number") return 0.0;
    if (distance >= 1.0) return 1;
    if (distance < 0) return 1 - Math.abs(distance);
    return 1 - distance;
  }

  async namespaceCount(namespace = null) {
    let connection = null;
    try {
      connection = await this.connect();
      if (!(await this.tableExists(connection, namespace))) return 0;
      const t = OceanBase.vTableName(namespace);
      const [rows] = await connection.query(
        `SELECT COUNT(*) AS c FROM \`${t}\``
      );
      return Number(rows[0]?.c || 0);
    } catch {
      return 0;
    } finally {
      if (connection) await connection.end();
    }
  }

  async namespace(connection, namespace = null) {
    if (!namespace) throw new Error("No namespace provided");
    const count = await this.namespaceCount(namespace);
    return { name: namespace, vectorCount: count };
  }

  async hasNamespace(namespace = null) {
    if (!namespace) throw new Error("No namespace provided");
    let connection = null;
    try {
      connection = await this.connect();
      return await this.namespaceExists(connection, namespace);
    } catch {
      return false;
    } finally {
      if (connection) await connection.end();
    }
  }

  async namespaceExists(connection, namespace = null) {
    if (!namespace) throw new Error("No namespace provided");
    return this.tableExists(connection, namespace);
  }

  async deleteVectorsInNamespace(connection, namespace = null) {
    if (!namespace) throw new Error("No namespace provided");
    const t = OceanBase.vTableName(namespace);
    await connection.query(`DROP TABLE IF EXISTS \`${t}\``);
    return true;
  }

  /**
   * @param {import("mysql2/promise").Connection} connection
   */
  async updateOrCreateCollection(connection, submissions, namespace) {
    if (!submissions?.length) return;
    const dim = submissions[0].vector.length;
    const t = OceanBase.vTableName(namespace);
    await connection.query(
      `CREATE TABLE IF NOT EXISTS \`${t}\` (id VARCHAR(40) PRIMARY KEY, embedding VECTOR(${dim}) NOT NULL, metadata JSON)`
    );

    await connection.beginTransaction();
    try {
      for (const row of submissions) {
        const vecLiteral = `[${row.vector.map(Number).join(",")}]`;
        await connection.query(
          `INSERT INTO \`${t}\` (id, embedding, metadata) VALUES (?, ?, ?)`,
          [row.id, vecLiteral, JSON.stringify(row.metadata)]
        );
      }
      await connection.commit();
    } catch (e) {
      await connection.rollback();
      throw e;
    }
  }

  async addDocumentToNamespace(
    namespace,
    documentData = {},
    fullFilePath = null,
    skipCache = false
  ) {
    const { DocumentVectors } = require("../../../models/vectors");
    const {
      storeVectorResult,
      cachedVectorInformation,
    } = require("../../files");
    let connection = null;

    try {
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      connection = await this.connect();
      this.logger("Adding new vectorized document into namespace", namespace);

      if (!skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { chunks } = cacheResult;
          const documentVectors = [];
          const submissions = [];

          for (const chunk of chunks.flat()) {
            const id = uuidv4();
            const { id: _id, ...meta } = chunk.metadata;
            documentVectors.push({ docId, vectorId: id });
            submissions.push({
              id,
              vector: chunk.values,
              metadata: meta,
            });
          }

          await this.updateOrCreateCollection(
            connection,
            submissions,
            namespace
          );
          await DocumentVectors.bulkInsert(documentVectors);
          return { vectorized: true, error: null };
        }
      }

      const { SystemSettings } = require("../../../models/systemSettings");
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
        chunkPrefix: EmbedderEngine?.embeddingPrefix,
      });
      const textChunks = await textSplitter.splitText(pageContent);

      this.logger("Snippets created from document:", textChunks.length);
      const documentVectors = [];
      const vectors = [];
      const submissions = [];
      const vectorValues = await EmbedderEngine.embedChunks(textChunks);

      if (!vectorValues || vectorValues.length === 0) {
        throw new Error(
          "Could not embed document chunks! This document will not be recorded."
        );
      }

      for (const [i, vector] of vectorValues.entries()) {
        const vectorRecord = {
          id: uuidv4(),
          values: vector,
          metadata: { ...metadata, text: textChunks[i] },
        };
        vectors.push(vectorRecord);
        submissions.push({
          id: vectorRecord.id,
          vector: vectorRecord.values,
          metadata: vectorRecord.metadata,
        });
        documentVectors.push({ docId, vectorId: vectorRecord.id });
      }

      if (vectors.length > 0) {
        const chunks = [];
        for (const chunk of toChunks(vectors, 500)) chunks.push(chunk);

        this.logger("Inserting vectorized chunks into OceanBase.");
        await this.updateOrCreateCollection(connection, submissions, namespace);
        await storeVectorResult(chunks, fullFilePath);
      }
      await DocumentVectors.bulkInsert(documentVectors);
      return { vectorized: true, error: null };
    } catch (err) {
      this.logger("addDocumentToNamespace", err.message);
      return { vectorized: false, error: err.message };
    } finally {
      if (connection) await connection.end();
    }
  }

  async deleteDocumentFromNamespace(namespace, docId) {
    if (!namespace) throw new Error("No namespace provided");
    if (!docId) throw new Error("No docId provided");

    let connection = null;
    try {
      connection = await this.connect();
      if (!(await this.namespaceExists(connection, namespace))) return false;

      const { DocumentVectors } = require("../../../models/vectors");
      const knownDocuments = await DocumentVectors.where({ docId });
      const vectorIds = knownDocuments.map((doc) => doc.vectorId);
      if (vectorIds.length === 0) return true;

      const t = OceanBase.vTableName(namespace);
      const placeholders = vectorIds.map(() => "?").join(",");
      await connection.query(
        `DELETE FROM \`${t}\` WHERE id IN (${placeholders})`,
        vectorIds
      );

      await DocumentVectors.deleteIds(knownDocuments.map((doc) => doc.id));
      return true;
    } catch (err) {
      this.logger(`deleteDocumentFromNamespace: ${err.message}`);
      return false;
    } finally {
      if (connection) await connection.end();
    }
  }

  /**
   * Parse JSON metadata from OceanBase (may be object or string)
   * @param {any} m
   */
  parseMetadata(m) {
    if (m == null) return {};
    if (typeof m === "object") return m;
    try {
      return JSON.parse(m);
    } catch {
      return {};
    }
  }

  /**
   * Builds a safe string literal for OceanBase `l2_distance(embedding, '[...]')`.
   * MySQL-compatible parsers split `<->` into `<` and JSON `->`, so we use `l2_distance` (see OceanBase vector docs).
   * @param {number[]} queryVector
   */
  static formatVectorLiteral(queryVector) {
    const parts = queryVector.map((n) => {
      const x = Number(n);
      if (!Number.isFinite(x)) throw new Error("Invalid embedding coordinate");
      return String(x);
    });
    return `[${parts.join(",")}]`;
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
    const t = OceanBase.vTableName(namespace);
    const vecLit = OceanBase.formatVectorLiteral(queryVector);
    const limit = Math.max(1, Math.min(10_000, Math.floor(Number(topN)) || 4));
    const [rows] = await client.query(
      `SELECT metadata, l2_distance(embedding, '${vecLit}') AS score FROM \`${t}\` ORDER BY l2_distance(embedding, '${vecLit}') LIMIT ${limit}`
    );

    for (const row of rows) {
      const score = Number(row.score);
      if (this.distanceToSimilarity(score) < similarityThreshold) continue;

      const meta = this.parseMetadata(row.metadata);
      if (filterIdentifiers.includes(sourceIdentifier(meta))) {
        this.logger(
          "A source was filtered from context as it's parent document is pinned."
        );
        continue;
      }

      result.contextTexts.push(meta.text);
      result.sourceDocuments.push({
        ...meta,
        score: this.distanceToSimilarity(score),
      });
      result.scores.push(this.distanceToSimilarity(score));
    }
    return result;
  }

  async performSimilaritySearch({
    namespace = null,
    input = "",
    LLMConnector = null,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = [],
  }) {
    let connection = null;
    if (!namespace || !input || !LLMConnector)
      throw new Error("Invalid request to performSimilaritySearch.");

    try {
      connection = await this.connect();
      if (!(await this.namespaceExists(connection, namespace))) {
        this.logger(
          `The namespace ${namespace} does not exist or has no vectors. Returning empty results.`
        );
        return {
          contextTexts: [],
          sources: [],
          message: null,
        };
      }

      const queryVector = await LLMConnector.embedTextInput(input);
      const { contextTexts, sourceDocuments } = await this.similarityResponse({
        client: connection,
        namespace,
        queryVector,
        similarityThreshold,
        topN,
        filterIdentifiers,
      });

      const sources = sourceDocuments.map((metadata, i) => {
        return { metadata: { ...metadata, text: contextTexts[i] } };
      });
      return {
        contextTexts,
        sources: this.curateSources(sources),
        message: false,
      };
    } catch (err) {
      this.logger("performSimilaritySearch", err.message);
      return {
        contextTexts: [],
        sources: [],
        message: err.message,
      };
    } finally {
      if (connection) await connection.end();
    }
  }

  async "namespace-stats"(reqBody = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("namespace required");

    let connection = null;
    try {
      connection = await this.connect();
      if (!(await this.namespaceExists(connection, namespace)))
        throw new Error("Namespace by that name does not exist.");
      return await this.namespace(connection, namespace);
    } catch (err) {
      return {
        message: `Error fetching stats for namespace ${namespace}: ${err.message}`,
      };
    } finally {
      if (connection) await connection.end();
    }
  }

  async "delete-namespace"(reqBody = {}) {
    const { namespace = null } = reqBody;
    if (!namespace) throw new Error("No namespace provided");

    let connection = null;
    try {
      const existingCount = await this.namespaceCount(namespace);
      if (existingCount === 0)
        return {
          message: `Namespace ${namespace} does not exist or has no vectors.`,
        };

      connection = await this.connect();
      await this.deleteVectorsInNamespace(connection, namespace);
      return {
        message: `Namespace ${namespace} was deleted along with ${existingCount} vectors.`,
      };
    } catch (err) {
      return {
        message: `Error deleting namespace ${namespace}: ${err.message}`,
      };
    } finally {
      if (connection) await connection.end();
    }
  }

  /**
   * Drop all vector tables with prefix VTB_
   */
  async reset() {
    let connection = null;
    try {
      connection = await this.connect();
      const tables = await this.listVTables(connection);
      for (const table of tables) {
        await connection.query(`DROP TABLE IF EXISTS \`${table}\``);
      }
      return { reset: true };
    } catch {
      return { reset: false };
    } finally {
      if (connection) await connection.end();
    }
  }

  curateSources(sources = []) {
    const documents = [];
    for (const source of sources) {
      const { text, vector: _v, _distance: _d, ...rest } = source;
      const metadata = rest.hasOwnProperty("metadata") ? rest.metadata : rest;
      if (Object.keys(metadata).length > 0) {
        documents.push({
          ...metadata,
          ...(text ? { text } : {}),
        });
      }
    }
    return documents;
  }

  /**
   * @returns {Promise<{ error: string | null, success: boolean }>}
   */
  static async validateConnection() {
    const instance = new OceanBase();
    try {
      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            error: `Connection timeout (${(instance.connectionTimeout / 1000).toFixed(0)}s).`,
            success: false,
          });
        }, instance.connectionTimeout);
      });
      const run = (async () => {
        let conn = null;
        try {
          conn = await instance.connect();
          return { error: null, success: true };
        } catch (err) {
          return { error: err.message, success: false };
        } finally {
          if (conn) await conn.end();
        }
      })();
      return await Promise.race([run, timeoutPromise]);
    } catch (err) {
      return { error: err.message, success: false };
    }
  }
}

module.exports = { OceanBase };
