const { CollectorApi } = require("../../../collectorApi");
const Provider = require("../providers/ai-provider");
const { summarizeContent } = require("../utils/summarize");

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
            try {
              if (url) return await this.scrape(url);
              return "There is nothing we can do. This function call returns no information.";
            } catch (error) {
              this.super.handlerProps.log(
                `Web Scraping Error: ${error.message}`
              );
              this.super.introspect(
                `${this.caller}: Web Scraping Error: ${error.message}`
              );
              return `There was an error while calling the function. No data or response was found. Let the user know this was the error: ${error.message}`;
            }
          },

          utils: {
            isYouTubeVideoUrl: function (url) {
              if (!url) {
                return false;
              }

              try {
                const urlObj = new URL(
                  url.includes("://") ? url : `https://${url}`
                );
                const hostname = urlObj.hostname.replace(/^www\./, "");

                if (
                  !["youtube.com", "youtu.be", "m.youtube.com"].includes(
                    hostname
                  )
                ) {
                  return false;
                }

                const videoIdRegex = /^[a-zA-Z0-9_-]{11}$/;

                // Handle youtu.be format
                if (hostname === "youtu.be") {
                  const videoId = urlObj.pathname.slice(1).split("/")[0];
                  return videoIdRegex.test(videoId);
                }

                // Handle youtube.com formats
                if (urlObj.pathname.startsWith("/watch")) {
                  const videoId = urlObj.searchParams.get("v");
                  return videoId && videoIdRegex.test(videoId);
                }

                const pathMatch = urlObj.pathname.match(
                  /^\/(embed|v)\/([a-zA-Z0-9_-]{11})/
                );
                return pathMatch && videoIdRegex.test(pathMatch[2]);
              } catch {
                return false;
              }
            },
            /**
             * Extracts the sub type from a Content-Type header and cleans
             * any parameters.
             *
             * @param contentTypeHeader The Content-Type header string (e.g., "application/json; charset=utf-8").
             * @returns The sub type as a string (e.g., "json", "pdf", "csv").
             *          Returns an empty string if the input is null, undefined, or doesn't match
             *          a common content type pattern.
             */
            getSubTypeFromContentType: function (contentTypeHeader) {
              if (!contentTypeHeader) {
                return "";
              }

              // Remove any parameters after the semicolon (e.g., "; charset=utf-8")
              const cleanedContentType = contentTypeHeader.split(";")[0].trim();

              // Extract the part after the last slash
              const parts = cleanedContentType.split("/");
              if (parts.length > 1) {
                return parts[parts.length - 1];
              }

              return ""; // Return empty string if no sub type can be determined
            },
          },
          /**
           * Scrape a website, pull the transcript and metadata for a YouTube video, or read the content of a file and summarize the content based on objective if the content is too large.
           * Objective is the original objective & task that user give to the agent, url is the url of the website to be scraped.
           * Here we can leverage the document collector to get raw website text quickly.
           *
           * @param url
           * @returns
           */
          scrape: async function (url) {
            // First, we need to check if the resource is accessible and retrieve the content type.
            const HEAD_TIMEOUT_MS = 10000;
            const headController = new AbortController();
            const headTimeout = setTimeout(
              () => headController.abort(),
              HEAD_TIMEOUT_MS
            );
            let res;
            try {
              res = await fetch(url, {
                method: "HEAD",
                signal: headController.signal,
              });
            } catch (error) {
              const isTimeout = error && error.name === "AbortError";
              this.super.introspect(
                `${this.caller}: Network request to ${url} failed${isTimeout ? " (timeout)" : ""}: ${error && error.message ? error.message : String(error)}`
              );
              if (isTimeout) {
                throw new Error(
                  `Timeout after ${HEAD_TIMEOUT_MS}ms while performing network request to ${url}: ${error.message}`
                );
              }
              throw new Error(
                `Network error during HEAD request to ${url}: ${error && error.message ? error.message : String(error)}`
              );
            } finally {
              clearTimeout(headTimeout);
            }
            if (!res.ok) {
              this.super.introspect(
                `${this.caller}: The resource is not accessible. Cannot proceed.`
              );
              throw new Error(
                "The resource is not accessible. Cannot proceed."
              );
            }
            const contentType = res.headers.get("Content-Type");
            if (!contentType) {
              this.super.introspect(
                `${this.caller}: The response from the resource does not have a Content-Type header. Cannot proceed.`
              );
              throw new Error(
                "The response from the resource does not have a Content-Type header. Cannot proceed."
              );
            }

            // If the resource is a webpage and not a YouTube video, tell the user that we are scraping the content of the webpage.
            if (
              contentType.includes("text/html") &&
              !this.utils.isYouTubeVideoUrl(url)
            ) {
              this.super.introspect(
                `${this.caller}: Scraping content of the webpage.`
              );
              // If the resource is a YouTube video and the content type is text/html, tell the user that we are pulling the transcript and metadata for the YouTube video.
            } else if (
              this.utils.isYouTubeVideoUrl(url) &&
              contentType.includes("text/html")
            ) {
              this.super.introspect(
                `${this.caller}: Pulling transcript and metadata for the YouTube video.`
              );
              // If the resource is a file, tell the user that we are reading the content of the file.
            } else {
              this.super.introspect(
                `${this.caller}: Reading the content of the ${this.utils
                  .getSubTypeFromContentType(contentType)
                  .toUpperCase()}.`
              );
            }
            // Collect the content of the resource
            const { success, content } =
              await new CollectorApi().getLinkContent(url);

            if (!success) {
              this.super.introspect(
                `${this.caller}: could not scrape ${url}. I can't use this page's content.`
              );
              throw new Error(
                `URL could not be scraped and no content was found.`
              );
            }

            if (!content || content?.length === 0) {
              throw new Error("There was no content to be collected or read.");
            }

            const { TokenManager } = require("../../../helpers/tiktoken");
            const tokenEstimate = new TokenManager(
              this.super.model
            ).countFromString(content);
            if (
              tokenEstimate <
              Provider.contextLimit(this.super.provider, this.super.model)
            ) {
              this.super.introspect(
                `${this.caller}: Content is within the model's context limit. ~${tokenEstimate} tokens.`
              );
              return content;
            }

            this.super.introspect(
              `${this.caller}: This page's content exceeds the model's context limit. Summarizing it right now.`
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
