import { USER_PROMPT_INPUT_MAP } from "@/utils/constants";
import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import debounce from "lodash.debounce";
import { safeJsonParse } from "@/utils/request";

/**
 * Fired by clearPromptInputDraft so any mounted hook instance can cancel a
 * still-pending debounced write that would otherwise resurrect the draft
 * right after it was cleared (eg: submitting within the debounce window).
 */
export const PROMPT_DRAFT_CLEARED_EVENT = "prompt_draft_cleared";

function readPromptInputMap() {
  return safeJsonParse(localStorage.getItem(USER_PROMPT_INPUT_MAP) || "{}", {});
}

function writePromptInputMap(map) {
  // Empty drafts are dropped entirely (incl. legacy "" entries) - a missing
  // key already means "no draft", so storing empties is just waste.
  for (const key of Object.keys(map)) if (!map[key]) delete map[key];
  localStorage.setItem(USER_PROMPT_INPUT_MAP, JSON.stringify(map));
}

/**
 * Immediately clears the stored draft for a given thread/workspace key.
 * Used before state updates that may remount PromptInput to prevent
 * stale text from being restored.
 * @param {string} storageKey - thread slug or workspace slug
 */
export function clearPromptInputDraft(storageKey) {
  try {
    const map = readPromptInputMap();
    delete map[storageKey];
    writePromptInputMap(map);
    window.dispatchEvent(
      new CustomEvent(PROMPT_DRAFT_CLEARED_EVENT, { detail: { storageKey } })
    );
  } catch {}
}

/**
 * Synchronizes prompt input value with localStorage, scoped to the current thread.
 *
 * Persists unsent prompt text across page refreshes and navigation. Each thread/workspace maintains
 * its own draft state independently, so the input is re-hydrated (or emptied) whenever the
 * thread/workspace changes. Storage key is determined by thread slug (if in a thread) or
 * workspace slug (if in default chat) - passed as props on routes without params (eg: Home page)
 * with the route params as fallback.
 *
 * Storage format (stored under USER_PROMPT_INPUT_MAP key):
 * ```json
 * {
 *   "thread-slug": "user's draft message...",
 *   "workspace-slug": "another draft message..."
 * }
 * ```
 *
 * @param {Object} props
 * @param {string} props.promptInput - Current prompt input value to sync
 * @param {Function} props.setPromptInput - State setter function for prompt input
 * @param {string|null} [props.workspaceSlug] - workspace slug when the route has no params
 * @param {string|null} [props.threadSlug] - thread slug when the route has no params
 * @returns {void}
 */
export default function usePromptInputStorage({
  promptInput,
  setPromptInput,
  workspaceSlug = null,
  threadSlug = null,
}) {
  const params = useParams();
  const storageKey =
    threadSlug ?? params.threadSlug ?? workspaceSlug ?? params.slug ?? null;
  const pendingHydration = useRef(true);

  const debouncedWriteToStorage = useMemo(
    () =>
      debounce((value, slug) => {
        const map = readPromptInputMap();
        map[slug] = value;
        writePromptInputMap(map);
      }, 500),
    []
  );

  // Hydrate the input from the stored draft whenever the thread/workspace
  // changes. Always sets (falling back to "") so a draft typed in one thread
  // never carries over into another.
  useEffect(() => {
    if (!storageKey) return;
    pendingHydration.current = true;
    setPromptInput(readPromptInputMap()[storageKey] || "");
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    // Right after a storageKey change, promptInput still holds the previous
    // thread's text for one render - skip persisting it under the new key
    // and wait for the hydrated value to land.
    if (pendingHydration.current) {
      pendingHydration.current = false;
      return;
    }
    debouncedWriteToStorage(promptInput, storageKey);

    return () => {
      // Runs before the next write (persist-as-you-type) and on key change /
      // unmount, so an in-flight draft is committed under its own key.
      debouncedWriteToStorage.flush();
    };
  }, [promptInput, storageKey, debouncedWriteToStorage]);

  // A cleared draft must also drop any pending write for that key, otherwise
  // the debounce/flush can write the old text right back.
  useEffect(() => {
    function cancelPendingWrite(e) {
      if (!e?.detail?.storageKey || e.detail.storageKey === storageKey)
        debouncedWriteToStorage.cancel();
    }
    window.addEventListener(PROMPT_DRAFT_CLEARED_EVENT, cancelPendingWrite);
    return () =>
      window.removeEventListener(
        PROMPT_DRAFT_CLEARED_EVENT,
        cancelPendingWrite
      );
  }, [storageKey, debouncedWriteToStorage]);
}
