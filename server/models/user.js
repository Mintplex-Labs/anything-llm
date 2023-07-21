const User = {
  tablename: "users",
  writable: [],
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT "default",
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  lastUpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  `,
  migrateTable: async function () {
    const { checkForMigrations } = require("../utils/database");
    console.log(`\x1b[34m[MIGRATING]\x1b[0m Checking for User migrations`);
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
  create: async function ({ username, password, role = null }) {
    const bcrypt = require("bcrypt");
    const db = await this.db();
    const { id, success, message } = await db
      .run(
        `INSERT INTO ${this.tablename} (username, password, role) VALUES(?, ?, ?)`,
        [username, bcrypt.hashSync(password, 10), role ?? "default"]
      )
      .then((res) => {
        return { id: res.lastID, success: true, message: null };
      })
      .catch((error) => {
        return { id: null, success: false, message: error.message };
      });

    if (!success) {
      db.close();
      console.error("FAILED TO CREATE USER.", message);
      return { user: null, error: message };
    }

    const user = await db.get(
      `SELECT * FROM ${this.tablename} WHERE id = ${id} `
    );
    db.close();

    return { user, error: null };
  },
  get: async function (clause = "") {
    const db = await this.db();
    const result = await db
      .get(`SELECT * FROM ${this.tablename} WHERE ${clause}`)
      .then((res) => res || null);
    if (!result) return null;
    db.close();
    return { ...result };
  },
  delete: async function (clause = "") {
    const db = await this.db();
    await db.get(`DELETE FROM ${this.tablename} WHERE ${clause}`);
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
};

module.exports = { User };
