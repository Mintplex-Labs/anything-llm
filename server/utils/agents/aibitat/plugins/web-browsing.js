const { SystemSettings } = require("../../../../models/systemSettings");

const webBrowsing = {
  name: "web-browsing",
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
          description:
            "Searches for a given query using a search engine to get better results for the user query.",
          examples: [
            {
              prompt: "Who won the world series today?",
              call: JSON.stringify({ query: "Winner of today's world series" }),
            },
            {
              prompt: "What is AnythingLLM?",
              call: JSON.stringify({ query: "AnythingLLM" }),
            },
            {
              prompt: "Current AAPL stock price",
              call: JSON.stringify({ query: "AAPL stock price today" }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              query: {
                type: "string",
                description: "A search query.",
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ query }) {
            try {
              if (query) return await this.search(query);
              return "There is nothing we can do. This function call returns no information.";
            } catch (error) {
              return `There was an error while calling the function. No data or response was found. Let the user know this was the error: ${error.message}`;
            }
          },

          /**
           * Use Google Custom Search Engines
           * Free to set up, easy to use, 100 calls/day!
           * https://programmablesearchengine.google.com/controlpanel/create
           */
          search: async function (query) {
            const provider =
              (await SystemSettings.get({ label: "agent_search_provider" }))
                ?.value ?? "unknown";
            let engine;
            switch (provider) {
              case "google-search-engine":
                engine = "_googleSearchEngine";
                break;
              case "searchapi":
                engine = "_searchApi";
                break;
              case "serper-dot-dev":
                engine = "_serperDotDev";
                break;
              case "bing-search":
                engine = "_bingWebSearch";
                break;
              case "serply-engine":
                engine = "_serplyEngine";
                break;
              case "searxng-engine":
                engine = "_searXNGEngine";
                break;
              default:
                engine = "_googleSearchEngine";
            }
            return await this[engine](query);
          },

          /**
           * Use Google Custom Search Engines
           * Free to set up, easy to use, 100 calls/day
           * https://programmablesearchengine.google.com/controlpanel/create
           */
          _googleSearchEngine: async function (query) {
            if (!process.env.AGENT_GSE_CTX || !process.env.AGENT_GSE_KEY) {
              this.super.introspect(
                `${this.caller}: I can't use Google searching because the user has not defined the required API keys.\nVisit: https://programmablesearchengine.google.com/controlpanel/create to create the API keys.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            const searchURL = new URL(
              "https://www.googleapis.com/customsearch/v1"
            );
            searchURL.searchParams.append("key", process.env.AGENT_GSE_KEY);
            searchURL.searchParams.append("cx", process.env.AGENT_GSE_CTX);
            searchURL.searchParams.append("q", query);

            this.super.introspect(
              `${this.caller}: Searching on Google for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );
            const data = await fetch(searchURL)
              .then((res) => res.json())
              .then((searchResult) => searchResult?.items || [])
              .then((items) => {
                return items.map((item) => {
                  return {
                    title: item.title,
                    link: item.link,
                    snippet: item.snippet,
                  };
                });
              })
              .catch((e) => {
                console.log(e);
                return [];
              });

            if (data.length === 0)
              return `No information was found online for the search query.`;
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - looking over them now.`
            );
            return JSON.stringify(data);
          },

          /**
           * Use SearchApi
           * SearchApi supports multiple search engines like Google Search, Bing Search, Baidu Search, Google News, YouTube, and many more.
           * https://www.searchapi.io/
           */
          _searchApi: async function (query) {
            if (!process.env.AGENT_SEARCHAPI_API_KEY) {
              this.super.introspect(
                `${this.caller}: I can't use SearchApi searching because the user has not defined the required API key.\nVisit: https://www.searchapi.io/ to create the API key for free.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            this.super.introspect(
              `${this.caller}: Using SearchApi to search for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );

            const engine = process.env.AGENT_SEARCHAPI_ENGINE;
            const params = new URLSearchParams({
              engine: engine,
              q: query,
            });

            const url = `https://www.searchapi.io/api/v1/search?${params.toString()}`;
            const { response, error } = await fetch(url, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${process.env.AGENT_SEARCHAPI_API_KEY}`,
                "Content-Type": "application/json",
                "X-SearchApi-Source": "AnythingLLM",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                return { response: data, error: null };
              })
              .catch((e) => {
                return { response: null, error: e.message };
              });
            if (error)
              return `There was an error searching for content. ${error}`;

            const data = [];
            if (response.hasOwnProperty("knowledge_graph"))
              data.push(response.knowledge_graph?.description);
            if (response.hasOwnProperty("answer_box"))
              data.push(response.answer_box?.answer);
            response.organic_results?.forEach((searchResult) => {
              const { title, link, snippet } = searchResult;
              data.push({
                title,
                link,
                snippet,
              });
            });

            if (data.length === 0)
              return `No information was found online for the search query.`;
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - looking over them now.`
            );
            return JSON.stringify(data);
          },

          /**
           * Use Serper.dev
           * Free to set up, easy to use, 2,500 calls for free one-time
           * https://serper.dev
           */
          _serperDotDev: async function (query) {
            if (!process.env.AGENT_SERPER_DEV_KEY) {
              this.super.introspect(
                `${this.caller}: I can't use Serper.dev searching because the user has not defined the required API key.\nVisit: https://serper.dev to create the API key for free.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            this.super.introspect(
              `${this.caller}: Using Serper.dev to search for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );
            const { response, error } = await fetch(
              "https://google.serper.dev/search",
              {
                method: "POST",
                headers: {
                  "X-API-KEY": process.env.AGENT_SERPER_DEV_KEY,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ q: query }),
                redirect: "follow",
              }
            )
              .then((res) => res.json())
              .then((data) => {
                return { response: data, error: null };
              })
              .catch((e) => {
                return { response: null, error: e.message };
              });
            if (error)
              return `There was an error searching for content. ${error}`;

            const data = [];
            if (response.hasOwnProperty("knowledgeGraph"))
              data.push(response.knowledgeGraph);
            response.organic?.forEach((searchResult) => {
              const { title, link, snippet } = searchResult;
              data.push({
                title,
                link,
                snippet,
              });
            });

            if (data.length === 0)
              return `No information was found online for the search query.`;
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - looking over them now.`
            );
            return JSON.stringify(data);
          },
          _bingWebSearch: async function (query) {
            if (!process.env.AGENT_BING_SEARCH_API_KEY) {
              this.super.introspect(
                `${this.caller}: I can't use Bing Web Search because the user has not defined the required API key.\nVisit: https://portal.azure.com/ to create the API key.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            const searchURL = new URL(
              "https://api.bing.microsoft.com/v7.0/search"
            );
            searchURL.searchParams.append("q", query);

            this.super.introspect(
              `${this.caller}: Using Bing Web Search to search for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );

            const searchResponse = await fetch(searchURL, {
              headers: {
                "Ocp-Apim-Subscription-Key":
                  process.env.AGENT_BING_SEARCH_API_KEY,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                const searchResults = data.webPages?.value || [];
                return searchResults.map((result) => ({
                  title: result.name,
                  link: result.url,
                  snippet: result.snippet,
                }));
              })
              .catch((e) => {
                console.log(e);
                return [];
              });

            if (searchResponse.length === 0)
              return `No information was found online for the search query.`;
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - looking over them now.`
            );
            return JSON.stringify(searchResponse);
          },
          _serplyEngine: async function (
            query,
            language = "en",
            hl = "us",
            limit = 100,
            device_type = "desktop",
            proxy_location = "US"
          ) {
            //  query (str): The query to search for
            //  hl (str): Host Language code to display results in (reference https://developers.google.com/custom-search/docs/xml_results?hl=en#wsInterfaceLanguages)
            //  limit (int): The maximum number of results to return [10-100, defaults to 100]
            //  device_type: get results based on desktop/mobile (defaults to desktop)

            if (!process.env.AGENT_SERPLY_API_KEY) {
              this.super.introspect(
                `${this.caller}: I can't use Serply.io searching because the user has not defined the required API key.\nVisit: https://serply.io to create the API key for free.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            this.super.introspect(
              `${this.caller}: Using Serply to search for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );

            const params = new URLSearchParams({
              q: query,
              language: language,
              hl,
              gl: proxy_location.toUpperCase(),
            });
            const url = `https://api.serply.io/v1/search/${params.toString()}`;
            const { response, error } = await fetch(url, {
              method: "GET",
              headers: {
                "X-API-KEY": process.env.AGENT_SERPLY_API_KEY,
                "Content-Type": "application/json",
                "User-Agent": "anything-llm",
                "X-Proxy-Location": proxy_location,
                "X-User-Agent": device_type,
              },
            })
              .then((res) => res.json())
              .then((data) => {
                if (data?.message === "Unauthorized") {
                  return {
                    response: null,
                    error:
                      "Unauthorized. Please double check your AGENT_SERPLY_API_KEY",
                  };
                }
                return { response: data, error: null };
              })
              .catch((e) => {
                return { response: null, error: e.message };
              });
            if (error)
              return `There was an error searching for content. ${error}`;

            const data = [];
            response.results?.forEach((searchResult) => {
              const { title, link, description } = searchResult;
              data.push({
                title,
                link,
                snippet: description,
              });
            });

            if (data.length === 0)
              return `No information was found online for the search query.`;
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - looking over them now.`
            );
            return JSON.stringify(data);
          },
          _searXNGEngine: async function (query) {
            let searchURL;
            if (!process.env.AGENT_SEARXNG_API_URL) {
              this.super.introspect(
                `${this.caller}: I can't use SearXNG searching because the user has not defined the required base URL.\nPlease set this value in the agent skill settings.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            try {
              searchURL = new URL(process.env.AGENT_SEARXNG_API_URL);
              searchURL.searchParams.append("q", encodeURIComponent(query));
              searchURL.searchParams.append("format", "json");
            } catch (e) {
              this.super.handlerProps.log(`SearXNG Search: ${e.message}`);
              this.super.introspect(
                `${this.caller}: I can't use SearXNG searching because the url provided is not a valid URL.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            this.super.introspect(
              `${this.caller}: Using SearXNG to search for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );

            const { response, error } = await fetch(searchURL.toString(), {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "User-Agent": "anything-llm",
              },
            })
              .then((res) => res.json())
              .then((data) => {
                return { response: data, error: null };
              })
              .catch((e) => {
                return { response: null, error: e.message };
              });
            if (error)
              return `There was an error searching for content. ${error}`;

            const data = [];
            response.results?.forEach((searchResult) => {
              const { url, title, content, publishedDate } = searchResult;
              data.push({
                title,
                link: url,
                snippet: content,
                publishedDate,
              });
            });

            if (data.length === 0)
              return `No information was found online for the search query.`;
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - looking over them now.`
            );
            return JSON.stringify(data);
          },
        });
      },
    };
  },
};

module.exports = {
  webBrowsing,
};
