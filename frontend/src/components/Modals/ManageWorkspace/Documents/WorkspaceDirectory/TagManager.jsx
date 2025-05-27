import { memo, useState } from "react";
import { Tag, X, Plus } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

function TagManager({ document, onUpdateTags }) {
  const { t } = useTranslation();
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [tags, setTags] = useState(document.tags || []);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      onUpdateTags(document.id, updatedTags);
      setNewTag("");
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(updatedTags);
    onUpdateTags(document.id, updatedTags);
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {tags.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-1 px-2 py-1 bg-theme-sidebar-subitem-hover rounded-lg"
        >
          <Tag size={14} className="text-theme-text-primary" />
          <span className="text-theme-text-primary text-xs">{tag}</span>
          <button
            onClick={() => handleRemoveTag(tag)}
            className="text-theme-text-primary hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      {showTagInput ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
            className="px-2 py-1 bg-theme-settings-input-bg border border-theme-modal-border rounded-lg text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary-button"
            placeholder={t("connectors.directory.enter-tag")}
            autoFocus
          />
          <button
            onClick={handleAddTag}
            className="text-theme-text-primary hover:text-white"
          >
            <Plus size={14} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowTagInput(true)}
          className="flex items-center gap-1 px-2 py-1 bg-theme-sidebar-subitem-hover rounded-lg text-theme-text-primary hover:text-white"
        >
          <Plus size={14} />
          <span className="text-xs">{t("connectors.directory.add-tag")}</span>
        </button>
      )}
    </div>
  );
}

export default memo(TagManager);
