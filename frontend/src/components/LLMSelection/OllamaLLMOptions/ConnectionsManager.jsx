import { useEffect, useState } from "react";
import { PencilSimple, Plus, X } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import OllamaConnection from "@/models/ollamaConnection";
import { useModal } from "@/hooks/useModal";
import showToast from "@/utils/toast";

/**
 * Named-Ollama-connections manager. Renders inline inside OllamaLLMOptions so
 * the env-based default and the per-workspace connection pool live in one place.
 */
export default function ConnectionsManager() {
  const { isOpen, openModal, closeModal } = useModal();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const refresh = async () => {
    const rows = await OllamaConnection.getAll();
    setConnections(rows);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const openCreate = () => {
    setEditing(null);
    openModal();
  };
  const openEdit = (c) => {
    setEditing(c);
    openModal();
  };
  const handleClose = () => {
    closeModal();
    setEditing(null);
  };

  const handleDelete = async (c) => {
    const msg =
      c.workspaceCount > 0
        ? `Delete "${c.name}"? ${c.workspaceCount} workspace(s) use it and will fall back to env defaults.`
        : `Delete "${c.name}"?`;
    if (!window.confirm(msg)) return;
    const { success, error } = await OllamaConnection.delete(c.id);
    if (success) {
      setConnections((prev) => prev.filter((r) => r.id !== c.id));
      showToast("Connection deleted", "success");
    } else showToast(`Delete failed: ${error}`, "error");
  };

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white text-sm font-semibold">
            Named connections
          </h3>
          <p className="text-xs text-white text-opacity-60 mt-1 max-w-[600px]">
            Add additional Ollama endpoints that individual workspaces can pick
            from. Workspaces left on <em>System default</em> use the URL above.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="border-none flex items-center gap-1 text-xs font-medium bg-primary-button text-white rounded-lg px-3 py-1.5 hover:opacity-90"
        >
          <Plus size={14} weight="bold" /> Add connection
        </button>
      </div>

      <div className="rounded-lg border border-white/10 overflow-hidden">
        <div className="grid grid-cols-[2fr_3fr_1fr_72px] gap-x-4 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400 bg-white/5">
          <span>Name</span>
          <span>Base path</span>
          <span>Workspaces</span>
          <span aria-hidden="true" />
        </div>
        {loading ? (
          <p className="text-xs text-zinc-400 px-4 py-3">Loading…</p>
        ) : connections.length === 0 ? (
          <p className="text-xs text-zinc-400 px-4 py-3">
            No named connections yet.
          </p>
        ) : (
          connections.map((c, idx) => (
            <div
              key={c.id}
              className={`grid grid-cols-[2fr_3fr_1fr_72px] gap-x-4 items-center px-4 py-2 text-sm ${
                idx > 0 ? "border-t border-white/5" : ""
              }`}
            >
              <span className="text-white truncate">{c.name}</span>
              <span className="text-zinc-400 truncate">{c.basePath}</span>
              <span className="text-zinc-400">{c.workspaceCount || 0}</span>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => openEdit(c)}
                  aria-label={`Edit ${c.name}`}
                  className="border-none text-zinc-400 hover:text-white"
                >
                  <PencilSimple size={16} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c)}
                  aria-label={`Delete ${c.name}`}
                  className="border-none text-zinc-400 hover:text-red-400"
                >
                  <X size={16} weight="bold" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <ConnectionModal
        isOpen={isOpen}
        closeModal={handleClose}
        onSuccess={refresh}
        connection={editing}
      />
    </div>
  );
}

function ConnectionModal({ isOpen, closeModal, onSuccess, connection }) {
  const isEdit = !!connection;
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = new FormData(e.target);
    const payload = {
      name: form.get("name"),
      basePath: form.get("basePath"),
      authToken: form.get("authToken") || null,
      keepAlive: form.get("keepAlive") || null,
      responseTimeout: form.get("responseTimeout") || null,
    };

    setSubmitting(true);
    const { error } = isEdit
      ? await OllamaConnection.update(connection.id, payload)
      : await OllamaConnection.create(payload);
    setSubmitting(false);
    if (error) return showToast(error, "error");
    showToast(`Connection ${isEdit ? "updated" : "created"}`, "success");
    onSuccess();
    closeModal();
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="relative w-[500px] max-w-2xl max-h-full bg-theme-bg-secondary rounded-lg shadow border border-theme-modal-border">
        <div className="flex items-start justify-between p-4 border-b border-theme-modal-border">
          <h3 className="text-lg font-semibold text-white">
            {isEdit ? "Edit connection" : "New Ollama connection"}
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="border-none text-gray-400 bg-transparent hover:bg-theme-modal-border hover:text-white rounded-lg text-sm p-1.5"
          >
            <X size={20} weight="bold" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <Field
            label="Name"
            name="name"
            required
            defaultValue={connection?.name || ""}
            placeholder="Local Ollama"
          />
          <Field
            label="Base path"
            name="basePath"
            required
            defaultValue={connection?.basePath || ""}
            placeholder="http://localhost:11434"
          />
          <Field
            label="Auth token (optional)"
            name="authToken"
            type="password"
            defaultValue={connection?.authToken || ""}
            placeholder="Bearer token, if required"
          />
          <Field
            label="Keep-alive (seconds, optional)"
            name="keepAlive"
            type="number"
            defaultValue={connection?.keepAlive ?? ""}
            placeholder="300"
          />
          <Field
            label="Response timeout (ms, optional)"
            name="responseTimeout"
            type="number"
            defaultValue={connection?.responseTimeout ?? ""}
            placeholder="Leave blank for default"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded-md text-sm text-zinc-300 hover:text-white border border-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-md text-sm bg-slate-50 text-zinc-950 hover:opacity-90 disabled:opacity-60"
            >
              {submitting ? "Saving…" : isEdit ? "Save" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-zinc-200">
      <span>{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="bg-zinc-800 text-white placeholder:text-zinc-500 rounded-md border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-white/30"
      />
    </label>
  );
}
