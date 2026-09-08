import { useTranslation } from "react-i18next";
import paths from "@/utils/paths";
import { Link } from "react-router-dom";
import Modal, { ModalHeader, ModalBody } from "@/components/lib/Modal";

export default function UnauthenticatedHubModal({ show, onClose }) {
  const { t } = useTranslation();
  if (!show) return null;

  return (
    <Modal isOpen={show} onClose={onClose} size="sm">
      <ModalHeader
        title={t("community_hub.publish.generic.unauthenticated.title")}
        onClose={onClose}
      />
      <ModalBody>
        <div className="flex flex-col items-center justify-center gap-y-4">
          <p className="text-sm text-zinc-300 light:text-slate-700 text-center max-w-[300px]">
            {t("community_hub.publish.generic.unauthenticated.description")}
          </p>
          <Link
            to={paths.communityHub.authentication()}
            className="w-[265px] bg-zinc-50 light:bg-slate-900 text-zinc-950 light:text-white py-2 px-4 rounded-lg hover:opacity-80 transition-all duration-200 mt-4 text-sm font-semibold text-center"
          >
            {t("community_hub.publish.generic.unauthenticated.button")}
          </Link>
        </div>
      </ModalBody>
    </Modal>
  );
}
