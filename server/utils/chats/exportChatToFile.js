const moment = require("moment");
const {
  applyBranding,
} = require("../agents/aibitat/plugins/create-files/pdf/utils.js");
const { convertToChatHistory } = require("../helpers/chat/responses.js");

const THOUGHT_TAGS = "thinking|think|thought|thought_chain";
const validExportTypes = ["pdf", "markdown", "plaintext", "json", "html"];

// Extract thought chain content from assistant messages.
function extractThoughtChain(text = "") {
  const matches = [];
  const regex = new RegExp(
    `<(${THOUGHT_TAGS})[^>]*>([\\s\\S]*?)</(${THOUGHT_TAGS})\\s*>`,
    "gi"
  );
  let m;
  while ((m = regex.exec(text)) !== null) matches.push(m[2].trim());
  return matches.join("\n\n") || null;
}

// Strip the assistant's thought chain so the export only contains the response.
function stripThoughtChain(text = "") {
  return text
    .replace(
      new RegExp(
        `<(${THOUGHT_TAGS})[^>]*>[\\s\\S]*?</(${THOUGHT_TAGS})\\s*>`,
        "gi"
      ),
      ""
    )
    .replace(new RegExp(`</?(${THOUGHT_TAGS}|response|answer)[^>]*>`, "gi"), "")
    .trim();
}

// Render uploaded image attachments as markdown images so they appear in the PDF.
function imagesToMarkdown(attachments = []) {
  return attachments
    .filter((a) => a?.contentString?.startsWith("data:image"))
    .map((a) => `![${a.name || "attachment"}](${a.contentString})`)
    .join("\n\n");
}

// Build a clean markdown document from a converted chat history.
function chatHistoryToMarkdown(history = [], { workspaceName, threadName }) {
  const lines = [`**Workspace:** ${workspaceName}  `];
  if (threadName) lines.push(`**Thread:** ${threadName}  `);
  lines.push(`**Exported:** ${moment().format("MMMM D, YYYY h:mm A")}`, "");

  for (const msg of history) {
    if (msg.role !== "user" && msg.role !== "assistant") continue;
    const content =
      msg.role === "assistant"
        ? stripThoughtChain(msg.content)
        : (msg.content || "").trim();
    const images = imagesToMarkdown(msg.attachments);
    if (!content && !images) continue;

    lines.push(
      "---",
      "",
      `**${msg.role === "user" ? "You" : "Assistant"}**`,
      ""
    );
    if (content) lines.push(content, "");
    if (images) lines.push(images, "");
  }

  return lines.join("\n");
}

function chatHistoryToPlainText(history = [], { workspaceName, threadName }) {
  const lines = [`Workspace: ${workspaceName}`];
  if (threadName) lines.push(`Thread: ${threadName}`);
  lines.push(`Exported: ${moment().format("MMMM D, YYYY h:mm A")}`, "");

  for (const msg of history) {
    if (msg.role !== "user" && msg.role !== "assistant") continue;
    const content =
      msg.role === "assistant"
        ? stripThoughtChain(msg.content)
        : (msg.content || "").trim();
    if (!content) continue;

    const label = msg.role === "user" ? "You" : "Assistant";
    lines.push("─".repeat(60), "", `[${label}]`, "", content, "");
  }

  return lines.join("\n");
}

function chatHistoryToJSON(history = [], { workspaceName, threadName }) {
  const messages = [];
  for (const msg of history) {
    if (msg.role !== "user" && msg.role !== "assistant") continue;
    const content =
      msg.role === "assistant"
        ? stripThoughtChain(msg.content)
        : (msg.content || "").trim();
    if (!content) continue;
    const entry = { role: msg.role, content };
    if (msg.role === "assistant") {
      const reasoning = extractThoughtChain(msg.content || "");
      if (reasoning) entry.reasoning = reasoning;
    }
    messages.push(entry);
  }

  return JSON.stringify(
    {
      workspace: workspaceName,
      thread: threadName || null,
      exported: moment().toISOString(),
      messages,
    },
    null,
    2
  );
}

function chatHistoryToHTML(history = [], { workspaceName, threadName }) {
  const rawTitle = threadName
    ? `${workspaceName} — ${threadName}`
    : workspaceName;
  const exported = moment().format("MMMM D, YYYY h:mm A");

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/\n/g, "<br/>");
  }

  const title = escapeHtml(rawTitle);
  const msgs = [];
  for (const msg of history) {
    if (msg.role !== "user" && msg.role !== "assistant") continue;
    const rawContent = (msg.content || "").trim();
    const content =
      msg.role === "assistant" ? stripThoughtChain(rawContent) : rawContent;
    const reasoning =
      msg.role === "assistant" ? extractThoughtChain(rawContent) : null;
    const images = (msg.attachments || [])
      .filter((a) => a?.contentString?.startsWith("data:image"))
      .map(
        (a) =>
          `<img src="${a.contentString}" alt="${escapeHtml(a.name || "attachment")}" class="max-w-full rounded-lg mt-2" />`
      )
      .join("\n");
    if (!content && !images && !reasoning) continue;

    const escapedContent = content ? escapeHtml(content) : "";

    const reasoningBlock = reasoning
      ? `<details class="mt-2 mb-1">
            <summary class="text-xs cursor-pointer text-zinc-400 hover:text-zinc-300 select-none">Show reasoning</summary>
            <div class="mt-1 p-3 rounded-lg bg-zinc-800/50 border border-zinc-600 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">${escapeHtml(reasoning)}</div>
          </details>`
      : "";

    const isUser = msg.role === "user";
    msgs.push(`
      <div class="flex ${isUser ? "justify-end" : "justify-start"} mb-4">
        <div class="${isUser ? "bg-blue-600 text-white" : "bg-zinc-700 text-zinc-100"} rounded-2xl px-5 py-3 max-w-[75%] shadow-md">
          <div class="text-xs font-semibold mb-1 ${isUser ? "text-blue-200" : "text-zinc-400"}">${isUser ? "You" : "Assistant"}</div>
          ${reasoningBlock}
          <div class="text-sm leading-relaxed whitespace-pre-wrap">${escapedContent}</div>
          ${images}
        </div>
      </div>`);
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Chat Export</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-zinc-900 text-zinc-100 min-h-screen">
  <div class="max-w-3xl mx-auto py-10 px-4">
    <header class="mb-8 border-b border-zinc-700 pb-4">
      <h1 class="text-2xl font-bold text-white">${title}</h1>
      <p class="text-sm text-zinc-400 mt-1">Exported ${exported}</p>
    </header>
    <div class="flex flex-col">
      ${msgs.join("\n")}
    </div>
    <footer class="mt-10 pt-4 border-t border-zinc-700 text-center text-xs text-zinc-500">
      Exported from AnythingLLM
    </footer>
  </div>
</body>
</html>`;
}

/**
 * Convert a chat history into a branded PDF buffer.
 * Reuses the same markdown -> PDF pipeline as the create-pdf-file agent skill so
 * it works identically across browser and desktop builds.
 * @param {Object[]} history - Output of convertToChatHistory
 * @param {{workspaceName: string, threadName?: string|null}} meta
 * @returns {Promise<Buffer>}
 */
async function chatHistoryToPDF(history = [], meta = {}) {
  const markdown = chatHistoryToMarkdown(history, meta);
  const { markdownToPdf } = await import("@mintplex-labs/mdpdf");
  const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");

  const pdfDoc = await PDFDocument.load(await markdownToPdf(markdown));
  await applyBranding(pdfDoc, { rgb, StandardFonts });

  return Buffer.from(await pdfDoc.save());
}

/**
 * Generate the chat-history PDF and write it as the response body. The frontend
 * reads it as a blob and names the download itself.
 * @param {import("express").Response} response
 * @param {Object[]} chats - Raw workspace_chats records
 * @param {{workspaceName: string, threadName?: string|null}} meta
 */
async function sendChatHistoryFile(response, chats, meta, type = "pdf") {
  switch (type) {
    case "pdf": {
      const buffer = await chatHistoryToPDF(convertToChatHistory(chats), meta);
      response.setHeader("Content-Type", "application/pdf");
      return response.send(buffer);
    }
    case "markdown": {
      const md = chatHistoryToMarkdown(convertToChatHistory(chats), meta);
      response.setHeader("Content-Type", "text/markdown");
      return response.send(Buffer.from(md, "utf-8"));
    }
    case "plaintext": {
      const txt = chatHistoryToPlainText(convertToChatHistory(chats), meta);
      response.setHeader("Content-Type", "text/plain");
      return response.send(Buffer.from(txt, "utf-8"));
    }
    case "json": {
      const json = chatHistoryToJSON(convertToChatHistory(chats), meta);
      response.setHeader("Content-Type", "application/json");
      return response.send(Buffer.from(json, "utf-8"));
    }
    case "html": {
      const html = chatHistoryToHTML(convertToChatHistory(chats), meta);
      response.setHeader("Content-Type", "text/html");
      return response.send(Buffer.from(html, "utf-8"));
    }
    default:
      throw new Error(`Unsupported export type: ${type}`);
  }
}

module.exports = { sendChatHistoryFile, validExportTypes };
