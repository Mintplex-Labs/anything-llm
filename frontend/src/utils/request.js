// Sets up the base headers for all authenticated requests so that we are able to prevent
// basic spoofing since a valid token is required and that cannot be spoofed
export function baseHeaders(providedToken = null) {
  const token =
    providedToken || window.localStorage.getItem("anythingllm_authtoken");
  return {
    Authorization: token ? `Bearer ${token}` : null,
  };
}
