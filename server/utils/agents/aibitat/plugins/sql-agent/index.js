const { SqlAgentGetTableSchema } = require("./get-table-schema");
const { SqlAgentListDatabase } = require("./list-database");
const { SqlAgentListTables } = require("./list-table");
const { SqlAgentQuery } = require("./query");

const FAKE_DBS = [
  {
    database_id: "dvd_rentals",
    engine: "postgresql",
    connectionString: "postgres://tim:password@0.0.0.0:5432/dvd_rentals",
  },
  {
    database_id: "classics",
    engine: "mysql",
    connectionString: "mysql://admin:password@127.0.0.1:3306/classicmodels",
  },
];

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
  FAKE_DBS,
};
