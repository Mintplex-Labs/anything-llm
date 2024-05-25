```javascript
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
        className="disabled:border disabled:border-green-300 border border-transparent relative w-full font-mono flex bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:border-white p-2.5"
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

```
Based on the provided TypeScript code, here is a comprehensive documentation in Markdown format:

**Purpose and Usage**
-------------------

The `ScriptTag` interface is used to generate an embed script for integrating AnythingLLM's chat widget into a website. The purpose of this interface is to provide a way to create and customize the chat widget's appearance and functionality.

**Methods**
---------

### createScriptTagSnippet(embed, scriptHost, serverHost)
---------------------------

* **Signature:** `createScriptTagSnippet(embed: { uuid: string }, scriptHost: string, serverHost: string): string`
* **Purpose:** This method generates an HTML script tag snippet for the chat widget.
* **Parameters:**
	+ `embed`: The embed configuration object with a unique UUID.
	+ `scriptHost`: The host URL for the script.
	+ `serverHost`: The host URL for the server.
* **Return Value:** A string representing the generated script tag snippet.

### const ScriptTag = ({ embed }) => { ... }
-------------------------------

* **Signature:** `{ (embed: { uuid: string }) => JSX.Element }`
* **Purpose:** This is a functional component that wraps the `createScriptTagSnippet` method.
* **Parameters:** The `embed` configuration object with a unique UUID.
* **Return Value:** A JSX element representing the chat widget embed.

**Examples**
------------

To use the `ScriptTag` interface, you can create an instance of it and call the `createScriptTagSnippet` method:
```typescript
import { ScriptTag } from './script-tag';

const embed = { uuid: 'my-embed-id' };
const scriptHost = 'http://localhost:3000';
const serverHost = 'http://localhost:3001';

const snippet = ScriptTag({ embed }).createScriptTagSnippet(embed, scriptHost, serverHost);
console.log(snippet); // Output the generated script tag snippet
```
**Dependencies**
----------------

The `ScriptTag` interface relies on the following dependencies:

* The `embed` configuration object with a unique UUID.
* The `scriptHost` and `serverHost` URLs for the script and server, respectively.

**Clarity and Consistency**
-------------------------------

Throughout this documentation, we have used consistent terminology and formatting to ensure clarity and ease of understanding. We have also provided concise examples to illustrate the usage of the interface and its methods.