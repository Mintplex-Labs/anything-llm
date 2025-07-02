import { Tooltip } from "react-tooltip";
import { createPortal } from "react-dom";

/**
 * Set the tooltips for the chat container in bulk.
 * Why do this?
 *
 * React-tooltip rendering on _each_ chat will attach an event listener to the body.
 * This will add up if we have many chats open resulting in the browser crashing
 * so we batch them together in a single component that renders at the top most level with
 * a static id the content can change, but this prevents the React-tooltip library from adding
 * hundreds of event listeners to the DOM.
 *
 * In general, anywhere we have iterative rendering the Tooltip should be rendered at the highest level to prevent
 * hundreds of event listeners from being added to the DOM in the worst case scenario.
 * @returns
 */
export function ChatTooltips() {
  return (
    <>
      <Tooltip
        id="message-to-speech"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
      <Tooltip
        id="regenerate-assistant-text"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
      <Tooltip
        id="copy-assistant-text"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
      <Tooltip
        id="feedback-button"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
      <Tooltip
        id="action-menu"
        place="top"
        delayShow={300}
        className="tooltip !text-xs"
      />
      <Tooltip
        id="edit-input-text"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
      <Tooltip
        id="metrics-visibility"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
      <Tooltip
        id="expand-cot"
        place="bottom"
        delayShow={300}
        className="tooltip !text-xs"
      />
      <Tooltip
        id="cot-thinking"
        place="bottom"
        delayShow={500}
        className="tooltip !text-xs"
      />
      <Tooltip
        id="query-refusal-info"
        place="top"
        delayShow={500}
        className="tooltip !text-xs max-w-[350px]"
      />
      <DocumentLevelTooltip />
    </>
  );
}

/**
 * This is a document level tooltip that is rendered at the top most level of the document
 * to ensure it is rendered above the chat history and other elements. Anytime we have tooltips
 * in modals the z-indexing can be recalculated and we need to ensure it is rendered at the top most level
 * so it positions correctly.
 */
function DocumentLevelTooltip() {
  return createPortal(
    <>
      <Tooltip
        id="similarity-score"
        place="top"
        delayShow={100}
        // z-[100] to ensure it renders above the chat history
        // as the citation modal is z-indexed above the chat history
        className="tooltip !text-xs z-[100]"
      />
    </>,
    document.body
  );
}
