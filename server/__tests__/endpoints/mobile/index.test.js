/* eslint-env jest, node */

jest.mock("../../../utils/middleware/validatedRequest", () => ({
  validatedRequest: jest.fn(),
}));
jest.mock("../../../models/mobileDevice", () => ({ MobileDevice: {} }));
jest.mock("../../../endpoints/mobile/utils", () => ({
  handleMobileCommand: jest.fn(),
}));
jest.mock("../../../endpoints/mobile/middleware", () => ({
  validDeviceToken: jest.fn(),
  validRegistrationToken: jest.fn(),
}));
jest.mock("../../../utils/http", () => ({ reqBody: jest.fn() }));
jest.mock("../../../utils/middleware/multiUserProtected", () => ({
  flexUserRoleValid: jest.fn(),
  ROLES: {},
}));

const { mobileEndpoints } = require("../../../endpoints/mobile");
const { handleMobileCommand } = require("../../../endpoints/mobile/utils");

function mockResponse({ headersSent = false } = {}) {
  const response = { headersSent, locals: {} };
  response.sendStatus = jest.fn().mockReturnValue(response);
  response.end = jest.fn().mockReturnValue(response);
  return response;
}

describe("POST /mobile/send/:command", () => {
  let handler;

  beforeAll(() => {
    const app = { get: jest.fn(), post: jest.fn(), delete: jest.fn() };
    mobileEndpoints(app);
    handler = app.post.mock.calls.find(
      ([path]) => path === "/mobile/send/:command"
    )[2];
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  it("answers 500 when the command rejects before anything was sent", async () => {
    handleMobileCommand.mockRejectedValue(new Error("boom"));
    const response = mockResponse();

    await handler({ params: { command: "stream-chat" } }, response);

    expect(response.sendStatus).toHaveBeenCalledWith(500);
    expect(response.end).toHaveBeenCalled();
  });

  it("ends the stream when the command rejects after headers were flushed", async () => {
    handleMobileCommand.mockRejectedValue(new Error("boom"));
    const response = mockResponse({ headersSent: true });

    await handler({ params: { command: "stream-chat" } }, response);

    expect(response.sendStatus).not.toHaveBeenCalled();
    expect(response.end).toHaveBeenCalled();
  });
});
