process.env.STORAGE_DIR = __dirname;

jest.mock("../../utils/helpers/updateENV", () => ({
  updateENV: jest.fn(),
  dumpENV: jest.fn(),
}));
jest.mock("../../utils/http", () => ({
  ...jest.requireActual("../../utils/http"),
  multiUserMode: () => false,
}));
jest.mock("../../utils/middleware/validatedRequest", () => ({
  validatedRequest: (_req, _res, next) => next(),
}));

const { updateENV } = require("../../utils/helpers/updateENV");
const { systemEndpoints } = require("../../endpoints/system");

function captureHandler(path) {
  const app = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    use: jest.fn(),
  };
  systemEndpoints(app);
  const call = app.post.mock.calls.find(([route]) => route === path);
  if (!call) throw new Error(`route ${path} was never registered`);
  return call[call.length - 1];
}

function mockResponse() {
  return {
    locals: {},
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    sendStatus: jest.fn().mockReturnValue({ end: jest.fn() }),
  };
}

describe("POST /system/update-password", () => {
  beforeEach(() => jest.clearAllMocks());

  it("reports the failure when updateENV rejects the new password", async () => {
    updateENV.mockResolvedValue({
      newValues: {},
      error: "Your password has restricted characters in it.",
    });
    const handler = captureHandler("/system/update-password");
    const response = mockResponse();

    await handler(
      { body: { usePassword: true, newPassword: "my.pass" } },
      response
    );

    expect(response.json).toHaveBeenCalledWith({
      success: false,
      error: "Your password has restricted characters in it.",
    });
  });

  it("reports success when updateENV accepts the new password", async () => {
    updateENV.mockResolvedValue({ newValues: {}, error: false });
    const handler = captureHandler("/system/update-password");
    const response = mockResponse();

    await handler(
      { body: { usePassword: true, newPassword: "goodpassword" } },
      response
    );

    expect(response.json).toHaveBeenCalledWith({
      success: true,
      error: false,
    });
  });

  it("handles a rejected updateENV inside its own catch instead of leaking it", async () => {
    // Attach a catch up front so a leaked rejection fails this test cleanly
    // rather than terminating the worker with an unhandled rejection.
    const rejection = Promise.reject(new Error("storage is read-only"));
    rejection.catch(() => {});
    updateENV.mockReturnValue(rejection);
    const handler = captureHandler("/system/update-password");
    const response = mockResponse();

    await handler(
      { body: { usePassword: true, newPassword: "goodpassword" } },
      response
    );

    // If the Promise is never awaited the handler falls through and answers
    // 200 success instead of reaching its catch.
    expect(response.json).not.toHaveBeenCalled();
    expect(response.sendStatus).toHaveBeenCalledWith(500);
  });
});
