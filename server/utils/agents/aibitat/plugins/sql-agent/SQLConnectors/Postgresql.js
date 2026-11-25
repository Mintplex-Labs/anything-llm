const pgSql = require("pg");

class PostgresSQLConnector {
  #connected = false;
  constructor(
    config = {
      connectionString: null,
      schema: null,
    }
  ) {
    this.className = "PostgresSQLConnector";
    this.connectionString = config.connectionString;
    this.schema = config.schema || "public";
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
   * @param {Array} params optional parameters for prepared statement
   * @returns {Promise<import(".").QueryResult>}
   */
  async runQuery(queryString = "", params = []) {
    const result = { rows: [], count: 0, error: null };
    try {
      if (!this.#connected) await this.connect();
      const query = await this._client.query(queryString, params);
      result.rows = query.rows;
      result.count = query.rowCount;
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
    return {
      query: `SELECT * FROM pg_catalog.pg_tables WHERE schemaname = $1`,
      params: [this.schema],
    };
  }

  getTableSchemaSql(table_name) {
    return {
      query: `SELECT column_name, data_type, character_maximum_length, column_default, is_nullable FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = $1 AND table_schema = $2`,
      params: [table_name, this.schema],
    };
  }
}

module.exports.PostgresSQLConnector = PostgresSQLConnector;
