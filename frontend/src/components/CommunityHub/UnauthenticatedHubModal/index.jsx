import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";
import paths from "@/utils/paths";
import { Link } from "react-router-dom";
import ModalWrapper from "@/components/ModalWrapper";

export default function UnauthenticatedHubModal({ show, onClose }) {
  const { t } = useTranslation();
  if (!show) return null;

  return (
    <ModalWrapper isOpen={show}>
      <div className="relative w-[400px] max-w-full bg-theme-bg-primary rounded-lg shadow border border-theme-modal-border">
        <div className="p-6">
          <button
            onClick={onClose}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={18} weight="bold" className="text-white" />
          </button>
          <div className="flex flex-col items-center justify-center gap-y-4">
            <h3 className="text-lg font-semibold text-white">
              {t("community_hub.publish.generic.unauthenticated.title")}
            </h3>
            <p className="text-lg text-white text-center max-w-[300px]">
              {t("community_hub.publish.generic.unauthenticated.description")}
            </p>
            <Link
              to={paths.communityHub.authentication()}
              className="w-[265px] bg-theme-bg-secondary hover:bg-theme-sidebar-item-hover text-theme-text-primary py-2 px-4 rounded-lg transition-colors mt-4 text-sm font-semibold text-center"
            >
              {t("community_hub.publish.generic.unauthenticated.button")}
            </Link>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
