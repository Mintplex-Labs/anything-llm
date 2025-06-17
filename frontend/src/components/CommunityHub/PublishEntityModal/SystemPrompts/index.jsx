import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CommunityHub from "@/models/communityHub";
import showToast from "@/utils/toast";
import paths from "@/utils/paths";
import { X } from "@phosphor-icons/react";

export default function SystemPrompts({ entity }) {
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
        prompt: form.get("prompt"),
        tags: tags,
        visibility: visibility,
      };

      const { success, error, itemId } =
        await CommunityHub.createSystemPrompt(data);
      if (!success) throw new Error(error);
      setItemId(itemId);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to publish prompt:", error);
      showToast(`Failed to publish prompt: ${error.message}`, "error", {
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
            {t("chat.prompt.publish.success_title")}
          </h3>
          <p className="text-lg text-theme-text-primary text-center max-w-2xl">
            {t("chat.prompt.publish.success_description")}
          </p>
          <p className="text-theme-text-secondary text-center text-sm">
            {t("chat.prompt.publish.success_thank_you")}
          </p>
          <a
            href={paths.communityHub.viewItem("system-prompt", itemId)}
            target="_blank"
            rel="noreferrer"
            className="w-[265px] bg-theme-bg-secondary hover:bg-theme-sidebar-item-hover text-theme-text-primary py-2 px-4 rounded-lg transition-colors mt-4 text-sm font-semibold text-center"
          >
            {t("chat.prompt.publish.view_on_hub")}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex gap-x-2 items-center mb-3 -mt-8">
        <h3 className="text-xl font-semibold text-theme-text-primary px-6 py-3">
          {t(`chat.prompt.publish.modal_title`)}
        </h3>
      </div>
      <form ref={formRef} className="flex" onSubmit={handleSubmit}>
        <div className="w-1/2 p-6 pt-0 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-theme-text-primary mb-1">
              {t("chat.prompt.publish.name_label")}
            </label>
            <div className="text-xs text-theme-text-secondary mb-2">
              {t("chat.prompt.publish.name_description")}
            </div>
            <input
              type="text"
              name="name"
              required
              minLength={3}
              maxLength={300}
              placeholder={t("chat.prompt.publish.name_placeholder")}
              className="w-full bg-theme-bg-secondary rounded-lg p-2 text-theme-text-primary text-sm focus:outline-primary-button active:outline-primary-button outline-none placeholder:text-theme-text-placeholder"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-theme-text-primary mb-1">
              {t("chat.prompt.publish.description_label")}
            </label>
            <div className="text-xs text-white/60 mb-2">
              {t("chat.prompt.publish.description_description")}
            </div>
            <textarea
              name="description"
              required
              minLength={10}
              maxLength={1000}
              placeholder={t("chat.prompt.publish.description_description")}
              className="w-full bg-theme-bg-secondary rounded-lg p-2 text-white text-sm focus:outline-primary-button active:outline-primary-button outline-none min-h-[80px] placeholder:text-theme-text-placeholder"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              {t("chat.prompt.publish.tags_label")}
            </label>
            <div className="text-xs text-white/60 mb-2">
              {t("chat.prompt.publish.tags_description")}
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
                placeholder={t("chat.prompt.publish.tags_placeholder")}
                className="flex-1 min-w-[200px] border-none text-sm bg-transparent text-theme-text-primary placeholder:text-theme-text-placeholder p-0 h-[24px] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              {t("chat.prompt.publish.visibility_label")}
            </label>
            <div className="text-xs text-white/60 mb-2">
              {visibility === "public"
                ? t("chat.prompt.publish.public_description")
                : t("chat.prompt.publish.private_description")}
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
              {t("chat.prompt.publish.prompt_label")}
            </label>
            <div className="text-xs text-white/60 mb-2">
              {t("chat.prompt.publish.prompt_description")}
            </div>
            <textarea
              name="prompt"
              required
              minLength={10}
              defaultValue={entity}
              placeholder={t("chat.prompt.publish.prompt_placeholder")}
              className="w-full bg-theme-bg-secondary rounded-lg p-2 text-white text-sm focus:outline-primary-button active:outline-primary-button outline-none min-h-[300px] placeholder:text-theme-text-placeholder"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cta-button hover:opacity-80 text-theme-text-primary font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? t("chat.prompt.publish.publishing")
              : t("chat.prompt.publish.publish_button")}
          </button>
        </div>
      </form>
    </>
  );
}
