import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BookOpen } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import WorkspaceRow from "./WorkspaceRow";
import NewWorkspaceModal from "./NewWorkspaceModal";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";

export default function AdminWorkspaces() {
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[86px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-white">
                Instance Workspaces
              </p>
              <button
                onClick={openModal}
                className="flex items-center gap-x-2 px-4 py-2 rounded-lg bg-[#2C2F36] text-white text-sm hover:bg-[#3D4147] shadow-md border border-[#3D4147]"
              >
                <BookOpen className="h-4 w-4" /> New Workspace
              </button>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              These are all the workspaces that exist on this instance. Removing
              a workspace will delete all of it's associated chats and settings.
            </p>
          </div>
          <WorkspacesContainer />
        </div>
        <ModalWrapper isOpen={isOpen}>
          <NewWorkspaceModal closeModal={closeModal} />
        </ModalWrapper>
      </div>
    </div>
  );
}

function WorkspacesContainer() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const _users = await Admin.users();
      const _workspaces = await Admin.workspaces();
      setUsers(_users);
      setWorkspaces(_workspaces);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="#3D4147"
        baseColor="#2C2F35"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <table className="w-full text-sm text-left rounded-lg mt-6">
      <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Link
          </th>
          <th scope="col" className="px-6 py-3">
            Users
          </th>
          <th scope="col" className="px-6 py-3">
            Created On
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {workspaces.map((workspace) => (
          <WorkspaceRow
            key={workspace.id}
            workspace={workspace}
            users={users}
          />
        ))}
      </tbody>
    </table>
  );
}
