export const AUTH_USER = "anythingllm_user";
export const AUTH_TOKEN = "anythingllm_authToken";
export const AUTH_TIMESTAMP = "anythingllm_authTimestamp";

export const USER_BACKGROUND_COLOR = "bg-historical-msg-user";
export const AI_BACKGROUND_COLOR = "bg-historical-msg-system";
export const COMPLETE_QUESTIONNAIRE = "anythingllm_completed_questionnaire";
export const SEEN_DOC_PIN_ALERT = "anythingllm_pinned_document_alert";
export const SEEN_WATCH_ALERT = "anythingllm_watched_document_alert";

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
