import MarkdownIt from "markdown-it";
import "highlight.js/styles/github-dark.css";

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

export default function MarkdownRenderer({ content, showThinking }) {
  if (!content) return null;

  if (!showThinking) {
    const processedContent = content.replace(/<think>[\s\S]*?<\/think>/g, "");
    const html = md.render(processedContent);
    return (
      <div
        className="markdown-renderer"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const parts = parseContent(content);
  return (
    <div className="markdown-renderer">
      {parts.map((part, index) => {
        const html = md.render(part.text);
        if (part.type === "think") {
          return (
            <div key={index}>
              <div
                className="text-blue-500"
                dangerouslySetInnerHTML={{ __html: html }}
              />
              <br />
            </div>
          );
        }
        return <div key={index} dangerouslySetInnerHTML={{ __html: html }} />;
      })}
    </div>
  );
}
