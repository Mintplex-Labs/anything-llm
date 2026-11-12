jest.mock("bcryptjs");

describe("authTokenHash helper", () => {
  const originalToken = process.env.AUTH_TOKEN;
  const hadToken = "AUTH_TOKEN" in process.env;

  const loadModules = () => ({
    bcrypt: require("bcryptjs"),
    authTokenHash:
      require("../../../utils/helpers/authTokenHash").authTokenHash,
  });

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    if (hadToken) {
      process.env.AUTH_TOKEN = originalToken;
    } else {
      delete process.env.AUTH_TOKEN;
    }
  });

  it("memoizes the hash and reuses it across calls for the same token", () => {
    process.env.AUTH_TOKEN = "token-a";
    const { bcrypt, authTokenHash } = loadModules();
    bcrypt.hashSync.mockReturnValue("$2b$10$hasha");

    expect(authTokenHash()).toBe("$2b$10$hasha");
    expect(authTokenHash()).toBe("$2b$10$hasha");
    expect(authTokenHash()).toBe("$2b$10$hasha");

    expect(bcrypt.hashSync).toHaveBeenCalledTimes(1);
    expect(bcrypt.hashSync).toHaveBeenCalledWith("token-a", 10);
  });

  it("recomputes when AUTH_TOKEN changes", () => {
    process.env.AUTH_TOKEN = "token-a";
    const { bcrypt, authTokenHash } = loadModules();
    bcrypt.hashSync.mockReturnValue("$2b$10$hasha");
    expect(authTokenHash()).toBe("$2b$10$hasha");

    process.env.AUTH_TOKEN = "token-b";
    bcrypt.hashSync.mockReturnValue("$2b$10$hashb");
    expect(authTokenHash()).toBe("$2b$10$hashb");

    expect(bcrypt.hashSync).toHaveBeenCalledTimes(2);
    expect(bcrypt.hashSync).toHaveBeenLastCalledWith("token-b", 10);
  });

  it("recomputes when AUTH_TOKEN changes back to a previously seen value", () => {
    process.env.AUTH_TOKEN = "token-a";
    const { bcrypt, authTokenHash } = loadModules();
    bcrypt.hashSync.mockReturnValue("$2b$10$hasha");
    expect(authTokenHash()).toBe("$2b$10$hasha");

    process.env.AUTH_TOKEN = "token-b";
    bcrypt.hashSync.mockReturnValue("$2b$10$hashb");
    expect(authTokenHash()).toBe("$2b$10$hashb");

    process.env.AUTH_TOKEN = "token-a";
    bcrypt.hashSync.mockReturnValue("$2b$10$hasha");
    expect(authTokenHash()).toBe("$2b$10$hasha");

    expect(bcrypt.hashSync).toHaveBeenCalledTimes(3);
    expect(bcrypt.hashSync).toHaveBeenLastCalledWith("token-a", 10);
  });
});