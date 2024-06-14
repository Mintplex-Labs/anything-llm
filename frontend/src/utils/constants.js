export const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export const AUTH_USER = "anythingllm_user";
export const AUTH_TOKEN = "anythingllm_authToken";
export const AUTH_TIMESTAMP = "anythingllm_authTimestamp";
export const COMPLETE_QUESTIONNAIRE = "anythingllm_completed_questionnaire";
export const SEEN_DOC_PIN_ALERT = "anythingllm_pinned_document_alert";
export const SEEN_WATCH_ALERT = "anythingllm_watched_document_alert";

export const USER_BACKGROUND_COLOR = "bg-historical-msg-user";
export const AI_BACKGROUND_COLOR = "bg-historical-msg-system";

export function fullApiUrl() {
  if (API_BASE !== "/api") return API_BASE;
  return `${window.location.origin}/api`;
}
