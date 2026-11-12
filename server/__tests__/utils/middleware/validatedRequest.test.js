jest.mock("bcryptjs");
jest.mock("../../../models/systemSettings", () => ({
  SystemSettings: { isMultiUserMode: jest.fn() },
}));
jest.mock("../../../models/user", () => ({
  User: { get: jest.fn() },
}));
jest.mock("../../../utils/EncryptionManager", () => ({
  EncryptionManager: jest.fn(function () {
    this.decrypt = jest.fn().mockReturnValue("single-user-password");
  }),
}));
jest.mock("../../../utils/http", () => ({
  decodeJWT: jest.fn(),
}));

describe("validatedRequest single-user auth", () => {
  const envBackup = {
    NODE_ENV: process.env.NODE_ENV,
    AUTH_TOKEN: process.env.AUTH_TOKEN,
    JWT_SECRET: process.env.JWT_SECRET,
  };

  const loadModules = () => ({
    validatedRequest:
      require("../../../utils/middleware/validatedRequest").validatedRequest,
    SystemSettings: require("../../../models/systemSettings").SystemSettings,
    decodeJWT: require("../../../utils/http").decodeJWT,
    bcrypt: require("bcryptjs"),
    EncryptionManager:
      require("../../../utils/EncryptionManager").EncryptionManager,
  });

  const makeRequest = () => ({
    header: jest.fn(
      (name) =>
        ({ Authorization: "Bearer some.jwt.value" })[name]
    ),
  });

  const makeResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    locals: {},
  });

  const makeNext = () => jest.fn();

  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = "test";
    process.env.AUTH_TOKEN = "single-user-password";
    process.env.JWT_SECRET = "jwt-secret";
  });

  afterEach(() => {
    for (const [key, value] of Object.entries(envBackup)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it("hashes AUTH_TOKEN once and compares the decrypted payload on every request", async () => {
    const { validatedRequest, SystemSettings, decodeJWT, bcrypt, EncryptionManager } =
      loadModules();
    SystemSettings.isMultiUserMode.mockResolvedValue(false);
    decodeJWT.mockReturnValue({
      p: "a".repeat(32) + ":" + "b".repeat(32),
    });
    bcrypt.hashSync.mockReturnValue("$2b$10$cachedhash");
    bcrypt.compareSync.mockReturnValue(true);

    for (let i = 0; i < 3; i++) {
      const request = makeRequest();
      const response = makeResponse();
      const next = makeNext();

      await validatedRequest(request, response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(response.status).not.toHaveBeenCalled();
      expect(bcrypt.compareSync).toHaveBeenLastCalledWith(
        "single-user-password",
        "$2b$10$cachedhash"
      );
    }

    expect(EncryptionManager).toHaveBeenCalledTimes(1);
    expect(bcrypt.hashSync).toHaveBeenCalledTimes(1);
    expect(bcrypt.hashSync).toHaveBeenCalledWith("single-user-password", 10);
    expect(bcrypt.compareSync).toHaveBeenCalledTimes(3);
  });

  it("rejects requests whose decrypted payload does not match AUTH_TOKEN", async () => {
    const { validatedRequest, SystemSettings, decodeJWT, bcrypt } = loadModules();
    SystemSettings.isMultiUserMode.mockResolvedValue(false);
    decodeJWT.mockReturnValue({
      p: "a".repeat(32) + ":" + "b".repeat(32),
    });
    bcrypt.hashSync.mockReturnValue("$2b$10$cachedhash");
    bcrypt.compareSync.mockReturnValue(false);

    const request = makeRequest();
    const response = makeResponse();
    const next = makeNext();

    await validatedRequest(request, response, next);

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      error: "Invalid auth credentials.",
    });
  });

  it("passes through without bcrypt when AUTH_TOKEN is not configured", async () => {
    const { validatedRequest, SystemSettings, bcrypt } = loadModules();
    delete process.env.AUTH_TOKEN;
    SystemSettings.isMultiUserMode.mockResolvedValue(false);

    const request = makeRequest();
    const response = makeResponse();
    const next = makeNext();

    await validatedRequest(request, response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(response.status).not.toHaveBeenCalled();
    expect(bcrypt.hashSync).not.toHaveBeenCalled();
    expect(bcrypt.compareSync).not.toHaveBeenCalled();
  });

  it("rejects requests with a malformed p payload", async () => {
    const { validatedRequest, SystemSettings, decodeJWT, bcrypt } = loadModules();
    SystemSettings.isMultiUserMode.mockResolvedValue(false);
    decodeJWT.mockReturnValue({ p: "not-a-valid-payload" });
    bcrypt.hashSync.mockReturnValue("$2b$10$cachedhash");
    bcrypt.compareSync.mockReturnValue(true);

    const request = makeRequest();
    const response = makeResponse();
    const next = makeNext();

    await validatedRequest(request, response, next);

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      error: "Token expired or failed validation.",
    });
    expect(bcrypt.compareSync).not.toHaveBeenCalled();
  });

  it("rejects requests without an Authorization header", async () => {
    const { validatedRequest, SystemSettings, decodeJWT, bcrypt } = loadModules();
    SystemSettings.isMultiUserMode.mockResolvedValue(false);
    decodeJWT.mockReturnValue({
      p: "a".repeat(32) + ":" + "b".repeat(32),
    });

    const request = { header: jest.fn(() => undefined) };
    const response = makeResponse();
    const next = makeNext();

    await validatedRequest(request, response, next);

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.json).toHaveBeenCalledWith({
      error: "No auth token found.",
    });
    expect(bcrypt.compareSync).not.toHaveBeenCalled();
  });
});