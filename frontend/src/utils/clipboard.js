import renderMarkdown from "./chat/markdown";

/**
 * Copies the given markdown string as rich text to the clipboard.
 * @param {string} markdownString - The markdown string to copy.
 * @returns {Promise<void>}
 */
export async function copyMarkdownAsRichText(markdownString) {
  try {
    const htmlContent = renderMarkdown(markdownString);
    const blobHTML = new Blob([htmlContent], { type: "text/html" });
    const blobText = new Blob([markdownString], { type: "text/plain" });

    const data = [
      new ClipboardItem({
        "text/html": blobHTML,
        "text/plain": blobText,
      }),
    ];

    await navigator.clipboard.write(data);
  } catch (error) {
    console.error("Failed to copy markdown as rich text: ", error);
  }
}
