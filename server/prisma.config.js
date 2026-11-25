// A plain object rather than defineConfig() from "prisma/config", so this file loads where the Prisma CLI is not
// installed as a dependency (the Docker image generates the client with a one-off npx install of the CLI).
const { databaseUrl } = require("./utils/prisma/datasource")

module.exports = {
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js"
  },
  datasource: {
    url: databaseUrl()
  }
}
