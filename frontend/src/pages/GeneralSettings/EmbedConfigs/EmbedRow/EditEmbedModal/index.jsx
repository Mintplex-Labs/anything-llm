import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import {
  BooleanInput,
  ChatModeSelection,
  NumberInput,
  PermittedDomains,
  WorkspaceSelection,
  enforceSubmissionSchema,
} from "../../NewEmbedModal";
import Embed from "@/models/embed";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";
export default function EditEmbedModal({ embed, closeModal }) {
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    setError(null);
    e.preventDefault();
    const form = new FormData(e.target);
    const data = enforceSubmissionSchema(form);
    const { success, error } = await Embed.updateEmbed(embed.id, data);
    if (success) {
      showToast(t("editEmbedModal.updateSuccessMessage"), "success", {
        clear: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
    setError(error);
  };

  return (
    <div className="relative max-w-2xl max-h-full">
      <div className="relative bg-main-gradient rounded-lg shadow">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
          <h3 className="text-xl font-semibold text-white">
            {`${t("editEmbedModal.title")} #${embed.id}`}
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            data-modal-hide="staticModal"
          >
            <X className="text-gray-300 text-lg" />
          </button>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="p-6 space-y-6 flex h-auto max-h-[80vh] w-full overflow-y-scroll">
            <div className="w-full flex flex-col gap-y-6">
              <WorkspaceSelection defaultValue={embed.workspace.id} />
              <ChatModeSelection defaultValue={embed.chat_mode} />
              <PermittedDomains
                defaultValue={
                  embed.allowlist_domains
                    ? JSON.parse(embed.allowlist_domains)
                    : []
                }
              />
              <NumberInput
                name="max_chats_per_day"
                title={t("editEmbedModal.maxChatsPerDay")}
                hint={t("editEmbedModal.maxChatsPerDayHint")}
                defaultValue={embed.max_chats_per_day}
              />
              <NumberInput
                name="max_chats_per_session"
                title={t("editEmbedModal.maxChatsPerSession")}
                hint={t("editEmbedModal.maxChatsPerSessionHint")}
                defaultValue={embed.max_chats_per_session}
              />
              <BooleanInput
                name="allow_model_override"
                title={t("editEmbedModal.enableDynamicModelUse")}
                hint={t("editEmbedModal.enableDynamicModelUseHint")}
                defaultValue={embed.allow_model_override}
              />
              <BooleanInput
                name="allow_temperature_override"
                title={t("editEmbedModal.enableDynamicLLMTemperature")}
                hint={t("editEmbedModal.enableDynamicLLMTemperatureHint")}
                defaultValue={embed.allow_temperature_override}
              />
              <BooleanInput
                name="allow_prompt_override"
                title={t("editEmbedModal.enablePromptOverride")}
                hint={t("editEmbedModal.enablePromptOverrideHint")}
                defaultValue={embed.allow_prompt_override}
              />

              {error && (
                <p className="text-red-400 text-sm">
                  {t("editEmbedModal.errorMessage", { error })}
                </p>
              )}
              <p className="text-white text-xs md:text-sm pb-8">
                {t("editEmbedModal.embedCreationHint").split("{}")[0]}
                <code className="bg-stone-800 text-white mx-1 px-1 rounded-sm">
                  &lt;script&gt;
                </code>
                {t("editEmbedModal.embedCreationHint").split("{}")[1]}
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <button
              onClick={closeModal}
              type="button"
              className="px-4 py-2 rounded-lg text-white hover:bg-stone-900 transition-all duration-300"
            >
              {t("editEmbedModal.cancelButton")}
            </button>
            <button
              type="submit"
              className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              {t("editEmbedModal.updateButton")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
