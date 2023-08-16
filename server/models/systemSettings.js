const SystemSettings = {
  supportedFields: [
    "multi_user_mode",
    "users_can_delete_workspaces",
    "limit_user_messages",
    "message_limit",
    "logo_filename",
    "telemetry_id",
  ],
  privateField: [],
  tablename: "system_settings",
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  label TEXT UNIQUE NOT NULL,
  value TEXT,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  lastUpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  `,
  migrateTable: async function () {
    const { checkForMigrations } = require("../utils/database");
    console.log(
      `\x1b[34m[MIGRATING]\x1b[0m Checking for System Setting migrations`
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
  updateSettings: async function (updates = {}) {
    const validConfigKeys = Object.keys(updates).filter((key) =>
      this.supportedFields.includes(key)
    );
    for (const key of validConfigKeys) {
      const existingRecord = await this.get(`label = '${key}'`);
      if (!existingRecord) {
        const db = await this.db();
        const value = updates[key] === null ? null : String(updates[key]);
        const { success, message } = await db
          .run(`INSERT INTO ${this.tablename} (label, value) VALUES (?, ?)`, [
            key,
            value,
          ])
          .then((res) => {
            return { id: res.lastID, success: true, message: null };
          })
          .catch((error) => {
            return { id: null, success: false, message: error.message };
          });
        db.close();
        if (!success) {
          console.error("FAILED TO ADD SYSTEM CONFIG OPTION", message);
          return { success: false, error: message };
        }
      } else {
        const db = await this.db();
        const value = updates[key] === null ? null : String(updates[key]);
        const { success, message } = await db
          .run(`UPDATE ${this.tablename} SET label=?,value=? WHERE id = ?`, [
            key,
            value,
            existingRecord.id,
          ])
          .then(() => {
            return { success: true, message: null };
          })
          .catch((error) => {
            return { success: false, message: error.message };
          });

        db.close();
        if (!success) {
          console.error("FAILED TO UPDATE SYSTEM CONFIG OPTION", message);
          return { success: false, error: message };
        }
      }
    }
    return { success: true, error: null };
  },
  isMultiUserMode: async function () {
    return (await this.get(`label = 'multi_user_mode'`))?.value === "true";
  },
  currentLogoFilename: async function () {
    const result = await this.get(`label = 'logo_filename'`);
    return result ? result.value : null;
  },
};

module.exports.SystemSettings = SystemSettings;
