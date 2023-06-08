const slugify = require("slugify");
const { Document } = require("./documents");

const Workspace = {
  tablename: "workspaces",
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  vectorTag TEXT DEFAULT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  lastUpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  `,
  db: async function () {
    const sqlite3 = require("sqlite3").verbose();
    const { open } = require("sqlite");

    const db = await open({
      filename: "anythingllm.db",
      driver: sqlite3.Database,
    });

    await db.exec(
      `CREATE TABLE IF NOT EXISTS ${this.tablename} (${this.colsInit})`
    );
    db.on("trace", (sql) => console.log(sql));
    return db;
  },
  new: async function (name = null) {
    if (!name) return { result: null, message: "name cannot be null" };

    const db = await this.db();
    const { id, success, message } = await db
      .run(`INSERT INTO ${this.tablename} (name, slug) VALUES (?, ?)`, [
        name,
        slugify(name, { lower: true }),
      ])
      .then((res) => {
        return { id: res.lastID, success: true, message: null };
      })
      .catch((error) => {
        return { id: null, success: false, message: error.message };
      });
    if (!success) return { workspace: null, message };

    const workspace = await db.get(
      `SELECT * FROM ${this.tablename} WHERE id = ${id}`
    );
    return { workspace, message: null };
  },
  get: async function (clause = "") {
    const db = await this.db();
    const result = await db
      .get(`SELECT * FROM ${this.tablename} WHERE ${clause}`)
      .then((res) => res || null);
    if (!result) return null;

    const documents = await Document.forWorkspace(result.id);
    return { ...result, documents };
  },
  delete: async function (clause = "") {
    const db = await this.db();
    await db.get(`DELETE FROM ${this.tablename} WHERE ${clause}`);
    return true;
  },
  where: async function (clause = "", limit = null) {
    const db = await this.db();
    const results = await db.all(
      `SELECT * FROM ${this.tablename} ${clause ? `WHERE ${clause}` : ""} ${
        !!limit ? `LIMIT ${limit}` : ""
      }`
    );
    return results;
  },
};

module.exports = { Workspace };
