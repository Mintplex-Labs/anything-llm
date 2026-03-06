const { SystemSettings } = require("../../models/systemSettings");
const prisma = require("../prisma");

function log(message, ...args) {
  console.log(
    `\x1b[36m[MIGRATION::WORKSPACE_CHAT_MODE]\x1b[0m ${message}`,
    ...args
  );
}

async function markMigrationCompleted() {
  await SystemSettings.updateSettings({
    legacy_workspaces_to_automatic_migration_status: "completed",
  });
}

/**
 * Migrate legacy workspaces to automatic mode if they are in "chat" mode and created before 2024-02-16.
 * This migration will only run once and the workspace must:
 * - Be in "chat" mode (default prior)
 * - Be created before 2024-02-16
 * Automatic mode is a better UX since it will put the workspace in auto-agent tool call mode when the user asks a question
 * which is usually what people expect to happen so they get the best answers.
 */
async function migrateLegacyWorkspacesToAutomatic() {
  try {
    // Check if migration has already been run
    const migrationStatus = await SystemSettings.getValueOrFallback(
      { label: "legacy_workspaces_to_automatic_migration_status" },
      "not_completed"
    );
    if (migrationStatus === "completed") return;

    const result = await prisma.workspaces.updateMany({
      where: {
        chatMode: "chat",
        createdAt: {
          lt: new Date("2024-02-16T00:00:00Z"),
        },
      },
      data: {
        chatMode: "automatic",
      },
    });

    if (result.count > 0) {
      log(
        `Migrated ${result.count} legacy workspaces in "chat" mode created before 2024-02-16 to automatic mode.`
      );
    }
    await markMigrationCompleted();
  } catch (e) {
    log(
      "Error migrating legacy workspaces to automatic mode",
      e.message,
      e.stack
    );
  }
}

module.exports = migrateLegacyWorkspacesToAutomatic;
