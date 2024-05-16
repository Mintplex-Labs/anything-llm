const pgSql = require("pg");

class PostgresSQLConnector {
  #connected = false;
  constructor(
    config = {
      connectionString: null,
    }
  ) {
    this.connectionString = config.connectionString;
    this._client = new pgSql.Client({
      connectionString: this.connectionString,
    });
  }

  async connect() {
    await this._client.connect();
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
      result.rows = query.rows;
      result.count = query.rowCount;
    } catch (err) {
      console.log(this.constructor.name, err);
      result.error = err.message;
    } finally {
      await this._client.end();
      this.#connected = false;
    }
    return result;
  }

  getTablesSql() {
    return `SELECT * FROM pg_catalog.pg_tables WHERE schemaname = 'public'`;
  }
  getTableSchemaSql(table_name) {
    return ` select column_name, data_type, character_maximum_length, column_default, is_nullable from INFORMATION_SCHEMA.COLUMNS where table_name = '${table_name}'`;
  }
}

module.exports.PostgresSQLConnector = PostgresSQLConnector;
