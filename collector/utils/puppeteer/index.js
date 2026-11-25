const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");

/**
 * Puppeteer page loader for the collector. Always closes the browser, whether the
 * scrape succeeds or throws (navigation timeout, destroyed execution context,
 * net::ERR_*), so a long-running collector never accumulates orphaned Chromium
 * processes. Overrides scrape() because the base scrape() calls the static
 * _scrape by class name, which a subclass cannot intercept.
 * Also accepts `headers`, sent with every request of the page.
 */
class PuppeteerLoader extends PuppeteerWebBaseLoader {
  async scrape() {
    const { launch } = await PuppeteerWebBaseLoader.imports();
    const browser = await launch({
      headless: true,
      defaultViewport: null,
      ignoreDefaultArgs: ["--disable-extensions"],
      ...this.options?.launchOptions,
    });
    try {
      const page = await browser.newPage();
      if (this.options?.headers)
        await page.setExtraHTTPHeaders(this.options.headers);
      await page.goto(this.webPath, {
        timeout: 180000,
        waitUntil: "domcontentloaded",
        ...this.options?.gotoOptions,
      });
      return this.options?.evaluate
        ? await this.options.evaluate(page, browser)
        : await page.evaluate(() => document.body.innerHTML);
    } finally {
      // A wedged browser can make close() reject; never leave its process behind.
      await browser.close().catch(() => browser.process()?.kill("SIGKILL"));
    }
  }
}

module.exports = { PuppeteerLoader };
