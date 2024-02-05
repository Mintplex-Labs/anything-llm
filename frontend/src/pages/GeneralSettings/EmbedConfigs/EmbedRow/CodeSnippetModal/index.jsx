import React, { useState } from "react";
import { CheckCircle, CopySimple, X } from "@phosphor-icons/react";
import showToast from "@/utils/toast";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark-dimmed.min.css";

export default function CodeSnippetModal({ embed, closeModal }) {
  return (
    <div className="relative max-w-2xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">
            Copy your embed code
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            data-modal-hide="staticModal"
          >
            <X className="text-gray-300 text-lg" />
          </button>
        </div>
        <div>
          <div className="p-6 space-y-6 flex h-auto max-h-[80vh] w-full overflow-y-scroll">
            <div className="w-full flex flex-col gap-y-6">
              <ScriptTag embed={embed} />
            </div>
          </div>
          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <button
              onClick={closeModal}
              type="button"
              className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
            >
              Close
            </button>
            <div hidden={true} />
          </div>
        </div>
      </div>
    </div>
  );
}

function createScriptTagSnippet(embed, scriptHost, serverHost) {
  return `<!-- 
Paste this script at the bottom of your HTML before the </body> tag.
See more style and config options on our docs
https://github.com/Mintplex-Labs/anything-llm/tree/master/embed/README.md
-->
<script 
  data-embed-id="${embed.uuid}" 
  data-base-api-url="${serverHost}/api/embed"
  src="${scriptHost}/embed/anythingllm-chat-widget.min.js">
</script>
<!-- AnythingLLM (https://useanything.com) -->
`;
}

const ScriptTag = ({ embed }) => {
  const [copied, setCopied] = useState(false);
  const scriptHost = import.meta.env.DEV
    ? "http://localhost:3000"
    : window.location.origin;
  const serverHost = import.meta.env.DEV
    ? "http://localhost:3001"
    : window.location.origin;
  const snippet = createScriptTagSnippet(embed, scriptHost, serverHost);

  const handleClick = () => {
    window.navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2500);
    showToast("Snippet copied to clipboard!", "success", { clear: true });
  };

  return (
    <div>
      <div className="flex flex-col mb-2">
        <label className="block text-sm font-medium text-white">
          HTML Script Tag Embed Code
        </label>
        <p className="text-slate-300 text-xs">
          Have your workspace chat embed function like a help desk chat bottom
          in the corner of your website.
        </p>
        <a
          href="https://github.com/Mintplex-Labs/anything-llm/tree/master/embed/README.md"
          target="_blank"
          className="text-blue-300 hover:underline"
        >
          View all style and configuration options &rarr;
        </a>
      </div>
      <button
        disabled={copied}
        onClick={handleClick}
        className="disabled:border disabled:border-green-300 border border-transparent relative w-full font-mono flex bg-zinc-900 text-white placeholder-white placeholder-opacity-60 text-sm rounded-lg focus:border-white p-2.5"
      >
        <div
          className="flex w-full text-left flex-col gap-y-1 pr-6 pl-4 whitespace-pre-line"
          dangerouslySetInnerHTML={{
            __html: hljs.highlight(snippet, {
              language: "html",
              ignoreIllegals: true,
            }).value,
          }}
        />
        {copied ? (
          <CheckCircle
            size={14}
            className="text-green-300 absolute top-2 right-2"
          />
        ) : (
          <CopySimple size={14} className="absolute top-2 right-2" />
        )}
      </button>
    </div>
  );
};
