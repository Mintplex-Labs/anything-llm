const moment = require("moment");
const {
  applyBranding,
} = require("../agents/aibitat/plugins/create-files/pdf/utils.js");
const { convertToChatHistory } = require("../helpers/chat/responses");

const THOUGHT_TAGS = "thinking|think|thought|thought_chain";

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
async function sendChatHistoryPDF(response, chats, meta) {
  const buffer = await chatHistoryToPDF(convertToChatHistory(chats), meta);
  response.setHeader("Content-Type", "application/pdf");
  return response.send(buffer);
}

module.exports = { sendChatHistoryPDF };
