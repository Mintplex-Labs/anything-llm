import { AUTH_TOKEN, AUTH_USER } from "./constants";

// Sets up the base headers for all authenticated requests so that we are able to prevent
// basic spoofing since a valid token is required and that cannot be spoofed
export function userFromStorage() {
  const userString = window.localStorage.getItem(AUTH_USER);
  if (!userString) return null;
  return safeJsonParse(userString, null);
}

export function baseHeaders(providedToken = null) {
  const token = providedToken || window.localStorage.getItem(AUTH_TOKEN);
  return {
    Authorization: token ? `Bearer ${token}` : null,
  };
}

export function safeJsonParse(jsonString, fallback = null) {
  try {
    if (jsonString === null || jsonString === undefined) return fallback;
    return JSON.parse(jsonString);
  } catch {}
  return fallback;
}
