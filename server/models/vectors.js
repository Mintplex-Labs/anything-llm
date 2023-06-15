const { checkForMigrations } = require("../utils/database");
const { Document } = require("./documents");

// TODO: Do we want to store entire vectorized chunks in here
// so that we can easily spin up temp-namespace clones for threading
const DocumentVectors = {
  tablename: "document_vectors",
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  docId TEXT NOT NULL,
  vectorId TEXT NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  lastUpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  `,
  migrateTable: async function () {
    console.log(
      `\x1b[34m[MIGRATING]\x1b[0m Checking for DocumentVector migrations`
    );
    const db = await this.db(false);
    await checkForMigrations(this, db);
  },
  migrations: function () {
    return [];
  },
  db: async function (tracing = true) {
    const sqlite3 = require("sqlite3").verbose();
    const { open } = require("sqlite");

    const db = await open({
      filename: `${
        !!process.env.STORAGE_DIR ? `${process.env.STORAGE_DIR}/` : "storage/"
      }anythingllm.db`,
      driver: sqlite3.Database,
    });

    await db.exec(
      `CREATE TABLE IF NOT EXISTS ${this.tablename} (${this.colsInit})`
    );

    if (tracing) db.on("trace", (sql) => console.log(sql));
    return db;
  },
  bulkInsert: async function (vectorRecords = []) {
    if (vectorRecords.length === 0) return;

    const db = await this.db();

    // Build a single query string with multiple placeholders for the INSERT operation
    const placeholders = vectorRecords.map(() => "(?, ?)").join(", ");

    const stmt = await db.prepare(
      `INSERT INTO ${this.tablename} (docId, vectorId) VALUES ${placeholders}`
    );

    // Flatten the vectorRecords array to match the order of placeholders
    const values = vectorRecords.reduce(
      (arr, record) => arr.concat([record.docId, record.vectorId]),
      []
    );

    stmt.run(values);
    stmt.finalize();
    db.close();

    return { documentsInserted: vectorRecords.length };
  },
  deleteForWorkspace: async function (workspaceId) {
    const documents = await Document.forWorkspace(workspaceId);
    const docIds = [...new Set(documents.map((doc) => doc.docId))];
    const ids = (
      await this.where(`docId IN (${docIds.map((id) => `'${id}'`).join(",")})`)
    ).map((doc) => doc.id);
    await this.deleteIds(ids);
    return true;
  },
  where: async function (clause = "", limit = null) {
    const db = await this.db();
    const results = await db.all(
      `SELECT * FROM ${this.tablename} ${clause ? `WHERE ${clause}` : ""} ${
        !!limit ? `LIMIT ${limit}` : ""
      }`
    );

    db.close();
    return results;
  },
  deleteIds: async function (ids = []) {
    const db = await this.db();
    await db.get(
      `DELETE FROM ${this.tablename} WHERE id IN (${ids.join(", ")}) `
    );
    db.close();
    return true;
  },
};

module.exports = { DocumentVectors };
