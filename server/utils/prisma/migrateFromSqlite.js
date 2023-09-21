const { PrismaClient } = require("@prisma/client");
const sqlite3 = require("sqlite3").verbose();

const prisma = new PrismaClient();
const db = new sqlite3.Database("../../storage/anythingllm.db");

async function migrateData() {
  try {
    // Migrate data for system_settings table
    db.all("SELECT * FROM system_settings", [], async (err, rows) => {
      if (err) {
        throw err;
      }
      for (let row of rows) {
        try {
          await prisma.system_settings.create({
            data: {
              label: row.label,
              value: row.value,
              createdAt: new Date(row.createdAt),
              lastUpdatedAt: new Date(row.lastUpdatedAt),
            },
          });
        } catch (error) {
          if (error.code === "P2002") {
            console.warn(
              `Skipping insertion of row with label "${row.label}" as it already exists in the Prisma database.`
            );
            continue;
          }
          throw error;
        }
      }
    });

    // Migrate data for users table
    db.all("SELECT * FROM users", [], async (err, rows) => {
      if (err) {
        throw err;
      }
      for (let row of rows) {
        await prisma.users.create({
          data: {
            username: row.username,
            password: row.password,
            role: row.role,
            suspended: row.suspended,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        });
      }
    });

    // Migrate data for workspaces table
    db.all("SELECT * FROM workspaces", [], async (err, rows) => {
      if (err) {
        throw err;
      }
      for (let row of rows) {
        await prisma.workspaces.create({
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
        });
      }
    });

    // Migrate data for workspace_users table
    db.all("SELECT * FROM workspace_users", [], async (err, rows) => {
      if (err) {
        throw err;
      }
      for (let row of rows) {
        await prisma.workspace_users.create({
          data: {
            user_id: row.user_id,
            workspace_id: row.workspace_id,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        });
      }
    });

    // Migrate data for workspace_documents table
    db.all("SELECT * FROM workspace_documents", [], async (err, rows) => {
      if (err) {
        throw err;
      }
      for (let row of rows) {
        await prisma.workspace_documents.create({
          data: {
            docId: row.docId,
            filename: row.filename,
            docpath: row.docpath,
            workspaceId: row.workspaceId,
            metadata: row.metadata,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        });
      }
    });

    // Migrate data for api_keys table
    db.all("SELECT * FROM api_keys", [], async (err, rows) => {
      if (err) {
        throw err;
      }
      for (let row of rows) {
        await prisma.api_keys.create({
          data: {
            secret: row.secret,
            createdBy: row.createdBy,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        });
      }
    });

    // Migrate data for invites table
    db.all("SELECT * FROM invites", [], async (err, rows) => {
      if (err) {
        throw err;
      }
      for (let row of rows) {
        await prisma.invites.create({
          data: {
            code: row.code,
            status: row.status,
            claimedBy: row.claimedBy,
            createdBy: row.createdBy,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        });
      }
    });

    // Migrate data for document_vectors table
    db.all("SELECT * FROM document_vectors", [], async (err, rows) => {
      if (err) {
        throw err;
      }
      for (let row of rows) {
        await prisma.document_vectors.create({
          data: {
            docId: row.docId,
            vectorId: row.vectorId,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        });
      }
    });

    // Migrate data for welcome_messages table
    db.all("SELECT * FROM welcome_messages", [], async (err, rows) => {
      if (err) {
        throw err;
      }
      for (let row of rows) {
        await prisma.welcome_messages.create({
          data: {
            user: row.user,
            response: row.response,
            orderIndex: row.orderIndex,
            createdAt: new Date(row.createdAt),
          },
        });
      }
    });

    // Migrate data for workspace_chats table
    db.all("SELECT * FROM workspace_chats", [], async (err, rows) => {
      if (err) {
        throw err;
      }
      for (let row of rows) {
        await prisma.workspace_chats.create({
          data: {
            workspaceId: row.workspaceId,
            prompt: row.prompt,
            response: row.response,
            include: row.include === 1 ? true : false, // Convert SQLite BOOL to JavaScript boolean
            user_id: row.user_id,
            createdAt: new Date(row.createdAt),
            lastUpdatedAt: new Date(row.lastUpdatedAt),
          },
        });
      }
    });

    console.log("Data migration completed successfully");
  } catch (error) {
    console.error("Data migration failed:", error);
  } finally {
    await prisma.$disconnect();
    db.close();
  }
}

migrateData();
