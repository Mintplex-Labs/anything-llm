const Level = require("level");
const levelgraph = require("levelgraph");
const fs = require("fs");
const path = require("path");
const {
  insertIntoGraph,
  _insertIntoGraph,
  _knowledgeGraphSearch,
} = require("./utils");

// Note: Any function beginning with $ will close the database after calling.
// so you should either - re-init the caller and when using non-closing methods you
// MUST call graph.close();
class GraphManager {
  leveldb;
  db;
  namespaceStorageLocation;
  connected = false;

  constructor(options = { namespace: null }) {
    this.graphFolder = `${
      !!process.env.STORAGE_DIR ? `${process.env.STORAGE_DIR}/` : "./storage/"
    }knowledge-graphs`;
    this.cacheFolder = `${
      !!process.env.STORAGE_DIR ? `${process.env.STORAGE_DIR}/` : "./storage/"
    }knowledge-graph-cache`;

    // If you want to start an instance already init'd without having
    // to chain the calls.
    if (!!options.namespace) this.init(options);
    return this;
  }

  // Can also ne called to ensure DB is open before running a method.
  init({ namespace = null }) {
    if (!namespace) throw new Error("Cannot create graph for empty namespace");
    if (!fs.existsSync(this.graphFolder)) fs.mkdirSync(this.graphFolder);

    this.namespace = namespace;
    this.namespaceStorageLocation = path.resolve(this.graphFolder, namespace);
    this.leveldb = new Level(this.namespaceStorageLocation);
    this.db = levelgraph(this.leveldb);
    this.connected = true;
    return this;
  }

  log(text, ...args) {
    console.log(`\x1b[36m[KnowledgeGraphManager]\x1b[0m ${text}`, ...args);
  }

  close() {
    if (!this.connected) return;
    this.db.close();
    this.connected = false;
    return;
  }

  async size() {
    if (!this.connected)
      throw new Error("No database connected - call .init() first.");
    return new Promise((resolve) => {
      this.db.get({}, function (_, results) {
        resolve(results.length);
      });
    });
  }

  // Will delete the entire levelgraph object for a namespace.
  deleteGraph(namespace = null) {
    // If calling from init'd instance no need to check for namespace.
    // since it will be set.
    if (!!this.namespace) {
      if (!fs.existsSync(this.namespaceStorageLocation)) return;
      this.log(
        `Knowledge Graph for namespace "${this.namespace}" was deleted.`
      );
      fs.rmSync(this.namespaceStorageLocation, { recursive: true });
      return;
    }

    if (!namespace)
      throw new Error("cannot resetDB without a namespace value.");
    const filepath = path.resolve(this.graphFolder, namespace);
    if (!fs.existsSync(filepath)) return;
    this.log(`Knowledge Graph for namespace "${namespace}" was deleted.`);
    fs.rmSync(filepath, { recursive: true });
  }

  async $upsert(_args, additionalData = {}, cacheTo = null) {
    if (!this.connected)
      throw new Error("No database connected - call .init() first.");
    const response = await this.put(_args, additionalData, cacheTo);
    this.close();
    return response;
  }

  async put(_args, additionalData = {}, cacheTo = null) {
    if (!this.connected)
      throw new Error("No database connected - call .init() first.");

    const logger = this.log;
    const args = Array.isArray(_args)
      ? _args.map((d) => ({ ...d, ...additionalData }))
      : { ...args, ...additionalData };
    const response = new Promise((resolve, reject) => {
      this.db.put(args, function (err) {
        if (!!err) {
          reject(err);
          return;
        }

        logger(
          `Successful async put of ${
            !args?.length ? "a triplet." : `${args?.length} triplets.`
          }`
        );
        resolve(true);
      });
    });

    cacheTo ? this.saveToCache(args, cacheTo) : null;
    return response;
  }

  // Options:
  // limit: number,
  async $query(triplets, options = {}) {
    if (!this.connected)
      throw new Error("No database connected - call .init() first.");
    const queries = [];

    for (const triplet of triplets) {
      queries.push(() => {
        return new Promise((resolve, reject) => {
          this.db.get(
            { ...triplet, limit: options?.limit || null },
            function (err, list) {
              if (!!err) {
                reject(err);
                return;
              }
              resolve(list);
            }
          );
        });
      });
    }

    const data = await Promise.all(queries.map((f) => f())).then((res) =>
      res.flat()
    );

    this.close();
    return data;
  }

  async $deleteByDocumentId(documentId) {
    if (!this.connected)
      throw new Error("No database connected - call .init() first.");
    const logger = this.log;

    // levelgraph can only delete exact matches of all keys so we need to
    // loop over the collection as we have it and filter on the property we need
    // which is not ideal but the only real solution without doing inverted keys
    // for faster lookups - maybe a future improvement?
    // once we have our objects can we send to .del and they will go away.
    const toDelete = await new Promise((resolve) => {
      this.db.get({}, function (_, results) {
        resolve(results.filter((res) => res.documentId === documentId));
      });
    });

    await new Promise((resolve, reject) => {
      this.db.del(toDelete, function (err) {
        if (!!err) {
          reject(err);
          return;
        }

        logger(`Successful async delete of ${toDelete.length} triplets`);
        resolve(true);
      });
    });

    this.close();
    return;
  }

  hasCache(cacheKey) {
    const cachePath = path.resolve(this.cacheFolder, `${cacheKey}.json`);
    if (!fs.existsSync(cachePath)) return { exists: false, statements: [] };

    try {
      return {
        exists: true,
        statements: JSON.parse(
          fs.readFileSync(cachePath, { encoding: "utf8" })
        ),
      };
    } catch {}
    return { exists: false, statements: [] };
  }

  saveToCache(stmts, cacheKey) {
    this.log(`Saving ${stmts.length} triplets to cache ${cacheKey}.`);
    if (!fs.existsSync(this.cacheFolder)) fs.mkdirSync(this.cacheFolder);
    fs.writeFileSync(
      path.resolve(this.cacheFolder, `${cacheKey}.json`),
      JSON.stringify(stmts),
      { encoding: "utf-8" }
    );
    return;
  }

  async insertIntoGraph(
    namespace = null,
    metadatas = [],
    graphCacheKey = null
  ) {
    return await _insertIntoGraph(this, namespace, metadatas, graphCacheKey);
  }

  async knowledgeGraphSearch(namespace = null, textChunks = []) {
    return await _knowledgeGraphSearch(this, namespace, textChunks);
  }
}

module.exports.GraphManager = GraphManager;
