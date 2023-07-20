const slugify = require("slugify");
const { Document } = require("./documents");
const { checkForMigrations } = require("../utils/database");

const Workspace = {
  tablename: "workspaces",
  writable: [
    // Used for generic updates so we can validate keys in request body
    "name",
    "slug",
    "vectorTag",
    "openAiTemp",
    "openAiHistory",
    "lastUpdatedAt",
    "openAiPrompt",
  ],
  colsInit: `
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  vectorTag TEXT DEFAULT NULL,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
  openAiTemp REAL DEFAULT NULL,
  openAiHistory INTEGER DEFAULT 20,
  lastUpdatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
  openAiPrompt TEXT DEFAULT NULL
  `,
  migrateTable: async function () {
    console.log(`\x1b[34m[MIGRATING]\x1b[0m Checking for Workspace migrations`);
    const db = await this.db(false);
    await checkForMigrations(this, db);
  },
  migrations: function () {
    return [
      {
        colName: "openAiTemp",
        execCmd: `ALTER TABLE ${this.tablename} ADD COLUMN openAiTemp REAL DEFAULT NULL`,
        doif: false,
      },
      {
        colName: "openAiPrompt",
        execCmd: `ALTER TABLE ${this.tablename} ADD COLUMN openAiPrompt TEXT DEFAULT NULL`,
        doif: false,
      },
      {
        colName: "id",
        execCmd: `CREATE TRIGGER IF NOT EXISTS Trg_LastUpdated AFTER UPDATE ON ${this.tablename}
                                 FOR EACH ROW
                                 BEGIN
                                  UPDATE ${this.tablename} SET lastUpdatedAt = CURRENT_TIMESTAMP WHERE id = old.id;
                                 END`,
        doif: true,
      },
      {
        colName: "openAiHistory",
        execCmd: `ALTER TABLE ${this.tablename} ADD COLUMN openAiHistory INTEGER DEFAULT 20`,
        doif: false,
      },
    ];
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
  new: async function (name = null) {
    if (!name) return { result: null, message: "name cannot be null" };
    var slug = slugify(name, { lower: true });

    const existingBySlug = await this.get(`slug = '${slug}'`);
    if (existingBySlug !== null) {
      const slugSeed = Math.floor(10000000 + Math.random() * 90000000);
      slug = slugify(`${name}-${slugSeed}`, { lower: true });
    }

    const db = await this.db();
    const { id, success, message } = await db
      .run(`INSERT INTO ${this.tablename} (name, slug) VALUES (?, ?)`, [
        name,
        slug,
      ])
      .then((res) => {
        return { id: res.lastID, success: true, message: null };
      })
      .catch((error) => {
        return { id: null, success: false, message: error.message };
      });

    if (!success) {
      db.close();
      return { workspace: null, message };
    }

    const workspace = await db.get(
      `SELECT * FROM ${this.tablename} WHERE id = ${id}`
    );
    db.close();

    return { workspace, message: null };
  },
  update: async function (id = null, data = {}) {
    if (!id) throw new Error("No workspace id provided for update");

    const validKeys = Object.keys(data).filter((key) =>
      this.writable.includes(key)
    );
    const values = Object.values(data);
    if (validKeys.length === 0 || validKeys.length !== values.length)
      return { workspace: { id }, message: "No valid fields to update!" };

    const template = `UPDATE ${this.tablename} SET ${validKeys.map((key) => {
      return `${key}=?`;
    })} WHERE id = ?`;
    const db = await this.db();
    const { success, message } = await db
      .run(template, [...values, id])
      .then(() => {
        return { success: true, message: null };
      })
      .catch((error) => {
        return { success: false, message: error.message };
      });

    db.close();
    if (!success) {
      return { workspace: null, message };
    }

    const updatedWorkspace = await this.get(`id = ${id}`);
    return { workspace: updatedWorkspace, message: null };
  },
  get: async function (clause = "") {
    const db = await this.db();
    const result = await db
      .get(`SELECT * FROM ${this.tablename} WHERE ${clause}`)
      .then((res) => res || null);
    if (!result) return null;
    db.close();

    const documents = await Document.forWorkspace(result.id);
    return { ...result, documents };
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

module.exports = { Workspace };
