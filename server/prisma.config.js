const { defineConfig } = require("prisma/config")
const { databaseUrl } = require("./utils/prisma/datasource")

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js"
  },
  datasource: {
    url: databaseUrl()
  }
})
