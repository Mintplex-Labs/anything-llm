import { THOUGHT_REGEX_COMPLETE } from "@/components/WorkspaceChat/ChatContainer/ChatHistory/ThoughtContainer";
import { useState } from "react";

export default function useCopyText(delay = 2500) {
  const [copied, setCopied] = useState(false);
  const copyText = async (content) => {
    if (!content) return;

    // Filter thinking blocks from the content if they exist
    const nonThinkingContent = content.replace(THOUGHT_REGEX_COMPLETE, "");
    navigator?.clipboard?.writeText(nonThinkingContent);
    setCopied(nonThinkingContent);
    setTimeout(() => {
      setCopied(false);
    }, delay);
  };

  return { copyText, copied };
}
