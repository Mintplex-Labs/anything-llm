import React, { useState } from "react";
import { CheckCircle, CopySimple } from "@phosphor-icons/react";
import showToast from "@/utils/toast";
import hljs from "highlight.js";
import "@/utils/chat/themes/github-dark.css";
import "@/utils/chat/themes/github.css";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalSecondaryButton,
  ModalLabel,
  ModalHint,
} from "@/components/lib/Modal";

export default function CodeSnippetModal({ embed, closeModal }) {
  return (
    <div className="flex flex-col gap-y-5">
      <ModalHeader title="Copy your embed code" onClose={closeModal} />
      <ModalBody className="max-h-[60vh] overflow-y-auto">
        <ScriptTag embed={embed} />
      </ModalBody>
      <ModalFooter className="justify-end">
        <ModalSecondaryButton onClick={closeModal} type="button">
          Close
        </ModalSecondaryButton>
      </ModalFooter>
    </div>
  );
}

function createScriptTagSnippet(embed, scriptHost, serverHost) {
  return `<!--
Paste this script at the bottom of your HTML before the </body> tag.
See more style and config options on our docs
https://github.com/Mintplex-Labs/anythingllm-embed/blob/main/README.md
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
        <ModalLabel>HTML Script Tag Embed Code</ModalLabel>
        <ModalHint>
          Have your workspace chat embed function like a help desk chat bottom
          in the corner of your website.
        </ModalHint>
        <a
          href="https://github.com/Mintplex-Labs/anythingllm-embed/blob/main/README.md"
          target="_blank"
          rel="noreferrer"
          className="text-blue-300 light:text-blue-500 hover:underline"
        >
          View all style and configuration options &rarr;
        </a>
      </div>
      <button
        disabled={copied}
        onClick={handleClick}
        className={`border-none disabled:border disabled:border-green-300 disabled:light:border-green-600 border border-transparent relative w-full font-mono flex hljs ${theme} light:border light:border-gray-700 text-white placeholder:text-zinc-400 text-sm rounded-lg focus:border-sky-500 outline-none p-2.5 m-1`}
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
