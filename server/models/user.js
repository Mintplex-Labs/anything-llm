const { escape } = require("sqlstring-sqlite");

const User = {
  tablename: "users",
  writable: [],
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT "default",
  suspended INTEGER NOT NULL DEFAULT 0,
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
      `PRAGMA foreign_keys = ON;CREATE TABLE IF NOT EXISTS ${this.tablename} (${this.colsInit})`
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
  update: async function (userId, updates = {}) {
    const user = await this.get(`id = ${escape(userId)}`);
    if (!user) return { success: false, error: "User does not exist." };
    const { username, password, role, suspended = 0 } = updates;
    const toUpdate = { suspended };

    if (user.username !== username && username?.length > 0) {
      const usedUsername = !!(await this.get(`username = ${escape(username)}`));
      if (usedUsername)
        return { success: false, error: `${username} is already in use.` };
      toUpdate.username = username;
    }

    if (!!password) {
      const bcrypt = require("bcrypt");
      toUpdate.password = bcrypt.hashSync(password, 10);
    }

    if (user.role !== role && ["admin", "default"].includes(role)) {
      // If was existing admin and that has been changed
      // make sure at least one admin exists
      if (user.role === "admin") {
        const validAdminCount = (await this.count(`role = 'admin'`)) > 1;
        if (!validAdminCount)
          return {
            success: false,
            error: `There would be no admins if this action was completed. There must be at least one admin.`,
          };
      }

      toUpdate.role = role;
    }

    if (Object.keys(toUpdate).length !== 0) {
      const values = Object.values(toUpdate);
      const template = `UPDATE ${this.tablename} SET ${Object.keys(
        toUpdate
      ).map((key) => {
        return `${key}=?`;
      })} WHERE id = ?`;

      const db = await this.db();
      const { success, message } = await db
        .run(template, [...values, userId])
        .then(() => {
          return { success: true, message: null };
        })
        .catch((error) => {
          return { success: false, message: error.message };
        });

      db.close();
      if (!success) {
        console.error(message);
        return { success: false, error: message };
      }
    }

    return { success: true, error: null };
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
