/* eslint-env jest */
const { PGVector } = require("../../../utils/vectorDbProviders/pgvector");
const { updateENV } = require("../../../utils/helpers/updateENV");

const ORIGINAL_ENV = process.env;

beforeEach(() => {
  process.env = { ...ORIGINAL_ENV };
  delete process.env.PGVECTOR_CONNECTION_STRING;
});

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.restoreAllMocks();
});

describe("PGVectorConnectionString validation on save", () => {
  it.each([
    "postgresql://dbuser:dbuserpass@localhost:5432/yourdb",
    "postgres://dbuser:dbuserpass@localhost:5432/yourdb",
  ])("accepts %s", async (connectionString) => {
    const validateConnection = jest
      .spyOn(PGVector, "validateConnection")
      .mockResolvedValue({ error: null, success: true });

    const { error } = await updateENV({
      PGVectorConnectionString: connectionString,
    });

    expect(error).toBe(false);
    expect(validateConnection).toHaveBeenCalledWith({ connectionString });
    expect(process.env.PGVECTOR_CONNECTION_STRING).toBe(connectionString);
  });

  it.each([
    "mysql://dbuser:dbuserpass@localhost:3306/yourdb",
    "localhost:5432/yourdb",
  ])("rejects %s without connecting", async (connectionString) => {
    const validateConnection = jest.spyOn(PGVector, "validateConnection");

    const { error } = await updateENV({
      PGVectorConnectionString: connectionString,
    });

    expect(error).toContain("Invalid Postgres connection string");
    expect(validateConnection).not.toHaveBeenCalled();
    expect(process.env.PGVECTOR_CONNECTION_STRING).toBeUndefined();
  });
});
