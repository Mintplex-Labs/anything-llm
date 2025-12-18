import { USER_PROMPT_INPUT_MAP } from "@/utils/constants";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import debounce from "lodash.debounce";
import { safeJsonParse } from "@/utils/request";

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
    const serializedPromptInputMap =
      localStorage.getItem(USER_PROMPT_INPUT_MAP) || "{}";

    const promptInputMap = safeJsonParse(serializedPromptInputMap, {});

    const userPromptInputValue = promptInputMap[threadSlug ?? workspaceSlug];
    if (userPromptInputValue) {
      setPromptInput(userPromptInputValue);
      // Notify parent component so message state is synchronized
      onChange({ target: { value: userPromptInputValue } });
    }
  }, []);

  const debouncedWriteToStorage = useMemo(
    () =>
      debounce((value, slug) => {
        const serializedPromptInputMap =
          localStorage.getItem(USER_PROMPT_INPUT_MAP) || "{}";
        const promptInputMap = safeJsonParse(serializedPromptInputMap, {});
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

    return () => {
      debouncedWriteToStorage.cancel();
    };
  }, [promptInput, threadSlug, workspaceSlug, debouncedWriteToStorage]);
}
