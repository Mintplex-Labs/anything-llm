import { useEffect, useState } from "react";
import { Trash, FloppyDisk, PencilSimple } from "@phosphor-icons/react";
import MarkdownSkills from "@/models/markdownSkills";
import showToast from "@/utils/toast";

const NAME_HINT =
  "1-64 lowercase letters, numbers, and single hyphens (e.g. git-commit-conventions). Must match the folder name.";

const INPUT_CLASS =
  "w-full px-3 py-2 bg-theme-bg-primary border border-theme-sidebar-border rounded-lg text-theme-text-primary text-sm placeholder:text-theme-text-secondary/50 outline-none focus:border-cta-button transition-colors";
const SAVE_BUTTON_CLASS =
  "flex items-center justify-center gap-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white text-sm font-medium rounded-lg transition-colors";

/**
 * Editor panel for a markdown skill (agentskills.io SKILL.md format).
 * Pass an existing skill to edit it, or `isNew` to create one.
 */
export default function MarkdownSkillEditor({
  skill,
  isNew = false,
  onSaved,
  onDeleted,
  onRenamed,
}) {
  const [name, setName] = useState(skill?.name || "");
  const [description, setDescription] = useState(skill?.description || "");
  const [license, setLicense] = useState(skill?.license || "");
  const [compatibility, setCompatibility] = useState(
    skill?.compatibility || ""
  );
  const [body, setBody] = useState(skill?.body || "");
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Reset the form when switching skills.
  useEffect(() => {
    setName(skill?.name || "");
    setDescription(skill?.description || "");
    setLicense(skill?.license || "");
    setCompatibility(skill?.compatibility || "");
    setBody(skill?.body || "");
    setConfirmingDelete(false);
  }, [skill]);

  const canEditName = isNew || !skill;

  // The name must stay kebab-case and, for existing skills, match the folder
  // name (which cannot be changed from here - use the rename fix instead).
  const isNameValid =
    /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) && name.length <= 64;
  const nameMismatch =
    !isNew && skill?.error && /does not match its folder/.test(skill.error);

  const handleRenameFolder = async () => {
    // Keep the frontmatter name: rename the folder (skill.dir) to match it.
    const { skill: renamed, error } = await MarkdownSkills.rename(
      skill.dir || skill.name,
      name.trim()
    );
    if (error || !renamed) {
      showToast(error || "Could not rename the skill folder.", "error", {
        clear: true,
      });
      return;
    }
    showToast(`Folder renamed to "${renamed.name}".`, "success", {
      clear: true,
    });
    onRenamed?.(skill.name, renamed);
  };

  const handleSave = async () => {
    if (!name.trim() || !description.trim()) {
      showToast("A name and description are required.", "error", {
        clear: true,
      });
      return;
    }
    setSaving(true);
    const { skill: saved, error } = await MarkdownSkills.save({
      name: name.trim(),
      description: description.trim(),
      license: license.trim() || undefined,
      compatibility: compatibility.trim() || undefined,
      body,
    });
    setSaving(false);
    if (error) {
      showToast(error, "error", { clear: true });
      return;
    }
    showToast(`Skill "${saved.name}" saved.`, "success", { clear: true });
    onSaved?.(saved);
  };

  const handleDelete = async () => {
    const { success, error } = await MarkdownSkills.delete(name);
    if (!success) {
      showToast(error || "Failed to delete skill.", "error", { clear: true });
      return;
    }
    showToast(`Skill "${name}" deleted.`, "success", { clear: true });
    onDeleted?.(name);
  };

  return (
    <div className="flex flex-col gap-y-4 h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <PencilSimple size={20} className="text-cta-button" />
          <h2 className="text-lg font-semibold">
            {isNew ? "New Markdown Skill" : `Edit: ${skill?.name || ""}`}
          </h2>
        </div>
        {!isNew &&
          (confirmingDelete ? (
            <div className="flex items-center gap-x-2">
              <span className="text-sm text-theme-text-secondary">
                Delete this skill?
              </span>
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm text-red-400 hover:underline"
              >
                Yes, delete
              </button>
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="text-sm text-theme-text-secondary hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmingDelete(true)}
              className="text-theme-text-secondary hover:text-red-400 transition-colors"
              title="Delete skill"
            >
              <Trash size={20} />
            </button>
          ))}
      </div>

      <div className="text-xs text-theme-text-secondary">
        Skills follow the{" "}
        <a
          href="https://agentskills.io/specification"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-cta-button"
        >
          Agent Skills specification
        </a>
        . The <code className="font-mono">name</code> and{" "}
        <code className="font-mono">description</code> are used to detect when a
        skill is relevant; the body below is injected into the model's context
        when it is.
      </div>

      {nameMismatch && (
        <div className="flex items-center justify-between gap-x-3 px-3 py-2 bg-amber-400/10 border border-amber-400/30 rounded-lg">
          <span className="text-xs text-amber-400/90">
            This skill's folder name does not match its name. Rename the folder
            to the name shown above so the skill can be managed normally.
          </span>
          <button
            type="button"
            onClick={handleRenameFolder}
            disabled={!isNameValid}
            className="text-xs text-cta-button hover:underline disabled:opacity-50 flex-none"
          >
            Rename folder
          </button>
        </div>
      )}

      <div className="flex flex-col gap-y-4">
        <label className="flex flex-col gap-y-1">
          <span className="text-sm font-medium">Name</span>
          <input
            type="text"
            value={name}
            disabled={!canEditName}
            onChange={(e) => setName(e.target.value)}
            placeholder="my-new-skill"
            className={`${INPUT_CLASS} disabled:opacity-50 ${
              name && !isNameValid ? "border-red-400" : ""
            }`}
          />
          <span
            className={`text-xs ${
              name && !isNameValid
                ? "text-red-400"
                : "text-theme-text-secondary"
            }`}
          >
            {name && !isNameValid
              ? "Invalid: use lowercase letters, numbers, and single hyphens (max 64 chars)."
              : NAME_HINT}
          </span>
        </label>

        <label className="flex flex-col gap-y-1">
          <span className="text-sm font-medium">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What the skill does and when to use it. Include trigger keywords."
            rows={3}
            className={`${INPUT_CLASS} resize-y`}
          />
          <span className="text-xs text-theme-text-secondary">
            Detection relies on this field. Describe the task AND the keywords
            that should activate the skill. Max 1024 characters.
          </span>
        </label>

        <div className="grid grid-cols-2 gap-x-4">
          <label className="flex flex-col gap-y-1">
            <span className="text-sm font-medium">License (optional)</span>
            <input
              type="text"
              value={license}
              onChange={(e) => setLicense(e.target.value)}
              placeholder="MIT"
              className={INPUT_CLASS}
            />
          </label>
          <label className="flex flex-col gap-y-1">
            <span className="text-sm font-medium">
              Compatibility (optional)
            </span>
            <input
              type="text"
              value={compatibility}
              onChange={(e) => setCompatibility(e.target.value)}
              placeholder="Requires internet access"
              className={INPUT_CLASS}
            />
          </label>
        </div>

        <label className="flex flex-col gap-y-1 flex-1 min-h-0">
          <span className="text-sm font-medium">Instructions (markdown)</span>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={
              "# My Skill\n\nStep-by-step instructions, examples, edge cases..."
            }
            rows={12}
            className={`${INPUT_CLASS} resize-y font-mono`}
          />
        </label>
      </div>

      <div className="flex items-center justify-end gap-x-3">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className={SAVE_BUTTON_CLASS}
        >
          <FloppyDisk size={16} />
          {saving ? "Saving..." : "Save Skill"}
        </button>
      </div>
    </div>
  );
}
