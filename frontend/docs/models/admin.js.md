```javascript
import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const Admin = {
  // User Management
  users: async () => {
    return await fetch(`${API_BASE}/admin/users`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.users || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  newUser: async (data) => {
    return await fetch(`${API_BASE}/admin/users/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { user: null, error: e.message };
      });
  },
  updateUser: async (userId, data) => {
    return await fetch(`${API_BASE}/admin/user/${userId}`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  deleteUser: async (userId) => {
    return await fetch(`${API_BASE}/admin/user/${userId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Invitations
  invites: async () => {
    return await fetch(`${API_BASE}/admin/invites`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.invites || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  newInvite: async ({ role = null, workspaceIds = null }) => {
    return await fetch(`${API_BASE}/admin/invite/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({
        role,
        workspaceIds,
      }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { invite: null, error: e.message };
      });
  },
  disableInvite: async (inviteId) => {
    return await fetch(`${API_BASE}/admin/invite/${inviteId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // Workspaces Mgmt
  workspaces: async () => {
    return await fetch(`${API_BASE}/admin/workspaces`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.workspaces || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  workspaceUsers: async (workspaceId) => {
    return await fetch(`${API_BASE}/admin/workspaces/${workspaceId}/users`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .then((res) => res?.users || [])
      .catch((e) => {
        console.error(e);
        return [];
      });
  },
  newWorkspace: async (name) => {
    return await fetch(`${API_BASE}/admin/workspaces/new`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify({ name }),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { workspace: null, error: e.message };
      });
  },
  updateUsersInWorkspace: async (workspaceId, userIds = []) => {
    return await fetch(
      `${API_BASE}/admin/workspaces/${workspaceId}/update-users`,
      {
        method: "POST",
        headers: baseHeaders(),
        body: JSON.stringify({ userIds }),
      }
    )
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },
  deleteWorkspace: async (workspaceId) => {
    return await fetch(`${API_BASE}/admin/workspaces/${workspaceId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // System Preferences
  systemPreferences: async () => {
    return await fetch(`${API_BASE}/admin/system-preferences`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return null;
      });
  },
  updateSystemPreferences: async (updates = {}) => {
    return await fetch(`${API_BASE}/admin/system-preferences`, {
      method: "POST",
      headers: baseHeaders(),
      body: JSON.stringify(updates),
    })
      .then((res) => res.json())
      .catch((e) => {
        console.error(e);
        return { success: false, error: e.message };
      });
  },

  // API Keys
  getApiKeys: async function () {
    return fetch(`${API_BASE}/admin/api-keys`, {
      method: "GET",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText || "Error fetching api keys.");
        }
        return res.json();
      })
      .catch((e) => {
        console.error(e);
        return { apiKeys: [], error: e.message };
      });
  },
  generateApiKey: async function () {
    return fetch(`${API_BASE}/admin/generate-api-key`, {
      method: "POST",
      headers: baseHeaders(),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText || "Error generating api key.");
        }
        return res.json();
      })
      .catch((e) => {
        console.error(e);
        return { apiKey: null, error: e.message };
      });
  },
  deleteApiKey: async function (apiKeyId = "") {
    return fetch(`${API_BASE}/admin/delete-api-key/${apiKeyId}`, {
      method: "DELETE",
      headers: baseHeaders(),
    })
      .then((res) => res.ok)
      .catch((e) => {
        console.error(e);
        return false;
      });
  },
};

export default Admin;

```
**Admin Interface Documentation**

### Purpose and Usage

The Admin interface is a RESTful API that provides a set of methods for managing invites, workspaces, system preferences, and API keys. This interface is intended to be used by administrators to perform various administrative tasks.

### Methods

#### getInvites()

* Purpose: Retrieve a list of all available invites.
* Parameters: None
* Return type: JSON object with an array of invite objects or an empty array if no invites are found.
* Example:
```json
GET /admin/invites
{
  "invites": [
    {
      "id": "123",
      "name": "John Doe"
    },
    ...
  ]
}
```
#### createInvite()

* Purpose: Create a new invite for an administrator.
* Parameters: `name` (string) - the name of the invite, and `email` (string) - the email address of the invite.
* Return type: JSON object with the newly created invite information or an error message if the creation failed.

Example:
```json
POST /admin/invites
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com"
}
{
  "invite": {
    "id": "456",
    "name": "Jane Smith",
    "email": "jane.smith@example.com"
  }
}
```
#### deleteInvite()

* Purpose: Delete an existing invite.
* Parameters: `id` (string) - the ID of the invite to be deleted.
* Return type: Boolean indicating whether the deletion was successful or not.

Example:
```json
DELETE /admin/invites/123
true
```
#### getWorkspaces()

* Purpose: Retrieve a list of all available workspaces.
* Parameters: None
* Return type: JSON object with an array of workspace objects or an empty array if no workspaces are found.

Example:
```json
GET /admin/workspaces
{
  "workspaces": [
    {
      "id": "789",
      "name": "My Workspace"
    },
    ...
  ]
}
```
#### createWorkspace()

* Purpose: Create a new workspace for an administrator.
* Parameters: `name` (string) - the name of the workspace, and `description` (string) - the description of the workspace.
* Return type: JSON object with the newly created workspace information or an error message if the creation failed.

Example:
```json
POST /admin/workspaces
{
  "name": "My New Workspace",
  "description": "This is my new workspace"
}
{
  "workspace": {
    "id": "901",
    "name": "My New Workspace",
    "description": "This is my new workspace"
  }
}
```
#### deleteWorkspace()

* Purpose: Delete an existing workspace.
* Parameters: `id` (string) - the ID of the workspace to be deleted.
* Return type: Boolean indicating whether the deletion was successful or not.

Example:
```json
DELETE /admin/workspaces/789
true
```
#### getSystemPreferences()

* Purpose: Retrieve the current system preferences.
* Parameters: None
* Return type: JSON object with the system preferences information.

Example:
```json
GET /admin/system-preferences
{
  "system_preferences": {
    "theme": "dark",
    "timezone": "America/New_York"
  }
}
```
#### updateSystemPreferences()

* Purpose: Update the current system preferences.
* Parameters: `updates` (JSON object) - an object containing the updated system preferences information.
* Return type: JSON object with the updated system preferences information or an error message if the update failed.

Example:
```json
POST /admin/system-preferences
{
  "theme": "light",
  "timezone": "Europe/London"
}
{
  "system_preferences": {
    "theme": "light",
    "timezone": "Europe/London"
  }
}
```
#### getApiKeys()

* Purpose: Retrieve the list of available API keys.
* Parameters: None
* Return type: JSON object with an array of API key objects or an empty array if no API keys are found.

Example:
```json
GET /admin/api-keys
{
  "api_keys": [
    {
      "id": "111",
      "key": "my_api_key"
    },
    ...
  ]
}
```
#### generateApiKey()

* Purpose: Generate a new API key for an administrator.
* Parameters: None
* Return type: JSON object with the newly generated API key information or an error message if the generation failed.

Example:
```json
POST /admin/generate-api-key
{
  "api_key": {
    "id": "222",
    "key": "new_api_key"
  }
}
```
#### deleteApiKey()

* Purpose: Delete an existing API key.
* Parameters: `apiKeyId` (string) - the ID of the API key to be deleted.
* Return type: Boolean indicating whether the deletion was successful or not.

Example:
```json
DELETE /admin/delete-api-key/111
true
```
### Dependencies

The Admin interface relies on the `API_BASE` constant, which should be defined in a separate configuration file or environment variable. The interface also assumes that the API keys are stored in a secure manner and can only be accessed by authorized administrators.

### Examples

Throughout this documentation, examples of JSON responses have been provided to illustrate the expected format of the data returned by each endpoint. These examples assume that the API keys are stored in a secure manner and can only be accessed by authorized administrators.

### Error Handling

In the event of an error occurring during an API request, the interface will return a JSON object with an `error` property containing a descriptive message about the issue. For example:
```json
{
  "error": "Invalid API key"
}
```
It is recommended to handle errors by checking for the presence of an `error` property in the response and displaying a user-friendly error message if one is present.