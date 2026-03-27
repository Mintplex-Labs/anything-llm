import { useState } from "react";
import { useTranslation } from "react-i18next";
import MemoryForm from "@/components/Memories/MemoryForm";
import MemoryItem from "@/components/Memories/MemoryItem";
import { Brain, Plus } from "@phosphor-icons/react";

/**
 * @param {Object} props
 * @param {Object[]} props.memories
 * @param {function} props.onDelete
 * @param {function} props.onUpdate
 * @param {function} props.onAdd - Called with (content) on submit
 */
export default function GlobalMemoriesSection({
  memories,
  onDelete,
  onUpdate,
  onAdd,
}) {
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);

  function handleAdd(content) {
    onAdd(content);
    setShowAddForm(false);
  }

  return (
    <div>
      <div className="flex flex-col gap-y-1 mb-4">
        <div className="flex items-center justify-between">
          <label className="block input-label">
            {t("personalization.global.title", {
              count: memories.length,
              max: 5,
            })}
          </label>
          {memories.length < 5 && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-x-1 border-none text-theme-text-secondary font-medium text-sm px-[10px] py-[6px] rounded-md bg-theme-bg-secondary hover:bg-theme-bg-primary"
            >
              <Plus size={14} weight="bold" />
              {t("personalization.global.add-button")}
            </button>
          )}
        </div>
        <p className="text-white text-opacity-60 text-xs font-medium">
          {t("personalization.global.description")}
        </p>
      </div>

      {showAddForm && (
        <div className="mb-4">
          <MemoryForm
            placeholder={t("personalization.global.placeholder")}
            submitLabel={t("personalization.form.add")}
            onSubmit={handleAdd}
            onCancel={() => setShowAddForm(false)}
          />
        </div>
      )}

      {memories.length === 0 && !showAddForm ? (
        <div className="flex items-center justify-center rounded-lg bg-theme-settings-input-bg py-8">
          <div className="flex flex-col items-center gap-y-2">
            <Brain className="h-8 w-8 text-theme-text-secondary" />
            <p className="text-sm text-theme-text-secondary">
              {t("personalization.global.empty-title")}
            </p>
            <p className="text-xs text-theme-text-secondary">
              {t("personalization.global.empty-description")}
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-y-1">
          {memories.map((memory) => (
            <MemoryItem
              key={memory.id}
              memory={memory}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </div>
      )}
    </div>
  );
}
