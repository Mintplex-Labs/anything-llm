const mysql = require("mysql2/promise");
const { ConnectionStringParser } = require("./utils");

class MySQLConnector {
  #connected = false;
  database_id = "";
  constructor(
    config = {
      connectionString: null,
    }
  ) {
    this.className = "MySQLConnector";
    this.connectionString = config.connectionString;
    this._client = null;
    this.database_id = this.#parseDatabase();
  }

  #parseDatabase() {
    const connectionParser = new ConnectionStringParser({ scheme: "mysql" });
    const parsed = connectionParser.parse(this.connectionString);
    return parsed?.endpoint;
  }

  async connect() {
    this._client = await mysql.createConnection({ uri: this.connectionString });
    this.#connected = true;
    return this._client;
  }

  /**
   *
   * @param {string} queryString the SQL query to be run
   * @returns {Promise<import(".").QueryResult>}
   */
  async runQuery(queryString = "") {
    const result = { rows: [], count: 0, error: null };
    try {
      if (!this.#connected) await this.connect();
      const [query] = await this._client.query(queryString);
      result.rows = query;
      result.count = query?.length;
    } catch (err) {
      console.log(this.className, err);
      result.error = err.message;
    } finally {
      // Check client is connected before closing since we use this for validation
      if (this._client) {
        await this._client.end();
        this.#connected = false;
      }
    }
    return result;
  }

  async validateConnection() {
    try {
      const result = await this.runQuery("SELECT 1");
      return { success: !result.error, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getTablesSql() {
    return `SELECT table_name FROM information_schema.tables WHERE table_schema = '${this.database_id}'`;
  }
  getTableSchemaSql(table_name) {
    return `SHOW COLUMNS FROM ${this.database_id}.${table_name};`;
  }
}

module.exports.MySQLConnector = MySQLConnector;
