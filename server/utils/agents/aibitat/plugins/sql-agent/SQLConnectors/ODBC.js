const odbc = require("odbc");
const UrlPattern = require("url-pattern");

class ODBCConnector {
  #connected = false;
  database_id = "";
  constructor(
    config = {
      connectionString: null,
    }
  ) {
    this.connectionString = config.connectionString;
    this._client = null;
    this.database_id = this.#parseDatabase();
  }

  #parseDatabase() {
    const regex = /Database=([^;]+)/;
    const match = this.connectionString.match(regex);
    return match ? match[1] : null;
  }

  async connect() {
    this._client = await odbc.connect(this.connectionString);
    this.#connected = true;
    return this._client;
  }

  /**
   *
   * @param {string} queryString the SQL query to be run
   * @returns {import(".").QueryResult}
   */
  async runQuery(queryString = "") {
    const result = { rows: [], count: 0, error: null };
    try {
      if (!this.#connected) await this.connect();
      const query = await this._client.query(queryString);
      result.rows = query;
      result.count = query.length;
    } catch (err) {
      console.log(this.constructor.name, err);
      result.error = err.message;
    } finally {
      await this._client.close();
      this.#connected = false;
    }
    return result;
  }

  getTablesSql() {
    return `SELECT table_name FROM information_schema.tables WHERE table_schema = '${this.database_id}'`;
  }

  getTableSchemaSql(table_name) {
    return `SHOW COLUMNS FROM ${this.database_id}.${table_name};`;
  }
}

module.exports.ODBCConnector = ODBCConnector;
