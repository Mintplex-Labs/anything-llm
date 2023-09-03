const { Telemetry } = require("./telemetry");

const ApiKey = {
  tablename: "api_keys",
  writable: [],
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  secret TEXT UNIQUE,
  createdBy INTEGER DEFAULT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  lastUpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  `,
  migrateTable: async function () {
    const { checkForMigrations } = require("../utils/database");
    console.log(`\x1b[34m[MIGRATING]\x1b[0m Checking for ApiKey migrations`);
    const db = await this.db(false);
    await checkForMigrations(this, db);
  },
  migrations: function () {
    return [];
  },
  makeSecret: () => {
    const uuidAPIKey = require("uuid-apikey");
    return uuidAPIKey.create().apiKey;
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
  create: async function (createdByUserId = null) {
    const db = await this.db();
    const { id, success, message } = await db
      .run(`INSERT INTO ${this.tablename} (secret, createdBy) VALUES(?, ?)`, [
        this.makeSecret(),
        createdByUserId,
      ])
      .then((res) => {
        return { id: res.lastID, success: true, message: null };
      })
      .catch((error) => {
        return { id: null, success: false, message: error.message };
      });

    if (!success) {
      db.close();
      console.error("FAILED TO CREATE API KEY.", message);
      return { apiKey: null, error: message };
    }

    const apiKey = await db.get(
      `SELECT * FROM ${this.tablename} WHERE id = ${id} `
    );
    db.close();
    await Telemetry.sendTelemetry("api_key_created");
    return { apiKey, error: null };
  },
  get: async function (clause = "") {
    const db = await this.db();
    const result = await db
      .get(
        `SELECT * FROM ${this.tablename} ${clause ? `WHERE ${clause}` : clause}`
      )
      .then((res) => res || null);
    if (!result) return null;
    db.close();
    return { ...result };
  },
  count: async function (clause = null) {
    const db = await this.db();
    const { count } = await db.get(
      `SELECT COUNT(*) as count FROM ${this.tablename} ${
        clause ? `WHERE ${clause}` : ""
      } `
    );
    db.close();

    return count;
  },
  delete: async function (clause = "") {
    const db = await this.db();
    await db.get(
      `DELETE FROM ${this.tablename} ${clause ? `WHERE ${clause}` : ""}`
    );
    db.close();

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
  whereWithUser: async function (clause = "", limit = null) {
    const { User } = require("./user");
    const apiKeys = await this.where(clause, limit);

    for (const apiKey of apiKeys) {
      if (!apiKey.createdBy) continue;
      const user = await User.get(`id = ${apiKey.createdBy}`);
      if (!user) continue;

      apiKey.createdBy = {
        id: user.id,
        username: user.username,
        role: user.role,
      };
    }

    return apiKeys;
  },
};

module.exports = { ApiKey };
