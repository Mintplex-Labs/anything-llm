import { useState } from "react";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { CaretDown } from "@phosphor-icons/react";
import "highlight.js/styles/github-dark.css";
import DOMPurify from "@/utils/chat/purify";

const md = new MarkdownIt({
  html: true,
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ""; // use external default escaping
  },
});

const ThoughtBubble = ({ thought }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!thought) return null;

  const cleanThought = thought.replace(/<\/?think>/g, "").trim();
  if (!cleanThought) return null;

  return (
    <div className="mb-3">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="cursor-pointer flex items-center gap-x-2 text-theme-text-secondary hover:text-theme-text-primary transition-colors mb-2"
      >
        <CaretDown
          size={14}
          weight="bold"
          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
        <span className="text-xs font-medium">View thoughts</span>
      </div>
      {isExpanded && (
        <div className="bg-theme-bg-chat-input rounded-md p-3 border-l-2 border-theme-text-secondary/30">
          <div className="text-xs text-theme-text-secondary font-mono whitespace-pre-wrap">
            {cleanThought}
          </div>
        </div>
      )}
    </div>
  );
};

function parseContent(content) {
  const parts = [];
  let lastIndex = 0;
  content.replace(/<think>([^]*?)<\/think>/g, (match, thinkContent, offset) => {
    if (offset > lastIndex) {
      parts.push({ type: "normal", text: content.slice(lastIndex, offset) });
    }
    parts.push({ type: "think", text: thinkContent });
    lastIndex = offset + match.length;
  });
  if (lastIndex < content.length) {
    parts.push({ type: "normal", text: content.slice(lastIndex) });
  }
  return parts;
}

export default function MarkdownRenderer({ content }) {
  if (!content) return null;

  const parts = parseContent(content);
  return (
    <div className="whitespace-normal">
      {parts.map((part, index) => {
        const html = md.render(part.text);
        if (part.type === "think")
          return <ThoughtBubble key={index} thought={part.text} />;
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }}
          />
        );
      })}
    </div>
  );
}
