const { SystemSettings } = require("../../../../models/systemSettings");
const { TokenManager } = require("../../../helpers/tiktoken");
const tiktoken = new TokenManager();

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
          countTokens: (string) =>
            tiktoken
              .countFromString(string)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ","),
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
              case "serpapi":
                engine = "_serpApi";
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
              case "tavily-search":
                engine = "_tavilySearch";
                break;
              case "duckduckgo-engine":
                engine = "_duckDuckGoEngine";
                break;
              case "exa-search":
                engine = "_exaSearch";
                break;
              case "perplexity-search":
                engine = "_perplexitySearch";
                break;
              default:
                engine = "_duckDuckGoEngine";
            }
            return await this[engine](query);
          },

          /**
           * Utility function to truncate a string to a given length for debugging
           * calls to the API while keeping the actual values mostly intact
           * @param {string} str - The string to truncate
           * @param {number} length - The length to truncate the string to
           * @returns {string} The truncated string
           */
          middleTruncate(str, length = 5) {
            if (str.length <= length) return str;
            return `${str.slice(0, length)}...${str.slice(-length)}`;
          },

          /**
           * Report citations for an array of search results.
           * Uses title, link, and snippet directly from result data.
           * @param {Array<{title?: string, link?: string, snippet?: string}>} results - Search results to report as citations
           */
          reportSearchResultsCitations: function (results) {
            if (!Array.isArray(results)) return;
            const citations = [];
            for (const result of results) {
              const fallbackUrl =
                result.link ||
                result.url ||
                result.website ||
                result.product_link ||
                result.patent_link ||
                result.link_clean;

              citations.push({
                id: result.link || fallbackUrl,
                title: result.title || fallbackUrl,
                text: result.snippet || result.description || result.text || "",
                chunkSource: result.link
                  ? `link://${result.link}`
                  : `link://${fallbackUrl}`,
                score: null,
              });
            }
            this.super.addCitation?.(citations);
          },

          /**
           * Use SerpApi
           * SerpApi supports dozens of search engines across the major platforms including Google, DuckDuckGo, Bing, eBay, Amazon, Baidu, Yandex, and more.
           * https://serpapi.com/
           */
          _serpApi: async function (query) {
            if (!process.env.AGENT_SERPAPI_API_KEY) {
              this.super.introspect(
                `${this.caller}: I can't use SerpApi searching because the user has not defined the required API key.\nVisit: https://serpapi.com/ to create the API key for free.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            this.super.introspect(
              `${this.caller}: Using SerpApi to search for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );

            const engine = process.env.AGENT_SERPAPI_ENGINE;
            const queryParamKey = engine === "amazon" ? "k" : "q";

            const params = new URLSearchParams({
              engine: engine,
              [queryParamKey]: query,
              api_key: process.env.AGENT_SERPAPI_API_KEY,
            });

            const url = `https://serpapi.com/search.json?${params.toString()}`;
            const { response, error } = await fetch(url, {
              method: "GET",
              headers: {},
            })
              .then((res) => {
                if (res.ok) return res.json();
                throw new Error(
                  `${res.status} - ${res.statusText}. params: ${JSON.stringify({ auth: this.middleTruncate(process.env.AGENT_SERPAPI_API_KEY, 5), q: query })}`
                );
              })
              .then((data) => {
                return { response: data, error: null };
              })
              .catch((e) => {
                this.super.handlerProps.log(`SerpApi Error: ${e.message}`);
                return { response: null, error: e.message };
              });
            if (error)
              return `There was an error searching for content. ${error}`;

            const data = [];

            switch (engine) {
              case "google":
                if (response.hasOwnProperty("knowledge_graph"))
                  data.push(response.knowledge_graph);
                if (response.hasOwnProperty("answer_box"))
                  data.push(response.answer_box);
                response.organic_results?.forEach((searchResult) => {
                  const { title, link, snippet } = searchResult;
                  data.push({
                    title,
                    link,
                    snippet,
                  });
                });
                response.local_results?.forEach((searchResult) => {
                  const {
                    title,
                    rating,
                    reviews,
                    description,
                    address,
                    website,
                    extensions,
                  } = searchResult;
                  data.push({
                    title,
                    rating,
                    reviews,
                    description,
                    address,
                    website,
                    extensions,
                  });
                });
                break;
              case "google_maps":
                response.local_results?.slice(0, 10).forEach((searchResult) => {
                  const {
                    title,
                    rating,
                    reviews,
                    description,
                    address,
                    website,
                    extensions,
                  } = searchResult;
                  data.push({
                    title,
                    rating,
                    reviews,
                    description,
                    address,
                    website,
                    extensions,
                  });
                });
                break;
              case "google_images_light":
                response.images_results
                  ?.slice(0, 10)
                  .forEach((searchResult) => {
                    const { title, source, link, thumbnail } = searchResult;
                    data.push({
                      title,
                      source,
                      link,
                      thumbnail,
                    });
                  });
                break;
              case "google_shopping_light":
                response.shopping_results
                  ?.slice(0, 10)
                  .forEach((searchResult) => {
                    const {
                      title,
                      source,
                      price,
                      rating,
                      reviews,
                      snippet,
                      thumbnail,
                      product_link,
                    } = searchResult;
                    data.push({
                      title,
                      source,
                      price,
                      rating,
                      reviews,
                      snippet,
                      thumbnail,
                      product_link,
                    });
                  });
                break;
              case "google_news_light":
                response.news_results?.slice(0, 10).forEach((searchResult) => {
                  const { title, link, source, thumbnail, snippet, date } =
                    searchResult;
                  data.push({
                    title,
                    link,
                    source,
                    thumbnail,
                    snippet,
                    date,
                  });
                });
                break;
              case "google_jobs":
                response.jobs_results?.forEach((searchResult) => {
                  const {
                    title,
                    company_name,
                    location,
                    description,
                    apply_options,
                    extensions,
                  } = searchResult;
                  data.push({
                    title,
                    company_name,
                    location,
                    description,
                    apply_options,
                    extensions,
                  });
                });
                break;
              case "google_patents":
                response.organic_results?.forEach((searchResult) => {
                  const {
                    title,
                    patent_link,
                    snippet,
                    inventor,
                    assignee,
                    publication_number,
                  } = searchResult;
                  data.push({
                    title,
                    patent_link,
                    snippet,
                    inventor,
                    assignee,
                    publication_number,
                  });
                });
                break;
              case "google_scholar":
                response.organic_results?.forEach((searchResult) => {
                  const { title, link, snippet, publication_info } =
                    searchResult;
                  data.push({
                    title,
                    link,
                    snippet,
                    publication_info,
                  });
                });
                break;
              case "baidu":
                if (response.hasOwnProperty("answer_box"))
                  data.push(response.answer_box);
                response.organic_results?.forEach((searchResult) => {
                  const { title, link, snippet } = searchResult;
                  data.push({
                    title,
                    link,
                    snippet,
                  });
                });
                break;
              case "amazon":
                response.organic_results
                  ?.slice(0, 10)
                  .forEach((searchResult) => {
                    const {
                      title,
                      rating,
                      reviews,
                      price,
                      link_clean,
                      thumbnail,
                    } = searchResult;
                    data.push({
                      title,
                      rating,
                      reviews,
                      price,
                      link_clean,
                      thumbnail,
                    });
                  });
            }

            if (data.length === 0)
              return `No information was found online for the search query.`;

            this.reportSearchResultsCitations(data);
            const result = JSON.stringify(data);
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - reviewing the results now. (~${this.countTokens(result)} tokens)`
            );
            return result;
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
              .then((res) => {
                if (res.ok) return res.json();
                throw new Error(
                  `${res.status} - ${res.statusText}. params: ${JSON.stringify({ auth: this.middleTruncate(process.env.AGENT_SEARCHAPI_API_KEY, 5), q: query })}`
                );
              })
              .then((data) => {
                return { response: data, error: null };
              })
              .catch((e) => {
                this.super.handlerProps.log(`SearchApi Error: ${e.message}`);
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

            this.reportSearchResultsCitations(data);
            const result = JSON.stringify(data);
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - reviewing the results now. (~${this.countTokens(result)} tokens)`
            );
            return result;
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
              .then((res) => {
                if (res.ok) return res.json();
                throw new Error(
                  `${res.status} - ${res.statusText}. params: ${JSON.stringify({ auth: this.middleTruncate(process.env.AGENT_SERPER_DEV_KEY, 5), q: query })}`
                );
              })
              .then((data) => {
                return { response: data, error: null };
              })
              .catch((e) => {
                this.super.handlerProps.log(`Serper.dev Error: ${e.message}`);
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

            this.reportSearchResultsCitations(data);
            const result = JSON.stringify(data);
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - reviewing the results now. (~${this.countTokens(result)} tokens)`
            );
            return result;
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
              .then((res) => {
                if (res.ok) return res.json();
                throw new Error(
                  `${res.status} - ${res.statusText}. params: ${JSON.stringify({ auth: this.middleTruncate(process.env.AGENT_BING_SEARCH_API_KEY, 5), q: query })}`
                );
              })
              .then((data) => {
                const searchResults = data.webPages?.value || [];
                return searchResults.map((result) => ({
                  title: result.name,
                  link: result.url,
                  snippet: result.snippet,
                }));
              })
              .catch((e) => {
                this.super.handlerProps.log(
                  `Bing Web Search Error: ${e.message}`
                );
                return [];
              });

            if (searchResponse.length === 0)
              return `No information was found online for the search query.`;

            this.reportSearchResultsCitations(searchResponse);
            const result = JSON.stringify(searchResponse);
            this.super.introspect(
              `${this.caller}: I found ${searchResponse.length} results - reviewing the results now. (~${this.countTokens(result)} tokens)`
            );
            return result;
          },
          _serplyEngine: async function (
            query,
            language = "en",
            hl = "us",
            //eslint-disable-next-line
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
              .then((res) => {
                if (res.ok) return res.json();
                throw new Error(
                  `${res.status} - ${res.statusText}. params: ${JSON.stringify({ auth: this.middleTruncate(process.env.AGENT_SERPLY_API_KEY, 5), q: query })}`
                );
              })
              .then((data) => {
                if (data?.message === "Unauthorized")
                  throw new Error(
                    "Unauthorized. Please double check your AGENT_SERPLY_API_KEY"
                  );
                return { response: data, error: null };
              })
              .catch((e) => {
                this.super.handlerProps.log(`Serply Error: ${e.message}`);
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

            this.reportSearchResultsCitations(data);
            const result = JSON.stringify(data);
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - reviewing the results now. (~${this.countTokens(result)} tokens)`
            );
            return result;
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
              .then((res) => {
                if (res.ok) return res.json();
                throw new Error(
                  `${res.status} - ${res.statusText}. params: ${JSON.stringify({ url: searchURL.toString() })}`
                );
              })
              .then((data) => {
                return { response: data, error: null };
              })
              .catch((e) => {
                this.super.handlerProps.log(
                  `SearXNG Search Error: ${e.message}`
                );
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

            this.reportSearchResultsCitations(data);
            const result = JSON.stringify(data);
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - reviewing the results now. (~${this.countTokens(result)} tokens)`
            );
            return result;
          },
          _tavilySearch: async function (query) {
            if (!process.env.AGENT_TAVILY_API_KEY) {
              this.super.introspect(
                `${this.caller}: I can't use Tavily searching because the user has not defined the required API key.\nVisit: https://tavily.com/ to create the API key.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            this.super.introspect(
              `${this.caller}: Using Tavily to search for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );

            const url = "https://api.tavily.com/search";
            const { response, error } = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                api_key: process.env.AGENT_TAVILY_API_KEY,
                query: query,
              }),
            })
              .then((res) => {
                if (res.ok) return res.json();
                throw new Error(
                  `${res.status} - ${res.statusText}. params: ${JSON.stringify({ auth: this.middleTruncate(process.env.AGENT_TAVILY_API_KEY, 5), q: query })}`
                );
              })
              .then((data) => {
                return { response: data, error: null };
              })
              .catch((e) => {
                this.super.handlerProps.log(
                  `Tavily Search Error: ${e.message}`
                );
                return { response: null, error: e.message };
              });

            if (error)
              return `There was an error searching for content. ${error}`;

            const data = [];
            response.results?.forEach((searchResult) => {
              const { title, url, content } = searchResult;
              data.push({
                title,
                link: url,
                snippet: content,
              });
            });

            if (data.length === 0)
              return `No information was found online for the search query.`;

            this.reportSearchResultsCitations(data);
            const result = JSON.stringify(data);
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - reviewing the results now. (~${this.countTokens(result)} tokens)`
            );
            return result;
          },
          _duckDuckGoEngine: async function (query) {
            /**
             * Extract the actual destination URL from a DuckDuckGo redirect link.
             * DDG links look like: //duckduckgo.com/l/?uddg=https%3A%2F%2Fexample.com&rut=...
             * @param {string} ddgLink - The DuckDuckGo redirect link
             * @returns {string} The actual destination URL
             */
            function extractUrl(ddgLink) {
              if (!ddgLink) return ddgLink;
              try {
                const fullUrl = ddgLink.startsWith("//")
                  ? `https:${ddgLink}`
                  : ddgLink;
                const url = new URL(fullUrl);
                const actualUrl = url.searchParams.get("uddg");
                return actualUrl ? decodeURIComponent(actualUrl) : ddgLink;
              } catch {
                return ddgLink;
              }
            }

            this.super.introspect(
              `${this.caller}: Using DuckDuckGo to search for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );

            const searchURL = new URL("https://html.duckduckgo.com/html");
            searchURL.searchParams.append("q", query);

            const response = await fetch(searchURL.toString())
              .then((res) => {
                if (res.ok) return res.text();
                throw new Error(
                  `${res.status} - ${res.statusText}. params: ${JSON.stringify({ url: searchURL.toString() })}`
                );
              })
              .catch((e) => {
                this.super.handlerProps.log(
                  `DuckDuckGo Search Error: ${e.message}`
                );
                return null;
              });

            if (!response) return `There was an error searching DuckDuckGo.`;
            const html = response;
            const data = [];
            const results = html.split('<div class="result results_links');

            // Skip first element since it's before the first result
            for (let i = 1; i < results.length; i++) {
              const result = results[i];

              // Extract title
              const titleMatch = result.match(
                /<a[^>]*class="result__a"[^>]*>(.*?)<\/a>/
              );
              const title = titleMatch ? titleMatch[1].trim() : "";

              // Extract URL and clean DDG redirect
              const urlMatch = result.match(
                /<a[^>]*class="result__a"[^>]*href="([^"]*)">/
              );
              const link = extractUrl(urlMatch ? urlMatch[1] : "");

              // Extract snippet
              const snippetMatch = result.match(
                /<a[^>]*class="result__snippet"[^>]*>(.*?)<\/a>/
              );
              const snippet = snippetMatch
                ? snippetMatch[1].replace(/<\/?b>/g, "").trim()
                : "";

              if (title && link && snippet) {
                data.push({ title, link, snippet });
              }
            }

            if (data.length === 0) {
              return `No information was found online for the search query.`;
            }

            this.reportSearchResultsCitations(data);
            const result = JSON.stringify(data);
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - reviewing the results now. (~${this.countTokens(result)} tokens)`
            );
            return result;
          },
          _exaSearch: async function (query) {
            if (!process.env.AGENT_EXA_API_KEY) {
              this.super.introspect(
                `${this.caller}: I can't use Exa searching because the user has not defined the required API key.\nVisit: https://exa.ai to create the API key.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            this.super.introspect(
              `${this.caller}: Using Exa to search for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );

            const url = "https://api.exa.ai/search";
            const { response, error } = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": process.env.AGENT_EXA_API_KEY,
              },
              body: JSON.stringify({
                query: query,
                type: "auto",
                numResults: 10,
                contents: {
                  text: true,
                },
              }),
            })
              .then((res) => {
                if (res.ok) return res.json();
                throw new Error(
                  `${res.status} - ${res.statusText}. params: ${JSON.stringify({ auth: this.middleTruncate(process.env.AGENT_EXA_API_KEY, 5), q: query })}`
                );
              })
              .then((data) => {
                return { response: data, error: null };
              })
              .catch((e) => {
                this.super.handlerProps.log(`Exa Search Error: ${e.message}`);
                return { response: null, error: e.message };
              });

            if (error)
              return `There was an error searching for content. ${error}`;

            const data = [];
            response.results?.forEach((searchResult) => {
              const { title, url, text, publishedDate } = searchResult;
              data.push({
                title,
                link: url,
                snippet: text,
                publishedDate,
              });
            });

            if (data.length === 0)
              return `No information was found online for the search query.`;

            this.reportSearchResultsCitations(data);
            const result = JSON.stringify(data);
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - reviewing the results now. (~${this.countTokens(result)} tokens)`
            );
            return result;
          },

          _perplexitySearch: async function (query) {
            if (!process.env.AGENT_PERPLEXITY_API_KEY) {
              this.super.introspect(
                `${this.caller}: I can't use Perplexity searching because the user has not defined the required API key.\nVisit: [https://console.perplexity.ai](https://console.perplexity.ai) to create the API key.`
              );
              return `Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet.`;
            }

            this.super.introspect(
              `${this.caller}: Using Perplexity to search for "${
                query.length > 100 ? `${query.slice(0, 100)}...` : query
              }"`
            );

            const { response, error } = await fetch(
              "https://api.perplexity.ai/search",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${process.env.AGENT_PERPLEXITY_API_KEY}`,
                },
                body: JSON.stringify({
                  query: query,
                  max_results: 5,
                  max_tokens_per_page: 2048,
                }),
              }
            )
              .then((res) => {
                if (res.ok) return res.json();
                throw new Error(
                  `${res.status} - ${res.statusText}. params: ${JSON.stringify({
                    auth: this.middleTruncate(
                      process.env.AGENT_PERPLEXITY_API_KEY,
                      5
                    ),
                    q: query,
                  })}`
                );
              })
              .then((data) => {
                return { response: data, error: null };
              })
              .catch((e) => {
                this.super.handlerProps.log(
                  `Perplexity Search Error: ${e.message}`
                );
                return { response: null, error: e.message };
              });

            if (error)
              return `There was an error searching for content. ${error}`;

            const data = [];
            if (response.results) {
              response.results.forEach((result) => {
                data.push({
                  title: result.title,
                  link: result.url,
                  snippet: result.snippet || "",
                });
              });
            }

            if (data.length === 0)
              return "No information was found online for the search query.";

            this.reportSearchResultsCitations(data);

            const result = JSON.stringify(data);
            this.super.introspect(
              `${this.caller}: I found ${data.length} results - reviewing the results now. (~${this.countTokens(result)} tokens)`
            );

            return result;
          },
        });
      },
    };
  },
};

module.exports = {
  webBrowsing,
};
