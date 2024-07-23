const { SystemSettings } = require("../../../../../../models/systemSettings");
const { safeJsonParse } = require("../../../../../http");

/**
 * @typedef {('postgresql'|'mysql'|'sql-server'|'odbc')} SQLEngine
 */

/**
 * @typedef {Object} QueryResult
 * @property {[number]} rows - The query result rows
 * @property {number} count - Number of rows the query returned/changed
 * @property {string|null} error - Error string if there was an issue
 */

/**
 * A valid database SQL connection object
 * @typedef {Object} SQLConnection
 * @property {string} database_id - Unique identifier of the database connection
 * @property {SQLEngine} engine - Engine used by connection
 * @property {string} connectionString - RFC connection string for db
 */

/**
 * @param {SQLEngine} identifier
 * @param {object} connectionConfig
 * @returns Database Connection Engine Class for SQLAgent or throws error
 */
function getDBClient(identifier = "", connectionConfig = {}) {
  switch (identifier) {
    case "mysql":
      const { MySQLConnector } = require("./MySQL");
      return new MySQLConnector(connectionConfig);
    case "postgresql":
      const { PostgresSQLConnector } = require("./Postgresql");
      return new PostgresSQLConnector(connectionConfig);
    case "sql-server":
      const { MSSQLConnector } = require("./MSSQL");
      return new MSSQLConnector(connectionConfig);
    case "odbc":
      const { ODBCConnector } = require("./ODBC");
      return new ODBCConnector(connectionConfig);
    default:
      throw new Error(
        `There is no supported database connector for ${identifier}`
      );
  }
}

/**
 * Lists all of the known database connection that can be used by the agent.
 * @returns {Promise<[SQLConnection]>}
 */
async function listSQLConnections() {
  return safeJsonParse(
    (await SystemSettings.get({ label: "agent_sql_connections" }))?.value,
    []
  );
}

module.exports = {
  getDBClient,
  listSQLConnections,
};
