module.exports.SqlAgentListTables = {
  name: "sql-list-tables",
  plugin: function () {
    const {
      listSQLConnections,
      getDBClient,
    } = require("./SQLConnectors/index.js");

    return {
      name: "sql-list-tables",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all available tables in a database via its `database_id`.",
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              database_id: {
                type: "string",
                description:
                  "The database identifier for which we will list all tables for.",
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ database_id = "" }) {
            try {
              this.super.handlerProps.log(`Using the sql-list-tables tool.`);
              const databaseConfig = (await listSQLConnections()).find(
                (db) => db.database_id === database_id
              );
              if (!databaseConfig)
                return `No database connection for ${database_id} was found!`;

              const db = getDBClient(databaseConfig.engine, databaseConfig);
              this.super.introspect(
                `${this.caller}: Checking what are the available tables in the ${databaseConfig.database_id} database.`
              );
              this.super.introspect(`Running SQL: ${db.getTablesSql()}`);
              const result = await db.runQuery(db.getTablesSql(database_id));
              return JSON.stringify(result);
            } catch (e) {
              console.error(e);
              return e.message;
            }
          },
        });
      },
    };
  },
};
