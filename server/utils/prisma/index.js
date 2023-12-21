const { PrismaClient } = require("@prisma/client");

// npx prisma introspect
// npx prisma generate
// npx prisma migrate dev --name init -> ensures that db is in sync with schema
// npx prisma migrate reset -> resets the db

const isProd = process.env.NODE_ENV === "production";
const logLevels = isProd
  ? ["error", "info", "warn"]
  : ["query", "info", "warn", "error"];
const prisma = new PrismaClient({
  log: logLevels,
});

module.exports = prisma;
