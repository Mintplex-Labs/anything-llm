import ChatWindowHeader from "./Header";
import SessionId from "../SessionId";
import useChatHistory from "@/hooks/chat/useChatHistory";
import ChatContainer from "./ChatContainer";

export default function ChatWindow({ closeChat, settings, sessionId }) {
  const { chatHistory, loading } = useChatHistory(settings, sessionId);

  if (loading)
    return (
      <div>
        <p>loading...</p>
      </div>
    );
  setEventDelegatorForCodeSnippets();
  return (
    <div className="flex flex-col">
      <ChatWindowHeader
        iconUrl={settings.brandImageUrl}
        closeChat={closeChat}
      />
      <ChatContainer
        sessionId={sessionId}
        settings={settings}
        knownHistory={chatHistory}
      />
      <SessionId />
    </div>
  );
}

// Enables us to safely markdown and sanitize all responses without risk of injection
// but still be able to attach a handler to copy code snippets on all elements
// that are code snippets.
function copyCodeSnippet(uuid) {
  const target = document.querySelector(`[data-code="${uuid}"]`);
  if (!target) return false;
  const markdown =
    target.parentElement?.parentElement?.querySelector(
      "pre:first-of-type"
    )?.innerText;
  if (!markdown) return false;

  window.navigator.clipboard.writeText(markdown);
  target.classList.add("text-green-500");
  const originalText = target.innerHTML;
  target.innerText = "Copied!";
  target.setAttribute("disabled", true);

  setTimeout(() => {
    target.classList.remove("text-green-500");
    target.innerHTML = originalText;
    target.removeAttribute("disabled");
  }, 2500);
}

// Listens and hunts for all data-code-snippet clicks.
function setEventDelegatorForCodeSnippets() {
  document?.addEventListener("click", function (e) {
    const target = e.target.closest("[data-code-snippet]");
    const uuidCode = target?.dataset?.code;
    if (!uuidCode) return false;
    copyCodeSnippet(uuidCode);
  });
}
