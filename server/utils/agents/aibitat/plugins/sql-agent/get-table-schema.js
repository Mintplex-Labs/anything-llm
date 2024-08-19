module.exports.SqlAgentGetTableSchema = {
  name: "sql-get-table-schema",
  plugin: function () {
    const {
      listSQLConnections,
      getDBClient,
    } = require("./SQLConnectors/index.js");

    return {
      name: "sql-get-table-schema",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Gets the table schema in SQL for a given `table` and `database_id`",
          examples: [
            {
              prompt: "What does the customers table in access-logs look like?",
              call: JSON.stringify({
                database_id: "access-logs",
                table_name: "customers",
              }),
            },
            {
              prompt:
                "Get me the full name of a company in records-main, the table should be call comps",
              call: JSON.stringify({
                database_id: "records-main",
                table_name: "comps",
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              database_id: {
                type: "string",
                description:
                  "The database identifier for which we will connect to to query the table schema. This is a required field.",
              },
              table_name: {
                type: "string",
                description:
                  "The database identifier for the table name we want the schema for. This is a required field.",
              },
            },
            additionalProperties: false,
          },
          required: ["database_id", "table_name"],
          handler: async function ({ database_id = "", table_name = "" }) {
            this.super.handlerProps.log(`Using the sql-get-table-schema tool.`);
            try {
              const databaseConfig = (await listSQLConnections()).find(
                (db) => db.database_id === database_id
              );
              if (!databaseConfig) {
                this.super.handlerProps.log(
                  `sql-get-table-schema to find config!`,
                  database_id
                );
                return `No database connection for ${database_id} was found!`;
              }

              const db = getDBClient(databaseConfig.engine, databaseConfig);
              this.super.introspect(
                `${this.caller}: Querying the table schema for ${table_name} in the ${databaseConfig.database_id} database.`
              );
              this.super.introspect(
                `Running SQL: ${db.getTableSchemaSql(table_name)}`
              );
              const result = await db.runQuery(
                db.getTableSchemaSql(table_name)
              );

              if (result.error) {
                this.super.handlerProps.log(
                  `sql-get-table-schema tool reported error`,
                  result.error
                );
                this.super.introspect(`Error: ${result.error}`);
                return `There was an error running the query: ${result.error}`;
              }

              return JSON.stringify(result);
            } catch (e) {
              this.super.handlerProps.log(
                `sql-get-table-schema raised an error. ${e.message}`
              );
              return e.message;
            }
          },
        });
      },
    };
  },
};
