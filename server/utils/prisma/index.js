const { PrismaClient } = require("@prisma/client");

// npx prisma introspect
// npx prisma generate
// npx prisma migrate dev --name init -> ensures that db is in sync with schema
// npx prisma migrate reset -> resets the db

const isProd = process.env.NODE_ENV === "production";
const prisma = new PrismaClient({
  log: isProd ? ["error"] : ["query", "info", "warn"],
});

module.exports = prisma;
