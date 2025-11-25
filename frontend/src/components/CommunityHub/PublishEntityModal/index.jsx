import { X } from "@phosphor-icons/react";
import { useCommunityHubAuth } from "@/hooks/useCommunityHubAuth";
import UnauthenticatedHubModal from "@/components/CommunityHub/UnauthenticatedHubModal";
import SystemPrompts from "./SystemPrompts";
import ModalWrapper from "@/components/ModalWrapper";
import AgentFlows from "./AgentFlows";
import SlashCommands from "./SlashCommands";

export default function PublishEntityModal({
  show,
  onClose,
  entityType,
  entity,
}) {
  const { isAuthenticated, loading } = useCommunityHubAuth();
  if (!show || loading) return null;
  if (!isAuthenticated)
    return <UnauthenticatedHubModal show={show} onClose={onClose} />;

  const renderEntityForm = () => {
    switch (entityType) {
      case "system-prompt":
        return <SystemPrompts entity={entity} />;
      case "agent-flow":
        return <AgentFlows entity={entity} />;
      case "slash-command":
        return <SlashCommands entity={entity} />;
      default:
        return null;
    }
  };

  return (
    <ModalWrapper isOpen={show}>
      <div className="relative max-w-[900px] bg-theme-bg-primary rounded-lg shadow border border-theme-modal-border">
        <div className="relative p-6">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={18} weight="bold" className="text-white" />
          </button>
        </div>
        {renderEntityForm()}
      </div>
    </ModalWrapper>
  );
}
