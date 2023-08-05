const Invite = {
  tablename: "invites",
  writable: [],
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT "pending",
  claimedBy INTEGER DEFAULT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  createdBy INTEGER NOT NULL,
  lastUpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP
  `,
  migrateTable: async function () {
    const { checkForMigrations } = require("../utils/database");
    console.log(`\x1b[34m[MIGRATING]\x1b[0m Checking for Invites migrations`);
    const db = await this.db(false);
    await checkForMigrations(this, db);
  },
  migrations: function () {
    return [];
  },
  makeCode: () => {
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
  create: async function (createdByUserId = 0) {
    const db = await this.db();
    const { id, success, message } = await db
      .run(`INSERT INTO ${this.tablename} (code, createdBy) VALUES(?, ?)`, [
        this.makeCode(),
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
      console.error("FAILED TO CREATE USER.", message);
      return { invite: null, error: message };
    }

    const invite = await db.get(
      `SELECT * FROM ${this.tablename} WHERE id = ${id} `
    );
    db.close();

    return { invite, error: null };
  },
  deactivate: async function (inviteId = null) {
    const invite = await this.get(`id = ${inviteId}`);
    if (!invite) return { success: false, error: "Invite does not exist." };
    if (invite.status !== "pending")
      return { success: false, error: "Invite is not in pending status." };

    const db = await this.db();
    const { success, message } = await db
      .run(`UPDATE ${this.tablename} SET status=? WHERE id=?`, [
        "disabled",
        inviteId,
      ])
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

    return { success: true, error: null };
  },
  markClaimed: async function (inviteId = null, user) {
    const invite = await this.get(`id = ${inviteId}`);
    if (!invite) return { success: false, error: "Invite does not exist." };
    if (invite.status !== "pending")
      return { success: false, error: "Invite is not in pending status." };

    const db = await this.db();
    const { success, message } = await db
      .run(`UPDATE ${this.tablename} SET status=?,claimedBy=? WHERE id=?`, [
        "claimed",
        user.id,
        inviteId,
      ])
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
  whereWithUsers: async function (clause = "", limit = null) {
    const { User } = require("./user");
    const results = await this.where(clause, limit);
    for (const invite of results) {
      if (!!invite.claimedBy) {
        const acceptedUser = await User.get(`id = ${invite.claimedBy}`);
        invite.claimedBy = {
          id: acceptedUser?.id,
          username: acceptedUser?.username,
        };
      }

      if (!!invite.createdBy) {
        const createdUser = await User.get(`id = ${invite.createdBy}`);
        invite.createdBy = {
          id: createdUser?.id,
          username: createdUser?.username,
        };
      }
    }
    return results;
  },
};

module.exports.Invite = Invite;
