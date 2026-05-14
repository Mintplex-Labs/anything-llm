let codeSnippetDelegatorRegistered = false;

function getCodeSnippetText(target) {
  if (!target) return null;
  const container = target.closest(".hljs");
  const text = container?.querySelector("pre:first-of-type")?.innerText;
  return text || null;
}

async function writeClipboardText(text) {
  if (!text) return false;
  if (typeof window === "undefined") return false;
  if (!window.navigator?.clipboard?.writeText) return false;
  await window.navigator.clipboard.writeText(text);
  return true;
}

export async function copyCodeSnippet(uuid) {
  if (typeof document === "undefined") return false;
  const target = document.querySelector(`[data-code="${uuid}"]`);
  const markdown = getCodeSnippetText(target);
  if (!target || !markdown) {
    console.warn(`Unable to find code snippet for ${uuid}.`);
    return false;
  }
  if (target.disabled) return false;

  const originalText = target.innerHTML;
  try {
    const copied = await writeClipboardText(markdown);
    if (!copied) return false;

    target.classList.add("text-green-500");
    target.innerText = "Copied!";
    target.setAttribute("disabled", true);

    setTimeout(() => {
      target.classList.remove("text-green-500");
      target.innerHTML = originalText;
      target.removeAttribute("disabled");
    }, 2500);
    return true;
  } catch (error) {
    console.error("Failed to copy code snippet:", error);
    return false;
  }
}

export function setEventDelegatorForCodeSnippets() {
  if (typeof document === "undefined" || codeSnippetDelegatorRegistered) {
    return;
  }
  codeSnippetDelegatorRegistered = true;

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-code-snippet]");
    const uuidCode = target?.dataset?.code;
    if (!uuidCode) return;
    copyCodeSnippet(uuidCode);
  });
}
