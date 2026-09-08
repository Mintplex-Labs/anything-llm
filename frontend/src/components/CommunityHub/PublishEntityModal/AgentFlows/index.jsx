import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import CommunityHub from "@/models/communityHub";
import showToast from "@/utils/toast";
import { X, CaretRight } from "@phosphor-icons/react";
import { BLOCK_INFO } from "@/pages/Admin/AgentBuilder/BlockList";
import {
  ModalHeader,
  ModalPrimaryButton,
  ModalLabel,
  ModalHint,
  ModalInput,
  ModalTextarea,
} from "@/components/lib/Modal";

export default function AgentFlows({ entity, onSuccess }) {
  const { t } = useTranslation();
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
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
      onSuccess(itemId);
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

  return (
    <>
      <div className="w-full flex gap-x-2 items-center mb-3 -mt-8 px-6 py-3">
        <ModalHeader
          title={t("community_hub.publish.agent_flow.modal_title")}
        />
      </div>
      <form ref={formRef} className="flex" onSubmit={handleSubmit}>
        <div className="w-1/2 p-6 pt-0 space-y-4">
          <ModalInput
            label={t("community_hub.publish.agent_flow.name_label")}
            hint={t("community_hub.publish.agent_flow.name_description")}
            type="text"
            name="name"
            required
            minLength={3}
            maxLength={300}
            defaultValue={entity.name}
            placeholder={t("community_hub.publish.agent_flow.name_placeholder")}
          />

          <ModalTextarea
            label={t("community_hub.publish.agent_flow.description_label")}
            hint={t("community_hub.publish.agent_flow.description_description")}
            name="description"
            required
            minLength={10}
            maxLength={1000}
            defaultValue={entity.description}
            placeholder={t(
              "community_hub.publish.agent_flow.description_description"
            )}
            className="min-h-[80px]"
          />
          <div>
            <ModalLabel>
              {t("community_hub.publish.agent_flow.tags_label")}
            </ModalLabel>
            <ModalHint className="mb-2">
              {t("community_hub.publish.agent_flow.tags_description")}
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
                  "community_hub.publish.agent_flow.tags_placeholder"
                )}
                className="flex-1 min-w-[200px] border-none text-sm bg-transparent text-slate-50 light:text-slate-900 placeholder:text-zinc-400 light:placeholder:text-slate-400 p-0 h-[24px] focus:outline-none"
              />
            </div>
          </div>
          <div>
            <ModalLabel>
              {t("community_hub.publish.agent_flow.visibility_label")}
            </ModalLabel>
            <ModalHint>
              {t("community_hub.publish.agent_flow.privacy_note")}
            </ModalHint>
          </div>
        </div>
        <div className="w-1/2 p-6 pt-0 flex flex-col gap-y-4">
          <div>
            <ModalLabel>Flow Steps</ModalLabel>
            <ModalHint>
              The steps the agent will follow when the flow is triggered.
            </ModalHint>
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
                      className="flex flex-col bg-zinc-800 light:bg-white border border-zinc-800 light:border-slate-300 rounded-lg px-3 py-2 w-full cursor-pointer group"
                      onClick={() => setExpandedStep(isExpanded ? null : idx)}
                    >
                      <div className="flex items-center gap-x-3 w-full">
                        <span>{info?.icon}</span>
                        <span className="text-slate-50 light:text-slate-900 text-sm font-medium flex-1">
                          {info?.label || step.type}
                        </span>
                        {!isExpanded && (
                          <span className="text-zinc-400 light:text-slate-600 text-xs ml-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px] min-w-0">
                            {summary}
                          </span>
                        )}
                        <span
                          className={`ml-2 text-zinc-400 light:text-slate-600 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                        >
                          <CaretRight size={16} />
                        </span>
                      </div>
                      {isExpanded && summary && (
                        <div className="w-full text-zinc-400 light:text-slate-600 text-xs mt-1 whitespace-pre-line break-words">
                          {summary}
                        </div>
                      )}
                    </div>
                    {idx < entity.steps.length - 1 && (
                      <span className="text-zinc-400 light:text-slate-600 text-lg my-1">
                        ↓
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-zinc-400 light:text-slate-600 text-xs">
                No steps defined.
              </div>
            )}
          </div>
          <ModalPrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full"
          >
            {isSubmitting
              ? t("community_hub.publish.agent_flow.submitting")
              : t("community_hub.publish.agent_flow.submit")}
          </ModalPrimaryButton>
        </div>
      </form>
    </>
  );
}
