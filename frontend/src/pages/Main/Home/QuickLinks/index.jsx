import { ChatCenteredDots, FileArrowDown, Plus } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import Workspace from "@/models/workspace";
import paths from "@/utils/paths";
import { useManageWorkspaceModal } from "@/components/Modals/ManageWorkspace";
import ManageWorkspace from "@/components/Modals/ManageWorkspace";
import { useState, useEffect } from "react";
import { useNewWorkspaceModal } from "@/components/Modals/NewWorkspace";
import NewWorkspaceModal from "@/components/Modals/NewWorkspace";
import useUser from "@/hooks/useUser";
import System from "@/models/system";

export default function QuickLinks() {
  const navigate = useNavigate();
  const { showModal } = useManageWorkspaceModal();
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [isMultiUser, setIsMultiUser] = useState(false);
  const { user } = useUser();
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();

  useEffect(() => {
    System.isMultiUserMode().then(setIsMultiUser);
  }, []);

  const sendChat = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      navigate(paths.workspace.chat(firstWorkspace.slug));
    }
  };

  const embedDocument = async () => {
    const workspaces = await Workspace.all();
    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      setSelectedWorkspace(firstWorkspace);
      showModal();
    }
  };

  const createWorkspace = () => {
    showNewWsModal();
  };

  const isDefaultUser = isMultiUser && user?.role === "default";

  return (
    <div>
      <h1 className="text-theme-home-text uppercase text-sm font-semibold mb-4">
        Quick Links
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={sendChat}
          className="h-[45px] bg-theme-home-button-primary rounded-lg text-black flex items-center justify-center gap-x-2.5 transition-all duration-200 hover:bg-theme-home-button-primary-hover"
        >
          <ChatCenteredDots size={16} />
          Send Chat
        </button>
        {!isDefaultUser && (
          <>
            <button
              onClick={embedDocument}
              className="h-[45px] bg-theme-home-button-secondary rounded-lg text-theme-home-button-secondary-text flex items-center justify-center gap-x-2.5 transition-all duration-200 hover:bg-theme-home-button-secondary-hover hover:text-theme-home-button-secondary-hover-text"
            >
              <FileArrowDown size={16} />
              Embed a Document
            </button>
            <button
              onClick={createWorkspace}
              className="h-[45px] bg-theme-home-button-secondary rounded-lg text-theme-home-button-secondary-text flex items-center justify-center gap-x-2.5 transition-all duration-200 hover:bg-theme-home-button-secondary-hover hover:text-theme-home-button-secondary-hover-text"
            >
              <Plus size={16} />
              Create Workspace
            </button>
          </>
        )}
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
