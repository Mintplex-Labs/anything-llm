const {
  PuppeteerWebBaseLoader,
} = require("langchain/document_loaders/web/puppeteer");

/**
 * PuppeteerWebBaseLoader that always closes its browser. langchain's _scrape only
 * closes it after goto and evaluate succeed, so every failed scrape (navigation
 * timeout, destroyed execution context, net::ERR_*) leaked a whole Chromium
 * process tree until the container ran out of memory.
 * Also accepts `headers`, sent with every request of the page.
 */
class ClosingPuppeteerWebBaseLoader extends PuppeteerWebBaseLoader {
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

module.exports = { ClosingPuppeteerWebBaseLoader };
