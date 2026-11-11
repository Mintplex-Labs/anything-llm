const { v4 } = require("uuid");
const { createPreviewer } = require("./render.js");
const { slideThumbnail } = require("./thumbnail.js");

/**
 * Streams images of a deck's slides to the chat UI while the deck is built,
 * as "pptxSlidePreview" events on the agent socket. Each image is drawn by
 * the same renderer as the file (see createPreviewer) and baked into a JPEG
 * (see slideThumbnail), so what the user watches is what they download.
 * Previews are never stored: a reload shows only the finished file. A
 * preview that fails is logged and the rest are skipped; it never stops the
 * deck.
 * @param {import("../../../index.js")} aibitat - The agent that owns the tool call
 * @param {{title: string, subtitle: string}} deck
 * @param {object} theme - From getTheme
 * @returns {{add: (slide: import("./slides.js").Slide|null) => void, end: () => void}}
 *   add takes null for the cover; end marks the deck finished or stopped.
 */
function slidePreviews(aibitat, deck, theme) {
  const deckId = v4();
  const preview = createPreviewer(deck, theme);
  const log = (message) =>
    aibitat.handlerProps?.log?.(`[DeckPreview] ${message}`);
  let index = 0;
  let sent = 0;
  let broken = false;
  const send = (content) => {
    try {
      aibitat.socket?.send("pptxSlidePreview", { deckId, ...content });
      return true;
    } catch (error) {
      log(error.message);
      return false;
    }
  };
  return {
    add(slide) {
      const position = index++;
      if (broken) return;
      try {
        const image = slideThumbnail(preview(slide));
        if (send({ index: position, image })) sent++;
      } catch (error) {
        // Most likely canvas is unavailable here; later slides would fail
        // the same way.
        broken = true;
        log(`Previews disabled: ${error.stack || error.message}`);
      }
    },
    end() {
      // The chat only has a card to close once a slide was sent.
      if (sent) send({ done: true });
    },
  };
}

module.exports = { slidePreviews };
