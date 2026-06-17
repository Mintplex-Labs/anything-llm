/**
 * Build a citation/source object for a document that is injected into an
 * agent's context - namely drag-and-dropped/parsed files and pinned documents.
 *
 * Non-agent chat (see `server/utils/chats/stream.js`) reports these documents
 * as `sources` so they render as citations under a reply. Agent chat injects
 * the same documents into the user message but historically never registered
 * them as citations, so the answer used the document content without surfacing
 * where it came from. This helper produces a citation object in the shape the
 * frontend expects so agent replies can cite injected documents too.
 *
 * @param {{id?: string, title?: string, pageContent?: string, chunkSource?: string, metadata?: {title?: string}}} doc
 * @param {string} fallbackTitle - Title to use when the document has none.
 * @returns {{id: string, title: string, text: string, chunkSource: string, score: null}}
 */
function documentToCitationSource(
  doc = {},
  fallbackTitle = "Uploaded Document"
) {
  const pageContent =
    typeof doc?.pageContent === "string" ? doc.pageContent : "";
  return {
    id: doc?.id || fallbackTitle,
    title: doc?.title || doc?.metadata?.title || fallbackTitle,
    text: pageContent.slice(0, 1_000) + "...continued on in source document...",
    chunkSource: doc?.chunkSource || "",
    score: null,
  };
}

module.exports = { documentToCitationSource };
