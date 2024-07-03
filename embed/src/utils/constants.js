export const CHAT_UI_REOPEN = "___anythingllm-chat-widget-open___";
export function parseStylesSrc(scriptSrc = null) {
  try {
    const _url = new URL(scriptSrc);
    _url.pathname = _url.pathname
      .replace("anythingllm-chat-widget.js", "anythingllm-chat-widget.min.css")
      .replace(
        "anythingllm-chat-widget.min.js",
        "anythingllm-chat-widget.min.css"
      );
    return _url.toString();
  } catch {
    return "";
  }
}
