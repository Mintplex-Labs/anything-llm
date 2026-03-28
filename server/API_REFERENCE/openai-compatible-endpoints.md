# OpenAI Compatible Endpoints

> Part of **AnythingLLM Developer API**

---

## `GET` /v1/openai/models



Get all available "models" which are workspaces you can use for chatting.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |

**Response Body** (application/json):

| Name | Type | Description |
|------|------|-------------|
| `message` | string | - |

**Response Body** (application/xml):

| Name | Type | Description |
|------|------|-------------|
| `message` | string | - |


---
## `POST` /v1/openai/chat/completions



Execute a chat with a workspace with OpenAI compatibility. Supports streaming as well. Model must be a workspace slug from /models.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Send a prompt to the workspace with full use of documents as if sending a chat in AnythingLLM. Only supports some values of OpenAI API. See example below.

- **Required:** Yes

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **401** | Unauthorized |
| **403** | Forbidden |
| **500** | Internal Server Error |

**Response Body** (application/json):

| Name | Type | Description |
|------|------|-------------|
| `message` | string | - |

**Response Body** (application/xml):

| Name | Type | Description |
|------|------|-------------|
| `message` | string | - |


---
## `POST` /v1/openai/embeddings



Get the embeddings of any arbitrary text string. This will use the embedder provider set in the system. Please ensure the token length of each string fits within the context of your embedder model.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

The input string(s) to be embedded. If the text is too long for the embedder model context, it will fail to embed. The vector and associated chunk metadata will be returned in the array order provided

- **Required:** Yes

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |

**Response Body** (application/json):

| Name | Type | Description |
|------|------|-------------|
| `message` | string | - |

**Response Body** (application/xml):

| Name | Type | Description |
|------|------|-------------|
| `message` | string | - |


---
## `GET` /v1/openai/vector_stores



List all the vector database collections connected to AnythingLLM. These are essentially workspaces but return their unique vector db identifier - this is the same as the workspace slug.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |

**Response Body** (application/json):

| Name | Type | Description |
|------|------|-------------|
| `message` | string | - |

**Response Body** (application/xml):

| Name | Type | Description |
|------|------|-------------|
| `message` | string | - |


---
