/**
 * Applies pending Prisma migrations to the SQLite database without the Prisma CLI.
 *
 * Production images and the desktop app ship only the pre-generated client, not the Prisma CLI and its native
 * schema engine, so this applies each pending migration.sql itself. It keeps the same bookkeeping as
 * `prisma migrate deploy` (one _prisma_migrations row per migration, sha256 checksum of migration.sql, unix-ms
 * timestamps), so the Prisma CLI still sees the database as fully migrated, and like Prisma, a failed migration
 * blocks every later run until it is resolved.
 *
 * Usage: node prisma/migrate.js [databasePath] [migrationsDir]
 * Without arguments it migrates the database from DATABASE_URL (default storage/anythingllm.db).
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Database = require("better-sqlite3");

function migrate(databasePath, migrationsDir) {
  const db = new Database(databasePath);
  try {
    db.exec(`CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
    "id"                    TEXT PRIMARY KEY NOT NULL,
    "checksum"              TEXT NOT NULL,
    "finished_at"           DATETIME,
    "migration_name"        TEXT NOT NULL,
    "logs"                  TEXT,
    "rolled_back_at"        DATETIME,
    "started_at"            DATETIME NOT NULL DEFAULT current_timestamp,
    "applied_steps_count"   INTEGER UNSIGNED NOT NULL DEFAULT 0
)`);

    const failed = db
      .prepare(
        `SELECT migration_name FROM _prisma_migrations WHERE finished_at IS NULL AND rolled_back_at IS NULL`
      )
      .all();
    if (failed.length)
      throw new Error(
        `Failed migration(s) must be resolved first: ${failed.map((r) => r.migration_name).join(", ")}`
      );

    const applied = new Set(
      db
        .prepare(
          `SELECT migration_name FROM _prisma_migrations WHERE rolled_back_at IS NULL`
        )
        .all()
        .map((r) => r.migration_name)
    );
    const pending = fs
      .readdirSync(migrationsDir, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() &&
          fs.existsSync(path.join(migrationsDir, entry.name, "migration.sql"))
      )
      .map((entry) => entry.name)
      .sort()
      .filter((name) => !applied.has(name));

    const start = db.prepare(
      `INSERT INTO _prisma_migrations (id, checksum, migration_name, started_at, applied_steps_count) VALUES (?, ?, ?, ?, 0)`
    );
    const finish = db.prepare(
      `UPDATE _prisma_migrations SET finished_at = ?, applied_steps_count = 1 WHERE id = ?`
    );
    const fail = db.prepare(
      `UPDATE _prisma_migrations SET logs = ? WHERE id = ?`
    );

    for (const name of pending) {
      const sql = fs.readFileSync(
        path.join(migrationsDir, name, "migration.sql")
      );
      const id = crypto.randomUUID();
      const checksum = crypto.createHash("sha256").update(sql).digest("hex");
      start.run(id, checksum, name, Date.now());
      try {
        db.exec(sql.toString("utf8"));
      } catch (error) {
        fail.run(String(error.stack || error), id);
        throw new Error(`Migration ${name} failed: ${error.message}`);
      }
      finish.run(Date.now(), id);
    }
    return pending;
  } finally {
    db.close();
  }
}

function defaultDatabasePath() {
  // Required lazily: the desktop app runs this file on its own and always passes both paths.
  const { databaseUrl } = require("../utils/prisma/datasource");
  const url = databaseUrl();
  if (!url.startsWith("file:"))
    throw new Error(`Only SQLite databases can be migrated, got ${url}`);
  return url.slice("file:".length);
}

if (require.main === module) {
  try {
    const databasePath = process.argv[2] || defaultDatabasePath();
    const migrationsDir = process.argv[3] || path.join(__dirname, "migrations");
    const applied = migrate(databasePath, migrationsDir);
    console.log(
      applied.length
        ? `Applied ${applied.length} migration(s): ${applied.join(", ")}`
        : "No pending migrations."
    );
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { migrate };
