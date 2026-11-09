/* eslint-env jest, node */
jest.mock("langchain/document_loaders/web/puppeteer", () => {
  class PuppeteerWebBaseLoader {
    constructor(webPath, options) {
      this.webPath = webPath;
      this.options = options;
    }
  }
  PuppeteerWebBaseLoader.imports = jest.fn();
  return { PuppeteerWebBaseLoader };
});

const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const { PuppeteerLoader } = require("../../../utils/puppeteer");

function mockBrowser(page) {
  const browser = {
    newPage: jest.fn().mockResolvedValue(page),
    close: jest.fn().mockResolvedValue(),
    process: () => null,
  };
  PuppeteerWebBaseLoader.imports.mockResolvedValue({
    launch: jest.fn().mockResolvedValue(browser),
  });
  return browser;
}

function mockPage(overrides = {}) {
  return {
    setExtraHTTPHeaders: jest.fn().mockResolvedValue(),
    goto: jest.fn().mockResolvedValue(),
    evaluate: jest.fn().mockResolvedValue("<p>body</p>"),
    ...overrides,
  };
}

const scrape = (options) =>
  new PuppeteerLoader("https://example.com", options).scrape();

describe("PuppeteerLoader", () => {
  it("returns the page content and closes the browser", async () => {
    const browser = mockBrowser(mockPage());

    await expect(scrape()).resolves.toBe("<p>body</p>");
    expect(browser.close).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["goto", { goto: jest.fn().mockRejectedValue(new Error("timeout")) }],
    [
      "evaluate",
      {
        evaluate: jest
          .fn()
          .mockRejectedValue(new Error("Execution context was destroyed")),
      },
    ],
  ])("closes the browser when %s throws", async (_, overrides) => {
    const browser = mockBrowser(mockPage(overrides));

    await expect(scrape()).rejects.toThrow();
    expect(browser.close).toHaveBeenCalledTimes(1);
  });

  it("kills the browser process when close() rejects", async () => {
    const kill = jest.fn();
    const browser = mockBrowser(
      mockPage({ goto: jest.fn().mockRejectedValue(new Error("timeout")) })
    );
    browser.close.mockRejectedValue(new Error("Connection closed"));
    browser.process = () => ({ kill });

    await expect(scrape()).rejects.toThrow("timeout");
    expect(kill).toHaveBeenCalledWith("SIGKILL");
  });

  it("sends custom headers and passes the page to evaluate", async () => {
    const page = mockPage();
    mockBrowser(page);

    await expect(
      scrape({
        headers: { Authorization: "Bearer abc" },
        evaluate: async (p) => (p === page ? "evaluated" : "wrong page"),
      })
    ).resolves.toBe("evaluated");
    expect(page.setExtraHTTPHeaders).toHaveBeenCalledWith({
      Authorization: "Bearer abc",
    });
  });
});
