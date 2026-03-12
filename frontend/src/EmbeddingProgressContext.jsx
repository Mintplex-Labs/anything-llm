import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { API_BASE, AUTH_TOKEN } from "@/utils/constants";

const EmbeddingProgressContext = createContext();

export function useEmbeddingProgress() {
  const ctx = useContext(EmbeddingProgressContext);
  if (!ctx)
    throw new Error(
      "useEmbeddingProgress must be used within EmbeddingProgressProvider"
    );
  return ctx;
}

export function EmbeddingProgressProvider({ children }) {
  const [embeddingProgressMap, setEmbeddingProgressMap] = useState({});
  const eventSourcesRef = useRef({});
  const cleanupTimeoutsRef = useRef({});

  // Cleanup all EventSources on unmount
  useEffect(() => {
    return () => {
      for (const slug of Object.keys(eventSourcesRef.current)) {
        eventSourcesRef.current[slug]?.close();
      }
    };
  }, []);

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
            case "batch_starting": {
              const initial = {};
              for (const name of data.filenames || []) {
                initial[name] = { status: "pending" };
              }
              setEmbeddingProgressMap((prev) => ({
                ...prev,
                [slug]: { ...initial, ...prev[slug] },
              }));
              break;
            }

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
              // A real embedding job just finished — close and schedule cleanup.
              eventSource.close();
              delete eventSourcesRef.current[slug];
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

  return (
    <EmbeddingProgressContext.Provider
      value={{
        embeddingProgressMap,
        startEmbedding,
        clearProgress,
        connectSSE,
      }}
    >
      {children}
    </EmbeddingProgressContext.Provider>
  );
}
