import { X } from "@phosphor-icons/react";
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
    <Modal isOpen={show} onClose={onClose} variant="bare">
      <div className="relative w-full max-w-[900px] mx-4 max-h-[90vh] overflow-y-auto bg-zinc-900 light:bg-white rounded-lg shadow-xs border border-zinc-800 light:border-slate-300">
        <div className="relative p-6">
          <button
            onClick={onClose}
            type="button"
            aria-label="Close"
            className="absolute top-4 right-4 transition-colors duration-200 bg-transparent rounded-lg p-1 inline-flex items-center text-slate-50 light:text-slate-900 hover:bg-zinc-800 light:hover:bg-slate-100 border-none"
          >
            <X size={16} weight="bold" />
          </button>
        </div>
        {renderEntityForm()}
      </div>
    </Modal>
  );
}
