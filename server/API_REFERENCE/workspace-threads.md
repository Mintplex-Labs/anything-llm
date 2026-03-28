# Workspace Threads

> Part of **AnythingLLM Developer API**

---

## `POST` /v1/workspace/{slug}/thread/new



Create a new workspace thread



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** | string | ✅ Yes | Unique slug of workspace |
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Optional userId associated with the thread, thread slug and thread name

- **Required:** No

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
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
## `POST` /v1/workspace/{slug}/thread/{threadSlug}/update



Update thread name by its unique slug.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** | string | ✅ Yes | Unique slug of workspace |
| `threadSlug` | **path** | string | ✅ Yes | Unique slug of thread |
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

JSON object containing new name to update the thread.

- **Required:** Yes

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
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
## `DELETE` /v1/workspace/{slug}/thread/{threadSlug}



Delete a workspace thread



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** | string | ✅ Yes | Unique slug of workspace |
| `threadSlug` | **path** | string | ✅ Yes | Unique slug of thread |
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | Thread deleted successfully |
| **400** | Bad Request |
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
## `GET` /v1/workspace/{slug}/thread/{threadSlug}/chats



Get chats for a workspace thread



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** | string | ✅ Yes | Unique slug of workspace |
| `threadSlug` | **path** | string | ✅ Yes | Unique slug of thread |
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
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
## `POST` /v1/workspace/{slug}/thread/{threadSlug}/chat



Chat with a workspace thread



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** | string | ✅ Yes | Unique slug of workspace |
| `threadSlug` | **path** | string | ✅ Yes | Unique slug of thread |
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Send a prompt to the workspace thread and the type of conversation (query or chat).

- **Required:** Yes

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
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
## `POST` /v1/workspace/{slug}/thread/{threadSlug}/stream-chat



Stream chat with a workspace thread



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `slug` | **path** | string | ✅ Yes | Unique slug of workspace |
| `threadSlug` | **path** | string | ✅ Yes | Unique slug of thread |
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Send a prompt to the workspace thread and the type of conversation (query or chat).

- **Required:** Yes

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |

**Response Body** (application/json):

| Name | Type | Description |
|------|------|-------------|
| `message` | string | - |


**Response Body** (application/xml):

| Name | Type | Description |
|------|------|-------------|
| `message` | string | - |



---
