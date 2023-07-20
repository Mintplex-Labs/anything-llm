import { encode as HTMLEncode } from "he";
import markdownIt from "markdown-it";
const markdown = markdownIt({
  html: true,
  typographer: true,
  highlight: function (str) {
    return `<div class="whitespace-pre-line w-fit rounded-lg bg-black-900 px-4 pt-10 pb-4 relative font-mono font-normal text-sm text-slate-200"><div class="w-full flex items-center absolute top-0 left-0 text-slate-200 bg-stone-800 px-4 py-2 text-xs font-sans justify-between rounded-t-md"><button onclick='window.copySnippet();' class="flex ml-auto gap-2"><svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>Copy code</button></div><pre class='markdown'>${HTMLEncode(
      str
    )}<pre></div>`;
  },
});

window.copySnippet = function () {
  if (!event?.target) return false;

  const target = event?.target;
  const markdown =
    target.parentElement?.parentElement?.querySelector(".markdown")?.innerText;
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
  }, 5000);
};

export default function renderMarkdown(text = "") {
  return markdown.render(text);
}
