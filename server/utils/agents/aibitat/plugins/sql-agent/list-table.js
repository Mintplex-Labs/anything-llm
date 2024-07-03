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
          examples: [
            {
              prompt: "What tables are there in the `access-logs` database?",
              call: JSON.stringify({ database_id: "access-logs" }),
            },
            {
              prompt:
                "What information can you access in the customer_accts postgres db?",
              call: JSON.stringify({ database_id: "customer_accts" }),
            },
            {
              prompt: "Can you tell me what is in the primary-logs db?",
              call: JSON.stringify({ database_id: "primary-logs" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              database_id: {
                type: "string",
                description:
                  "The database identifier for which we will list all tables for. This is a required parameter",
              },
            },
            additionalProperties: false,
          },
          required: ["database_id"],
          handler: async function ({ database_id = "" }) {
            try {
              this.super.handlerProps.log(`Using the sql-list-tables tool.`);
              const databaseConfig = (await listSQLConnections()).find(
                (db) => db.database_id === database_id
              );
              if (!databaseConfig) {
                this.super.handlerProps.log(
                  `sql-list-tables failed to find config!`,
                  database_id
                );
                return `No database connection for ${database_id} was found!`;
              }

              const db = getDBClient(databaseConfig.engine, databaseConfig);
              this.super.introspect(
                `${this.caller}: Checking what are the available tables in the ${databaseConfig.database_id} database.`
              );

              this.super.introspect(`Running SQL: ${db.getTablesSql()}`);
              const result = await db.runQuery(db.getTablesSql(database_id));
              if (result.error) {
                this.super.handlerProps.log(
                  `sql-list-tables tool reported error`,
                  result.error
                );
                this.super.introspect(`Error: ${result.error}`);
                return `There was an error running the query: ${result.error}`;
              }

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
