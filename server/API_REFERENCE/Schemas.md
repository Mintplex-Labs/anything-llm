# Data Schemas

> **AnythingLLM Developer API** — Schema Definitions

---

## `InvalidAPIKey`


**Type:** `object`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `message` | string | ❌ No | - |




---
## `Getv1_authresponse_403Schema`

> Response body for GET /v1/auth → 403


**Type:** `object`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `message` | string | ❌ No | - |




---
## `Postv1_document_uploadrequestSchema`

> Request body for POST /v1/document/upload


**Type:** `object`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `file` | string (binary) | ✅ Yes | The file to upload |
| `addToWorkspaces` | string | ❌ No | comma-separated text-string of workspace slugs to embed the document into post-upload. eg: workspace1,workspace2 |
| `metadata` | object | ❌ No | Key:Value pairs of metadata to attach to the document in JSON Object format. Only specific keys are allowed - see example. |


**Required fields:** `file`



---
## `Deletev1_document_removefolderrequestSchema`

> Request body for DELETE /v1/document/remove-folder


**Type:** `object`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `name` | string | ❌ No | - |




---
## `Deletev1_system_removedocumentsrequestSchema`

> Request body for DELETE /v1/system/remove-documents


**Type:** `object`

### Properties

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `names` | array[string] | ❌ No | - |




---
