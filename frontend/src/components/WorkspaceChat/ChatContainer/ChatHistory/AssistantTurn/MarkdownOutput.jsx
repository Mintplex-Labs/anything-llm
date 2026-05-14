import { memo } from "react";
import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";
import {
  THOUGHT_REGEX_CLOSE,
  THOUGHT_REGEX_COMPLETE,
  THOUGHT_REGEX_OPEN,
  ThoughtChainComponent,
} from "../ThoughtContainer";

function splitThoughtContent(message = "") {
  if (!message) return { thoughtChain: null, markdown: "" };

  if (
    message.match(THOUGHT_REGEX_OPEN) &&
    !message.match(THOUGHT_REGEX_CLOSE)
  ) {
    return { thoughtChain: message, markdown: "" };
  }

  const completeThoughtChain = message.match(THOUGHT_REGEX_COMPLETE)?.[0];
  if (completeThoughtChain) {
    return {
      thoughtChain: completeThoughtChain,
      markdown: message.replace(THOUGHT_REGEX_COMPLETE, ""),
    };
  }

  return { thoughtChain: null, markdown: message };
}

function MarkdownOutput({ content = "", messageId }) {
  if (!content) return null;
  const { thoughtChain, markdown } = splitThoughtContent(content);

  return (
    <div className="flex flex-col gap-y-1">
      {thoughtChain && (
        <ThoughtChainComponent content={thoughtChain} messageId={messageId} />
      )}
      {markdown && (
        <span
          className="break-words flex flex-col gap-y-1 text-white light:text-slate-900"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(renderMarkdown(markdown)),
          }}
        />
      )}
    </div>
  );
}

export default memo(MarkdownOutput);
