import { useEffect, useState } from "react";
import { FullScreenLoader } from "@/components/Preloader";
import System from "@/models/system";
import paths from "@/utils/paths";

/**
 * Protects the view from system set ups who cannot view chat history.
 * If the user cannot view chat history, they are redirected to the home page.
 * @param {React.ReactNode} children
 */
export function CanViewChatHistory({ children }) {
  const { loading, viewable } = useCanViewChatHistory();
  if (loading) return <FullScreenLoader />;
  if (!viewable) {
    window.location.href = paths.home();
    return <FullScreenLoader />;
  }

  return <>{children}</>;
}

/**
 * Provides the `viewable` state to the children.
 * @returns {React.ReactNode}
 */
export function CanViewChatHistoryProvider({ children }) {
  const { loading, viewable } = useCanViewChatHistory();
  if (loading) return null;
  return <>{children({ viewable })}</>;
}

/**
 * Hook that fetches the can view chat history state from local storage or the system settings.
 * @returns {Promise<{viewable: boolean, error: string | null}>}
 */
export function useCanViewChatHistory() {
  const [loading, setLoading] = useState(true);
  const [viewable, setViewable] = useState(false);

  useEffect(() => {
    async function fetchViewable() {
      const { viewable } = await System.fetchCanViewChatHistory();
      setViewable(viewable);
      setLoading(false);
    }
    fetchViewable();
  }, []);

  return { loading, viewable };
}
