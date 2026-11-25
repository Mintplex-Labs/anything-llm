const mssql = require("mssql");
const { ConnectionStringParser } = require("./utils");

class MSSQLConnector {
  #connected = false;
  database_id = "";
  connectionConfig = {
    user: null,
    password: null,
    database: null,
    server: null,
    port: null,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };

  constructor(
    config = {
      // we will force into RFC-3986 from DB
      // eg: mssql://user:password@server:port/database?{...opts}
      connectionString: null, // we will force into RFC-3986
    }
  ) {
    this.className = "MSSQLConnector";
    this.connectionString = config.connectionString;
    this._client = null;
    this.#parseDatabase();
  }

  #parseDatabase() {
    const connectionParser = new ConnectionStringParser({ scheme: "mssql" });
    const parsed = connectionParser.parse(this.connectionString);

    this.database_id = parsed?.endpoint;
    this.connectionConfig = {
      ...this.connectionConfig,
      user: parsed?.username,
      password: parsed?.password,
      database: parsed?.endpoint,
      server: parsed?.hosts?.[0]?.host,
      port: parsed?.hosts?.[0]?.port,
      options: {
        ...this.connectionConfig.options,
        encrypt: parsed?.options?.encrypt === "true",
      },
    };
  }

  async connect() {
    this._client = await mssql.connect(this.connectionConfig);
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

      const request = this._client.request();
      params.forEach((value, index) => {
        request.input(`p${index}`, value);
      });
      const query = await request.query(queryString);
      result.rows = query.recordset;
      result.count = query.rowsAffected.reduce((sum, a) => sum + a, 0);
    } catch (err) {
      console.log(this.className, err);
      result.error = err.message;
    } finally {
      // Check client is connected before closing since we use this for validation
      if (this._client) {
        await this._client.close();
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
    return `SELECT name FROM sysobjects WHERE xtype='U';`;
  }

  getTableSchemaSql(table_name) {
    return {
      query: `SELECT COLUMN_NAME, COLUMN_DEFAULT, IS_NULLABLE, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = @p0`,
      params: [table_name],
    };
  }
}

module.exports.MSSQLConnector = MSSQLConnector;
