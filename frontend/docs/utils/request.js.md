```javascript
import { AUTH_TOKEN, AUTH_USER } from "./constants";

// Sets up the base headers for all authenticated requests so that we are able to prevent
// basic spoofing since a valid token is required and that cannot be spoofed
export function userFromStorage() {
  try {
    const userString = window.localStorage.getItem(AUTH_USER);
    if (!userString) return null;
    return JSON.parse(userString);
  } catch {}
  return {};
}

export function baseHeaders(providedToken = null) {
  const token = providedToken || window.localStorage.getItem(AUTH_TOKEN);
  return {
    Authorization: token ? `Bearer ${token}` : null,
  };
}

export function safeJsonParse(jsonString, fallback = null) {
  try {
    return JSON.parse(jsonString);
  } catch {}
  return fallback;
}

```
**Documentation for User Authentication Interface**

**Purpose and Usage:**
The user authentication interface provides a set of utility functions for handling user authentication and token management. This interface is intended to be used within the codebase to facilitate secure and authenticated requests.

**Methods:**

### `userFromStorage()`

* **Signature:** `export function userFromStorage(): User | null`
* **Purpose:** Retrieves the currently logged-in user from local storage.
* **Parameters:** None
* **Return Type:** `User | null` (returns the current user if available, otherwise returns null)
* **Example:**
```javascript
const user = userFromStorage();
if (user) {
  console.log(`Hello, ${user.name}!`);
} else {
  console.log("No user logged in.");
}
```
### `baseHeaders( [providedToken] )`

* **Signature:** `export function baseHeaders(providedToken?: string | null): { Authorization: string } | null`
* **Purpose:** Returns the base headers for authenticated requests, including a valid token (if provided).
* **Parameters:**
	+ `providedToken`: An optional token string (default is null)
* **Return Type:** `{ Authorization: string } | null` (returns the base headers with the provided token or null if no token is available)
* **Example:**
```javascript
const headers = baseHeaders(token);
fetch('/api/endpoint', { headers, method: 'GET' });
```
### `safeJsonParse(jsonString, [fallback] )`

* **Signature:** `export function safeJsonParse(jsonString: string, fallback?: any): any`
* **Purpose:** Safely parses a JSON string and returns the resulting object. If parsing fails, it returns the provided fallback value.
* **Parameters:**
	+ `jsonString`: The JSON string to parse
	+ `fallback`: An optional fallback value (default is null)
* **Return Type:** `any` (returns the parsed JSON object or the fallback value if parsing fails)
* **Example:**
```javascript
const data = safeJsonParse('{ "key": "value" }');
console.log(data); // { key: "value" }

try {
  const badData = safeJsonParse('not a valid json string');
} catch (error) {
  console.error("Error parsing JSON:", error);
}
```
**Dependencies:**
This interface relies on the `AUTH_TOKEN` and `AUTH_USER` constants from the `"./constants"` module.

**Clarity and Consistency:**
The documentation is organized into clear sections, with concise descriptions of each method. The examples illustrate the usage of each function, making it easier to understand how to integrate this interface into your codebase.