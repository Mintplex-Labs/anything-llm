/* eslint-env jest */
const { ConnectionStringParser } = require("../../../utils/agents/aibitat/plugins/sql-agent/SQLConnectors/utils");

describe("ConnectionStringParser", () => {
  describe("Basic Parsing", () => {
    test("should parse a basic connection string without options", () => {
      const parser = new ConnectionStringParser({ scheme: "mssql" });
      const result = parser.parse("mssql://user:pass@localhost:1433/mydb");

      expect(result).toEqual({
        scheme: "mssql",
        username: "user",
        password: "pass",
        hosts: [{ host: "localhost", port: 1433 }],
        endpoint: "mydb",
        options: undefined
      });
    });

    test("should parse a connection string with options", () => {
      const parser = new ConnectionStringParser({ scheme: "mssql" });
      const result = parser.parse("mssql://user:pass@localhost:1433/mydb?encrypt=true&trustServerCertificate=true");

      expect(result).toEqual({
        scheme: "mssql",
        username: "user",
        password: "pass",
        hosts: [{ host: "localhost", port: 1433 }],
        endpoint: "mydb",
        options: {
          encrypt: "true",
          trustServerCertificate: "true"
        }
      });
    });

    test("should handle empty passwords", () => {
      const parser = new ConnectionStringParser({ scheme: "mssql" });
      const result = parser.parse("mssql://user@localhost:1433/mydb");

      expect(result).toEqual({
        scheme: "mssql",
        username: "user",
        password: undefined,
        hosts: [{ host: "localhost", port: 1433 }],
        endpoint: "mydb",
        options: undefined
      });
    });
  });

  describe("Error Handling", () => {
    test("should throw error for invalid scheme", () => {
      const parser = new ConnectionStringParser({ scheme: "mssql" });
      expect(() => parser.parse("mysql://user:pass@localhost:3306/mydb"))
        .toThrow("URI must start with 'mssql://'");
    });

    test("should throw error for missing scheme", () => {
      const parser = new ConnectionStringParser({ scheme: "mssql" });
      expect(() => parser.parse("user:pass@localhost:1433/mydb"))
        .toThrow("No scheme found in URI");
    });
  });

  describe("Special Characters", () => {
    test("should handle special characters in username and password", () => {
      const parser = new ConnectionStringParser({ scheme: "mssql" });
      const result = parser.parse("mssql://user%40domain:p%40ssw%3Ard@localhost:1433/mydb");

      expect(result).toEqual({
        scheme: "mssql",
        username: "user@domain",
        password: "p@ssw:rd",
        hosts: [{ host: "localhost", port: 1433 }],
        endpoint: "mydb",
        options: undefined
      });
    });

    test("should handle special characters in database name", () => {
      const parser = new ConnectionStringParser({ scheme: "mssql" });
      const result = parser.parse("mssql://user:pass@localhost:1433/my%20db");

      expect(result).toEqual({
        scheme: "mssql",
        username: "user",
        password: "pass",
        hosts: [{ host: "localhost", port: 1433 }],
        endpoint: "my db",
        options: undefined
      });
    });
  });

  describe("Multiple Hosts", () => {
    test("should parse multiple hosts", () => {
      const parser = new ConnectionStringParser({ scheme: "mssql" });
      const result = parser.parse("mssql://user:pass@host1:1433,host2:1434/mydb");

      expect(result).toEqual({
        scheme: "mssql",
        username: "user",
        password: "pass",
        hosts: [
          { host: "host1", port: 1433 },
          { host: "host2", port: 1434 }
        ],
        endpoint: "mydb",
        options: undefined
      });
    });

    test("should handle hosts without ports", () => {
      const parser = new ConnectionStringParser({ scheme: "mssql" });
      const result = parser.parse("mssql://user:pass@host1,host2/mydb");

      expect(result).toEqual({
        scheme: "mssql",
        username: "user",
        password: "pass",
        hosts: [
          { host: "host1" },
          { host: "host2" }
        ],
        endpoint: "mydb",
        options: undefined
      });
    });
  });

  describe("Provider-Specific Tests", () => {
    test("should parse MySQL connection string", () => {
      const parser = new ConnectionStringParser({ scheme: "mysql" });
      const result = parser.parse("mysql://user:pass@localhost:3306/mydb?ssl=true");

      expect(result).toEqual({
        scheme: "mysql",
        username: "user",
        password: "pass",
        hosts: [{ host: "localhost", port: 3306 }],
        endpoint: "mydb",
        options: { ssl: "true" }
      });
    });

    test("should parse PostgreSQL connection string", () => {
      const parser = new ConnectionStringParser({ scheme: "postgresql" });
      const result = parser.parse("postgresql://user:pass@localhost:5432/mydb?sslmode=require");

      expect(result).toEqual({
        scheme: "postgresql",
        username: "user",
        password: "pass",
        hosts: [{ host: "localhost", port: 5432 }],
        endpoint: "mydb",
        options: { sslmode: "require" }
      });
    });

    test("should parse MSSQL connection string with encryption options", () => {
      const parser = new ConnectionStringParser({ scheme: "mssql" });
      const result = parser.parse("mssql://user:pass@localhost:1433/mydb?encrypt=true&trustServerCertificate=true");

      expect(result).toEqual({
        scheme: "mssql",
        username: "user",
        password: "pass",
        hosts: [{ host: "localhost", port: 1433 }],
        endpoint: "mydb",
        options: {
          encrypt: "true",
          trustServerCertificate: "true"
        }
      });
    });
  });
});