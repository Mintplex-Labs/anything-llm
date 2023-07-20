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
      return;
    }

    const { Workspace } = require("../../models/workspace");
    const { Document } = require("../../models/documents");
    const { DocumentVectors } = require("../../models/vectors");
    const { WorkspaceChats } = require("../../models/workspaceChats");
    await Workspace.migrateTable();
    await Document.migrateTable();
    await DocumentVectors.migrateTable();
    await WorkspaceChats.migrateTable();
  } catch (e) {
    console.error(`validateTablePragmas: Migrations failed`, e);
  }
  return;
}

module.exports = {
  checkForMigrations,
  validateTablePragmas,
};
