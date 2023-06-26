const { checkForMigrations } = require("../utils/database");

const WorkspaceChats = {
  tablename: "workspace_chats",
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workspaceId INTEGER NOT NULL,
  prompt TEXT NOT NULL,
  response TEXT NOT NULL,
  include BOOL DEFAULT true,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  lastUpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  `,
  migrateTable: async function () {
    console.log(
      `\x1b[34m[MIGRATING]\x1b[0m Checking for WorkspaceChats migrations`
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
  new: async function ({ workspaceId, prompt, response = {} }) {
    const db = await this.db();
    const { id, success, message } = await db
      .run(
        `INSERT INTO ${this.tablename} (workspaceId, prompt, response) VALUES (?, ?, ?)`,
        [workspaceId, prompt, JSON.stringify(response)]
      )
      .then((res) => {
        return { id: res.lastID, success: true, message: null };
      })
      .catch((error) => {
        return { id: null, success: false, message: error.message };
      });
    if (!success) {
      db.close();
      return { chat: null, message };
    }

    const chat = await db.get(
      `SELECT * FROM ${this.tablename} WHERE id = ${id}`
    );
    db.close();

    return { chat, message: null };
  },
  forWorkspace: async function (workspaceId = null, limit = null) {
    if (!workspaceId) return [];
    return await this.where(
      `workspaceId = ${workspaceId} AND include = true`,
      limit,
      "ORDER BY id ASC"
    );
  },
  markHistoryInvalid: async function (workspaceId = null) {
    if (!workspaceId) return;
    const db = await this.db();
    await db.run(
      `UPDATE ${this.tablename} SET include = false WHERE workspaceId = ?`,
      [workspaceId]
    );
    db.close();

    return;
  },
  get: async function (clause = "") {
    const db = await this.db();
    const result = await db
      .get(`SELECT * FROM ${this.tablename} WHERE ${clause}`)
      .then((res) => res || null);
    db.close();

    if (!result) return null;
    return result;
  },
  delete: async function (clause = "") {
    const db = await this.db();
    await db.get(`DELETE FROM ${this.tablename} WHERE ${clause}`);
    db.close();

    return true;
  },
  where: async function (clause = "", limit = null, order = null) {
    const db = await this.db();
    const results = await db.all(
      `SELECT * FROM ${this.tablename} ${clause ? `WHERE ${clause}` : ""} ${
        !!order ? order : ""
      } ${!!limit ? `LIMIT ${limit}` : ""} `
    );
    db.close();

    return results;
  },
};

module.exports = { WorkspaceChats };
