import { useEffect, useState } from "react";
import Appearance from "@/models/appearance";
import { ASSISTANT_MESSAGE_COMPLETE_EVENT } from "@/components/contexts/TTSProvider";
import { THOUGHT_REGEX_COMPLETE } from "../ThoughtContainer";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";

/**
 * Polite live region that announces each reply once it has finished
 * streaming. The region stays mounted so that screen readers are already
 * watching it when the text arrives.
 * @param {Object} props
 * @param {Object[]} props.history - the chat history being rendered
 */
export default function CompletedReplyAnnouncement({ history }) {
  const announcement = useCompletedReplyAnnouncement(history);
  return (
    <div className="sr-only" role="status">
      {announcement}
    </div>
  );
}

/**
 * Returns the visible text of each reply once it finishes streaming, for a
 * polite live region, so screen reader users hear the reply without having
 * to navigate to it.
 *
 * Skipped when TTS auto-play is on, because that already speaks the reply and
 * the two would talk over each other.
 * @param {Object[]} history - the chat history being rendered
 * @returns {string} the text to announce, or an empty string
 */
function useCompletedReplyAnnouncement(history) {
  const [completedChatId, setCompletedChatId] = useState(null);
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    function handleComplete(event) {
      const chatId = event.detail?.chatId;
      if (!chatId || Appearance.get("autoPlayAssistantTtsResponse")) return;
      // Empty the region first so a reply identical to the last one is
      // still announced.
      setAnnouncement("");
      setCompletedChatId(chatId);
    }
    window.addEventListener(ASSISTANT_MESSAGE_COMPLETE_EVENT, handleComplete);
    return () =>
      window.removeEventListener(
        ASSISTANT_MESSAGE_COMPLETE_EVENT,
        handleComplete
      );
  }, []);

  // The event fires before the finished message reaches history, so wait for
  // the render that carries it.
  useEffect(() => {
    if (!completedChatId) return;
    const message = history.find(
      (msg) => msg.role === "assistant" && msg.chatId === completedChatId
    );
    if (!message) return;
    setCompletedChatId(null);
    setAnnouncement(replyToPlainText(message.content));
  }, [history, completedChatId]);

  return announcement;
}

/**
 * Reduces a reply to the text a sighted user sees: no thought segment, and no
 * markdown syntax for the screen reader to spell out.
 * @param {string} content - the raw assistant message
 * @returns {string}
 */
function replyToPlainText(content) {
  if (typeof content !== "string") return "";
  const visible = content.replace(THOUGHT_REGEX_COMPLETE, "");
  const html = DOMPurify.sanitize(renderMarkdown(visible));
  const text =
    new DOMParser().parseFromString(html, "text/html").body.textContent ?? "";
  return text.replace(/\s+/g, " ").trim();
}
