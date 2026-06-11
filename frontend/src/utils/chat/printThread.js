import renderMarkdown from "@/utils/chat/markdown";
import DOMPurify from "@/utils/chat/purify";
import AnythingLLMLogo from "@/media/logo/anything-llm-dark.png";
import {
  THOUGHT_REGEX_COMPLETE,
  THOUGHT_REGEX_OPEN,
  THOUGHT_REGEX_CLOSE,
} from "@/components/WorkspaceChat/ChatContainer/ChatHistory/ThoughtContainer";

// Message types that are transient UI artifacts (thought bubbles, agent status,
// approval prompts, route notices) and should never appear in an export.
const EXCLUDED_TYPES = new Set([
  "statusResponse",
  "abort",
  "modelRouteNotification",
  "toolApprovalRequest",
  "clarifyingQuestion",
]);

function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Strip characters browsers mangle in download filenames so the suggested
// PDF name stays clean and readable.
function fileSafe(str = "") {
  return str
    .replace(/[\\/:*?"<>|]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Build a readable PDF filename, e.g.
// "AnythingLLM Export - my thread (My Workspace) - 2026-06-10 5.38 PM".
function buildDocTitle({ workspaceName, threadName, date }) {
  const workspace = fileSafe(workspaceName) || "Workspace";
  const thread = fileSafe(threadName);
  const subject = thread ? `${thread} (${workspace})` : workspace;
  return `AnythingLLM Export - ${subject} - ${date}`;
}

// Strip the assistant's thought chain so the export only contains the response.
function stripThoughtChain(message = "") {
  return message
    .replace(THOUGHT_REGEX_COMPLETE, "")
    .replace(THOUGHT_REGEX_OPEN, "")
    .replace(THOUGHT_REGEX_CLOSE, "")
    .trim();
}

// Only export real user/assistant turns with text content - skip pending
// replies, status/agent notices, and rich-object messages (charts, file cards).
function printableMessages(history = []) {
  return history.filter(
    (msg) =>
      !msg.pending &&
      (msg.role === "user" || msg.role === "assistant") &&
      typeof msg.content === "string" &&
      msg.content.trim().length > 0 &&
      !EXCLUDED_TYPES.has(msg.type)
  );
}

// Render image attachments (stored as data-URL strings) so uploaded images
// appear in the export, mirroring the in-app ChatAttachments component.
function attachmentsToHtml(attachments = []) {
  const images = attachments.filter((a) =>
    a?.contentString?.startsWith("data:image")
  );
  if (images.length === 0) return "";
  return `<div class="attachments">${images
    .map(
      (a) =>
        `<img src="${a.contentString}" alt="${escapeHtml(a.name || "attachment")}" />`
    )
    .join("")}</div>`;
}

function messageToHtml(msg) {
  const isUser = msg.role === "user";
  const label = isUser ? "You" : "Assistant";
  const content = isUser ? msg.content : stripThoughtChain(msg.content);
  const body = DOMPurify.sanitize(renderMarkdown(content));
  return `<div class="message ${msg.role}">
    <div class="role">${label}</div>
    <div class="content">${body}</div>
    ${attachmentsToHtml(msg.attachments)}
  </div>`;
}

// Print colors are forced (print-color-adjust) so accents survive even when the
// browser's "Background graphics" option is off. Layout avoids fill-based
// styling so it reads correctly regardless of that setting.
const PRINT_STYLES = `
  /* margin:0 removes the browser's auto-generated header/footer (date, url,
     page numbers). Page margins are reinstated by the thead/tfoot spacers in
     the layout table, which reserve top/bottom space on every page, plus the
     body's horizontal padding. */
  @page { margin: 0; }
  *{ box-sizing: border-box; }
  html, body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; margin: 0; padding: 0 14mm; font-size: 14px; }
  .layout { width: 100%; border-collapse: collapse; }
  .layout > thead .space-top { height: 9mm; }
  .layout > tfoot .space-bottom { height: 10mm; }
  .doc-header { display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #e2e8f0; padding-bottom: 16px; margin-bottom: 28px; }
  .doc-header .logo { height: 26px; width: auto; }
  .doc-header .meta { display: inline-grid; grid-template-columns: auto auto; column-gap: 8px; row-gap: 3px; }
  .doc-header .meta .label { font-size: 13px; font-weight: 600; color: #0f172a; text-align: right; }
  .doc-header .meta .value { font-size: 13px; color: #1e293b; text-align: left; }
  .doc-header .meta .date { grid-column: 2 / 3; font-size: 12px; color: #64748b; text-align: left; margin-top: 4px; }
  .attachments { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px; }
  .attachments img { max-width: 220px; max-height: 220px; border-radius: 8px; border: 1px solid #e2e8f0; }
  .message { padding-left: 16px; border-left: 3px solid #e2e8f0; margin-bottom: 22px; }
  .message.user { border-left-color: #0ba5ec; }
  .message .role { font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; break-after: avoid; page-break-after: avoid; }
  .message.user .role { color: #0284c7; }
  .message.assistant .role { color: #64748b; }
  .content { color: #1e293b; }
  .content p { margin: 0 0 8px; orphans: 2; widows: 2; }
  .content p:last-child { margin-bottom: 0; }
  .content code { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }
  /* The app wraps fenced code in a .hljs div, which markdown-it then nests
     inside its own <pre><code>. Strip all that <pre> chrome so only the .hljs
     div renders as the code box (otherwise the outer pre prints as an empty
     box). The box flows directly after preceding text and breaks across pages
     naturally rather than jumping to a new page. */
  .content pre { background: none; border: none; padding: 0; margin: 0; white-space: pre-wrap; word-break: break-word; font-size: 13px; }
  .content pre:has(.hljs) { white-space: normal; }
  .content .hljs { display: block; margin: 0 0 8px; padding: 12px; max-width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; }
  .content .hljs > div { display: none; }
  .content table { border-collapse: collapse; width: 100%; }
  .content tr { page-break-inside: avoid; }
  .content th, .content td { border: 1px solid #e2e8f0; padding: 6px 10px; text-align: left; }
  .content img { max-width: 100%; }
  .content a { color: #0284c7; }
  .doc-footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  button[data-code-snippet] { display: none; }
`;

function buildDocument({
  messages,
  workspaceName,
  threadName,
  date,
  docTitle,
}) {
  const threadRow = threadName
    ? `<span class="label">Thread:</span><span class="value">${escapeHtml(threadName)}</span>`
    : "";
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(docTitle)}</title>
    <style>${PRINT_STYLES}</style>
  </head>
  <body>
    <table class="layout">
      <thead><tr><td class="space-top"></td></tr></thead>
      <tfoot><tr><td class="space-bottom"></td></tr></tfoot>
      <tbody><tr><td>
        <header class="doc-header">
          <img class="logo" src="${AnythingLLMLogo}" alt="AnythingLLM" />
          <div class="meta">
            ${threadRow}
            <span class="label">Workspace:</span><span class="value">${escapeHtml(workspaceName)}</span>
            <div class="date">${escapeHtml(date)}</div>
          </div>
        </header>
        ${messages.map(messageToHtml).join("")}
        <footer class="doc-footer">Exported from AnythingLLM</footer>
      </td></tr></tbody>
    </table>
  </body>
</html>`;
}

/**
 * Renders a clean, branded copy of the chat thread into a hidden iframe and
 * triggers the browser's print dialog (which supports "Save as PDF"). Needs no
 * backend or external dependency.
 * @param {Object} options
 * @param {Object[]} options.history - The chat history to export
 * @param {string} [options.workspaceName] - Workspace name shown in the header
 * @param {string} [options.threadName] - Thread name used as the document title
 * @returns {boolean} false when there is nothing to print
 */
export default function printChatThread({
  history = [],
  workspaceName = "",
  threadName = "",
} = {}) {
  const messages = printableMessages(history);
  if (messages.length === 0) return false;

  const now = new Date();
  const fileStamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${now
    .toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    .replace(/:/g, ".")}`;

  const docTitle = buildDocTitle({
    workspaceName,
    threadName,
    date: fileStamp,
  });
  const html = buildDocument({
    messages,
    workspaceName: workspaceName || "Workspace",
    threadName,
    date: now.toLocaleString(),
    docTitle,
  });

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";

  iframe.onload = () => {
    const frameWindow = iframe.contentWindow;
    // Wait for images (the logo, attachments) to finish loading so they are
    // painted before the print snapshot is taken.
    const pendingImages = Array.from(frameWindow.document.images).filter(
      (img) => !img.complete
    );
    Promise.all(
      pendingImages.map(
        (img) =>
          new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          })
      )
    ).then(() => {
      // The browser names the PDF after the top document's title and ignores
      // the iframe's, so lend it our export title while the dialog is open and
      // restore it afterward. Register afterprint before print() so cleanup
      // runs whether or not print() blocks until the dialog closes.
      const previousTitle = document.title;
      frameWindow.onafterprint = () => {
        document.title = previousTitle;
        iframe.remove();
      };
      document.title = docTitle;
      frameWindow.focus();
      frameWindow.print();
    });
  };

  iframe.srcdoc = html;
  document.body.appendChild(iframe);
  return true;
}
