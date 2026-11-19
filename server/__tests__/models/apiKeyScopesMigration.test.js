/* eslint-env jest */
const fs = require("fs");
const os = require("os");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { ApiKey } = require("../../models/apiKeys");

const MIGRATIONS = path.resolve(__dirname, "../../prisma/migrations");
const statements = (migration) =>
  fs
    .readFileSync(path.join(MIGRATIONS, migration, "migration.sql"), "utf8")
    .split(";")
    .map((statement) => statement.replace(/^\s*--.*$/gm, "").trim())
    .filter(Boolean);

describe("api key scopes migration", () => {
  let dir;
  let db;

  beforeAll(async () => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "api-key-migration-"));
    db = new PrismaClient({
      datasources: { db: { url: `file:${path.join(dir, "test.db")}` } },
    });
    await db.$executeRawUnsafe(
      `CREATE TABLE "api_keys" ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "name" TEXT, "secret" TEXT, "createdBy" INTEGER, "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, "lastUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)`
    );
    for (const statement of statements("20261117005657_init"))
      await db.$executeRawUnsafe(statement);

    await db.$executeRawUnsafe(
      `INSERT INTO "api_keys" ("name", "secret", "scope", "scopeConfig") VALUES
        ('unscoped', 'A', NULL, NULL),
        ('full', 'B', 'full', NULL),
        ('workspace', 'C', 'workspace', '{"workspaceIds":[1,2]}'),
        ('user', 'D', 'user', NULL)`
    );
    for (const statement of statements("20261118222317_init"))
      await db.$executeRawUnsafe(statement);
  });

  afterAll(async () => {
    await db.$disconnect();
    fs.rmSync(dir, { recursive: true, force: true });
  });

  const key = (name) => db.api_keys.findFirst({ where: { name } });

  it.each(["unscoped", "full"])(
    "keeps the %s key full access",
    async (name) => {
      const apiKey = await key(name);
      expect(apiKey.scope).toBeNull();
      expect(ApiKey.isFullAccess(apiKey)).toBe(true);
      expect(ApiKey.workspaceIds(apiKey)).toBeNull();
    }
  );

  it("keeps a workspace key limited to its workspaces", async () => {
    const apiKey = await key("workspace");
    expect(ApiKey.isFullAccess(apiKey)).toBe(false);
    expect(ApiKey.scopesOf(apiKey)).toEqual(["chat", "workspace", "openai"]);
    expect(ApiKey.workspaceIds(apiKey)).toEqual([1, 2]);
  });

  it("keeps a user key on user management and login tokens", async () => {
    const apiKey = await key("user");
    expect(ApiKey.isFullAccess(apiKey)).toBe(false);
    expect(ApiKey.scopesOf(apiKey)).toEqual(["users", "sso"]);
    expect(ApiKey.workspaceIds(apiKey)).toBeNull();
  });
});
