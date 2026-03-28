# Documents

> Part of **AnythingLLM Developer API**

---

## `POST` /v1/document/upload



Upload a new file to AnythingLLM to be parsed and prepared for embedding, with optional metadata.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

File to be uploaded.

- **Required:** Yes

- **Content-Type:** `multipart/form-data`
  | Name | Type | Required | Description |
  |------|------|----------|-------------|
  | `file` | string (binary) | ✅ Yes | The file to upload |
  | `addToWorkspaces` | string | ❌ No | comma-separated text-string of workspace slugs to embed the document into post-upload. eg: workspace1,workspace2 |
  | `metadata` | object | ❌ No | Key:Value pairs of metadata to attach to the document in JSON Object format. Only specific keys are allowed - see example. |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **422** | Unprocessable Entity |
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
## `POST` /v1/document/upload/{folderName}



Upload a new file to a specific folder in AnythingLLM to be parsed and prepared for embedding. If the folder does not exist, it will be created.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `folderName` | **path** | string | ✅ Yes | Target folder path (defaults to 'custom-documents' if not provided) |
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

File to be uploaded, with optional metadata.

- **Required:** Yes

- **Content-Type:** `multipart/form-data`
  | Name | Type | Required | Description |
  |------|------|----------|-------------|
  | `file` | string (binary) | ✅ Yes | The file to upload |
  | `addToWorkspaces` | string | ❌ No | comma-separated text-string of workspace slugs to embed the document into post-upload. eg: workspace1,workspace2 |
  | `metadata` | object | ❌ No | Key:Value pairs of metadata to attach to the document in JSON Object format. Only specific keys are allowed - see example. |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **422** | Unprocessable Entity |
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
## `POST` /v1/document/upload-link



Upload a valid URL for AnythingLLM to scrape and prepare for embedding. Optionally, specify a comma-separated list of workspace slugs to embed the document into post-upload.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Link of web address to be scraped and optionally a comma-separated list of workspace slugs to embed the document into post-upload, and optional metadata.

- **Required:** Yes

- **Content-Type:** `application/json`

  - **Type:** `object`



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **422** | Unprocessable Entity |
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
## `POST` /v1/document/raw-text



Upload a file by specifying its raw text content and metadata values without having to upload a file.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Text content and metadata of the file to be saved to the system. Use metadata-schema endpoint to get the possible metadata keys

- **Required:** Yes

- **Content-Type:** `application/json`

  - **Type:** `object`



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **403** | Forbidden |
| **422** | Unprocessable Entity |
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
## `GET` /v1/documents



List of all locally-stored documents in instance



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
## `GET` /v1/documents/folder/{folderName}



Get all documents stored in a specific folder.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `folderName` | **path** | string | ✅ Yes | Name of the folder to retrieve documents from |
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
## `GET` /v1/document/accepted-file-types



Check available filetypes and MIMEs that can be uploaded.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
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
## `GET` /v1/document/metadata-schema



Get the known available metadata schema for when doing a raw-text upload and the acceptable type of value for each key.



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
## `GET` /v1/document/{docName}



Get a single document by its unique AnythingLLM document name



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `docName` | **path** | string | ✅ Yes | Unique document name to find (name in /documents) |
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
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
## `POST` /v1/document/create-folder



Create a new folder inside the documents storage directory.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Name of the folder to create.

- **Required:** Yes

- **Content-Type:** `application/json`

  - **Type:** `string`



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
## `DELETE` /v1/document/remove-folder



Remove a folder and all its contents from the documents storage directory.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Name of the folder to remove.

- **Required:** Yes

- **Content-Type:** `application/json`
  | Name | Type | Required | Description |
  |------|------|----------|-------------|
  | `name` | string | ❌ No | - |



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
## `POST` /v1/document/move-files



Move files within the documents storage directory.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Array of objects containing source and destination paths of files to move.

- **Required:** Yes

- **Content-Type:** `application/json`

  - **Type:** `object`



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
