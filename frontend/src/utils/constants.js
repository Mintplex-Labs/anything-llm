export const AUTH_USER = "anythingllm_user";
export const AUTH_TOKEN = "anythingllm_authToken";
export const AUTH_TIMESTAMP = "anythingllm_authTimestamp";

export const USER_BACKGROUND_COLOR = "bg-historical-msg-user";
export const AI_BACKGROUND_COLOR = "bg-historical-msg-system";
export const COMPLETE_QUESTIONNAIRE = "anythingllm_completed_questionnaire";
export const SEEN_DOC_PIN_ALERT = "anythingllm_pinned_document_alert";

export const ANYTHINGLLM_OLLAMA = {
  localStorageKey: "anythingllm_model_download",
  startEvent: "modelDownloadStart",
  completeEvent: "modelDownloadComplete",
  abortEvent: "modelDownloadAbort",
};

export const READY_EVENT_NAME = "system-ready";
export const REMOTE_APP_VERSION_URL =
  "https://s3.us-west-1.amazonaws.com/public.useanything.com/latest/version.txt";
export const _APP_VERSION = {
  value: null,
};
export const _API_BASE_URL = {
  value: import.meta.env.VITE_API_BASE || "/api",
};
export const _APP_PLATFORM = {
  value: null,
};
