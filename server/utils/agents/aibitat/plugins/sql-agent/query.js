module.exports.SqlAgentQuery = {
  name: "sql-query",
  plugin: function () {
    const { FAKE_DBS } = require("./index.js");
    const { getDBClient } = require("./SQLConnectors/index.js");

    return {
      name: "sql-query",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Run a read-only SQL query on a `database_id` which will return up rows of data related to the query. The query must only be SELECT statements which do not modify the table data. There should be a reasonable LIMIT on the return quantity to prevent long-running or queries which crash the db.",
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              database_id: {
                type: "string",
                description:
                  "The database identifier for which we will connect to to query the table schema.",
              },
              sql_query: {
                type: "string",
                description:
                  "The raw SQL query to run. Should be a query which does not modify the table and will return results.",
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ database_id = "", sql_query = "" }) {
            this.super.handlerProps.log(`Using the sql-query tool.`);
            try {
              const databaseConfig = FAKE_DBS.find(
                (db) => db.database_id === database_id
              );
              if (!databaseConfig)
                return `No database connection for ${database_id} was found!`;

              this.super.introspect(
                `${this.caller}: Im going to run a query on the ${database_id} to get an answer.`
              );
              const db = getDBClient(databaseConfig.engine, databaseConfig);

              this.super.introspect(`Running SQL: ${sql_query}`);
              const result = await db.runQuery(sql_query);

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
