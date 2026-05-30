import { useEffect, useState } from "react";
import OllamaConnection from "@/models/ollamaConnection";

/**
 * Slim Ollama-connection picker for the in-chat LLM selector modal. Mirrors
 * the styling of the chat model dropdown next to it. Reports both the chosen
 * id and the resolved connection object so the model fetch can use the right
 * basePath/authToken.
 */
export default function OllamaConnectionInline({
  selectedConnectionId,
  onChange,
}) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    OllamaConnection.getAll().then((rows) => {
      setConnections(rows);
      setLoading(false);
      // Resolve the initial connection object so callers know the saved one.
      // If the saved id was deleted on the backend, fall back to System default
      // so the model fetch isn't permanently gated waiting for a ghost.
      if (selectedConnectionId) {
        const match =
          rows.find((c) => String(c.id) === String(selectedConnectionId)) ||
          null;
        if (match) onChange?.(selectedConnectionId, match, { initial: true });
        else onChange?.(null, null, { initial: true });
      } else {
        onChange?.(null, null, { initial: true });
      }
    });
    // We only want this to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    const match = value
      ? connections.find((c) => String(c.id) === value) || null
      : null;
    onChange?.(value || null, match);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-zinc-400 light:text-slate-500">
        Ollama connection
      </p>
      <select
        disabled={loading}
        value={selectedConnectionId ?? ""}
        onChange={handleChange}
        className="bg-zinc-900 light:bg-white text-white light:text-slate-900 text-sm rounded-lg h-8 w-full px-2.5 outline-none border border-zinc-900 light:border-slate-400 cursor-pointer disabled:cursor-not-allowed"
      >
        <option value="">System default (env vars)</option>
        {connections.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} — {c.basePath}
          </option>
        ))}
      </select>
    </div>
  );
}
