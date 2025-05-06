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
      server: parsed?.hosts[0]?.host,
      port: parsed?.hosts[0]?.port,
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
   * @returns {import(".").QueryResult}
   */
  async runQuery(queryString = "") {
    const result = { rows: [], count: 0, error: null };
    try {
      if (!this.#connected) await this.connect();

      const query = await this._client.query(queryString);
      result.rows = query.recordset;
      result.count = query.rowsAffected.reduce((sum, a) => sum + a, 0);
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
    return `SELECT name FROM sysobjects WHERE xtype='U';`;
  }
  getTableSchemaSql(table_name) {
    return `SELECT COLUMN_NAME,COLUMN_DEFAULT,IS_NULLABLE,DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME='${table_name}'`;
  }
}

module.exports.MSSQLConnector = MSSQLConnector;
