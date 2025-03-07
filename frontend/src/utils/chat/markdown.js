import { encode as HTMLEncode } from "he";
import markdownIt from "markdown-it";
import markdownItKatexPlugin from "./plugins/markdown-katex";
import hljs from "highlight.js";
import "./themes/github-dark.css";
import "./themes/github.css";
import { v4 } from "uuid";

// 인용 참조 링크 패턴 (예: [1], [source 1], [doc 3] 등)
const CITATION_LINK_REGEX = /\[(\d+|source\s+\d+|doc\s+\d+)\]/g;

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
              <button data-code-snippet data-code="code-${uuid}" class="flex items-center gap-x-1">
                <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                <p class="text-xs" style="margin: 0px;padding: 0px;">Copy block</p>
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
          <button data-code-snippet data-code="code-${uuid}" class="flex items-center gap-x-1">
            <svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
            <p class="text-xs" style="margin: 0px;padding: 0px;">Copy block</p>
          </button>
        </div>
      <pre class="whitespace-pre-wrap">` +
      HTMLEncode(code) +
      "</pre></div>"
    );
  },
});

// 인용 참조 링크를 클릭 가능한 링크로 변환하는 커스텀 룰 추가
markdown.core.ruler.push('citation_links', state => {
  if (!state.tokens || !state.env) return;
  
  for (let i = 0; i < state.tokens.length; i++) {
    if (state.tokens[i].type === 'inline') {
      const tokens = state.tokens[i].children;
      
      for (let j = 0; j < tokens.length; j++) {
        if (tokens[j].type === 'text') {
          const text = tokens[j].content;
          const matches = text.match(CITATION_LINK_REGEX);
          
          if (matches) {
            let lastPos = 0;
            const newTokens = [];
            
            text.replace(CITATION_LINK_REGEX, (match, p1, offset) => {
              // 매치 전 텍스트 추가
              if (offset > lastPos) {
                const textToken = new state.Token('text', '', 0);
                textToken.content = text.slice(lastPos, offset);
                newTokens.push(textToken);
              }
              
              // 링크 오픈 토큰
              const linkOpenToken = new state.Token('citation_link_open', 'a', 1);
              linkOpenToken.attrSet('href', '#');
              linkOpenToken.attrSet('class', 'citation-link text-sky-400 hover:text-sky-300');
              linkOpenToken.attrSet('data-citation-index', p1.replace(/\D/g, ''));
              newTokens.push(linkOpenToken);
              
              // 텍스트 토큰
              const textToken = new state.Token('text', '', 0);
              textToken.content = match;
              newTokens.push(textToken);
              
              // 링크 클로즈 토큰
              const linkCloseToken = new state.Token('citation_link_close', 'a', -1);
              newTokens.push(linkCloseToken);
              
              lastPos = offset + match.length;
            });
            
            // 나머지 텍스트 추가
            if (lastPos < text.length) {
              const textToken = new state.Token('text', '', 0);
              textToken.content = text.slice(lastPos);
              newTokens.push(textToken);
            }
            
            // 원래 토큰을 새 토큰들로 교체
            tokens.splice(j, 1, ...newTokens);
            j += newTokens.length - 1;
          }
        }
      }
    }
  }
});

// 새로운 토큰 타입에 대한 렌더러 추가
markdown.renderer.rules.citation_link_open = function(tokens, idx) {
  const token = tokens[idx];
  return `<a href="#" class="${token.attrGet('class')}" data-citation-index="${token.attrGet('data-citation-index')}">`;
};

markdown.renderer.rules.citation_link_close = function() {
  return '</a>';
};

// Add custom renderer for strong tags to handle theme colors
markdown.renderer.rules.strong_open = () => '<strong class="text-white">';
markdown.renderer.rules.strong_close = () => "</strong>";
markdown.renderer.rules.link_open = (tokens, idx) => {
  const token = tokens[idx];
  const href = token.attrs.find((attr) => attr[0] === "href");
  return `<a href="${href[1]}" target="_blank" rel="noopener noreferrer">`;
};

// Custom renderer for responsive images rendered in markdown
markdown.renderer.rules.image = function (tokens, idx) {
  const token = tokens[idx];
  const srcIndex = token.attrIndex("src");
  const src = token.attrs[srcIndex][1];
  const alt = token.content || "";

  return `<div class="w-full max-w-[800px]"><img src="${src}" alt="${alt}" class="w-full h-auto" /></div>`;
};

markdown.use(markdownItKatexPlugin);

export default function renderMarkdown(text = "") {
  return markdown.render(text);
}
