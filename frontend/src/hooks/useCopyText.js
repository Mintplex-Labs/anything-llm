import { THOUGHT_REGEX_COMPLETE } from "@/components/WorkspaceChat/ChatContainer/ChatHistory/ThoughtContainer";
import { copyMarkdownAsRichText } from "@/utils/clipboard";
import { useState } from "react";

export default function useCopyText(delay = 2500) {
  const [copied, setCopied] = useState(false);
  const copyText = async (content) => {
    if (!content) return;

    // Filter thinking blocks from the content if they exist
    const nonThinkingContent = content.replace(THOUGHT_REGEX_COMPLETE, "");
    await copyMarkdownAsRichText(nonThinkingContent);
    setCopied(true);
    setTimeout(() => setCopied(false), delay);
  };

  return { copyText, copied };
}
