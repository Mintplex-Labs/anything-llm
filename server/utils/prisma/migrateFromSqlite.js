const { PrismaClient } = require("@prisma/client");
const sqlite3 = require("sqlite3").verbose();
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
const db = new sqlite3.Database(DATABASE_PATH);

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
  let transactionPromises = [];

  try {
    console.log("Starting data migration...");

    // Step 1: Migrate system_settings table
    await migrateTable("system_settings", (row) => {
      transactionPromises.push(
        prisma.system_settings.create({
          data: {
            label: row.label,
            value: row.value,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        })
      );
    });

    // Step 2: Migrate users table
    await migrateTable("users", (row) => {
      transactionPromises.push(
        prisma.users.create({
          data: {
            username: row.username,
            password: row.password,
            role: row.role,
            suspended: row.suspended,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        })
      );
    });

    // Step 3: Migrate workspaces table
    await migrateTable("workspaces", (row) => {
      transactionPromises.push(
        prisma.workspaces.create({
          data: {
            name: row.name,
            slug: row.slug,
            vectorTag: row.vectorTag,
            openAiTemp: row.openAiTemp,
            openAiHistory: row.openAiHistory,
            openAiPrompt: row.openAiPrompt,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        })
      );
    });

    // Step 4: Migrate api_keys table
    await migrateTable("api_keys", (row) => {
      transactionPromises.push(
        prisma.api_keys.create({
          data: {
            secret: row.secret,
            createdBy: row.createdBy,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        })
      );
    });

    // Step 5: Migrate invites table
    await migrateTable("invites", (row) => {
      transactionPromises.push(
        prisma.invites.create({
          data: {
            code: row.code,
            status: row.status,
            claimedBy: row.claimedBy,
            createdBy: row.createdBy,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        })
      );
    });

    // Step 6: Migrate workspace_documents table
    await migrateTable("workspace_documents", (row) => {
      transactionPromises.push(
        prisma.workspace_documents.create({
          data: {
            docId: row.docId,
            filename: row.filename,
            docpath: row.docpath,
            workspaceId: row.workspaceId,
            metadata: row.metadata,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        })
      );
    });

    // Step 7: Migrate document_vectors table
    await migrateTable("document_vectors", (row) => {
      transactionPromises.push(
        prisma.document_vectors.create({
          data: {
            docId: row.docId,
            vectorId: row.vectorId,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        })
      );
    });

    // Step 8: Migrate welcome_messages table
    await migrateTable("welcome_messages", (row) => {
      transactionPromises.push(
        prisma.welcome_messages.create({
          data: {
            user: row.user,
            response: row.response,
            orderIndex: row.orderIndex,
            createdAt: new Date(row.createdAt),
          },
        })
      );
    });

    // Step 9: Migrate workspace_users table
    await migrateTable("workspace_users", (row) => {
      transactionPromises.push(
        prisma.workspace_users.create({
          data: {
            user_id: row.user_id,
            workspace_id: row.workspace_id,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        })
      );
    });

    // Step 10: Migrate workspace_chats table
    await migrateTable("workspace_chats", (row) => {
      transactionPromises.push(
        prisma.workspace_chats.create({
          data: {
            workspaceId: row.workspaceId,
            prompt: row.prompt,
            response: row.response,
            include: row.include === 1,
            user_id: row.user_id,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        })
      );
    });

    // Run all the transactions
    await prisma.$transaction(transactionPromises);

    console.log("Data migration completed successfully");
  } catch (error) {
    console.error("Data migration failed:", error);
  } finally {
    await prisma.$disconnect();
    db.close();
  }
}

async function migrateTable(tableName, migrateRowFunc) {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${tableName}`, [], async (err, rows) => {
      if (err) {
        return reject(err);
      }

      for (let row of rows) {
        try {
          await migrateRowFunc(row);
        } catch (error) {
          console.warn(`Failed to migrate row in table "${tableName}":`, error);
        }
      }

      resolve();
    });
  });
}

migrateData();
