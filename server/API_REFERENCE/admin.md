# Admin

> Part of **AnythingLLM Developer API**

---

## `GET` /v1/admin/is-multi-user-mode



Check to see if the instance is in multi-user-mode first. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
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
## `GET` /v1/admin/users



Check to see if the instance is in multi-user-mode first. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
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
## `POST` /v1/admin/users/new



Create a new user with username and password. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Key pair object that will define the new user to add to the system.

- **Required:** Yes

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **400** | Bad Request |
| **401** | Instance is not in Multi-User mode. Method denied |
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
## `POST` /v1/admin/users/{id}



Update existing user settings. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `id` | **path** | string | ✅ Yes | id of the user in the database. |
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Key pair object that will update the found user. All fields are optional and will not update unless specified.

- **Required:** Yes

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
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
## `DELETE` /v1/admin/users/{id}



Delete existing user by id. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `id` | **path** | string | ✅ Yes | id of the user in the database. |
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
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
## `GET` /v1/admin/invites



List all existing invitations to instance regardless of status. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
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
## `POST` /v1/admin/invite/new



Create a new invite code for someone to use to register with instance. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Request body for creation parameters of the invitation

- **Required:** No

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
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
## `DELETE` /v1/admin/invite/{id}



Deactivates (soft-delete) invite by id. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `id` | **path** | string | ✅ Yes | id of the invite in the database. |
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
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
## `GET` /v1/admin/workspaces/{workspaceId}/users



Retrieve a list of users with permissions to access the specified workspace.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `workspaceId` | **path** | string | ✅ Yes | id of the workspace. |
| `Authorization` | **header** | string | ❌ No | - |



### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
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
## `POST` /v1/admin/workspaces/{workspaceId}/update-users



Overwrite workspace permissions to only be accessible by the given user ids and admins. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `workspaceId` | **path** | string | ✅ Yes | id of the workspace in the database. |
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Entire array of user ids who can access the workspace. All fields are optional and will not update unless specified.

- **Required:** Yes

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
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
## `POST` /v1/admin/workspaces/{workspaceSlug}/manage-users



Set workspace permissions to be accessible by the given user ids and admins. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `workspaceSlug` | **path** | string | ✅ Yes | slug of the workspace in the database |
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Array of user ids who will be given access to the target workspace. reset will remove all existing users from the workspace and only add the new users - default false.

- **Required:** Yes

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
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
## `POST` /v1/admin/workspace-chats



All chats in the system ordered by most recent. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Page offset to show of workspace chats. All fields are optional and will not update unless specified.

- **Required:** No

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
## `POST` /v1/admin/preferences



Update multi-user preferences for instance. Methods are disabled until multi user mode is enabled via the UI.



### Parameters

| Name | Located In | Type | Required | Description |
|------|-----------|------|----------|-------------|
| `Authorization` | **header** | string | ❌ No | - |


### Request Body

Object with setting key and new value to set. All keys are optional and will not update unless specified.

- **Required:** Yes

- **Content-Type:** `application/json`


### Responses

| Status Code | Description |
|-------------|-------------|
| **200** | OK |
| **401** | Instance is not in Multi-User mode. Method denied |
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
