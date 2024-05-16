const { SqlAgentGetTableSchema } = require("./get-table-schema");
const { SqlAgentListDatabase } = require("./list-database");
const { SqlAgentListTables } = require("./list-table");
const { SqlAgentQuery } = require("./query");

const sqlAgent = {
  name: "sql-agent",
  startupConfig: {
    params: {},
  },
  plugin: [
    SqlAgentListDatabase,
    SqlAgentListTables,
    SqlAgentGetTableSchema,
    SqlAgentQuery,
  ],
};

module.exports = {
  sqlAgent,
};
