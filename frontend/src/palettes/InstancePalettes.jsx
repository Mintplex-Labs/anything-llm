import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import showToast from "@/utils/toast";
import { useTheme } from "@/hooks/useTheme";
import {
  PALETTE_SEEDS,
  copyPaletteColors,
  listPalettes,
  paletteStore,
} from "@/palettes";
import Toggle from "@/components/lib/Toggle";
import AutosaveForm, {
  SavedIndicator,
  useAutosaveForm,
} from "@/components/AutosaveForm";
import { PaletteButton } from "./PalettePicker";

/**
 * Admin editor for the palettes served to every user of this instance, the
 * instance default palette, and whether that default is enforced.
 * Every change saves as soon as it is made.
 */
export default function InstancePalettes() {
  const { t } = useTranslation();
  const { instancePalettes } = useTheme();
  const [draft, setDraft] = useState(instancePalettes);

  // Follow the server copy, which is also what every save resolves to.
  useEffect(() => {
    setDraft(instancePalettes);
  }, [instancePalettes]);

  async function persist() {
    const { success, error } = await Admin.updateSystemPreferences({
      theme_palettes: JSON.stringify(draft),
    });
    if (!success) {
      showToast(
        t("customization.items.instance-palettes.save-failed", { error }),
        "error"
      );
      setDraft(paletteStore.getSnapshot().instance);
      return false;
    }
    await paletteStore.refresh();
    return true;
  }

  return (
    <AutosaveForm onSave={persist} className="flex flex-col gap-y-0.5 my-4">
      <PaletteSettings draft={draft} setDraft={setDraft} />
    </AutosaveForm>
  );
}

function PaletteSettings({ draft, setDraft }) {
  const { t } = useTranslation();
  const { palette } = useTheme();
  const { markDirty, save } = useAutosaveForm();
  const [editing, setEditing] = useState(null);

  // Preview the palette being edited across the whole app.
  useEffect(() => {
    paletteStore.setPreview(
      editing
        ? { colors: { main: editing.main, accent: editing.accent } }
        : null
    );
  }, [editing]);
  useEffect(() => () => paletteStore.setPreview(null), []);

  /** Applies a change to the draft and saves it, showing the field's indicator. */
  function commit(field, next) {
    setDraft(next);
    markDirty(field);
    save();
  }

  function startNew() {
    setEditing({
      id: `custom-${Math.random().toString(36).slice(2, 10)}`,
      name: "",
      ...copyPaletteColors(palette, draft),
    });
  }

  function finishEditing() {
    if (!editing.name.trim()) {
      showToast(
        t("customization.items.instance-palettes.name-required"),
        "error"
      );
      return;
    }
    const exists = draft.palettes.some(({ id }) => id === editing.id);
    commit("palettes", {
      ...draft,
      palettes: exists
        ? draft.palettes.map((p) => (p.id === editing.id ? editing : p))
        : [...draft.palettes, editing],
    });
    setEditing(null);
  }

  /** The default palette can only be enforced when it is not the stock one. */
  function setDefault(key) {
    const defaultPalette = key === "default" ? null : key;
    if (defaultPalette === draft.defaultPalette) return;
    commit("palettes", {
      ...draft,
      defaultPalette,
      enforced: defaultPalette ? draft.enforced : false,
    });
  }

  function removePalette(id) {
    const isDefault = draft.defaultPalette === id;
    commit("palettes", {
      palettes: draft.palettes.filter((p) => p.id !== id),
      defaultPalette: isDefault ? null : draft.defaultPalette,
      enforced: isDefault ? false : draft.enforced,
    });
  }

  return (
    <>
      <p className="text-sm leading-6 font-semibold text-white">
        {t("customization.items.instance-palettes.title")}
        <SavedIndicator name="palettes" />
      </p>
      <p className="text-xs text-white/60">
        {t("customization.items.instance-palettes.description")}
      </p>

      <div className="flex flex-wrap items-center gap-2 mt-2">
        {listPalettes(draft).map(({ key, name, colors, isInstance }) => (
          <PaletteButton
            key={key}
            name={name}
            colors={colors}
            selected={(draft.defaultPalette ?? "default") === key}
            onClick={() => setDefault(key)}
            actions={
              isInstance && (
                <>
                  <IconButton
                    label={t("customization.items.instance-palettes.edit")}
                    onClick={() =>
                      setEditing({
                        ...draft.palettes.find(({ id }) => id === key),
                      })
                    }
                  >
                    <PencilSimple size={14} />
                  </IconButton>
                  <IconButton
                    label={t("customization.items.instance-palettes.delete")}
                    onClick={() => removePalette(key)}
                    danger
                  >
                    <Trash size={14} />
                  </IconButton>
                </>
              )
            }
          />
        ))}
        {!editing && (
          <button
            type="button"
            onClick={startNew}
            className="flex items-center gap-x-2 rounded-lg py-2 px-3 text-sm text-white/60 hover:text-white border border-dashed border-theme-sidebar-border"
          >
            <Plus size={14} />
            {t("customization.items.instance-palettes.new")}
          </button>
        )}
      </div>

      {editing && (
        <PaletteEditor
          palette={editing}
          onChange={setEditing}
          onDone={finishEditing}
          onCancel={() => setEditing(null)}
        />
      )}

      <Toggle
        size="md"
        variant="horizontal"
        className="mt-6"
        name="enforced"
        label={
          <>
            {t("customization.items.instance-palettes.enforce")}
            <SavedIndicator name="enforced" />
          </>
        }
        description={t(
          "customization.items.instance-palettes.enforce-description"
        )}
        enabled={draft.enforced}
        disabled={!draft.defaultPalette}
        onChange={(enforced) => commit("enforced", { ...draft, enforced })}
      />
    </>
  );
}

function IconButton({ label, onClick, danger = false, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`p-1 rounded text-white/60 ${danger ? "hover:text-red-400" : "hover:text-white"}`}
    >
      {children}
    </button>
  );
}

function PaletteEditor({ palette, onChange, onDone, onCancel }) {
  const { t } = useTranslation();

  // The palette saves on Done, so keep its inputs out of the form's autosave.
  const isolate = (e) => e.stopPropagation();

  return (
    <div
      onChange={isolate}
      onBlur={isolate}
      className="flex flex-col gap-y-3 mt-3 p-4 w-fit rounded-lg border border-theme-sidebar-border"
    >
      <input
        type="text"
        value={palette.name}
        maxLength={40}
        placeholder={t("customization.items.instance-palettes.name")}
        onChange={(e) => onChange({ ...palette, name: e.target.value })}
        onKeyDown={(e) => {
          if (e.key !== "Enter") return;
          e.preventDefault();
          onDone();
        }}
        className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button outline-none block w-60 py-2 px-4"
      />
      <div className="flex flex-col gap-y-2">
        {PALETTE_SEEDS.map((seed) => (
          <label key={seed} className="flex items-center gap-x-2 text-sm">
            <input
              type="color"
              value={palette[seed]}
              onChange={(e) => onChange({ ...palette, [seed]: e.target.value })}
              className="w-8 h-8 rounded cursor-pointer bg-transparent"
            />
            <span className="text-white">
              {t(`customization.items.instance-palettes.colors.${seed}`)}
            </span>
            <span className="text-xs text-white/60 font-mono">
              {palette[seed]}
            </span>
          </label>
        ))}
      </div>
      <p className="text-xs text-white/60">
        {t("customization.items.instance-palettes.preview-note")}
      </p>
      <div className="flex gap-x-2">
        <button
          type="button"
          onClick={onDone}
          className="border border-slate-200 px-4 py-2 rounded-lg text-white text-sm hover:bg-slate-200 hover:text-slate-800"
        >
          {t("customization.items.instance-palettes.done")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-lg text-white/60 text-sm hover:text-white"
        >
          {t("customization.items.instance-palettes.cancel")}
        </button>
      </div>
    </div>
  );
}
