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
      <h1 className="text-white uppercase text-sm font-semibold mb-4">
        Quick Links
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          onClick={sendChat}
          className="h-[45px] bg-[#36BFFA] rounded-lg text-black flex items-center justify-center gap-x-2.5 transition-all duration-200 hover:bg-[#36BFFA]/90"
        >
          <ChatCenteredDots size={16} />
          Send Chat
        </button>
        {!isDefaultUser && (
          <>
            <button
              onClick={embedDocument}
              className="h-[45px] bg-[#27282A] rounded-lg text-white flex items-center justify-center gap-x-2.5 transition-all duration-200 hover:bg-[#36BFFA]/10 hover:text-[#36BFFA]"
            >
              <FileArrowDown size={16} />
              Embed a Document
            </button>
            <button
              onClick={createWorkspace}
              className="h-[45px] bg-[#27282A] rounded-lg text-white flex items-center justify-center gap-x-2.5 transition-all duration-200 hover:bg-[#36BFFA]/10 hover:text-[#36BFFA]"
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
