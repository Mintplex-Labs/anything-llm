const { CollectorApi } = require("../../../collectorApi");
const Provider = require("../providers/ai-provider");
const { summarizeContent } = require("../utils/summarize");
const { createT } = require("../../../../locales");

const webScraping = {
  name: "web-scraping",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          controller: new AbortController(),
          description:
            "Scrapes the content of a webpage or online resource from a provided URL.",
          examples: [
            {
              prompt: "What is anythingllm.com about?",
              call: JSON.stringify({ url: "https://anythingllm.com" }),
            },
            {
              prompt: "Scrape https://example.com",
              call: JSON.stringify({ url: "https://example.com" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              url: {
                type: "string",
                format: "uri",
                description:
                  "A complete web address URL including protocol. Assumes https if not provided.",
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ url }) {
            const t = createT();
            try {
              if (url) return await this.scrape(url);
              return await t("errors.function_no_info");
            } catch (error) {
              return await t("errors.function_error", { error: error.message });
            }
          },

          /**
           * Scrape a website and summarize the content based on objective if the content is too large.
           * Objective is the original objective & task that user give to the agent, url is the url of the website to be scraped.
           * Here we can leverage the document collector to get raw website text quickly.
           *
           * @param url
           * @returns
           */
          scrape: async function (url) {
            const t = createT();
            this.super.introspect(
              `${this.caller}: ${await t("agents.web_scraping.scraping_content", { url })}`
            );
            const { success, content } =
              await new CollectorApi().getLinkContent(url);

            if (!success) {
              this.super.introspect(
                `${this.caller}: ${await t("agents.web_scraping.scrape_failed", { url })}`
              );
              throw new Error(
                await t("agents.web_scraping.scrape_failed_generic", { url })
              );
            }

            if (!content || content?.length === 0) {
              throw new Error(await t("agents.web_scraping.no_content"));
            }

            const { TokenManager } = require("../../../helpers/tiktoken");
            if (
              new TokenManager(this.super.model).countFromString(content) <
              Provider.contextLimit(this.super.provider, this.super.model)
            ) {
              return content;
            }

            this.super.introspect(
              `${this.caller}: ${await t("agents.web_scraping.content_too_long")}`
            );
            this.super.onAbort(() => {
              this.super.handlerProps.log(
                "Abort was triggered, exiting summarization early."
              );
              this.controller.abort();
            });

            return summarizeContent({
              provider: this.super.provider,
              model: this.super.model,
              controllerSignal: this.controller.signal,
              content,
            });
          },
        });
      },
    };
  },
};

module.exports = {
  webScraping,
};
