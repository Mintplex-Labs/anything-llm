const { SystemSettings } = require("../../../../../../models/systemSettings");
const { safeJsonParse } = require("../../../../../http");

/**
 * @typedef {('postgresql'|'mysql'|'sql-server')} SQLEngine
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

/**
 * Validates a SQL connection by attempting to connect and run a simple query
 * @param {SQLEngine} identifier - The SQL engine type
 * @param {object} connectionConfig - The connection configuration
 * @returns {Promise<{success: boolean, error: string|null}>}
 */
async function validateConnection(identifier = "", connectionConfig = {}) {
  try {
    const client = getDBClient(identifier, connectionConfig);
    return await client.validateConnection();
  } catch (error) {
    console.log(`Failed to connect to ${identifier} database.`);
    return {
      success: false,
      error: `Unable to connect to ${identifier}. Please verify your connection details.`,
    };
  }
}

module.exports = {
  getDBClient,
  listSQLConnections,
  validateConnection,
};
