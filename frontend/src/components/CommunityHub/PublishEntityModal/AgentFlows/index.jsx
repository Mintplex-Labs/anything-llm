import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CommunityHub from "@/models/communityHub";
import showToast from "@/utils/toast";
import paths from "@/utils/paths";
import { X, CaretRight } from "@phosphor-icons/react";
import { BLOCK_INFO } from "@/pages/Admin/AgentBuilder/BlockList";
import { Link } from "react-router-dom";

export default function AgentFlows({ entity }) {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [itemId, setItemId] = useState(null);
  const [expandedStep, setExpandedStep] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);
    try {
      const form = new FormData(formRef.current);
      const data = {
        name: form.get("name"),
        description: form.get("description"),
        tags: tags,
        visibility: "private",
        flow: JSON.stringify({
          name: form.get("name"),
          description: form.get("description"),
          steps: entity.steps,
          tags: tags,
          visibility: "private",
        }),
      };
      const { success, error, itemId } =
        await CommunityHub.createAgentFlow(data);
      if (!success) throw new Error(error);
      setItemId(itemId);
      setIsSuccess(true);
    } catch (error) {
      console.error("Failed to publish agent flow:", error);
      showToast(`Failed to publish agent flow: ${error.message}`, "error", {
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
            {t("community_hub.publish.agent_flow.success_title")}
          </h3>
          <p className="text-lg text-theme-text-primary text-center max-w-2xl">
            {t("community_hub.publish.agent_flow.success_description")}
          </p>
          <p className="text-theme-text-secondary text-center text-sm">
            {t("community_hub.publish.agent_flow.success_thank_you")}
          </p>
          <Link
            to={paths.communityHub.viewItem("agent-flow", itemId)}
            target="_blank"
            rel="noreferrer"
            className="w-[265px] bg-theme-bg-secondary hover:bg-theme-sidebar-item-hover text-theme-text-primary py-2 px-4 rounded-lg transition-colors mt-4 text-sm font-semibold text-center"
          >
            {t("community_hub.publish.agent_flow.view_on_hub")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex gap-x-2 items-center mb-3 -mt-8">
        <h3 className="text-xl font-semibold text-theme-text-primary px-6 py-3">
          {t("community_hub.publish.agent_flow.modal_title")}
        </h3>
      </div>
      <form ref={formRef} className="flex" onSubmit={handleSubmit}>
        <div className="w-1/2 p-6 pt-0 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-theme-text-primary mb-1">
              {t("community_hub.publish.agent_flow.name_label")}
            </label>
            <div className="text-xs text-theme-text-secondary mb-2">
              {t("community_hub.publish.agent_flow.name_description")}
            </div>
            <input
              type="text"
              name="name"
              required
              minLength={3}
              maxLength={300}
              defaultValue={entity.name}
              placeholder={t(
                "community_hub.publish.agent_flow.name_placeholder"
              )}
              className="border-none w-full bg-theme-bg-secondary rounded-lg p-2 text-theme-text-primary text-sm focus:outline-primary-button active:outline-primary-button outline-none placeholder:text-theme-text-placeholder"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-theme-text-primary mb-1">
              {t("community_hub.publish.agent_flow.description_label")}
            </label>
            <div className="text-xs text-white/60 mb-2">
              {t("community_hub.publish.agent_flow.description_description")}
            </div>
            <textarea
              name="description"
              required
              minLength={10}
              maxLength={1000}
              defaultValue={entity.description}
              placeholder={t(
                "community_hub.publish.agent_flow.description_description"
              )}
              className="border-none w-full bg-theme-bg-secondary rounded-lg p-2 text-white text-sm focus:outline-primary-button active:outline-primary-button outline-none min-h-[80px] placeholder:text-theme-text-placeholder"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-1">
              {t("community_hub.publish.agent_flow.tags_label")}
            </label>
            <div className="text-xs text-white/60 mb-2">
              {t("community_hub.publish.agent_flow.tags_description")}
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
                  "community_hub.publish.agent_flow.tags_placeholder"
                )}
                className="flex-1 min-w-[200px] border-none text-sm bg-transparent text-theme-text-primary placeholder:text-theme-text-placeholder p-0 h-[24px] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-white">
              {t("community_hub.publish.agent_flow.visibility_label")}
            </label>
            <span className="text-xs text-theme-text-secondary">
              {t("community_hub.publish.agent_flow.privacy_note")}
            </span>
          </div>
        </div>
        <div className="w-1/2 p-6 pt-0 flex flex-col gap-y-4">
          <div>
            <label className="block text-sm font-semibold text-theme-text-primary mb-1">
              Flow Steps
            </label>
            <div className="text-xs text-white/60">
              The steps the agent will follow when the flow is triggered.
            </div>
          </div>
          <div className="flex flex-col gap-y-0.5">
            {entity.steps && entity.steps.length > 0 ? (
              entity.steps.map((step, idx) => {
                const info = BLOCK_INFO[step.type];
                const isExpanded = expandedStep === idx;
                const summary = info?.getSummary
                  ? info.getSummary(step.config)
                  : "";
                return (
                  <div key={idx} className="flex flex-col items-center w-full">
                    <div
                      className="flex flex-col bg-theme-bg-secondary rounded-lg px-3 py-2 w-full cursor-pointer group"
                      onClick={() => setExpandedStep(isExpanded ? null : idx)}
                    >
                      <div className="flex items-center gap-x-3 w-full">
                        <span>{info?.icon}</span>
                        <span className="text-theme-text-primary text-sm font-medium flex-1">
                          {info?.label || step.type}
                        </span>
                        {!isExpanded && (
                          <span className="text-theme-text-secondary text-xs ml-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px] min-w-0">
                            {summary}
                          </span>
                        )}
                        <span
                          className={`ml-2 text-theme-text-secondary transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        >
                          <CaretRight size={16} />
                        </span>
                      </div>
                      {isExpanded && summary && (
                        <div className="w-full text-theme-text-secondary text-xs mt-1 whitespace-pre-line break-words">
                          {summary}
                        </div>
                      )}
                    </div>
                    {idx < entity.steps.length - 1 && (
                      <span className="text-theme-text-secondary text-lg my-1">
                        ↓
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-theme-text-secondary text-xs">
                No steps defined.
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="border-none mt-4 w-full bg-cta-button hover:opacity-80 text-theme-text-primary font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting
              ? t("community_hub.publish.agent_flow.submitting")
              : t("community_hub.publish.agent_flow.submit")}
          </button>
        </div>
      </form>
    </>
  );
}
