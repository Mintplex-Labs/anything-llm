import { ChatCenteredDots, FileArrowDown, Plus } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import { useManageWorkspaceModal } from "@/components/Modals/ManageWorkspace";
import ManageWorkspace from "@/components/Modals/ManageWorkspace";
import { useState } from "react";
import { useNewWorkspaceModal } from "@/components/Modals/NewWorkspace";
import NewWorkspaceModal from "@/components/Modals/NewWorkspace";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";

export default function QuickLinks() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showModal } = useManageWorkspaceModal();
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();

  const sendChat = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(paths.workspace.chat(firstWorkspace.slug));
    } else {
      showToast(t("main-page.noWorkspaceError"), "warning", {
        clear: true,
      });
      showNewWsModal();
    }
  };

  const embedDocument = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      setSelectedWorkspace(firstWorkspace);
      showModal();
    } else {
      showToast(t("main-page.noWorkspaceError"), "warning", {
        clear: true,
      });
      showNewWsModal();
    }
  };

  const createWorkspace = () => {
    showNewWsModal();
  };

  return (
    <div>
      <h1 className="text-theme-home-text uppercase text-sm font-semibold mb-4">
        {t("main-page.quickLinks.title")}
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={sendChat}
          className="h-[45px] text-sm font-semibold bg-theme-home-button-secondary rounded-lg text-theme-home-button-secondary-text flex items-center justify-center gap-x-2.5 transition-all duration-200 hover:bg-theme-home-button-secondary-hover hover:text-theme-home-button-secondary-hover-text"
        >
          <ChatCenteredDots size={16} />
          {t("main-page.quickLinks.sendChat")}
        </button>
        <button
          onClick={embedDocument}
          className="h-[45px] text-sm font-semibold bg-theme-home-button-secondary rounded-lg text-theme-home-button-secondary-text flex items-center justify-center gap-x-2.5 transition-all duration-200 hover:bg-theme-home-button-secondary-hover hover:text-theme-home-button-secondary-hover-text"
        >
          <FileArrowDown size={16} />
          {t("main-page.quickLinks.embedDocument")}
        </button>
        <button
          onClick={createWorkspace}
          className="h-[45px] text-sm font-semibold bg-theme-home-button-secondary rounded-lg text-theme-home-button-secondary-text flex items-center justify-center gap-x-2.5 transition-all duration-200 hover:bg-theme-home-button-secondary-hover hover:text-theme-home-button-secondary-hover-text"
        >
          <Plus size={16} />
          {t("main-page.quickLinks.createWorkspace")}
        </button>
      </div>

      {selectedWorkspace && (
        <ManageWorkspace
          providedSlug={selectedWorkspace.slug}
          hideModal={() => {
            setSelectedWorkspace(null);
          }}
        />
      )}

      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
    </div>
  );
}
