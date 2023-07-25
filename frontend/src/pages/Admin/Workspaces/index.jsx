import { useEffect, useState } from "react";
import Sidebar, { SidebarMobileHeader } from "../../../components/AdminSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BookOpen } from "react-feather";
import usePrefersDarkMode from "../../../hooks/usePrefersDarkMode";
import Admin from "../../../models/admin";
import WorkspaceRow from "./WorkspaceRow";
import NewWorkspaceModal, { NewWorkspaceModalId } from "./NewWorkspaceModal";

export default function AdminWorkspaces() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-orange-100 dark:bg-stone-700 flex">
      {!isMobile && <Sidebar />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-white dark:bg-black-900 md:min-w-[82%] p-[18px] h-full overflow-y-scroll"
      >
        {isMobile && <SidebarMobileHeader />}
        <div className="flex flex-col w-full px-1 md:px-8">
          <div className="w-full flex flex-col gap-y-1">
            <div className="items-center flex gap-x-4">
              <p className="text-3xl font-semibold text-slate-600 dark:text-slate-200">
                Instance workspaces
              </p>
              <button
                onClick={() =>
                  document?.getElementById(NewWorkspaceModalId)?.showModal()
                }
                className="border border-slate-800 dark:border-slate-200 px-4 py-1 rounded-lg text-slate-800 dark:text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-800 hover:text-slate-100 dark:hover:bg-slate-200 dark:hover:text-slate-800"
              >
                <BookOpen className="h-4 w-4" /> New Workspace
              </button>
            </div>
            <p className="text-sm font-base text-slate-600 dark:text-slate-200">
              These are all the workspaces that exist on this instance. Removing
              a workspace will delete all of it's associated chats and settings.
            </p>
          </div>
          <WorkspacesContainer />
        </div>
        <NewWorkspaceModal />
      </div>
    </div>
  );
}

function WorkspacesContainer() {
  const darkMode = usePrefersDarkMode();
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
        baseColor={darkMode ? "#2a3a53" : null}
        highlightColor={darkMode ? "#395073" : null}
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <table className="md:w-3/4 w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg mt-5">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-stone-800 dark:text-gray-400">
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
            Actions
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
