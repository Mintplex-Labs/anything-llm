const WorkspaceUser = {
  tablename: "workspace_users",
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  workspace_id INTEGER NOT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  lastUpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  FOREIGN KEY (workspace_id) REFERENCES workspaces (id) ON DELETE CASCADE
  `,
  migrateTable: async function () {
    const { checkForMigrations } = require("../utils/database");
    console.log(
      `\x1b[34m[MIGRATING]\x1b[0m Checking for Workspace User migrations`
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
      `PRAGMA foreign_keys = ON;CREATE TABLE IF NOT EXISTS ${this.tablename} (${this.colsInit})`
    );

    if (tracing) db.on("trace", (sql) => console.log(sql));
    return db;
  },
  createMany: async function (userId, workspaceIds = []) {
    if (workspaceIds.length === 0) return;
    const db = await this.db();
    const stmt = await db.prepare(
      `INSERT INTO ${this.tablename} (user_id, workspace_id) VALUES (?,?)`
    );

    for (const workspaceId of workspaceIds) {
      stmt.run([userId, workspaceId]);
    }

    stmt.finalize();
    db.close();
    return;
  },
  createManyUsers: async function (userIds = [], workspaceId) {
    if (userIds.length === 0) return;
    const db = await this.db();
    const stmt = await db.prepare(
      `INSERT INTO ${this.tablename} (user_id, workspace_id) VALUES (?,?)`
    );

    for (const userId of userIds) {
      stmt.run([userId, workspaceId]);
    }

    stmt.finalize();
    db.close();
    return;
  },
  create: async function (userId = 0, workspaceId = 0) {
    const db = await this.db();
    const { success, message } = await db
      .run(
        `INSERT INTO ${this.tablename} (user_id, workspace_id) VALUES (?, ?)`,
        [userId, workspaceId]
      )
      .then((res) => {
        return { id: res.lastID, success: true, message: null };
      })
      .catch((error) => {
        return { id: null, success: false, message: error.message };
      });

    if (!success) {
      db.close();
      console.error("FAILED TO CREATE WORKSPACE_USER RELATIONSHIP.", message);
      return false;
    }
    return true;
  },
  get: async function (clause = "") {
    const db = await this.db();
    const result = await db
      .get(`SELECT * FROM ${this.tablename} WHERE ${clause}`)
      .then((res) => res || null);
    if (!result) return null;
    db.close();

    return result;
  },
  where: async function (clause = null, limit = null) {
    const db = await this.db();
    const results = await db.all(
      `SELECT * FROM ${this.tablename} ${clause ? `WHERE ${clause}` : ""} ${
        !!limit ? `LIMIT ${limit}` : ""
      }`
    );
    db.close();

    return results;
  },
  count: async function (clause = null) {
    const db = await this.db();
    const { count } = await db.get(
      `SELECT COUNT(*) as count FROM ${this.tablename} ${
        clause ? `WHERE ${clause}` : ""
      }`
    );
    db.close();

    return count;
  },
  delete: async function (clause = null) {
    const db = await this.db();
    await db.get(`DELETE FROM ${this.tablename} WHERE ${clause}`);
    return;
  },
};

module.exports.WorkspaceUser = WorkspaceUser;
