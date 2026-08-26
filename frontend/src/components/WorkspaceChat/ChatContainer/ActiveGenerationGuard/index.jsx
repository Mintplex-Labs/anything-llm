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
 * @note `useBlocker` constraints - do not lose these as this evolves:
 * - It requires a data router (`createBrowserRouter`/`createHashRouter`) and
 *   will THROW at mount inside a plain `<BrowserRouter>`/`<HashRouter>`. See
 *   main.jsx. The desktop app must use `createHashRouter` for this to work.
 * - React-router supports only ONE active blocker at a time app-wide. This is
 *   currently safe because a single ChatContainer mounts this guard - if
 *   another `useBlocker` is ever added elsewhere (eg: unsaved-form guards),
 *   they will silently conflict when co-mounted.
 * - It only intercepts router-driven navigation (`navigate`/`<Link>`),
 *   including browser back/forward. `window.location.*` navigations and
 *   reloads bypass it entirely - reloads killing generation is accepted
 *   behavior, but new in-app navigation must go through the router.
 * - The `shouldBlock` callback compares pathnames, so same-path query/hash
 *   changes are deliberately not blocked.
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isGenerating - Whether a response is actively generating (mirrors the Send/Stop button state)
 */
export default function ActiveGenerationGuard({ isGenerating = false }) {
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isGenerating && currentLocation.pathname !== nextLocation.pathname
  );

  // The modal stays open even if the response finishes while it is showing -
  // auto-resuming the navigation underneath the user is jarring. They decide
  // via Cancel/Continue either way, so only emit the abort if a response is
  // actually still generating.
  function stopGenerationAndLeave() {
    if (isGenerating) window.dispatchEvent(new CustomEvent(ABORT_STREAM_EVENT));
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
