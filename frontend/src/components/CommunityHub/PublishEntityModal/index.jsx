import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import paths from "@/utils/paths";
import { useCommunityHubAuth } from "@/hooks/useCommunityHubAuth";
import UnauthenticatedHubModal from "@/components/CommunityHub/UnauthenticatedHubModal";
import SystemPrompts from "./SystemPrompts";
import Modal from "@/components/lib/Modal";
import AgentFlows from "./AgentFlows";
import SlashCommands from "./SlashCommands";

export default function PublishEntityModal({
  show,
  onClose,
  entityType,
  entity,
}) {
  const { isAuthenticated, loading } = useCommunityHubAuth();
  const [successItemId, setSuccessItemId] = useState(null);
  if (!show || loading) return null;
  if (!isAuthenticated)
    return <UnauthenticatedHubModal show={show} onClose={onClose} />;

  const isSuccess = !!successItemId;
  const handleClose = () => {
    setSuccessItemId(null);
    onClose();
  };

  const renderEntityForm = () => {
    switch (entityType) {
      case "system-prompt":
        return <SystemPrompts entity={entity} onSuccess={setSuccessItemId} />;
      case "agent-flow":
        return <AgentFlows entity={entity} onSuccess={setSuccessItemId} />;
      case "slash-command":
        return <SlashCommands entity={entity} onSuccess={setSuccessItemId} />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={show} onClose={handleClose} variant="bare">
      <div
        className={`relative w-full ${
          isSuccess ? "max-w-[460px]" : "max-w-[900px]"
        } mx-4 max-h-[90vh] overflow-y-auto bg-zinc-900 light:bg-white rounded-lg shadow-xs border border-zinc-800 light:border-slate-300`}
      >
        <div className="relative p-6">
          <button
            onClick={handleClose}
            type="button"
            aria-label="Close"
            className="absolute top-4 right-4 transition-colors duration-200 bg-transparent rounded-lg p-1 inline-flex items-center text-slate-50 light:text-slate-900 hover:bg-zinc-800 light:hover:bg-slate-100 border-none"
          >
            <X size={16} weight="bold" />
          </button>
        </div>
        {isSuccess ? (
          <PublishSuccess entityType={entityType} itemId={successItemId} />
        ) : (
          renderEntityForm()
        )}
      </div>
    </Modal>
  );
}

function successCopy(entityType, t) {
  switch (entityType) {
    case "system-prompt":
      return {
        title: t("community_hub.publish.system_prompt.success_title"),
        description: t(
          "community_hub.publish.system_prompt.success_description"
        ),
        thankYou: t("community_hub.publish.system_prompt.success_thank_you"),
        viewOnHub: t("community_hub.publish.system_prompt.view_on_hub"),
      };
    case "agent-flow":
      return {
        title: t("community_hub.publish.agent_flow.success_title"),
        description: t("community_hub.publish.agent_flow.success_description"),
        thankYou: t("community_hub.publish.agent_flow.success_thank_you"),
        viewOnHub: t("community_hub.publish.agent_flow.view_on_hub"),
      };
    case "slash-command":
      return {
        title: t("community_hub.publish.slash_command.success_title"),
        description: t(
          "community_hub.publish.slash_command.success_description"
        ),
        thankYou: t("community_hub.publish.slash_command.success_thank_you"),
        viewOnHub: t("community_hub.publish.slash_command.view_on_hub"),
      };
    default:
      return null;
  }
}

function PublishSuccess({ entityType, itemId }) {
  const { t } = useTranslation();
  const copy = successCopy(entityType, t);
  if (!copy) return null;
  return (
    <div className="px-6 pb-8 flex flex-col items-center justify-center text-center gap-y-2">
      <h3 className="text-lg font-semibold text-slate-50 light:text-slate-900">
        {copy.title}
      </h3>
      <p className="text-lg text-slate-50 light:text-slate-900">
        {copy.description}
      </p>
      <p className="text-zinc-400 light:text-slate-600 text-sm">
        {copy.thankYou}
      </p>
      <Link
        to={paths.communityHub.viewItem(entityType, itemId)}
        target="_blank"
        rel="noreferrer"
        className="w-full bg-zinc-800 light:bg-slate-100 hover:bg-zinc-700 light:hover:bg-slate-200 text-slate-50 light:text-slate-900 py-2 px-4 rounded-lg transition-colors mt-4 text-sm font-semibold text-center"
      >
        {copy.viewOnHub}
      </Link>
    </div>
  );
}
