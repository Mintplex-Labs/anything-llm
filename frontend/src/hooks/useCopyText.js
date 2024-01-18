import { useState } from "react";

export default function useCopyText(delay = 2500) {
  const [copied, setCopied] = useState(false);
  const copyText = async (content) => {
    if (!content) return;
    navigator?.clipboard?.writeText(content);
    setCopied(content);
    setTimeout(() => {
      setCopied(false);
    }, delay);
  };

  return { copyText, copied };
}
