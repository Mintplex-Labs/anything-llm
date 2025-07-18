import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CommunityHub from "@/models/communityHub";
import showToast from "@/utils/toast";
import paths from "@/utils/paths";
import { X } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

export default function SlashCommands({ entity }) {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [isSuccess, setIsSuccess] = useState(false);
  const [itemId, setItemId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);
    try {
      const form = new FormData(formRef.current);
      const data = {
        name: form.get("name"),
        description: form.get("description"),
        command: entity.command,
        prompt: form.get("prompt"),
        tags: tags,
        visibility: visibility,
      };

      const { success, error, itemId } =
        await CommunityHub.createSlashCommand(data);
      if (!success) throw new Error(error);
      setItemId(itemId);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to publish slash command:", error);
      showToast(`Failed to publish slash command: ${error.message}`, "error", {
        clear: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = tagInput.trim();
      if (value.length > 20) return;
      if (value && !tags.includes(value)) {
        setTags((prevTags) => [...prevTags, value].slice(0, 5)); // Limit to 5 tags
        setTagInput("");
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  if (isSuccess) {
    return (
      <div className="p-6 -mt-12 w-[400px]">
        <div className="flex flex-col items-center justify-center gap-y-2">
          <h3 className="text-lg font-semibold text-theme-text-primary">
            {t("community_hub.publish.slash_command.success_title")}
          </h3>
          <p className="text-lg text-theme-text-primary text-center max-w-2xl">
            {t("community_hub.publish.slash_command.success_description")}
          </p>
          <p className="text-theme-text-secondary text-center text-sm">
            {t("community_hub.publish.slash_command.success_thank_you")}
          </p>
          <Link
            to={paths.communityHub.viewItem("slash-command", itemId)}
            target="_blank"
            rel="noreferrer"
            className="w-[265px] bg-theme-bg-secondary hover:bg-theme-sidebar-item-hover text-theme-text-primary py-2 px-4 rounded-lg transition-colors mt-4 text-sm font-semibold text-center"
          >
            {t("community_hub.publish.slash_command.view_on_hub")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex gap-x-2 items-center mb-3 -mt-8">
        <h3 className="text-xl font-semibold text-theme-text-primary px-6 py-3 flex items-center gap-x-2">
          {t("community_hub.publish.slash_command.modal_title")}
          <code className="bg-theme-bg-secondary rounded-lg px-1 text-theme-text-secondary text-lg font-mono">
            {entity.command}
          </code>
        </h3>
      </div>
      <form ref={formRef} className="flex" onSubmit={handleSubmit}>
        <div className="w-1/2 p-6 pt-0 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-theme-text-primary mb-1">
              {t("community_hub.publish.slash_command.name_label")}
            </label>
            <div className="text-xs text-theme-text-secondary mb-2">
              {t("community_hub.publish.slash_command.name_description")}
            </div>
            <input
              type="text"
              name="name"
              required
              minLength={3}
              maxLength={300}
              defaultValue={entity.name}
              placeholder={t(
                "community_hub.publish.slash_command.name_placeholder"
              )}
              className="border-none w-full bg-theme-bg-secondary rounded-lg p-2 text-theme-text-primary text-sm focus:outline-primary-button active:outline-primary-button outline-none placeholder:text-theme-text-placeholder"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-theme-text-primary mb-1">
              {t("community_hub.publish.slash_command.description_label")}
            </label>
            <div className="text-xs text-white/60 mb-2">
              {t("community_hub.publish.slash_command.description_description")}
            </div>
            <textarea
              name="description"
              required
              minLength={10}
              maxLength={1000}
              defaultValue={entity.description}
              placeholder={t(
                "community_hub.publish.slash_command.description_description"
              )}
              className="border-none w-full bg-theme-bg-secondary rounded-lg p-2 text-white text-sm focus:outline-primary-button active:outline-primary-button outline-none min-h-[80px] placeholder:text-theme-text-placeholder"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              {t("community_hub.publish.slash_command.tags_label")}
            </label>
            <div className="text-xs text-white/60 mb-2">
              {t("community_hub.publish.slash_command.tags_description")}
            </div>
            <div className="flex flex-wrap gap-2 p-2 bg-theme-bg-secondary rounded-lg min-h-[42px]">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-theme-text-primary bg-white/10 light:bg-black/10 rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="border-none text-theme-text-primary hover:text-theme-text-secondary cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t(
                  "community_hub.publish.slash_command.tags_placeholder"
                )}
                className="flex-1 min-w-[200px] border-none text-sm bg-transparent text-theme-text-primary placeholder:text-theme-text-placeholder p-0 h-[24px] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              {t("community_hub.publish.slash_command.visibility_label")}
            </label>
            <div className="text-xs text-white/60 mb-2">
              {visibility === "public"
                ? t("community_hub.publish.slash_command.public_description")
                : t("community_hub.publish.slash_command.private_description")}
            </div>
            <div className="w-fit h-[42px] bg-theme-bg-secondary rounded-lg p-0.5">
              <div className="flex items-center" role="group">
                <input
                  type="radio"
                  id="public"
                  name="visibility"
                  value="public"
                  className="peer/public hidden"
                  defaultChecked
                  onChange={(e) => setVisibility(e.target.value)}
                />
                <input
                  type="radio"
                  id="private"
                  name="visibility"
                  value="private"
                  className="peer/private hidden"
                  onChange={(e) => setVisibility(e.target.value)}
                />
                <label
                  htmlFor="public"
                  className="h-[36px] px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-theme-text-primary hover:text-theme-text-secondary peer-checked/public:bg-theme-sidebar-item-hover peer-checked/public:text-theme-primary-button flex items-center justify-center"
                >
                  Public
                </label>
                <label
                  htmlFor="private"
                  className="h-[36px] px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-theme-text-primary hover:text-theme-text-secondary peer-checked/private:bg-theme-sidebar-item-hover peer-checked/private:text-theme-primary-button flex items-center justify-center"
                >
                  Private
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 p-6 pt-0 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              {t("community_hub.publish.slash_command.prompt_label")}
            </label>
            <div className="text-xs text-white/60 mb-2">
              {t("community_hub.publish.slash_command.prompt_description")}
            </div>
            <textarea
              name="prompt"
              required
              minLength={10}
              defaultValue={entity.prompt}
              placeholder={t(
                "community_hub.publish.slash_command.prompt_placeholder"
              )}
              className="border-none w-full bg-theme-bg-secondary rounded-lg p-2 text-white text-sm focus:outline-primary-button active:outline-primary-button outline-none min-h-[300px] placeholder:text-theme-text-placeholder"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="border-none w-full bg-cta-button hover:opacity-80 text-theme-text-primary font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? t("community_hub.publish.slash_command.submitting")
              : t("community_hub.publish.slash_command.publish_button")}
          </button>
        </div>
      </form>
    </>
  );
}
