# User Management

> Part of **AnythingLLM Developer API**

---

## `GET` /v1/users



List all users



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Permission denied. |
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
## `GET` /v1/users/{id}/issue-auth-token



Issue a temporary auth token for a user



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `id` | **path** | string | ✅ Yes | The ID of the user to issue a temporary auth token for |
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Permission denied. |
| **403** | Forbidden |
| **404** | Not Found |
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
