const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const { databaseUrl } = require("./datasource");
const { serializeTransactions } = require("./serializedAdapter");

// npx prisma introspect
// npx prisma generate
// npx prisma migrate dev --name init -> ensures that db is in sync with schema
// npx prisma migrate reset -> resets the db

const logLevels = ["error", "info", "warn"]; // add "query" to debug query logs
const prisma = new PrismaClient({
  // Existing databases store DateTime columns as unix epoch milliseconds, so new rows must too.
  // The adapter default (iso8601) writes text, and SQLite sorts all integers before all text,
  // which silently breaks date filters and ordering across old and new rows.
  adapter: serializeTransactions(
    new PrismaBetterSqlite3(
      { url: databaseUrl() },
      { timestampFormat: "unixepoch-ms" }
    )
  ),
  log: logLevels,
});

module.exports = prisma;
