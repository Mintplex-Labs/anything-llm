const { ConnectionStringParser } = require("./utils");
// -- oracledb.initOracleClient({libDir: "/opt/oracle/instantclient_23_26",});
// Thin mode: DO NOT call initOracleClient()

class OracleConnector {
  #connected = false;
  database_id = "";

  constructor(
    config = {
      connectionString: null,
    }
  ) {
        // Load the Oracle driver on demand when this constructor is called
    this.oracledb = require("oracledb");

    // Set global output format once (will be set each time an instance is created,
    // but that's harmless due to caching)
    this.oracledb.outFormat = this.oracledb.OUT_FORMAT_OBJECT;
    
    // Log thin mode status when an instance is created
    console.log("Oracle driver thin mode:", oracledb.thin);
    
    this.className = "OracleConnector";
    this.connectionString = config.connectionString;
    this._client = null;
    this.database_id = this.#parseDatabase();
  }

  #parseDatabase() {
    const connectionParser = new ConnectionStringParser({ scheme: "oracle" });
    const parsed = connectionParser.parse(this.connectionString);
    return parsed?.endpoint; // service name
  }

  async connect() {
    const connectionParser = new ConnectionStringParser({ scheme: "oracle" });
    const parsed = connectionParser.parse(this.connectionString);

    const host = parsed.hosts[0]?.host;
    const port = parsed.hosts[0]?.port || 1521;
    const service = parsed.endpoint;

    this._client = await oracledb.getConnection({
      user: parsed.username,
      password: parsed.password,
      connectString: `${host}:${port}/${service}`,
    });

    this.#connected = true;
    return this._client;
  }

  /**
   * @param {string} queryString
   * @returns {Promise<import(".").QueryResult>}
   */
  async runQuery(queryString = "") {
    const result = { rows: [], count: 0, error: null };

    try {
      if (!this.#connected) await this.connect();

      const query = await this._client.execute(queryString, [], {
        autoCommit: true,
      });

      result.rows = query.rows || [];
      result.count = query.rows ? query.rows.length : 0;
    } catch (err) {
      console.log(this.className, err);
      result.error = err.message;
    } finally {
      if (this._client) {
        await this._client.close();
        this.#connected = false;
      }
    }

    return result;
  }

  async validateConnection() {
    try {
      const result = await this.runQuery("SELECT 1 FROM DUAL");
      return { success: !result.error, error: result.error };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getTablesSql() {
    return `
      SELECT table_name
      FROM user_tables
    `;
  }

  getTableSchemaSql(table_name) {
    return `
      SELECT column_name, data_type
      FROM user_tab_columns
      WHERE table_name = UPPER('${table_name}')
    `;
  }
}

module.exports.OracleConnector = OracleConnector;