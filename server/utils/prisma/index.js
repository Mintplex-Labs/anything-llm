const { PrismaClient } = require("@prisma/client");

// npx prisma introspect
// npx prisma generate
// npx prisma migrate dev --name init -> ensures that db is in sync with schema
// npx prisma migrate reset -> resets the db

// Propagate telemetry settings to Prisma
// When DISABLE_TELEMETRY is true disable Prisma's telemetry
// Prevents connections to checkpoint.prisma.io
if (process.env.DISABLE_TELEMETRY === "true") {
  process.env.CHECKPOINT_DISABLE = "1";
}

const logLevels = ["error", "info", "warn"]; // add "query" to debug query logs
const prisma = new PrismaClient({
  log: logLevels,
});

module.exports = prisma;
