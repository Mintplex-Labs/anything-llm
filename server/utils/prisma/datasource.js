const path = require("path");

const PRISMA_DIR = path.resolve(__dirname, "../../prisma");

/**
 * The database URL shared by the Prisma CLI (prisma.config.js) and the runtime client.
 * DATABASE_URL wins when set, otherwise the default SQLite file in server/storage is used.
 *
 * Relative SQLite paths are resolved from server/prisma, which is how Prisma resolved them when the URL
 * lived in schema.prisma. The CLI and the SQLite adapter would otherwise resolve them from the working
 * directory and open a different (empty) database.
 * @returns {string}
 */
function databaseUrl() {
  const url = process.env.DATABASE_URL || "file:../storage/anythingllm.db";
  if (!url.startsWith("file:")) return url;
  return `file:${path.resolve(PRISMA_DIR, url.slice("file:".length))}`;
}

module.exports = { databaseUrl };
