const { v4 } = require("uuid");
const { createPreviewer } = require("./render.js");

/**
 * Streams thumbnails of a deck's slides to the chat UI while the deck is
 * built, as "pptxSlidePreview" events on the agent socket. Each event holds
 * one slide drawn by the same renderer as the file (see createPreviewer), so
 * what the user watches is what they download. Previews are never stored: a
 * reload shows only the finished file. A preview that fails is logged and
 * skipped; it never stops the deck.
 * @param {import("../../../index.js")} aibitat - The agent that owns the tool call
 * @param {{title: string, subtitle: string}} deck
 * @param {object} theme - From getTheme
 * @returns {{add: (slide: import("./slides.js").Slide|null) => void, end: () => void}}
 *   add takes null for the cover; end marks the deck finished or stopped.
 */
function slidePreviews(aibitat, deck, theme) {
  const deckId = v4();
  const preview = createPreviewer(deck, theme);
  let index = 0;
  const send = (content) => {
    try {
      aibitat.socket?.send("pptxSlidePreview", { deckId, ...content });
    } catch (error) {
      aibitat.handlerProps?.log?.(`[DeckPreview] ${error.message}`);
    }
  };
  return {
    add(slide) {
      try {
        send({ index: index++, slide: preview(slide) });
      } catch (error) {
        aibitat.handlerProps?.log?.(`[DeckPreview] ${error.message}`);
      }
    },
    end() {
      send({ done: true });
    },
  };
}

module.exports = { slidePreviews };
