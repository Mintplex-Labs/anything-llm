import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import SystemPrompts from "./SystemPrompts";
import UnauthenticatedHubModal from "@/components/UnauthenticatedHubModal";
import { useCommunityHubAuth } from "@/hooks/useCommunityHubAuth";

export default function PublishEntityModal({
  show,
  onClose,
  entityType,
  entity,
}) {
  const { t } = useTranslation();
  const { isAuthenticated, loading } = useCommunityHubAuth();
  if (!show) return null;

  if (loading) return null;
  if (!isAuthenticated) {
    return <UnauthenticatedHubModal show={show} onClose={onClose} />;
  }

  const renderEntityForm = () => {
    switch (entityType) {
      case "system-prompt":
        return <SystemPrompts entity={entity} />;
      // Other entities
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative w-[900px] max-w-full bg-theme-bg-primary rounded-lg shadow border border-theme-modal-border">
        <div className="relative p-6">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white">
              {t(`chat.prompt.publish.modal_title`)}
            </h3>
          </div>
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
    </div>
  );
}
