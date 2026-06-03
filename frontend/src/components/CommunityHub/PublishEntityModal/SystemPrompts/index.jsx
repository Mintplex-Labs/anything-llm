import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CommunityHub from "@/models/communityHub";
import showToast from "@/utils/toast";
import paths from "@/utils/paths";
import { X } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import {
  ModalHeader,
  ModalPrimaryButton,
  ModalLabel,
  ModalHint,
  ModalInput,
  ModalTextarea,
} from "@/components/lib/Modal";

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
          <h3 className="text-lg font-semibold text-slate-50 light:text-slate-900">
            {t("community_hub.publish.system_prompt.success_title")}
          </h3>
          <p className="text-lg text-slate-50 light:text-slate-900 text-center max-w-2xl">
            {t("community_hub.publish.system_prompt.success_description")}
          </p>
          <p className="text-zinc-400 light:text-slate-600 text-center text-sm">
            {t("community_hub.publish.system_prompt.success_thank_you")}
          </p>
          <Link
            to={paths.communityHub.viewItem("system-prompt", itemId)}
            target="_blank"
            rel="noreferrer"
            className="w-[265px] bg-zinc-800 light:bg-slate-100 hover:bg-zinc-700 light:hover:bg-slate-200 text-slate-50 light:text-slate-900 py-2 px-4 rounded-lg transition-colors mt-4 text-sm font-semibold text-center"
          >
            {t("community_hub.publish.system_prompt.view_on_hub")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex gap-x-2 items-center mb-3 -mt-8 px-6 py-3">
        <ModalHeader
          title={t(`community_hub.publish.system_prompt.modal_title`)}
        />
      </div>
      <form ref={formRef} className="flex" onSubmit={handleSubmit}>
        <div className="w-1/2 p-6 pt-0 space-y-4">
          <ModalInput
            label={t("community_hub.publish.system_prompt.name_label")}
            hint={t("community_hub.publish.system_prompt.name_description")}
            type="text"
            name="name"
            required
            minLength={3}
            maxLength={300}
            placeholder={t(
              "community_hub.publish.system_prompt.name_placeholder"
            )}
          />

          <ModalTextarea
            label={t("community_hub.publish.system_prompt.description_label")}
            hint={t(
              "community_hub.publish.system_prompt.description_description"
            )}
            name="description"
            required
            minLength={10}
            maxLength={1000}
            placeholder={t(
              "community_hub.publish.system_prompt.description_description"
            )}
            className="min-h-[80px]"
          />
          <div>
            <ModalLabel>
              {t("community_hub.publish.system_prompt.tags_label")}
            </ModalLabel>
            <ModalHint className="mb-2">
              {t("community_hub.publish.system_prompt.tags_description")}
            </ModalHint>
            <div className="flex flex-wrap gap-2 p-2 bg-zinc-800 light:bg-white border border-zinc-800 light:border-slate-300 rounded-lg min-h-[42px]">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-slate-50 light:text-slate-900 bg-white/10 light:bg-black/10 rounded-md"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="border-none bg-transparent text-slate-50 light:text-slate-900 hover:text-zinc-400 light:hover:text-slate-600 cursor-pointer"
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
                  "community_hub.publish.system_prompt.tags_placeholder"
                )}
                className="flex-1 min-w-[200px] border-none text-sm bg-transparent text-slate-50 light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-400 p-0 h-[24px] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <ModalLabel>
              {t("community_hub.publish.system_prompt.visibility_label")}
            </ModalLabel>
            <ModalHint className="mb-2">
              {visibility === "public"
                ? t("community_hub.publish.system_prompt.public_description")
                : t("community_hub.publish.system_prompt.private_description")}
            </ModalHint>
            <div className="w-fit h-[42px] bg-zinc-800 light:bg-white border border-zinc-800 light:border-slate-300 rounded-lg p-0.5">
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
                  className="h-[36px] px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-slate-50 light:text-slate-900 hover:text-zinc-400 light:hover:text-slate-600 peer-checked/public:bg-zinc-700 light:peer-checked/public:bg-slate-200 flex items-center justify-center"
                >
                  Public
                </label>
                <label
                  htmlFor="private"
                  className="h-[36px] px-4 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer text-slate-50 light:text-slate-900 hover:text-zinc-400 light:hover:text-slate-600 peer-checked/private:bg-zinc-700 light:peer-checked/private:bg-slate-200 flex items-center justify-center"
                >
                  Private
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 p-6 pt-0 space-y-4">
          <ModalTextarea
            label={t("community_hub.publish.system_prompt.prompt_label")}
            hint={t("community_hub.publish.system_prompt.prompt_description")}
            name="prompt"
            required
            minLength={10}
            defaultValue={entity}
            placeholder={t(
              "community_hub.publish.system_prompt.prompt_placeholder"
            )}
            className="min-h-[300px]"
          />

          <ModalPrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting
              ? t("community_hub.publish.system_prompt.submitting")
              : t("community_hub.publish.system_prompt.publish_button")}
          </ModalPrimaryButton>
        </div>
      </form>
    </>
  );
}
