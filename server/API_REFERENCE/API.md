# API Reference

> **AnythingLLM Developer API** — Version 1.0.0

---

## `/v1/auth`

### GET /v1/auth



Verify the attached Authentication header contains a valid API token.



**Tags:** `Authentication` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | Valid auth token was found. |
| **403** | Forbidden |


---
## `/v1/admin/is-multi-user-mode`

### GET /v1/admin/is-multi-user-mode



Check to see if the instance is in multi-user-mode first. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |


---
## `/v1/admin/users`

### GET /v1/admin/users



Check to see if the instance is in multi-user-mode first. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/admin/users/new`

### POST /v1/admin/users/new



Create a new user with username and password. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Key pair object that will define the new user to add to the system.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **401** | Instance is not in Multi-User mode. Method denied |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/admin/users/{id}`

### POST /v1/admin/users/{id}



Update existing user settings. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `id` | **path** |  (string) | ✅ Yes | id of the user in the database. |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Key pair object that will update the found user. All fields are optional and will not update unless specified.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
### DELETE /v1/admin/users/{id}



Delete existing user by id. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `id` | **path** |  (string) | ✅ Yes | id of the user in the database. |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/admin/invites`

### GET /v1/admin/invites



List all existing invitations to instance regardless of status. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/admin/invite/new`

### POST /v1/admin/invite/new



Create a new invite code for someone to use to register with instance. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Request body for creation parameters of the invitation

- **Required:** No

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/admin/invite/{id}`

### DELETE /v1/admin/invite/{id}



Deactivates (soft-delete) invite by id. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `id` | **path** |  (string) | ✅ Yes | id of the invite in the database. |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/admin/workspaces/{workspaceId}/users`

### GET /v1/admin/workspaces/{workspaceId}/users



Retrieve a list of users with permissions to access the specified workspace.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `workspaceId` | **path** |  (string) | ✅ Yes | id of the workspace. |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/admin/workspaces/{workspaceId}/update-users`

### POST /v1/admin/workspaces/{workspaceId}/update-users



Overwrite workspace permissions to only be accessible by the given user ids and admins. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `workspaceId` | **path** |  (string) | ✅ Yes | id of the workspace in the database. |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Entire array of user ids who can access the workspace. All fields are optional and will not update unless specified.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/admin/workspaces/{workspaceSlug}/manage-users`

### POST /v1/admin/workspaces/{workspaceSlug}/manage-users



Set workspace permissions to be accessible by the given user ids and admins. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `workspaceSlug` | **path** |  (string) | ✅ Yes | slug of the workspace in the database |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Array of user ids who will be given access to the target workspace. &lt;code&gt;reset&lt;/code&gt; will remove all existing users from the workspace and only add the new users - default &lt;code&gt;false&lt;/code&gt;.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
| **403** | Forbidden |
| **404** | Not Found |
| **500** | Internal Server Error |


---
## `/v1/admin/workspace-chats`

### POST /v1/admin/workspace-chats



All chats in the system ordered by most recent. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Page offset to show of workspace chats. All fields are optional and will not update unless specified.

- **Required:** No

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/admin/preferences`

### POST /v1/admin/preferences



Update multi-user preferences for instance. Methods are disabled until multi user mode is enabled via the UI.



**Tags:** `Admin` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Object with setting key and new value to set. All keys are optional and will not update unless specified.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/document/upload`

### POST /v1/document/upload



Upload a new file to AnythingLLM to be parsed and prepared for embedding, with optional metadata.



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

File to be uploaded.

- **Required:** Yes

- **Content-Type:** `multipart/form-data`
  - **Schema:** `object`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **422** | Unprocessable Entity |
| **500** | Internal Server Error |


---
## `/v1/document/upload/{folderName}`

### POST /v1/document/upload/{folderName}



Upload a new file to a specific folder in AnythingLLM to be parsed and prepared for embedding. If the folder does not exist, it will be created.



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `folderName` | **path** |  (string) | ✅ Yes | Target folder path (defaults to &#x27;custom-documents&#x27; if not provided) |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

File to be uploaded, with optional metadata.

- **Required:** Yes

- **Content-Type:** `multipart/form-data`
  - **Schema:** `object`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **422** | Unprocessable Entity |
| **500** | Internal Server Error |


---
## `/v1/document/upload-link`

### POST /v1/document/upload-link



Upload a valid URL for AnythingLLM to scrape and prepare for embedding. Optionally, specify a comma-separated list of workspace slugs to embed the document into post-upload.



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Link of web address to be scraped and optionally a comma-separated list of workspace slugs to embed the document into post-upload, and optional metadata.

- **Required:** Yes

- **Content-Type:** `application/json`
  - **Schema:** `object`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **422** | Unprocessable Entity |
| **500** | Internal Server Error |


---
## `/v1/document/raw-text`

### POST /v1/document/raw-text



Upload a file by specifying its raw text content and metadata values without having to upload a file.



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Text content and metadata of the file to be saved to the system. Use metadata-schema endpoint to get the possible metadata keys

- **Required:** Yes

- **Content-Type:** `application/json`
  - **Schema:** `object`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **422** | Unprocessable Entity |
| **500** | Internal Server Error |


---
## `/v1/documents`

### GET /v1/documents



List of all locally-stored documents in instance



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/documents/folder/{folderName}`

### GET /v1/documents/folder/{folderName}



Get all documents stored in a specific folder.



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `folderName` | **path** |  (string) | ✅ Yes | Name of the folder to retrieve documents from |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/document/accepted-file-types`

### GET /v1/document/accepted-file-types



Check available filetypes and MIMEs that can be uploaded.



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Not Found |
| **500** | Internal Server Error |


---
## `/v1/document/metadata-schema`

### GET /v1/document/metadata-schema



Get the known available metadata schema for when doing a raw-text upload and the acceptable type of value for each key.



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/document/{docName}`

### GET /v1/document/{docName}



Get a single document by its unique AnythingLLM document name



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `docName` | **path** |  (string) | ✅ Yes | Unique document name to find (name in /documents) |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Not Found |
| **500** | Internal Server Error |


---
## `/v1/document/create-folder`

### POST /v1/document/create-folder



Create a new folder inside the documents storage directory.



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Name of the folder to create.

- **Required:** Yes

- **Content-Type:** `application/json`
  - **Schema:** `string`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/document/remove-folder`

### DELETE /v1/document/remove-folder



Remove a folder and all its contents from the documents storage directory.



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Name of the folder to remove.

- **Required:** Yes

- **Content-Type:** `application/json`
  - **Schema:** `object`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/document/move-files`

### POST /v1/document/move-files



Move files within the documents storage directory.



**Tags:** `Documents` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Array of objects containing source and destination paths of files to move.

- **Required:** Yes

- **Content-Type:** `application/json`
  - **Schema:** `object`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/new`

### POST /v1/workspace/new



Create a new workspace



**Tags:** `Workspaces` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

JSON object containing workspace configuration.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspaces`

### GET /v1/workspaces



List all current workspaces



**Tags:** `Workspaces` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}`

### GET /v1/workspace/{slug}



Get a workspace by its unique slug.



**Tags:** `Workspaces` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to find |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
### DELETE /v1/workspace/{slug}



Deletes a workspace by its slug.



**Tags:** `Workspaces` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to delete |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/update`

### POST /v1/workspace/{slug}/update



Update workspace settings by its unique slug.



**Tags:** `Workspaces` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to find |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

JSON object containing new settings to update a workspace. All keys are optional and will not update unless provided

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/chats`

### GET /v1/workspace/{slug}/chats



Get a workspaces chats regardless of user by its unique slug.



**Tags:** `Workspaces` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to find |
| `Authorization` | **header** |  (string) | ❌ No | - |
| `apiSessionId` | **query** |  (string) | ❌ No | Optional apiSessionId to filter by |
| `limit` | **query** |  (integer) | ❌ No | Optional number of chat messages to return (default: 100) |
| `orderBy` | **query** |  (string) | ❌ No | Optional order of chat messages (asc or desc) |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/update-embeddings`

### POST /v1/workspace/{slug}/update-embeddings



Add or remove documents from a workspace by its unique slug.



**Tags:** `Workspaces` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to find |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

JSON object of additions and removals of documents to add to update a workspace. The value should be the folder + filename with the exclusions of the top-level documents path.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/update-pin`

### POST /v1/workspace/{slug}/update-pin



Add or remove pin from a document in a workspace by its unique slug.



**Tags:** `Workspaces` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to find |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

JSON object with the document path and pin status to update.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Document not found |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/chat`

### POST /v1/workspace/{slug}/chat



Execute a chat with a workspace



**Tags:** `Workspaces` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | - |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Send a prompt to the workspace and the type of conversation (automatic, query or chat).&lt;br/&gt;&lt;b&gt;Query:&lt;/b&gt; Will not use LLM unless there are relevant sources from vectorDB &amp; does not recall chat history.&lt;br/&gt;&lt;b&gt;Automatic:&lt;/b&gt; Will use tool-calling if the provider supports native tool calling without needing to invoke @agent.&lt;br/&gt;&lt;b&gt;Chat:&lt;/b&gt; Uses LLM general knowledge w/custom embeddings to produce output, uses rolling chat history.&lt;br/&gt;&lt;b&gt;Attachments:&lt;/b&gt; Can include images and documents.&lt;br/&gt;&lt;b&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;Document attachments:&lt;/b&gt; must have the mime type &lt;code&gt;application/anythingllm-document&lt;/code&gt; - otherwise it will be passed to the LLM as an image and may fail to process. This uses the built-in document processor to first parse the document to text before injecting it into the context window.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/stream-chat`

### POST /v1/workspace/{slug}/stream-chat



Execute a streamable chat with a workspace



**Tags:** `Workspaces` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | - |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Send a prompt to the workspace and the type of conversation (automatic, query or chat).&lt;br/&gt;&lt;b&gt;Query:&lt;/b&gt; Will not use LLM unless there are relevant sources from vectorDB &amp; does not recall chat history.&lt;br/&gt;&lt;b&gt;Automatic:&lt;/b&gt; Will use tool-calling if the provider supports native tool calling without needing to invoke @agent.&lt;br/&gt;&lt;b&gt;Chat:&lt;/b&gt; Uses LLM general knowledge w/custom embeddings to produce output, uses rolling chat history.&lt;br/&gt;&lt;b&gt;Attachments:&lt;/b&gt; Can include images and documents.&lt;br/&gt;&lt;b&gt;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;Document attachments:&lt;/b&gt; must have the mime type &lt;code&gt;application/anythingllm-document&lt;/code&gt; - otherwise it will be passed to the LLM as an image and may fail to process. This uses the built-in document processor to first parse the document to text before injecting it into the context window.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |


---
## `/v1/workspace/{slug}/vector-search`

### POST /v1/workspace/{slug}/vector-search



Perform a vector similarity search in a workspace



**Tags:** `Workspaces` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace to search in |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Query to perform vector search with and optional parameters

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/system/env-dump`

### GET /v1/system/env-dump



Dump all settings to file storage



**Tags:** `System Settings` 




#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/system`

### GET /v1/system



Get all current system settings that are defined.



**Tags:** `System Settings` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/system/vector-count`

### GET /v1/system/vector-count



Number of all vectors in connected vector database



**Tags:** `System Settings` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/system/update-env`

### POST /v1/system/update-env



Update a system setting or preference.



**Tags:** `System Settings` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Key pair object that matches a valid setting and value. Get keys from GET /v1/system or refer to codebase.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/system/export-chats`

### GET /v1/system/export-chats



Export all of the chats from the system in a known format. Output depends on the type sent. Will be send with the correct header for the output.



**Tags:** `System Settings` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |
| `type` | **query** |  (string) | ❌ No | Export format jsonl, json, csv, jsonAlpaca |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/system/remove-documents`

### DELETE /v1/system/remove-documents



Permanently remove documents from the system.



**Tags:** `System Settings` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Array of document names to be removed permanently.

- **Required:** Yes

- **Content-Type:** `application/json`
  - **Schema:** `object`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | Documents removed successfully. |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/thread/new`

### POST /v1/workspace/{slug}/thread/new



Create a new workspace thread



**Tags:** `Workspace Threads` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Optional userId associated with the thread, thread slug and thread name

- **Required:** No

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/thread/{threadSlug}/update`

### POST /v1/workspace/{slug}/thread/{threadSlug}/update



Update thread name by its unique slug.



**Tags:** `Workspace Threads` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace |
| `threadSlug` | **path** |  (string) | ✅ Yes | Unique slug of thread |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

JSON object containing new name to update the thread.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/thread/{threadSlug}`

### DELETE /v1/workspace/{slug}/thread/{threadSlug}



Delete a workspace thread



**Tags:** `Workspace Threads` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace |
| `threadSlug` | **path** |  (string) | ✅ Yes | Unique slug of thread |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | Thread deleted successfully |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/thread/{threadSlug}/chats`

### GET /v1/workspace/{slug}/thread/{threadSlug}/chats



Get chats for a workspace thread



**Tags:** `Workspace Threads` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace |
| `threadSlug` | **path** |  (string) | ✅ Yes | Unique slug of thread |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/thread/{threadSlug}/chat`

### POST /v1/workspace/{slug}/thread/{threadSlug}/chat



Chat with a workspace thread



**Tags:** `Workspace Threads` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace |
| `threadSlug` | **path** |  (string) | ✅ Yes | Unique slug of thread |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Send a prompt to the workspace thread and the type of conversation (query or chat).

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/workspace/{slug}/thread/{threadSlug}/stream-chat`

### POST /v1/workspace/{slug}/thread/{threadSlug}/stream-chat



Stream chat with a workspace thread



**Tags:** `Workspace Threads` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** |  (string) | ✅ Yes | Unique slug of workspace |
| `threadSlug` | **path** |  (string) | ✅ Yes | Unique slug of thread |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Send a prompt to the workspace thread and the type of conversation (query or chat).

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |


---
## `/v1/users`

### GET /v1/users



List all users



**Tags:** `User Management` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Permission denied. |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/users/{id}/issue-auth-token`

### GET /v1/users/{id}/issue-auth-token



Issue a temporary auth token for a user



**Tags:** `User Management` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `id` | **path** |  (string) | ✅ Yes | The ID of the user to issue a temporary auth token for |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Permission denied. |
| **403** | Forbidden |
| **404** | Not Found |
| **500** | Internal Server Error |


---
## `/v1/openai/models`

### GET /v1/openai/models



Get all available &quot;models&quot; which are workspaces you can use for chatting.



**Tags:** `OpenAI Compatible Endpoints` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/openai/chat/completions`

### POST /v1/openai/chat/completions



Execute a chat with a workspace with OpenAI compatibility. Supports streaming as well. Model must be a workspace slug from /models.



**Tags:** `OpenAI Compatible Endpoints` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

Send a prompt to the workspace with full use of documents as if sending a chat in AnythingLLM. Only supports some values of OpenAI API. See example below.

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **401** | Unauthorized |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/openai/embeddings`

### POST /v1/openai/embeddings



Get the embeddings of any arbitrary text string. This will use the embedder provider set in the system. Please ensure the token length of each string fits within the context of your embedder model.



**Tags:** `OpenAI Compatible Endpoints` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

The input string(s) to be embedded. If the text is too long for the embedder model context, it will fail to embed. The vector and associated chunk metadata will be returned in the array order provided

- **Required:** Yes

- **Content-Type:** `application/json`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/openai/vector_stores`

### GET /v1/openai/vector_stores



List all the vector database collections connected to AnythingLLM. These are essentially workspaces but return their unique vector db identifier - this is the same as the workspace slug.



**Tags:** `OpenAI Compatible Endpoints` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/embed`

### GET /v1/embed



List all active embeds



**Tags:** `Embed` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `/v1/embed/{embedUuid}/chats`

### GET /v1/embed/{embedUuid}/chats



Get all chats for a specific embed



**Tags:** `Embed` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `embedUuid` | **path** |  (string) | ✅ Yes | UUID of the embed |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Embed not found |
| **500** | Internal Server Error |


---
## `/v1/embed/{embedUuid}/chats/{sessionUuid}`

### GET /v1/embed/{embedUuid}/chats/{sessionUuid}



Get chats for a specific embed and session



**Tags:** `Embed` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `embedUuid` | **path** |  (string) | ✅ Yes | UUID of the embed |
| `sessionUuid` | **path** |  (string) | ✅ Yes | UUID of the session |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Embed or session not found |
| **500** | Internal Server Error |


---
## `/v1/embed/new`

### POST /v1/embed/new



Create a new embed configuration



**Tags:** `Embed` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

JSON object containing embed configuration details

- **Required:** Yes

- **Content-Type:** `application/json`
  - **Schema:** `object`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **404** | Workspace not found |
| **500** | Internal Server Error |


---
## `/v1/embed/{embedUuid}`

### POST /v1/embed/{embedUuid}



Update an existing embed configuration



**Tags:** `Embed` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `embedUuid` | **path** |  (string) | ✅ Yes | UUID of the embed to update |
| `Authorization` | **header** |  (string) | ❌ No | - |


#### Request Body

JSON object containing embed configuration updates

- **Required:** Yes

- **Content-Type:** `application/json`
  - **Schema:** `object`


#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Embed not found |
| **500** | Internal Server Error |


---
### DELETE /v1/embed/{embedUuid}



Delete an existing embed configuration



**Tags:** `Embed` 


#### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `embedUuid` | **path** |  (string) | ✅ Yes | UUID of the embed to delete |
| `Authorization` | **header** |  (string) | ❌ No | - |



#### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Embed not found |
| **500** | Internal Server Error |


---
