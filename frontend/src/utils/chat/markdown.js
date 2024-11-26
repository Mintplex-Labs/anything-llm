import { encode as HTMLEncode } from "he";
import markdownIt from "markdown-it";
import markdownItKatex from "markdown-it-katex";
import hljs from "highlight.js";
import "./themes/github-dark.css";
import "./themes/github.css";
import { v4 } from "uuid";

const markdown = markdownIt({
  html: false,
  typographer: true,
  highlight: function (code, lang) {
    const uuid = v4();
    const theme =
      window.localStorage.getItem("theme") === "light"
        ? "github"
        : "github-dark";

    if (lang && hljs.getLanguage(lang)) {
      try {
        return (
          `<div class="whitespace-pre-line w-full hljs ${theme} light:border-solid light:border light:border-gray-700 rounded-lg px-4 pb-4 relative font-mono font-normal text-sm text-slate-200">
            <div class="w-full flex items-center absolute top-0 left-0 text-slate-200 light:bg-sky-800 bg-stone-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
              <div class="flex gap-2">
                <code class="text-xs">${lang || ""}</code>
              </div>
              <button data-code-snippet data-code="code-${uuid}" class="flex items-center gap-x-2">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                <p>Copy code</p>
              </button>
            </div>
          <pre class="whitespace-pre-wrap">` +
          hljs.highlight(code, { language: lang, ignoreIllegals: true }).value +
          "</pre></div>"
        );
      } catch (__) {}
    }

    return (
      `<div class="whitespace-pre-line w-full hljs ${theme} light:border-solid light:border light:border-gray-700 rounded-lg px-4 pb-4 relative font-mono font-normal text-sm text-slate-200">
        <div class="w-full flex items-center absolute top-0 left-0 text-slate-200 bg-stone-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md">
          <div class="flex gap-2"><code class="text-xs"></code></div>
          <button data-code-snippet data-code="code-${uuid}" class="flex items-center gap-x-2">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            <p>Copy code</p>
          </button>
        </div>
      <pre class="whitespace-pre-wrap">` +
      HTMLEncode(code) +
      "</pre></div>"
    );
  },
});

// Add custom renderer for strong tags to handle theme colors
markdown.renderer.rules.strong_open = () => '<strong class="text-white">';
markdown.renderer.rules.strong_close = () => "</strong>";

// Custom renderer for responsive images rendered in markdown
markdown.renderer.rules.image = function (tokens, idx) {
  const token = tokens[idx];
  const srcIndex = token.attrIndex("src");
  const src = token.attrs[srcIndex][1];
  const alt = token.content || "";

  return `<div class="w-full max-w-[800px]"><img src="${src}" alt="${alt}" class="w-full h-auto" /></div>`;
};

markdown.use(markdownItKatex);

export default function renderMarkdown(text = "") {
  return markdown.render(text);
}
