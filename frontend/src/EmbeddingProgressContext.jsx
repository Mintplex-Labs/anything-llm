import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { API_BASE, AUTH_TOKEN, AUTH_USER } from "@/utils/constants";

const EmbeddingProgressContext = createContext();
const STORAGE_KEY_PREFIX = "anythingllm_embedding_progress";

/**
 * Returns a user-scoped sessionStorage key so that different users
 * on the same browser tab don't see each other's embedding progress.
 * Falls back to the base key in single-user mode.
 */
function storageKey() {
  try {
    const raw = localStorage.getItem(AUTH_USER);
    if (raw) {
      const user = JSON.parse(raw);
      if (user?.id) return `${STORAGE_KEY_PREFIX}_${user.id}`;
    }
  } catch {
    // parse failure — fall through
  }
  return STORAGE_KEY_PREFIX;
}

/**
 * Read persisted progress from sessionStorage.
 * Returns {} if nothing is stored or on parse failure.
 *
 * When `sanitize` is true (used for initial state), slugs with no active work
 * are dropped entirely, and all remaining file statuses are reset to "pending"
 * so the SSE stream provides the real current state after reconnection.
 */
function loadPersistedProgress(sanitize = false) {
  try {
    const raw = sessionStorage.getItem(storageKey());
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!sanitize) return parsed;

    // Only keep slugs that still have active work.
    // Preserve "complete"/"failed" statuses (already confirmed by SSE before
    // the reload). Reset "pending"/"embedding" to "pending" — SSE will
    // provide real current state for those after reconnection.
    const cleaned = {};
    for (const [slug, files] of Object.entries(parsed)) {
      const hasActiveWork = Object.values(files).some(
        (f) => f.status === "pending" || f.status === "embedding"
      );
      if (!hasActiveWork) continue;
      const resetFiles = {};
      for (const [filename, fileStatus] of Object.entries(files)) {
        if (
          fileStatus.status === "complete" ||
          fileStatus.status === "failed"
        ) {
          resetFiles[filename] = fileStatus;
        } else {
          resetFiles[filename] = { status: "pending" };
        }
      }
      cleaned[slug] = resetFiles;
    }
    return cleaned;
  } catch {
    return {};
  }
}

/**
 * Write progress map to sessionStorage.
 * Removes the key entirely when the map is empty.
 */
function persistProgress(map) {
  try {
    if (Object.keys(map).length === 0) {
      sessionStorage.removeItem(storageKey());
    } else {
      sessionStorage.setItem(storageKey(), JSON.stringify(map));
    }
  } catch {
    // storage full or unavailable — non-critical
  }
}

export function useEmbeddingProgress() {
  const ctx = useContext(EmbeddingProgressContext);
  if (!ctx)
    throw new Error(
      "useEmbeddingProgress must be used within EmbeddingProgressProvider"
    );
  return ctx;
}

export function EmbeddingProgressProvider({ children }) {
  const [embeddingProgressMap, setEmbeddingProgressMap] = useState(() =>
    loadPersistedProgress(true)
  );
  const eventSourcesRef = useRef({});
  const cleanupTimeoutsRef = useRef({});

  // Persist to sessionStorage whenever the map changes
  useEffect(() => {
    persistProgress(embeddingProgressMap);
  }, [embeddingProgressMap]);

  /**
   * Open (or reconnect) an SSE EventSource for a given workspace slug.
   * Updates embeddingProgressMap in real time as events arrive.
   */
  const connectSSE = useCallback((slug) => {
    // Don't double-connect
    if (eventSourcesRef.current[slug]) return;

    try {
      const token = window.localStorage.getItem(AUTH_TOKEN);
      const progressUrl = new URL(
        `${API_BASE}/workspace/${slug}/embed-progress`
      );
      if (token) progressUrl.searchParams.set("token", token);

      const eventSource = new EventSource(progressUrl.toString());
      eventSourcesRef.current[slug] = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          switch (data.type) {
            case "doc_starting":
              setEmbeddingProgressMap((prev) => ({
                ...prev,
                [slug]: {
                  ...prev[slug],
                  [data.filename]: { status: "embedding" },
                },
              }));
              break;

            case "doc_complete":
              setEmbeddingProgressMap((prev) => ({
                ...prev,
                [slug]: {
                  ...prev[slug],
                  [data.filename]: { status: "complete" },
                },
              }));

              break;

            case "doc_failed":
              setEmbeddingProgressMap((prev) => ({
                ...prev,
                [slug]: {
                  ...prev[slug],
                  [data.filename]: {
                    status: "failed",
                    error: data.error || "Embedding failed",
                  },
                },
              }));

              break;

            case "all_complete":
              eventSource.close();
              delete eventSourcesRef.current[slug];
              // Auto-clear progress after 5s
              cleanupTimeoutsRef.current[slug] = setTimeout(() => {
                setEmbeddingProgressMap((prev) => {
                  const next = { ...prev };
                  delete next[slug];
                  return next;
                });
                delete cleanupTimeoutsRef.current[slug];
              }, 5000);
              break;
          }
        } catch {
          // ignore parse errors
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        delete eventSourcesRef.current[slug];
      };
    } catch {
      // SSE is optional — embedding still works without it
    }
  }, []);

  // On provider mount, reconnect SSE for any slugs that still have active work
  // (i.e. progress was persisted from before a page reload).
  useEffect(() => {
    const persisted = loadPersistedProgress();
    for (const slug of Object.keys(persisted)) {
      const progress = persisted[slug];
      const hasActiveWork = Object.values(progress).some(
        (f) => f.status === "pending" || f.status === "embedding"
      );
      if (hasActiveWork) {
        connectSSE(slug);
      }
    }
    // Cleanup all EventSources on unmount
    return () => {
      for (const slug of Object.keys(eventSourcesRef.current)) {
        eventSourcesRef.current[slug]?.close();
        delete eventSourcesRef.current[slug];
      }
    };
  }, [connectSSE]);

  const clearProgress = useCallback((slug) => {
    setEmbeddingProgressMap((prev) => {
      const next = { ...prev };
      delete next[slug];
      return next;
    });
    if (cleanupTimeoutsRef.current[slug]) {
      clearTimeout(cleanupTimeoutsRef.current[slug]);
      delete cleanupTimeoutsRef.current[slug];
    }
  }, []);

  const startEmbedding = useCallback(
    (slug, filenames) => {
      // Close any existing EventSource for this slug
      if (eventSourcesRef.current[slug]) {
        eventSourcesRef.current[slug].close();
        delete eventSourcesRef.current[slug];
      }
      if (cleanupTimeoutsRef.current[slug]) {
        clearTimeout(cleanupTimeoutsRef.current[slug]);
        delete cleanupTimeoutsRef.current[slug];
      }

      // Set all filenames to pending
      const initialProgress = {};
      for (const name of filenames) {
        initialProgress[name] = { status: "pending" };
      }
      setEmbeddingProgressMap((prev) => ({
        ...prev,
        [slug]: { ...initialProgress },
      }));

      connectSSE(slug);
    },
    [connectSSE]
  );

  const updateProgressFromApi = useCallback((slug, filenames, res) => {
    const embeddedPaths = new Set(res.embedded || []);
    const failedNames = res.failedToEmbed || [];

    setEmbeddingProgressMap((prev) => {
      const slugProgress = { ...prev[slug] };
      for (const name of filenames) {
        if (embeddedPaths.has(name)) {
          slugProgress[name] = { status: "complete" };
        } else {
          const displayName = name
            .split("/")
            .pop()
            ?.replace(/\.json$/, "");
          const didFail =
            failedNames.length > 0 &&
            failedNames.some(
              (f) => f === displayName || f === name || name.includes(f)
            );
          if (didFail) {
            slugProgress[name] = { status: "failed", error: res.message };
          } else if (
            slugProgress[name]?.status !== "complete" &&
            slugProgress[name]?.status !== "failed"
          ) {
            slugProgress[name] = { status: "complete" };
          }
        }
      }
      return { ...prev, [slug]: slugProgress };
    });
  }, []);

  const updateProgressWithError = useCallback((slug, filenames, error) => {
    setEmbeddingProgressMap((prev) => {
      const slugProgress = { ...prev[slug] };
      for (const name of filenames) {
        slugProgress[name] = { status: "failed", error: String(error) };
      }
      return { ...prev, [slug]: slugProgress };
    });
  }, []);

  return (
    <EmbeddingProgressContext.Provider
      value={{
        embeddingProgressMap,
        startEmbedding,
        updateProgressFromApi,
        updateProgressWithError,
        clearProgress,
      }}
    >
      {children}
    </EmbeddingProgressContext.Provider>
  );
}
