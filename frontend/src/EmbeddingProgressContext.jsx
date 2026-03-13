import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

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
  const abortControllersRef = useRef({});
  const cleanupTimeoutsRef = useRef({});

  useEffect(() => {
    return () => {
      for (const slug of Object.keys(abortControllersRef.current)) {
        abortControllersRef.current[slug]?.abort();
      }
    };
  }, []);

  /**
   * Open (or reconnect) an SSE connection for a given workspace slug.
   * Updates embeddingProgressMap in real time as events arrive.
   */
  const connectSSE = useCallback((slug) => {
    if (abortControllersRef.current[slug]) return;

    const ctrl = new AbortController();
    abortControllersRef.current[slug] = ctrl;

    fetchEventSource(`${API_BASE}/workspace/${slug}/embed-progress`, {
      method: "GET",
      headers: baseHeaders(),
      signal: ctrl.signal,
      openWhenHidden: true,
      onmessage(msg) {
        try {
          const data = JSON.parse(msg.data);

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
              ctrl.abort();
              delete abortControllersRef.current[slug];
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
      },
      onclose() {
        delete abortControllersRef.current[slug];
      },
      onerror() {
        delete abortControllersRef.current[slug];
        throw new Error("SSE connection error");
      },
    }).catch(() => {
      // SSE is optional — embedding still works without it
    });
  }, []);

  const startEmbedding = useCallback(
    (slug, filenames) => {
      if (abortControllersRef.current[slug]) {
        abortControllersRef.current[slug].abort();
        delete abortControllersRef.current[slug];
      }
      if (cleanupTimeoutsRef.current[slug]) {
        clearTimeout(cleanupTimeoutsRef.current[slug]);
        delete cleanupTimeoutsRef.current[slug];
      }

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
        connectSSE,
      }}
    >
      {children}
    </EmbeddingProgressContext.Provider>
  );
}
