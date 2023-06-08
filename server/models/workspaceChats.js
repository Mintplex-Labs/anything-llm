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
    if (!success) return { chat: null, message };

    const chat = await db.get(
      `SELECT * FROM ${this.tablename} WHERE id = ${id}`
    );
    return { chat, message: null };
  },
  forWorkspace: async function (workspaceId = null) {
    if (!workspaceId) return [];
    return await this.where(
      `workspaceId = ${workspaceId} AND include = true`,
      null,
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
    return;
  },
  get: async function (clause = "") {
    const db = await this.db();
    const result = await db
      .get(`SELECT * FROM ${this.tablename} WHERE ${clause}`)
      .then((res) => res || null);
    if (!result) return null;
    return result;
  },
  delete: async function (clause = "") {
    const db = await this.db();
    await db.get(`DELETE FROM ${this.tablename} WHERE ${clause}`);
    return true;
  },
  where: async function (clause = "", limit = null, order = null) {
    const db = await this.db();
    const results = await db.all(
      `SELECT * FROM ${this.tablename} ${clause ? `WHERE ${clause}` : ""} ${
        !!limit ? `LIMIT ${limit}` : ""
      } ${!!order ? order : ""}`
    );
    return results;
  },
};

module.exports = { WorkspaceChats };
