module.exports = {
  web_browsing: {
    api_key_missing: {
      google: "I can't use Google searching because the user has not defined the required API keys.\nVisit: https://programmablesearchengine.google.com/controlpanel/create to create the API keys.",
      searchapi: "I can't use SearchApi searching because the user has not defined the required API key.\nVisit: https://www.searchapi.io/ to create the API key for free.",
      serper: "I can't use Serper.dev searching because the user has not defined the required API key.\nVisit: https://serper.dev to create the API key for free.",
      bing: "I can't use Bing Web Search because the user has not defined the required API key.\nVisit: https://portal.azure.com/ to create the API key.",
      serply: "I can't use Serply.io searching because the user has not defined the required API key.\nVisit: https://serply.io to create the API key for free.",
      searxng_url: "I can't use SearXNG searching because the user has not defined the required base URL.\nPlease set this value in the agent skill settings.",
      searxng_invalid: "I can't use SearXNG searching because the url provided is not a valid URL.",
      tavily: "I can't use Tavily searching because the user has not defined the required API key.\nVisit: https://tavily.com/ to create the API key."
    },
    searching: {
      google: "Searching on Google for \"{{query}}\"",
      searchapi: "Using SearchApi to search for \"{{query}}\"",
      serper: "Using Serper.dev to search for \"{{query}}\"",
      bing: "Using Bing Web Search to search for \"{{query}}\"",
      serply: "Using Serply to search for \"{{query}}\"",
      searxng: "Using SearXNG to search for \"{{query}}\"",
      tavily: "Using Tavily to search for \"{{query}}\"",
      duckduckgo: "Using DuckDuckGo to search for \"{{query}}\""
    },
    results_found: "I found {{count}} results - reviewing the results now. (~{{tokens}} tokens)"
  },
  
  web_scraping: {
    scraping_content: "Scraping the content of {{url}}",
    scraping_content_as: "Scraping the content of {{url}} as {{captureAs}}",
    scrape_failed: "could not scrape {{url}}. I can't use this page's content.",
    scrape_failed_generic: "Could not scrape {{url}}. Cannot use this page's content.",
    content_too_long: "This page's content is way too long. I will summarize it right now.",
    content_too_long_tokens: "This page's content is way too long ({{tokenCount}} tokens). I will summarize it right now.",
    successfully_scraped: "Successfully scraped content from {{url}}",
    no_content: "There was no content to be collected or read.",
    successfully_summarized: "Successfully summarized content",
    no_selector: "No selector provided. Returning the entire HTML.",
    elements_found: "Found {{count}} elements matching selector: {{selector}}"
  },
  
  memory: {
    no_local_content: "I didn't find anything locally that would help answer this question.",
    found_context: "Found {{count}} additional piece of context to help answer this question.",
    saved_to_memory: "I saved the content to long-term memory in this workspaces vector database."
  },
  
  summarize: {
    looking_at_documents: "Looking at the available documents.",
    found_documents: "Found {{count}} documents",
    grabbing_content: "Grabbing all content for {{filename}}",
    summarizing: "Summarizing {{filename}}..."
  },
  
  rechart: {
    invalid_json: "{{name}} provided invalid JSON data - so we cant make a {{type}} chart.",
    rendering: "Rendering {{type}} chart."
  },
  
  save_file: {
    saving: "Saving file {{filename}}."
  },
  
  sql: {
    running_query_on: "Im going to run a query on the {{database_id}} to get an answer.",
    running_sql: "Running SQL: {{sql_query}}",
    checking_tables: "Checking what are the available tables in the {{database_id}} database.",
    querying_schema: "Querying the table schema for {{table_name}} in the {{database_id}} database.",
    checking_databases: "Checking what are the available databases.",
    error: "Error: {{error}}"
  },
  
  flows: {
    executing: "Executing flow: {{name}}",
    completed: "{{name}} completed successfully",
    failed: "Flow failed: {{error}}",
    processing_llm: "Processing data with LLM instruction...",
    sending_llm: "Sending request to LLM...",
    llm_response_received: "Successfully received LLM response",
    api_request: "Making {{method}} request to external API...",
    api_body: "Sending body to {{url}}: {{body}}",
    api_failed: "Request failed with status {{status}}",
    api_completed: "API call completed"
  },
  
  mcp: {
    executing: "Executing MCP server: {{name}} with {{args}}",
    completed: "MCP server: {{name}}:{{tool}} completed successfully",
    failed: "MCP server: {{name}}:{{tool}} failed with error:"
  }
};
