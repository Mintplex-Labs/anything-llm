const { getGitVersion } = require("../../endpoints/utils");
const { Telemetry } = require("../../models/telemetry");

function checkColumnTemplate(tablename = null, column = null) {
  if (!tablename || !column)
    throw new Error(`Migration Error`, { tablename, column });
  return `SELECT COUNT(*) AS _exists FROM pragma_table_info('${tablename}') WHERE name='${column}'`;
}

// Note (tcarambat): Since there is no good way to track migrations in Node/SQLite we use this simple system
// Each model has a `migrations` method that will return an array like...
// { colName: 'stringColName', execCmd: `SQL Command to run when`, doif: boolean },
// colName = name of column
// execCmd = Command to run when doif matches the state of the DB
// doif = condition to match that determines if execCmd will run.
// eg: Table workspace has slug column.
// execCmd: ALTER TABLE DROP COLUMN slug;
// doif: true
// => Will drop the slug column if the workspace table has a column named 'slug' otherwise nothing happens.
// If you are adding a new table column if needs to exist in the Models `colsInit` and as a migration.
// So both new and existing DBs will get the column when code is pulled in.

async function checkForMigrations(model, db) {
  if (model.migrations().length === 0) return;
  const toMigrate = [];
  for (const { colName, execCmd, doif } of model.migrations()) {
    const { _exists } = await db.get(
      checkColumnTemplate(model.tablename, colName)
    );
    const colExists = _exists !== 0;
    if (colExists !== doif) continue;

    toMigrate.push(execCmd);
  }

  if (toMigrate.length === 0) return;

  console.log(`Running ${toMigrate.length} migrations`, toMigrate);
  await db.exec(toMigrate.join(";\n"));
  return;
}

// Note(tcarambat): When building in production via Docker the SQLite file will not exist
// and if this function tries to run on boot the file will not exist
// and the server will abort and the container will exit.
// This function will run each reload on dev but on production
// it will be stubbed until the /api/migrate endpoint is GET.
async function validateTablePragmas(force = false) {
  try {
    if (process.env.NODE_ENV !== "development" && force === false) {
      console.log(
        `\x1b[34m[MIGRATIONS STUBBED]\x1b[0m Please ping /migrate once server starts to run migrations`
      );
      console.log(
        `\x1b[34m[ENV]\x1b[0m Expected storage directory is ${process.env.STORAGE_DIR}. Database should exist at ${process.env.STORAGE_DIR}/anythingllm.db`
      );
      return;
    }
    const { SystemSettings } = require("../../models/systemSettings");
    const { User } = require("../../models/user");
    const { Workspace } = require("../../models/workspace");
    const { WorkspaceUser } = require("../../models/workspaceUsers");
    const { Document } = require("../../models/documents");
    const { DocumentVectors } = require("../../models/vectors");
    const { WorkspaceChats } = require("../../models/workspaceChats");
    const { Invite } = require("../../models/invite");
    const { WelcomeMessages } = require("../../models/welcomeMessages");
    const { ApiKey } = require("../../models/apiKeys");

    await SystemSettings.migrateTable();
    await User.migrateTable();
    await Workspace.migrateTable();
    await WorkspaceUser.migrateTable();
    await Document.migrateTable();
    await DocumentVectors.migrateTable();
    await WorkspaceChats.migrateTable();
    await Invite.migrateTable();
    await WelcomeMessages.migrateTable();
    await ApiKey.migrateTable();
  } catch (e) {
    console.error(`validateTablePragmas: Migrations failed`, e);
  }
  return;
}

// Telemetry is anonymized and your data is never read. This can be disabled by setting
// DISABLE_TELEMETRY=true in the `.env` of however you setup. Telemetry helps us determine use
// of how AnythingLLM is used and how to improve this product!
// You can see all Telemetry events by ctrl+f `Telemetry.sendEvent` calls to verify this claim.
async function setupTelemetry() {
  if (process.env.DISABLE_TELEMETRY === "true") {
    console.log(
      `\x1b[31m[TELEMETRY DISABLED]\x1b[0m Telemetry is marked as disabled - no events will send. Telemetry helps Mintplex Labs Inc improve AnythingLLM.`
    );
    return true;
  }

  if (Telemetry.isDev()) {
    console.log(
      `\x1b[33m[TELEMETRY STUBBED]\x1b[0m Anonymous Telemetry stubbed in development.`
    );
    return;
  }

  console.log(
    `\x1b[32m[TELEMETRY ENABLED]\x1b[0m Anonymous Telemetry enabled. Telemetry helps Mintplex Labs Inc improve AnythingLLM.`
  );
  await Telemetry.findOrCreateId();
  await Telemetry.sendTelemetry("server_boot", {
    commit: getGitVersion(),
  });
  return;
}

// When working in a mounted disk mode (such as with Render) we will need to ensure that some "sticky" assets are mounted into
// the file storage so that when we reference them later in the code - they exist.
async function copyAssetsToStorage() {
  const fs = require("fs");
  const path = require("path");

  const localStorage = fs.resolve(__dirname, "../../storage");
  const mountedStorage = process.env.STORAGE_DIR;

  const items = [
    ["assets", "anything-llm-light.png"],
    ["assets", "anything-llm-dark.png"],
  ];

  for (const pathItems of items) {
    const src = path.resolve(localStorage, ...pathItems);
    const dest = path.resolve(mountedStorage, ...pathItems);

    if (fs.existsSync(dest)) continue;

    const destDirname = path.dirname(dest);
    fs.mkdirSync(destDirname, { recursive: true });
    console.log(`Copying ${src} to ${dest}!`);
    fs.copyFileSync(src, dest);
  }

  return;
}

module.exports = {
  checkForMigrations,
  validateTablePragmas,
  setupTelemetry,
  copyAssetsToStorage,
};
