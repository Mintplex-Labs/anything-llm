module.exports.SqlAgentListDatabase = {
  name: "sql-list-databases",
  plugin: function () {
    const { listSQLConnections } = require("./SQLConnectors");
    return {
      name: "sql-list-databases",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all available databases via `list_databases` you currently have access to. Returns a unique string identifier `database_id` that can be used for future calls.",
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          handler: async function () {
            this.super.handlerProps.log(`Using the sql-list-databases tool.`);
            this.super.introspect(
              `${this.caller}: Checking what are the available databases.`
            );
            return JSON.stringify(await listSQLConnections());
          },
        });
      },
    };
  },
};
