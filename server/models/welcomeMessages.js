const WelcomeMessages = {
  tablename: "welcome_messages",
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT NOT NULL,
  response TEXT NOT NULL,
  orderIndex INTEGER,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  `,

  migrateTable: async function () {
    const { checkForMigrations } = require("../utils/database");
    console.log(
      `\x1b[34m[MIGRATING]\x1b[0m Checking for Welcome Messages migrations`
    );
    const db = await this.db(false);
    await checkForMigrations(this, db);
    db.close();
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

    if (tracing) {
      db.on("trace", (sql) => console.log(sql));
    }

    return db;
  },

  get: async function (clause = "") {
    const db = await this.db();
    const result = await db
      .get(`SELECT * FROM ${this.tablename} WHERE ${clause}`)
      .then((res) => res || null);
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

  saveAll: async function (messages) {
    const db = await this.db();
    await db.run(`DELETE FROM ${this.tablename}`);
    for (const [index, message] of messages.entries()) {
      await db.run(
        `INSERT INTO ${this.tablename} (user, response, orderIndex) VALUES (?, ?, ?)`,
        [message.user, message.response, index]
      );
    }
    db.close();
  },

  getMessages: async function () {
    const db = await this.db();
    const results = await db.all(
      `SELECT user, response FROM ${this.tablename} ORDER BY orderIndex ASC`
    );
    db.close();
    return results;
  },
};

module.exports.WelcomeMessages = WelcomeMessages;
