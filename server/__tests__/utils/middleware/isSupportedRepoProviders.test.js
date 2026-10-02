const {
  isSupportedRepoProvider,
} = require("../../../utils/middleware/isSupportedRepoProviders");

describe("isSupportedRepoProvider middleware", () => {
  it("calls next for each supported repo platform", () => {
    for (const repo_platform of ["github", "gitlab", "gitea"]) {
      const next = jest.fn();
      const response = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      isSupportedRepoProvider({ params: { repo_platform } }, response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(response.status).not.toHaveBeenCalled();
    }
  });

  it("responds with 500 instead of throwing for an unsupported platform", () => {
    const next = jest.fn();
    const response = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    expect(() =>
      isSupportedRepoProvider(
        { params: { repo_platform: "bitbucket" } },
        response,
        next
      )
    ).not.toThrow();

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith(
      "Unsupported repo platform bitbucket"
    );
  });

  it("responds with 500 instead of throwing when repo_platform is missing", () => {
    const next = jest.fn();
    const response = { status: jest.fn().mockReturnThis(), send: jest.fn() };

    expect(() =>
      isSupportedRepoProvider({ params: {} }, response, next)
    ).not.toThrow();

    expect(next).not.toHaveBeenCalled();
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith("Unsupported repo platform null");
  });
});
