const { Client } = require("@elastic/elasticsearch");
const { TextSplitter } = require("../../TextSplitter");
const { SystemSettings } = require("../../../models/systemSettings");
const { cachedVectorInformation } = require("../../files");
const { v4: uuidv4 } = require("uuid");
const { getEmbeddingEngineSelection } = require("../../helpers");
const { sourceIdentifier } = require("../../chats");
const COLLECTION_REGEX = new RegExp();
  

const Elasticsearch = {
    name: "Elasticsearch",
  
  normalize: function (inputString) {
    if (COLLECTION_REGEX.test(inputString)) return inputString;
    let normalized = inputString.replace(/[^a-zA-Z0-9_-]/g, "-");

    normalized = normalized.replace(/\.\.+/g, ".");

    if (normalized[0] && !/^[a-zA-Z0-9]$/.test(normalized[0])) {
      normalized = "anythingllm-" + normalized.slice(1);
    }

    if (normalized[normalized.length - 1] && !/^[a-zA-Z0-9]$/.test(normalized[normalized.length - 1])) {
      normalized = normalized.slice(0, -1);
    }

    if (normalized.length < 3) {
      normalized = `anythingllm-${normalized}`;
    } else if (normalized.length > 63) {
      normalized = this.normalize(normalized.slice(0, 63));
    }

    if (/^\d+\.\d+\.\d+\.\d+$/.test(normalized)) {
      normalized = "-" + normalized.slice(1);
    }

    return normalized;
  },

  connect: async function () {
    if (process.env.VECTOR_DB !== "elasticsearch")
      throw new Error("Elasticsearch::Invalid ENV settings");

    const client = new Client({
      node: process.env.ELASTIC_ENDPOINT || 'http://localhost:9200',
      ...(!!process.env.ELASTIC_API_HEADER && !!process.env.ELASTIC_API_KEY
        ? {
            headers: {
              [process.env.ELASTIC_API_HEADER || 'Authorization']: process.env.ELASTIC_API_KEY
            }
          }
        : {}),
    });

    const isAlive = await client.cluster.health();
    if (!isAlive)
      throw new Error("ElasticsearchDB::Cluster health check failed - is the instance online?");
    
    return { client };
  },

  heartbeat: async function () {
    const { client } = await this.connect();
    const status = await client.cluster.health();
    return { status: status.status };
  },

  totalVectors: async function () {
    const { client } = await this.connect();
    const indexStats = await client.indices.stats({ metric: 'docs' });
    return indexStats.body._all.total.docs.count || 0;
  },

  distanceToSimilarity: function (distance = null) {
    if (distance === null || typeof distance !== "number") return 0.0;
    if (distance >= 1.0) return 1;
    if (distance <= 0) return 0;
    return 1 - distance;
  },

  namespaceCount: async function (_namespace = null) {
    const { client } = await this.connect();
    const indexName = this.normalize(_namespace);
    const indexStats = await client.indices.stats({ index: indexName });
    return indexStats.body._all.total.docs.count || 0;
  },

  similarityResponse: async function (
    client,
    namespace,
    queryVector,
    similarityThreshold = 0.25,
    topN = 4,
    filterIdentifiers = []
  ) {
    const indexName = this.normalize(namespace);
    const response = await client.search({
      index: indexName,
      body: {
        query: {
          script_score: {
            query: { match_all: {} },
            script: {
              source:"cosineSimilarity(params.queryVector, 'embedding') + 1.0", 
              params: { queryVector },
            },
          }
        },
        size: topN
      }
    });
  
    const result = {
      contextTexts: [],
      sourceDocuments: [],
      scores: []
    };

    response.body.hits.hits.forEach(hit => {
      const score = this.distanceToSimilarity(hit._score);
      if (score < similarityThreshold) return;
      if (filterIdentifiers.includes(sourceIdentifier(hit._source.metadata))) {
        console.log("Elasticsearch: A source was filtered from context as its parent document is pinned.");
        return;
      }

      result.contextTexts.push(hit._source.text);
      result.sourceDocuments.push(hit._source.metadata);
      result.scores.push(score);
    });

    return result;
  },

  hasNamespace: async function (namespace = null) {
    if (!namespace) return false;
    const { client } = await this.connect();
    return await this.namespaceExists(client, this.normalize(namespace));
  },

  namespaceExists: async function (client, namespace = null) {
    if (!namespace) throw new Error("No namespace value provided.");
    const indexName = this.normalize(namespace);
    const exists = await client.indices.exists({ index: indexName });
    return exists.body;
  },

  deleteVectorsInNamespace: async function (client, namespace = null) {
    const indexName = this.normalize(namespace);
    await client.indices.delete({ index: indexName });
    return true;
  },

  addDocumentToNamespace: async function (
    namespace,
    documentData = {},
    fullFilePath = null,
    skipCache = false
  ) {
    const { DocumentVectors } = require("../../../models/vectors");
    try {
      const { pageContent, docId, ...metadata } = documentData;
      if (!pageContent || pageContent.length == 0) return false;

      console.log("Adding new vectorized document into namespace", namespace);

      if (skipCache) {
        const cacheResult = await cachedVectorInformation(fullFilePath);
        if (cacheResult.exists) {
          const { client } = await this.connect();
          const indexName = this.normalize(namespace);
          const { chunks } = cacheResult;

          for (const chunk of chunks) {
            const documentVectors = [];
            for (const vectorChunk of chunk) {
              const id = uuidv4();
              const { id: _id, ...metadata } = vectorChunk.metadata;

              documentVectors.push({ docId, vectorId: id });

              if (!(await this.namespaceExists(client, namespace))){
                await client.indices.create({
                  index: indexName,
                  body: {
                    mappings: {
                      properties: {
                        text: {
                          type: "text"
                        },
                        embedding: {
                          type: "dense_vector",
                          dims: vectorChunk.values.length
                        },
                        metadata: {
                          type: "object"
                        }
                      }
                    }
                  }
                });
                console.log(`Index ${indexName} created with mappings.`);
              }
              const response = await client.index({
                index: indexName,
                id,
                body: {
                  text: metadata.text,
                  embedding: vectorChunk.values,
                  metadata
                }
              });

              if (!response) throw new Error("Error embedding into ElasticsearchDB");
            }

            await DocumentVectors.bulkInsert(documentVectors);
          }

          return { vectorized: true, error: null };
        }
      }

      const EmbedderEngine = getEmbeddingEngineSelection();
      const textSplitter = new TextSplitter({
        chunkSize: TextSplitter.determineMaxChunkSize(
          await SystemSettings.getValueOrFallback({
            label: "text_splitter_chunk_size"
          }),
          EmbedderEngine?.embeddingMaxChunkLength
        ),
        chunkOverlap: await SystemSettings.getValueOrFallback(
          { label: "text_splitter_chunk_overlap" },
          20
        ),
        chunkHeaderMeta: {
          sourceDocument: metadata?.title,
          published: metadata?.published || "unknown",
        },
      });

      const textChunks = await textSplitter.splitText(pageContent);
      console.log("Chunks created from document:", textChunks.length);

      const vectorValues = await EmbedderEngine.embedChunks(textChunks);
      const documentVectors = [];
      const { client } = await this.connect();
      const indexName = this.normalize(namespace);

      for (const [i, vector] of vectorValues.entries()) {
        const vectorRecord = {
          id: uuidv4(),
          values: vector,
          metadata: { ...metadata, text: textChunks[i] },
        };
        if (!(await this.namespaceExists(client, namespace))){
          await client.indices.create({
            index: indexName,
            body: {
              mappings: {
                properties: {
                  embedding: {
                    type: "dense_vector",
                    dims: vectorRecord.values.length
                  },
                  metadata: {
                    type: "object"
                  }
                }
              }
            }
          });
        }
        await client.index({
          index: indexName,
          id: vectorRecord.id,
          body: {
            text: textChunks[i],
            embedding: vectorRecord.values,
            metadata: vectorRecord.metadata
          }
        });

        documentVectors.push({ docId, vectorId: vectorRecord.id });
      }

      await DocumentVectors.bulkInsert(documentVectors);
      return { vectorized: true, error: null };
    } catch (e) {
      console.error("addDocumentToNamespace", e.message);
      return { vectorized: false, error: e.message };
    }
  },

  deleteDocumentFromNamespace: async function (namespace, docId) {
    const { DocumentVectors } = require("../../../models/vectors");
    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, namespace))) return;

    const indexName = this.normalize(namespace);
    const knownDocuments = await DocumentVectors.where({ docId });

    if (knownDocuments.length === 0) return;

    const vectorIds = knownDocuments.map(doc => doc.vectorId);

    for (const vectorId of vectorIds) {
      await client.delete({
        index: indexName,
        id: vectorId
      });
    }

    const indexes = knownDocuments.map(doc => doc.id);
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
    if (!namespace || !input || !LLMConnector)
      throw new Error("Invalid request to performSimilaritySearch.");

    const { client } = await this.connect();
    if (!(await this.namespaceExists(client, this.normalize(namespace)))) {
      return {
        contextTexts: [],
        sources: [],
        message: "Invalid query - no documents found for workspace!",
      };
    }

    const queryVector = await LLMConnector.embedTextInput(input);
    
    const { contextTexts, sourceDocuments } = await this.similarityResponse(
      client,
      namespace,
      queryVector,
      similarityThreshold,
      topN,
      filterIdentifiers
    );

    const sources = sourceDocuments.map((metadata, i) => {
      return { metadata: { ...metadata, text: contextTexts[i] } };
    });
    return {
      contextTexts,
      sources: this.curateSources(sources),
      message: false,
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

module.exports.ElasticsearchDB = Elasticsearch;