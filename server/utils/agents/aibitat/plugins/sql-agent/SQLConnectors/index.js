/**
 *
 * @param {('postgresql'|'mysql')} identifier
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
    default:
      throw new Error(
        `There is no supported database connector for ${identifier}`
      );
  }
}

module.exports.getDBClient = getDBClient;
