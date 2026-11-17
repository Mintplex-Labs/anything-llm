/* eslint-env jest, node */
const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");
const { PuppeteerLoader } = require("../../../utils/puppeteer");

const URL = "https://example.com";

function mockPage(overrides = {}) {
  return {
    setExtraHTTPHeaders: jest.fn().mockResolvedValue(),
    goto: jest.fn().mockResolvedValue(),
    evaluate: jest.fn().mockResolvedValue("<p>body</p>"),
    ...overrides,
  };
}

function mockBrowser(page = mockPage(), overrides = {}) {
  return {
    page,
    newPage: jest.fn().mockResolvedValue(page),
    close: jest.fn().mockResolvedValue(),
    process: () => null,
    ...overrides,
  };
}

/**
 * Stubs puppeteer's launch (only the real langchain loader's dynamic import is
 * replaced) so each launch call hands out the next browser in the list.
 */
function mockLaunch(...browsers) {
  const launch = jest.fn();
  for (const browser of browsers) launch.mockResolvedValueOnce(browser);
  jest.spyOn(PuppeteerWebBaseLoader, "imports").mockResolvedValue({ launch });
  return launch;
}

const scrape = (options, url = URL) =>
  new PuppeteerLoader(url, options).scrape();

afterEach(() => jest.restoreAllMocks());

describe("PuppeteerLoader", () => {
  describe("success path", () => {
    it("reads document.body.innerHTML when no evaluate is given", async () => {
      const browser = mockBrowser();
      mockLaunch(browser);

      await expect(scrape()).resolves.toBe("<p>body</p>");
      expect(browser.page.evaluate).toHaveBeenCalledTimes(1);
      expect(browser.page.evaluate.mock.calls[0][0].toString()).toContain(
        "document.body.innerHTML"
      );
    });

    it("passes the page and browser to evaluate and returns its result", async () => {
      const browser = mockBrowser();
      mockLaunch(browser);
      const evaluate = jest.fn().mockResolvedValue("evaluated");

      await expect(scrape({ evaluate })).resolves.toBe("evaluated");
      expect(evaluate).toHaveBeenCalledWith(browser.page, browser);
      expect(browser.page.evaluate).not.toHaveBeenCalled();
      expect(browser.close).toHaveBeenCalledTimes(1);
    });

    it("returns whatever evaluate resolves to, including empty values", async () => {
      mockLaunch(mockBrowser(), mockBrowser());

      await expect(scrape({ evaluate: async () => "" })).resolves.toBe("");
      await expect(scrape({ evaluate: async () => undefined })).resolves.toBe(
        undefined
      );
    });
  });

  describe("options", () => {
    it("launches with defaults that caller launchOptions override", async () => {
      const launch = mockLaunch(mockBrowser(), mockBrowser());

      await scrape();
      expect(launch).toHaveBeenLastCalledWith({
        headless: true,
        defaultViewport: null,
        ignoreDefaultArgs: ["--disable-extensions"],
      });

      await scrape({
        launchOptions: {
          headless: "new",
          ignoreHTTPSErrors: true,
          args: ["--no-sandbox"],
        },
      });
      expect(launch).toHaveBeenLastCalledWith({
        headless: "new",
        defaultViewport: null,
        ignoreDefaultArgs: ["--disable-extensions"],
        ignoreHTTPSErrors: true,
        args: ["--no-sandbox"],
      });
    });

    it("navigates to the loader URL with defaults that caller gotoOptions override", async () => {
      const first = mockBrowser();
      const second = mockBrowser();
      mockLaunch(first, second);

      await scrape(undefined, "https://example.com/a");
      expect(first.page.goto).toHaveBeenCalledWith("https://example.com/a", {
        timeout: 180000,
        waitUntil: "domcontentloaded",
      });

      await scrape({ gotoOptions: { waitUntil: "networkidle2" } });
      expect(second.page.goto).toHaveBeenCalledWith(URL, {
        timeout: 180000,
        waitUntil: "networkidle2",
      });
    });

    it("sets custom headers before navigating", async () => {
      const browser = mockBrowser();
      mockLaunch(browser);
      const order = [];
      browser.page.setExtraHTTPHeaders.mockImplementation(async () =>
        order.push("headers")
      );
      browser.page.goto.mockImplementation(async () => order.push("goto"));

      await scrape({ headers: { Authorization: "Bearer abc" } });

      expect(browser.page.setExtraHTTPHeaders).toHaveBeenCalledWith({
        Authorization: "Bearer abc",
      });
      expect(order).toEqual(["headers", "goto"]);
    });

    it.each([
      ["no options", undefined],
      ["no headers key", {}],
      ["null headers", { headers: null }],
    ])("skips setting headers with %s", async (_, options) => {
      const browser = mockBrowser();
      mockLaunch(browser);

      await scrape(options);
      expect(browser.page.setExtraHTTPHeaders).not.toHaveBeenCalled();
    });
  });

  describe("failure path", () => {
    it.each([
      ["newPage", (b) => b.newPage.mockRejectedValue(new Error("newPage"))],
      [
        "setExtraHTTPHeaders",
        (b) =>
          b.page.setExtraHTTPHeaders.mockRejectedValue(new Error("headers")),
      ],
      [
        "goto",
        (b) =>
          b.page.goto.mockRejectedValue(
            new Error("Navigation timeout of 180000 ms exceeded")
          ),
      ],
      [
        "goto (net::ERR_NAME_NOT_RESOLVED)",
        (b) =>
          b.page.goto.mockRejectedValue(
            new Error("net::ERR_NAME_NOT_RESOLVED at https://example.invalid/")
          ),
      ],
      [
        "default evaluate",
        (b) =>
          b.page.evaluate.mockRejectedValue(
            new Error("Execution context was destroyed")
          ),
      ],
    ])(
      "closes the browser and rethrows when %s rejects",
      async (_, breakIt) => {
        const browser = mockBrowser();
        breakIt(browser);
        mockLaunch(browser);

        await expect(scrape({ headers: { "X-Test": "1" } })).rejects.toThrow();
        expect(browser.close).toHaveBeenCalledTimes(1);
      }
    );

    it("closes the browser when a caller's evaluate throws", async () => {
      const browser = mockBrowser();
      mockLaunch(browser);
      const evaluate = jest.fn().mockRejectedValue(new Error("bad markup"));

      await expect(scrape({ evaluate })).rejects.toThrow("bad markup");
      expect(browser.close).toHaveBeenCalledTimes(1);
    });

    it("closes the browser when a non-Error value is thrown", async () => {
      const browser = mockBrowser();
      browser.page.goto.mockRejectedValue("plain string failure");
      mockLaunch(browser);

      await expect(scrape()).rejects.toBe("plain string failure");
      expect(browser.close).toHaveBeenCalledTimes(1);
    });

    it("rethrows a launch failure without trying to close anything", async () => {
      const launch = jest
        .fn()
        .mockRejectedValue(new Error("Failed to launch the browser process"));
      jest
        .spyOn(PuppeteerWebBaseLoader, "imports")
        .mockResolvedValue({ launch });

      await expect(scrape()).rejects.toThrow(
        "Failed to launch the browser process"
      );
    });
  });

  describe("when close() rejects", () => {
    it("kills the process and keeps the original scrape error", async () => {
      const kill = jest.fn();
      const browser = mockBrowser(mockPage(), {
        close: jest.fn().mockRejectedValue(new Error("Connection closed")),
        process: () => ({ kill }),
      });
      browser.page.goto.mockRejectedValue(new Error("timeout"));
      mockLaunch(browser);

      await expect(scrape()).rejects.toThrow("timeout");
      expect(kill).toHaveBeenCalledWith("SIGKILL");
    });

    it("kills the process and still returns content after a successful scrape", async () => {
      const kill = jest.fn();
      const browser = mockBrowser(mockPage(), {
        close: jest.fn().mockRejectedValue(new Error("Connection closed")),
        process: () => ({ kill }),
      });
      mockLaunch(browser);

      await expect(scrape()).resolves.toBe("<p>body</p>");
      expect(kill).toHaveBeenCalledWith("SIGKILL");
    });

    it("does not throw when there is no process handle to kill", async () => {
      const browser = mockBrowser(mockPage(), {
        close: jest.fn().mockRejectedValue(new Error("Connection closed")),
        process: () => null,
      });
      mockLaunch(browser);

      await expect(scrape()).resolves.toBe("<p>body</p>");
    });
  });

  describe("repeated and concurrent scrapes", () => {
    it("launches and closes a separate browser per scrape, failed or not", async () => {
      const ok = mockBrowser();
      const failing = mockBrowser();
      failing.page.goto.mockRejectedValue(new Error("timeout"));
      const alsoOk = mockBrowser();
      const launch = mockLaunch(ok, failing, alsoOk);

      const results = await Promise.allSettled([scrape(), scrape(), scrape()]);

      expect(results.map((r) => r.status)).toEqual([
        "fulfilled",
        "rejected",
        "fulfilled",
      ]);
      expect(launch).toHaveBeenCalledTimes(3);
      for (const browser of [ok, failing, alsoOk])
        expect(browser.close).toHaveBeenCalledTimes(1);
    });
  });
});
