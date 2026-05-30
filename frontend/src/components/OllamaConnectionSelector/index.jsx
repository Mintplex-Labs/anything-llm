import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import OllamaConnection from "@/models/ollamaConnection";
import paths from "@/utils/paths";

/**
 * Per-workspace Ollama connection picker for the workspace settings page.
 * Persists via the `ollamaConnectionId` field on the workspace and emits the
 * resolved connection object via `onConnectionChange` so the chat/agent model
 * picker can refetch against the right Ollama server.
 *
 * `onConnectionChange` is only called once the connections list has loaded,
 * so callers can safely gate fetches on it without racing against env defaults.
 */
export default function OllamaConnectionSelector({
  workspace,
  setHasChanges,
  onConnectionChange,
}) {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(
    workspace?.ollamaConnectionId ? String(workspace.ollamaConnectionId) : ""
  );

  useEffect(() => {
    OllamaConnection.getAll().then((rows) => {
      setConnections(rows);
      setLoading(false);
      // Fall back to System default if the saved id was deleted on the backend
      // so callers gating on the resolved connection don't wait forever.
      const matchId =
        selectedId !== "" && rows.find((c) => String(c.id) === selectedId)
          ? selectedId
          : "";
      if (matchId !== selectedId) setSelectedId(matchId);
      const match = matchId
        ? rows.find((c) => String(c.id) === matchId) || null
        : null;
      onConnectionChange?.(match);
    });
    // We only want this to run once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedId(value);
    setHasChanges(true);
    const match = value
      ? connections.find((c) => String(c.id) === value) || null
      : null;
    onConnectionChange?.(match);
  };

  return (
    <div className="mt-4 flex flex-col gap-y-1">
      <label className="block input-label">Ollama connection</label>
      <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
        Choose which configured Ollama endpoint this workspace should use, or
        leave on <em>System default</em> to use the
        <code className="px-1">OLLAMA_BASE_PATH</code> from your environment.
        Manage named connections from{" "}
        <Link
          to={paths.settings.llmPreference()}
          className="underline text-white"
        >
          LLM Preferences
        </Link>{" "}
        (when Ollama is selected as the provider).
      </p>
      <select
        name="ollamaConnectionId"
        value={selectedId}
        onChange={handleChange}
        disabled={loading}
        className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
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
