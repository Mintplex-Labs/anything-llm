import MarkdownIt from "markdown-it";
import "highlight.js/styles/github-dark.css";

const md = new MarkdownIt({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }
    return ""; // use external default escaping
  },
});

export default function MarkdownRenderer({ content, showThinking }) {
  const processedContent = showThinking
    ? content.replace(/<\/?think>/g, "")
    : content.replace(/<think>[\s\S]*?<\/think>/g, "");

  const html = md.render(processedContent);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
