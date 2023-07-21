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
