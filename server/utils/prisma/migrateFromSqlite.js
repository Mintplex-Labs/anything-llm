const { PrismaClient } = require("@prisma/client");
const execSync = require("child_process").execSync;
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const DATABASE_PATH = process.env.DB_URL || "../../storage/anythingllm.db";
const BACKUP_PATH = path.join(
  path.dirname(DATABASE_PATH),
  "anythingllm_backup.db"
);

// Backup the database before migrating data
function backupDatabase() {
  try {
    fs.copyFileSync(DATABASE_PATH, BACKUP_PATH);
    console.log("Database backup created successfully.");
  } catch (error) {
    console.error("Failed to create database backup:", error);
  }
}

backupDatabase();

const prisma = new PrismaClient();

// Reset the prisma database and prepare it for migration of data from sqlite
function resetAndMigrateDatabase() {
  try {
    console.log("Resetting and migrating the database...");
    execSync("cd ../.. && npx prisma migrate reset --skip-seed --force", {
      stdio: "inherit",
    });
    execSync("cd ../.. && npx prisma migrate dev --name init", {
      stdio: "inherit",
    });
    console.log("Database reset and initial migration completed successfully");
  } catch (error) {
    console.error("Failed to reset and migrate the database:", error);
  }
}

resetAndMigrateDatabase();

// Migrate data from sqlite to prisma
async function migrateData() {
  try {
    console.log("Starting data migration...");
    var legacyMap = {
      users: {
        count: 0,
      },
      workspaces: {
        count: 0,
      },
    };

    // Step 1: Migrate system_settings table
    await migrateTable("system_settings", (row) => {
      return prisma.system_settings.create({
        data: {
          label: row.label,
          value: row.value,
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 2: Migrate users table
    await migrateTable("users", (row) => {
      legacyMap.users[`user_${row.id}`] = legacyMap.users.count + 1;
      legacyMap.users.count++;

      return prisma.users.create({
        data: {
          username: row.username,
          password: row.password,
          role: row.role,
          suspended: row.suspended,
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 3: Migrate workspaces table
    await migrateTable("workspaces", (row) => {
      legacyMap.workspaces[`workspace_${row.id}`] =
        legacyMap.workspaces.count + 1;
      legacyMap.workspaces.count++;

      return prisma.workspaces.create({
        data: {
          name: row.name,
          slug: row.slug,
          vectorTag: row.vectorTag,
          openAiTemp: Number(row.openAiTemp) || 0.7,
          openAiHistory: Number(row.openAiHistory) || 20,
          openAiPrompt: row.openAiPrompt,
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 4: Migrate api_keys table
    await migrateTable("api_keys", async (row) => {
      const legacyUserId = row.createdBy
        ? legacyMap.users?.[`user_${row.createdBy}`]
        : null;
      return prisma.api_keys.create({
        data: {
          secret: row.secret,
          ...(legacyUserId
            ? { createdBy: Number(legacyUserId) }
            : { createdBy: Number(row.createdBy) }),
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 5: Migrate invites table
    await migrateTable("invites", async (row) => {
      const legacyCreatedUserId = row.createdBy
        ? legacyMap.users?.[`user_${row.createdBy}`]
        : null;
      const legacyClaimedUserId = row.claimedBy
        ? legacyMap.users?.[`user_${row.claimedBy}`]
        : null;

      return prisma.invites.create({
        data: {
          code: row.code,
          status: row.status,
          ...(legacyClaimedUserId
            ? { claimedBy: Number(legacyClaimedUserId) }
            : { claimedBy: Number(row.claimedBy) }),
          ...(legacyCreatedUserId
            ? { createdBy: Number(legacyCreatedUserId) }
            : { createdBy: Number(row.createdBy) }),
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 6: Migrate workspace_documents table
    await migrateTable("workspace_documents", async (row) => {
      const legacyWorkspaceId = row.workspaceId
        ? legacyMap.workspaces?.[`workspace_${row.workspaceId}`]
        : null;

      return prisma.workspace_documents.create({
        data: {
          docId: row.docId,
          filename: row.filename,
          docpath: row.docpath,
          ...(legacyWorkspaceId
            ? { workspaceId: Number(legacyWorkspaceId) }
            : {}),
          metadata: row.metadata,
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 7: Migrate document_vectors table
    await migrateTable("document_vectors", (row) => {
      return prisma.document_vectors.create({
        data: {
          docId: row.docId,
          vectorId: row.vectorId,
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 8: Migrate welcome_messages table
    await migrateTable("welcome_messages", (row) => {
      return prisma.welcome_messages.create({
        data: {
          user: row.user,
          response: row.response,
          orderIndex: row.orderIndex,
          createdAt: new Date(row.createdAt),
        },
      });
    });

    // Step 9: Migrate workspace_users table
    await migrateTable("workspace_users", async (row) => {
      const legacyUserId = row.user_id
        ? legacyMap.users?.[`user_${row.user_id}`]
        : null;
      const legacyWorkspaceId = row.workspace_id
        ? legacyMap.workspaces?.[`workspace_${row.workspace_id}`]
        : null;

      if (!legacyUserId || !legacyWorkspaceId) return;

      return prisma.workspace_users.create({
        data: {
          user_id: Number(legacyUserId),
          workspace_id: Number(legacyWorkspaceId),
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 10: Migrate workspace_chats table
    await migrateTable("workspace_chats", async (row) => {
      const legacyUserId = row.user_id
        ? legacyMap.users?.[`user_${row.user_id}`]
        : null;
      const legacyWorkspaceId = row.workspaceId
        ? legacyMap.workspaces?.[`workspace_${row.workspaceId}`]
        : null;

      return prisma.workspace_chats.create({
        data: {
          workspaceId: Number(legacyWorkspaceId),
          prompt: row.prompt,
          response: row.response,
          include: row.include === 1,
          ...(legacyUserId ? { user_id: Number(legacyUserId) } : {}),
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    console.log("Data migration completed successfully");
  } catch (error) {
    console.error("Data migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

async function migrateTable(tableName, migrateRowFunc) {
  const sqlite3 = require("sqlite3").verbose();
  const { open } = require("sqlite");
  const db = await open({
    filename: BACKUP_PATH,
    driver: sqlite3.Database,
  });

  // Check table exists
  const { count } = await db.get(
    `SELECT COUNT(*) as count FROM sqlite_master WHERE name='${tableName}'`
  )
  if (count === 0) {
    console.log(
      `${tableName} does not exist in legacy DB - nothing to migrate - skipping.`
    );
    return;
  }

  const upserts = [];
  const rows = await db.all(`SELECT * FROM ${tableName}`);

  try {
    for (const row of rows) {
      await migrateRowFunc(row);
      upserts.push(row);
    }
  } catch (e) {
    console.error(e);
    console.log({ tableName, upserts });
  } finally {
    await db.close();
  }
  return;
}

migrateData();
