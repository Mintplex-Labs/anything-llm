export const API_BASE = import.meta.env.VITE_API_BASE || "/api";
export const ONBOARDING_SURVEY_URL = "https://onboarding.anythingllm.com";

export const AUTH_USER = "anythingllm_user";
export const AUTH_TOKEN = "anythingllm_authToken";
export const AUTH_TIMESTAMP = "anythingllm_authTimestamp";
export const COMPLETE_QUESTIONNAIRE = "anythingllm_completed_questionnaire";
export const SEEN_DOC_PIN_ALERT = "anythingllm_pinned_document_alert";
export const SEEN_WATCH_ALERT = "anythingllm_watched_document_alert";

export const APPEARANCE_SETTINGS = "anythingllm_appearance_settings";

export const OLLAMA_COMMON_URLS = [
  "http://127.0.0.1:11434",
  "http://host.docker.internal:11434",
  "http://172.17.0.1:11434",
];

export const LMSTUDIO_COMMON_URLS = [
  "http://localhost:1234/v1",
  "http://127.0.0.1:1234/v1",
  "http://host.docker.internal:1234/v1",
  "http://172.17.0.1:1234/v1",
];

export const KOBOLDCPP_COMMON_URLS = [
  "http://127.0.0.1:5000/v1",
  "http://localhost:5000/v1",
  "http://host.docker.internal:5000/v1",
  "http://172.17.0.1:5000/v1",
];

export const LOCALAI_COMMON_URLS = [
  "http://127.0.0.1:8080/v1",
  "http://localhost:8080/v1",
  "http://host.docker.internal:8080/v1",
  "http://172.17.0.1:8080/v1",
];

export const DPAIS_COMMON_URLS = [
  "http://127.0.0.1:8553/v1",
  "http://0.0.0.0:8553/v1",
  "http://localhost:8553/v1",
  "http://host.docker.internal:8553/v1",
];

export const NVIDIA_NIM_COMMON_URLS = [
  "http://127.0.0.1:8000/v1/version",
  "http://localhost:8000/v1/version",
  "http://host.docker.internal:8000/v1/version",
  "http://172.17.0.1:8000/v1/version",
];

export function fullApiUrl() {
  if (API_BASE !== "/api") return API_BASE;
  return `${window.location.origin}/api`;
}

// Clear localStorage if API_BASE has changed since last visit
export function validateAndClearStaleCache() {
  const CACHE_KEY = "anythingllm_api_base";
  const BUILD_KEY = "anythingllm_build_time";
  const currentApiBase = API_BASE;
  const currentBuildTime = typeof __BUILD_TIME__ !== 'undefined' ? __BUILD_TIME__ : Date.now();
  const storedApiBase = localStorage.getItem(CACHE_KEY);
  const storedBuildTime = localStorage.getItem(BUILD_KEY);
  
  let shouldClearCache = false;
  let reason = "";
  
  if (storedApiBase && storedApiBase !== currentApiBase) {
    shouldClearCache = true;
    reason = `API_BASE changed from ${storedApiBase} to ${currentApiBase}`;
  }
  
  if (storedBuildTime && storedBuildTime !== currentBuildTime.toString()) {
    shouldClearCache = true;
    reason += (reason ? " and " : "") + `Build version changed from ${storedBuildTime} to ${currentBuildTime}`;
  }
  
  // Also check for corrupted auth tokens that might cause bcrypt issues
  const authToken = localStorage.getItem(AUTH_TOKEN);
  if (authToken) {
    try {
      // Basic validation - JWT should have 3 parts separated by dots
      const parts = authToken.split('.');
      if (parts.length !== 3) {
        shouldClearCache = true;
        reason += (reason ? " and " : "") + "Corrupted auth token detected";
      }
    } catch (error) {
      shouldClearCache = true;
      reason += (reason ? " and " : "") + "Invalid auth token format";
    }
  }
  
  if (shouldClearCache) {
    console.warn(reason + " - clearing cache");
    const itemsToKeep = [CACHE_KEY, BUILD_KEY]; // Keep the trackers
    
    // Get all localStorage keys
    const allKeys = Object.keys(localStorage);
    
    // Remove all anythingllm related items except the trackers
    allKeys.forEach(key => {
      if (key.startsWith('anythingllm_') && !itemsToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
  }
  
  // Update stored values
  localStorage.setItem(CACHE_KEY, currentApiBase);
  localStorage.setItem(BUILD_KEY, currentBuildTime.toString());
}

// Manual cache clearing function for debugging
export function clearAllAnythingLLMCache() {
  const allKeys = Object.keys(localStorage);
  const anythingLLMKeys = allKeys.filter(key => key.startsWith('anythingllm_'));
  
  anythingLLMKeys.forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log(`Cleared ${anythingLLMKeys.length} AnythingLLM cache items:`, anythingLLMKeys);
  
  // Also clear session storage
  const sessionKeys = Object.keys(sessionStorage);
  const sessionAnythingLLMKeys = sessionKeys.filter(key => key.startsWith('anythingllm_'));
  
  sessionAnythingLLMKeys.forEach(key => {
    sessionStorage.removeItem(key);
  });
  
  if (sessionAnythingLLMKeys.length > 0) {
    console.log(`Cleared ${sessionAnythingLLMKeys.length} AnythingLLM session items:`, sessionAnythingLLMKeys);
  }
  
  return anythingLLMKeys.length + sessionAnythingLLMKeys.length;
}

// Make it available globally for debugging
if (typeof window !== 'undefined') {
  window.clearAnythingLLMCache = clearAllAnythingLLMCache;
}

export const POPUP_BROWSER_EXTENSION_EVENT = "NEW_BROWSER_EXTENSION_CONNECTION";
