const { PrismaClient } = require("@prisma/client");

// npx prisma introspect
// npx prisma generate
// npx prisma migrate dev --name init -> ensures that db is in sync with schema
// npx prisma migrate reset -> resets the db

const prisma = new PrismaClient({
  log: ["query", "info", "warn"],
});

module.exports = prisma;
