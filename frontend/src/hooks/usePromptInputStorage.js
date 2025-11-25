import { USER_PROMPT_INPUT_MAP } from "@/utils/constants";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import debounce from "lodash.debounce";

/**
 * Synchronizes prompt input value with localStorage, scoped to the current thread.
 *
 * Persists unsent prompt text across page refreshes and navigation. Each thread/workspace maintains
 * its own draft state independently. Storage key is determined by thread slug (if in a thread) or
 * workspace slug (if in default chat).
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
 * @param {Function} props.onChange - Callback invoked when restoring saved value, receives `{ target: { value: string } }`
 * @param {string} props.promptInput - Current prompt input value to sync
 * @param {Function} props.setPromptInput - State setter function for prompt input
 * @returns {void}
 */
export default function usePromptInputStorage({
  onChange,
  promptInput,
  setPromptInput,
}) {
  const { threadSlug = null, slug: workspaceSlug } = useParams();
  useEffect(() => {
    // Get the user prompt input map from localStorage
    let promptInputMap = localStorage.getItem(USER_PROMPT_INPUT_MAP);

    // Attempt to deserialize the prompt input map
    try {
      promptInputMap = promptInputMap ? JSON.parse(promptInputMap) : {};
    } catch (error) {
      promptInputMap = {};
    }

    // If there is a thread slug, use it, otherwise the user is probably in the default thread and use the workspace slug
    const userPromptInputValue = promptInputMap[threadSlug ?? workspaceSlug];
    if (userPromptInputValue) {
      setPromptInput(userPromptInputValue);
      // Notify parent component so message state is synchronized
      onChange({ target: { value: userPromptInputValue } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set the user prompt input map to localStorage (debounced by 300ms)
  const debouncedWriteToStorage = useMemo(
    () =>
      debounce((value, slug) => {
        let promptInputMap = localStorage.getItem(USER_PROMPT_INPUT_MAP);

        // Attempt to deserialize the prompt input map
        try {
          promptInputMap = promptInputMap ? JSON.parse(promptInputMap) : {};
        } catch (error) {
          promptInputMap = {};
        }

        // Set the user prompt input value to the prompt input map by the thread slug or workspace slug (if in the default thread)
        promptInputMap[slug] = value;
        localStorage.setItem(
          USER_PROMPT_INPUT_MAP,
          JSON.stringify(promptInputMap)
        );
      }, 500),
    []
  );

  useEffect(() => {
    debouncedWriteToStorage(promptInput, threadSlug ?? workspaceSlug);

    // Cleanup: cancel pending debounced calls on unmount or when dependencies change
    return () => {
      debouncedWriteToStorage.cancel();
    };
  }, [promptInput, threadSlug, workspaceSlug, debouncedWriteToStorage]);
}
