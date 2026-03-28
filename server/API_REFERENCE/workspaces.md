# Workspaces

> Part of **AnythingLLM Developer API**

---

## `POST` /v1/workspace/new



Create a new workspace



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


### Request Body

JSON object containing workspace configuration.

- **Required:** Yes


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `GET` /v1/workspaces



List all current workspaces



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `GET` /v1/workspace/{slug}



Get a workspace by its unique slug.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to find |
| `Authorization` | **header** |  (string) | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `DELETE` /v1/workspace/{slug}



Deletes a workspace by its slug.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to delete |
| `Authorization` | **header** |  (string) | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `POST` /v1/workspace/{slug}/update



Update workspace settings by its unique slug.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to find |
| `Authorization` | **header** |  (string) | ❌ No | - |


### Request Body

JSON object containing new settings to update a workspace. All keys are optional and will not update unless provided

- **Required:** Yes


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `GET` /v1/workspace/{slug}/chats



Get a workspaces chats regardless of user by its unique slug.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to find |
| `Authorization` | **header** |  (string) | ❌ No | - |
| `apiSessionId` | **query** |  (string) | ❌ No | Optional apiSessionId to filter by |
| `limit` | **query** |  (integer) | ❌ No | Optional number of chat messages to return (default: 100) |
| `orderBy` | **query** |  (string) | ❌ No | Optional order of chat messages (asc or desc) |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `POST` /v1/workspace/{slug}/update-embeddings



Add or remove documents from a workspace by its unique slug.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to find |
| `Authorization` | **header** |  (string) | ❌ No | - |


### Request Body

JSON object of additions and removals of documents to add to update a workspace. The value should be the folder + filename with the exclusions of the top-level documents path.

- **Required:** Yes


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `POST` /v1/workspace/{slug}/update-pin



Add or remove pin from a document in a workspace by its unique slug.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to find |
| `Authorization` | **header** |  (string) | ❌ No | - |


### Request Body

JSON object with the document path and pin status to update.

- **Required:** Yes


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Document not found |
| **500** | Internal Server Error |


---
## `POST` /v1/workspace/{slug}/chat



Execute a chat with a workspace



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | - |
| `Authorization` | **header** |  (string) | ❌ No | - |


### Request Body

Send a prompt to the workspace and the type of conversation (automatic, query or chat).&lt;br/&gt;&lt;b&gt;Query:&lt;/b&gt; Will not use LLM unless there are relevant sources from vectorDB &amp; does not recall chat history.&lt;br/&gt;&lt;b&gt;Automatic:&lt;/b&gt; Will use tool-calling if the provider supports native tool calling without needing to invoke @agent.&lt;br/&gt;&lt;b&gt;Chat:&lt;/b&gt; Uses LLM general knowledge w/custom embeddings to produce output, uses rolling chat history.&lt;br/&gt;&lt;b&gt;Attachments:&lt;/b&gt; Can include images and documents.&lt;br/&gt;&lt;b&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;Document attachments:&lt;/b&gt; must have the mime type &lt;code&gt;application/anythingllm-document&lt;/code&gt; - otherwise it will be passed to the LLM as an image and may fail to process. This uses the built-in document processor to first parse the document to text before injecting it into the context window.

- **Required:** Yes


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `POST` /v1/workspace/{slug}/stream-chat



Execute a streamable chat with a workspace



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | - |
| `Authorization` | **header** |  (string) | ❌ No | - |


### Request Body

Send a prompt to the workspace and the type of conversation (automatic, query or chat).&lt;br/&gt;&lt;b&gt;Query:&lt;/b&gt; Will not use LLM unless there are relevant sources from vectorDB &amp; does not recall chat history.&lt;br/&gt;&lt;b&gt;Automatic:&lt;/b&gt; Will use tool-calling if the provider supports native tool calling without needing to invoke @agent.&lt;br/&gt;&lt;b&gt;Chat:&lt;/b&gt; Uses LLM general knowledge w/custom embeddings to produce output, uses rolling chat history.&lt;br/&gt;&lt;b&gt;Attachments:&lt;/b&gt; Can include images and documents.&lt;br/&gt;&lt;b&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;Document attachments:&lt;/b&gt; must have the mime type &lt;code&gt;application/anythingllm-document&lt;/code&gt; - otherwise it will be passed to the LLM as an image and may fail to process. This uses the built-in document processor to first parse the document to text before injecting it into the context window.

- **Required:** Yes


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |


---
## `POST` /v1/workspace/{slug}/vector-search



Perform a vector similarity search in a workspace



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to search in |
| `Authorization` | **header** |  (string) | ❌ No | - |


### Request Body

Query to perform vector search with and optional parameters

- **Required:** Yes


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
