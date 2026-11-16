const { v4 } = require("uuid");
const { createPreviewer } = require("./render.js");
const { slideThumbnail } = require("./thumbnail.js");

/**
 * Streams images of a deck's slides to the chat UI while the deck is built,
 * as "pptxSlidePreview" events on the agent socket. Each image is drawn by
 * the same renderer as the file (see createPreviewer) and baked into a JPEG
 * (see slideThumbnail), so what the user watches is what they download.
 * Images are baked one at a time in deck order without holding up the
 * deck; a slide whose picture is still being generated holds back the
 * slides after it until the picture is ready. Previews are never stored: a
 * reload shows only the finished file. A preview that fails is logged and
 * the rest are skipped; it never stops the deck.
 * @param {import("../../../index.js")} aibitat - The agent that owns the tool call
 * @param {{title: string, subtitle: string, image?: *, credit?: string}} deck - image may be a promise
 * @param {object} theme - From getTheme
 * @returns {{add: (slide: import("./slides.js").Slide|null) => void, end: () => Promise<void>}}
 *   add takes null for the cover; end marks the deck finished or stopped
 *   once every queued image has been sent.
 */
/** A picture that may still be loading, or null if loading failed. */
async function settled(picture) {
  try {
    return (await picture) ?? null;
  } catch {
    return null;
  }
}

function slidePreviews(aibitat, deck, theme) {
  const deckId = v4();
  const preview = createPreviewer(deck, theme);
  const log = (message) =>
    aibitat.handlerProps?.log?.(`[DeckPreview] ${message}`);
  let index = 0;
  let sent = 0;
  let broken = false;
  let queue = Promise.resolve();
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
      // Slides are recorded in the order added, which keeps the previewer's
      // divider count in step with the deck.
      queue = queue.then(async () => {
        if (broken) return;
        try {
          const owner = slide ?? deck;
          if (owner.image) owner.image = await settled(owner.image);
          const image = await slideThumbnail(preview(slide));
          if (send({ index: position, image })) sent++;
        } catch (error) {
          // Later slides would most likely fail the same way.
          broken = true;
          log(`Previews disabled: ${error.stack || error.message}`);
        }
      });
    },
    end() {
      queue = queue.then(() => {
        // The chat only has a card to close once a slide was sent.
        if (sent) send({ done: true });
      });
      return queue;
    },
  };
}

module.exports = { slidePreviews, settled };
