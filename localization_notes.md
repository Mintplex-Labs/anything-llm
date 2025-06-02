# Backend Localization Analysis - AnythingLLM

## Overview
This document catalogs all user-facing hardcoded strings found in the backend that need to be prepared for multilingual support (English and German initially).

## Categories of User-Facing Strings

### 1. Agent Introspection Messages (High Priority)
These are real-time status messages shown to users during agent operations via the `introspect()` function.

#### Web Browsing Plugin (`server/utils/agents/aibitat/plugins/web-browsing.js`)
- **Location**: Lines with `this.super.introspect()`
- **Messages**:
  - `"I can't use Google searching because the user has not defined the required API keys.\nVisit: https://programmablesearchengine.google.com/controlpanel/create to create the API keys."`
  - `"Searching on Google for \"${query.length > 100 ? \`${query.slice(0, 100)}...\` : query}\""`
  - `"I found ${data.length} results - reviewing the results now. (~${this.countTokens(result)} tokens)"`
  - `"I can't use SearchApi searching because the user has not defined the required API key.\nVisit: https://www.searchapi.io/ to create the API key for free."`
  - `"Using SearchApi to search for \"${query.length > 100 ? \`${query.slice(0, 100)}...\` : query}\""`
  - `"I can't use Serper.dev searching because the user has not defined the required API key.\nVisit: https://serper.dev to create the API key for free."`
  - `"Using Serper.dev to search for \"${query.length > 100 ? \`${query.slice(0, 100)}...\` : query}\""`
  - `"I can't use Bing Web Search because the user has not defined the required API key.\nVisit: https://portal.azure.com/ to create the API key."`
  - `"Using Bing Web Search to search for \"${query.length > 100 ? \`${query.slice(0, 100)}...\` : query}\""`
  - `"I can't use Serply.io searching because the user has not defined the required API key.\nVisit: https://serply.io to create the API key for free."`
  - `"Using Serply to search for \"${query.length > 100 ? \`${query.slice(0, 100)}...\` : query}\""`
  - `"I can't use SearXNG searching because the user has not defined the required base URL.\nPlease set this value in the agent skill settings."`
  - `"I can't use SearXNG searching because the url provided is not a valid URL."`
  - `"Using SearXNG to search for \"${query.length > 100 ? \`${query.slice(0, 100)}...\` : query}\""`
  - `"I can't use Tavily searching because the user has not defined the required API key.\nVisit: https://tavily.com/ to create the API key."`
  - `"Using Tavily to search for \"${query.length > 100 ? \`${query.slice(0, 100)}...\` : query}\""`
  - `"Using DuckDuckGo to search for \"${query.length > 100 ? \`${query.slice(0, 100)}...\` : query}\""`

#### Web Scraping Plugin (`server/utils/agents/aibitat/plugins/web-scraping.js`)
- **Messages**:
  - `"Scraping the content of ${url}"`
  - `"could not scrape ${url}. I can't use this page's content."`
  - `"This page's content is way too long. I will summarize it right now."`

#### Memory Plugin (`server/utils/agents/aibitat/plugins/memory.js`)
- **Messages**:
  - `"I didn't find anything locally that would help answer this question."`
  - `"Found ${contextTexts.length} additional piece of context to help answer this question."`
  - `"I saved the content to long-term memory in this workspaces vector database."`

#### Summarize Plugin (`server/utils/agents/aibitat/plugins/summarize.js`)
- **Messages**:
  - `"Looking at the available documents."`
  - `"Found ${documents.length} documents"`
  - `"Grabbing all content for ${docInfo.filename ?? \"\"}`
  - `"Summarizing ${filename ?? \"\"}..."`

#### Rechart Plugin (`server/utils/agents/aibitat/plugins/rechart.js`)
- **Messages**:
  - `"${this.name} provided invalid JSON data - so we cant make a ${type} chart."`
  - `"Rendering ${type} chart."`

#### Save File Browser Plugin (`server/utils/agents/aibitat/plugins/save-file-browser.js`)
- **Messages**:
  - `"Saving file ${filename}."`

#### SQL Agent Plugins
- **query.js**:
  - `"Im going to run a query on the ${database_id} to get an answer."`
  - `"Running SQL: ${sql_query}"`
  - `"Error: ${result.error}"`
- **list-table.js**:
  - `"Checking what are the available tables in the ${databaseConfig.database_id} database."`
  - `"Running SQL: ${db.getTablesSql()}"`
  - `"Error: ${result.error}"`
- **get-table-schema.js**:
  - `"Querying the table schema for ${table_name} in the ${databaseConfig.database_id} database."`
  - `"Running SQL: ${db.getTableSchemaSql(table_name)}"`
  - `"Error: ${result.error}"`
- **list-database.js**:
  - `"Checking what are the available databases."`

#### Agent Flow Executors
- **web-scraping.js**:
  - `"Scraping the content of ${url} as ${captureAs}"`
  - `"Could not scrape ${url}. Cannot use this page's content."`
  - `"Successfully scraped content from ${url}"`
  - `"There was no content to be collected or read."`
  - `"This page's content is way too long (${tokenCount} tokens). I will summarize it right now."`
  - `"Successfully summarized content"`
  - `"No selector provided. Returning the entire HTML."`
  - `"Found ${selectedElements.length} elements matching selector: ${selector}"`

- **llm-instruction.js**:
  - `"Processing data with LLM instruction..."`
  - `"Sending request to LLM..."`
  - `"Successfully received LLM response"`

- **api-call.js**:
  - `"Making ${method} request to external API..."`
  - `"Sending body to ${url}: ${requestConfig?.body || \"No body\"}"`
  - `"Request failed with status ${response.status}"`
  - `"API call completed"`

#### Agent Flow System (`server/utils/agentFlows/index.js`)
- **Messages**:
  - `"Executing flow: ${flow.name}"`
  - `"Flow failed: ${result.results[0]?.error || \"Unknown error\"}"`
  - `"${flow.name} completed successfully"`

#### MCP System (`server/utils/MCP/index.js`)
- **Messages**:
  - `"Executing MCP server: ${name} with ${JSON.stringify(args, null, 2)}"`
  - `"MCP server: ${name}:${tool.name} completed successfully"`
  - `"MCP server: ${name}:${tool.name} failed with error:"`

### 2. WebSocket Messages (Medium Priority)

#### WebSocket Plugin (`server/utils/agents/aibitat/plugins/websocket.js`)
- **Messages**:
  - `"waiting..."` (default parameter)
  - `"Error encountered while running: ${errorMessage}"`

### 3. API Response Messages (Medium Priority)

#### Error Messages in API Responses
- **Common patterns**:
  - `"Search is disabled and no content was found. This functionality is disabled because the user has not set it up yet."`
  - `"No information was found online for the search query."`
  - `"There was an error searching for content. ${error}"`
  - `"There was an error running the query: ${result.error}"`
  - Various "Failed to..." messages in API endpoints

### 4. Agent Function Return Messages (Medium Priority)

#### Function Handler Returns
- **Common patterns**:
  - `"There is nothing we can do. This function call returns no information."`
  - `"There was an error while calling the function. No data or response was found. Let the user know this was the error: ${error.message}"`
  - `"The content was failed to be embedded properly."`

## Implementation Strategy

### Phase 1: Infrastructure (Current)
1. ✅ Create localization documentation
2. ✅ Set up backend localization system
3. ✅ Create English baseline translations
4. ✅ Add German translations

### Phase 2: Agent Messages
1. Replace agent introspection messages
2. Update all plugin files
3. Test agent functionality

### Phase 3: API & Error Messages
1. Localize API responses
2. Update error handling
3. Test API endpoints

### Phase 4: Validation
1. Verify functionality preservation
2. Test language switching
3. Validate translation completeness

## Translation Keys Structure

### Proposed Namespace Organization
```
agents:
  web_browsing:
    api_key_missing: "..."
    searching: "..."
    results_found: "..."
  web_scraping:
    scraping_content: "..."
    scrape_failed: "..."
    content_too_long: "..."
  memory:
    no_local_content: "..."
    found_context: "..."
    saved_to_memory: "..."
  sql:
    running_query: "..."
    query_error: "..."
  flows:
    executing: "..."
    completed: "..."
    failed: "..."

errors:
  search_disabled: "..."
  no_results: "..."
  api_error: "..."
  function_error: "..."

common:
  waiting: "..."
  processing: "..."
  completed: "..."
```

## Notes
- All strings identified are user-facing and shown in the UI
- Internal logging, configuration, and system strings are excluded
- Focus on messages that provide user feedback or status updates
- Maintain exact functionality while enabling localization
