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

async function validateTablePragmas() {
  const { Workspace } = require("../../models/workspace");
  const { Document } = require("../../models/documents");
  const { DocumentVectors } = require("../../models/vectors");
  const { WorkspaceChats } = require("../../models/workspaceChats");
  await Workspace.migrateTable();
  await Document.migrateTable();
  await DocumentVectors.migrateTable();
  await WorkspaceChats.migrateTable();
}

module.exports = {
  checkForMigrations,
  validateTablePragmas,
};
