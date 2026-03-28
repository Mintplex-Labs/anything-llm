# Embed

> Part of **AnythingLLM Developer API**

---

## `GET` /v1/embed



List all active embeds



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
## `GET` /v1/embed/{embedUuid}/chats



Get all chats for a specific embed



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `embedUuid` | **path** | string | ✅ Yes | UUID of the embed |
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Embed not found |
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
## `GET` /v1/embed/{embedUuid}/chats/{sessionUuid}



Get chats for a specific embed and session



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `embedUuid` | **path** | string | ✅ Yes | UUID of the embed |
| `sessionUuid` | **path** | string | ✅ Yes | UUID of the session |
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Embed or session not found |
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
## `POST` /v1/embed/new



Create a new embed configuration



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

JSON object containing embed configuration details

- **Required:** Yes

- **Content-Type:** `application/json`

  - **Type:** `object`



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **403** | Forbidden |
| **404** | Workspace not found |
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
## `POST` /v1/embed/{embedUuid}



Update an existing embed configuration



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `embedUuid` | **path** | string | ✅ Yes | UUID of the embed to update |
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

JSON object containing embed configuration updates

- **Required:** Yes

- **Content-Type:** `application/json`

  - **Type:** `object`



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Embed not found |
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
## `DELETE` /v1/embed/{embedUuid}



Delete an existing embed configuration



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `embedUuid` | **path** | string | ✅ Yes | UUID of the embed to delete |
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **404** | Embed not found |
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
