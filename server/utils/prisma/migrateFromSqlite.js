const { PrismaClient } = require('@prisma/client');
const sqlite3 = require('sqlite3').verbose();
const execSync = require('child_process').execSync;

const prisma = new PrismaClient();
const db = new sqlite3.Database('../../storage/anythingllm.db');

// Reset the prisma database and prepare it for migration of data from sqlite
function resetAndMigrateDatabase() {
    try {
      console.log('Resetting and migrating the database...');
      execSync('cd ../.. && npx prisma migrate reset --skip-seed --force', { stdio: 'inherit' });
      execSync('cd ../.. && npx prisma migrate deploy', { stdio: 'inherit' });
      console.log('Database reset and migrations re-run successfully');
    } catch (error) {
      console.error('Failed to reset and migrate the database:', error);
    }
}

  resetAndMigrateDatabase();


// Migrate data from sqlite to prisma
async function migrateData() {
  try {
    // Step 1: Migrate system_settings table
    await migrateTable('system_settings', async (row) => {
      await prisma.system_settings.create({
        data: {
          label: row.label,
          value: row.value,
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 2: Migrate users table
    await migrateTable('users', async (row) => {
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
    });

    // Step 3: Migrate workspaces table
    await migrateTable('workspaces', async (row) => {
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
    });

    // Step 4: Migrate api_keys table
    await migrateTable('api_keys', async (row) => {
      await prisma.api_keys.create({
        data: {
          secret: row.secret,
          createdBy: row.createdBy,
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 5: Migrate invites table
    await migrateTable('invites', async (row) => {
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
    });

    // Step 6: Migrate workspace_documents table
    await migrateTable('workspace_documents', async (row) => {
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
    });

    // Step 7: Migrate document_vectors table
    await migrateTable('document_vectors', async (row) => {
      await prisma.document_vectors.create({
        data: {
          docId: row.docId,
          vectorId: row.vectorId,
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 8: Migrate welcome_messages table
    await migrateTable('welcome_messages', async (row) => {
      await prisma.welcome_messages.create({
        data: {
          user: row.user,
          response: row.response,
          orderIndex: row.orderIndex,
          createdAt: new Date(row.createdAt),
        },
      });
    });

    // Step 9: Migrate workspace_users table
    await migrateTable('workspace_users', async (row) => {
      await prisma.workspace_users.create({
        data: {
          user_id: row.user_id,
          workspace_id: row.workspace_id,
          createdAt: new Date(row.createdAt),
          lastUpdatedAt: new Date(row.lastUpdatedAt),
        },
      });
    });

    // Step 10: Migrate workspace_chats table
    await migrateTable('workspace_chats', async (row) => {
      await prisma.workspace_chats.create({
        data: {
          workspaceId: row.workspaceId,
          prompt: row.prompt,
          response: row.response,
          include: row.include === 1,
          user_id: row.user_id,
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
