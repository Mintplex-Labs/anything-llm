import { useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { ABORT_STREAM_EVENT } from "@/utils/chat";
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalSecondaryButton,
} from "@/components/lib/Modal";

/**
 * Guards against accidentally leaving a chat while a response is actively
 * generating (eg: the Stop button is showing). Internal route changes are
 * intercepted via react-router's `useBlocker` and confirmed through a modal.
 * Closing/refreshing the app entirely is intentionally not guarded - only
 * in-app navigation. All navigation must go through the router (`navigate`/
 * `<Link>`) for this guard to intercept it - `window.location` bypasses it.
 *
 * The guard is non-blocking: the stream keeps flowing in the background while
 * the modal is open. Generation is only aborted if the user confirms leaving.
 *
 * @note `useBlocker` requires a data router (`createBrowserRouter`/
 * `createHashRouter`) - plain `<HashRouter>` will throw. See main.jsx.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isGenerating - Whether a response is actively generating (mirrors the Send/Stop button state)
 */
export default function ActiveGenerationGuard({ isGenerating = false }) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isGenerating && currentLocation.pathname !== nextLocation.pathname
  );

  // If the response finishes while the modal is open there is nothing left
  // to protect - resume the navigation the user already asked for.
  useEffect(() => {
    if (blocker.state === "blocked" && !isGenerating) blocker.proceed();
  }, [blocker, isGenerating]);

  function stopGenerationAndLeave() {
    window.dispatchEvent(new CustomEvent(ABORT_STREAM_EVENT));
    blocker.proceed();
  }

  if (blocker.state !== "blocked") return null;
  return (
    <Modal isOpen={true} onClose={blocker.reset} size="md">
      <ModalHeader title="Stop generating response?" onClose={blocker.reset} />
      <ModalBody>
        <p className="text-sm text-zinc-400 light:text-slate-600">
          You are about to leave this chat, this will stop the model from
          generating the response and it cannot be recovered.
        </p>
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton type="button" onClick={blocker.reset}>
          Cancel
        </ModalSecondaryButton>
        <ModalPrimaryButton type="button" onClick={stopGenerationAndLeave}>
          Continue
        </ModalPrimaryButton>
      </ModalFooter>
    </Modal>
  );
}
