import React, { useState } from "react";
import { CheckCircle, CopySimple, X } from "@phosphor-icons/react";
import showToast from "@/utils/toast";
import hljs from "highlight.js";
import "@/utils/chat/themes/github-dark.css";
import "@/utils/chat/themes/github.css";

export default function CodeSnippetModal({ embed, closeModal }) {
  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Copy your embed code
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div className="px-7 py-6">
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            <ScriptTag embed={embed} />
          </div>
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
            <button
              onClick={closeModal}
              type="button"
              className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
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
<!-- AnythingLLM (https://anythingllm.com) -->
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
  const theme =
    window.localStorage.getItem("theme") === "light" ? "github" : "github-dark";

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
        <p className="text-theme-text-secondary text-xs">
          Have your workspace chat embed function like a help desk chat bottom
          in the corner of your website.
        </p>
        <a
          href="https://github.com/Mintplex-Labs/anything-llm/tree/master/embed/README.md"
          target="_blank"
          className="text-blue-300 light:text-blue-500 hover:underline"
        >
          View all style and configuration options &rarr;
        </a>
      </div>
      <button
        disabled={copied}
        onClick={handleClick}
        className={`disabled:border disabled:border-green-300 disabled:light:border-green-600 border border-transparent relative w-full font-mono flex hljs ${theme} light:border light:border-gray-700 text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none p-2.5`}
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
            className="text-green-300 light:text-green-600 absolute top-2 right-2"
          />
        ) : (
          <CopySimple size={14} className="absolute top-2 right-2" />
        )}
      </button>
    </div>
  );
};
