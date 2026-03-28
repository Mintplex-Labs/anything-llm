# System Settings

> Part of **AnythingLLM Developer API**

---

## `GET` /v1/system/env-dump



Dump all settings to file storage





### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `GET` /v1/system



Get all current system settings that are defined.



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
## `GET` /v1/system/vector-count



Number of all vectors in connected vector database



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
## `POST` /v1/system/update-env



Update a system setting or preference.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


### Request Body

Key pair object that matches a valid setting and value. Get keys from GET /v1/system or refer to codebase.

- **Required:** Yes


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `GET` /v1/system/export-chats



Export all of the chats from the system in a known format. Output depends on the type sent. Will be send with the correct header for the output.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |
| `type` | **query** |  (string) | ❌ No | Export format jsonl, json, csv, jsonAlpaca |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
## `DELETE` /v1/system/remove-documents



Permanently remove documents from the system.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** |  (string) | ❌ No | - |


### Request Body

Array of document names to be removed permanently.

- **Required:** Yes


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | Documents removed successfully. |
| **403** | Forbidden |
| **500** | Internal Server Error |


---
