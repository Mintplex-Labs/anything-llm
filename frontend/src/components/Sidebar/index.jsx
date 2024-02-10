import React, { useRef } from "react";
import { Wrench, Plus } from "@phosphor-icons/react";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "../Modals/NewWorkspace";
import ActiveWorkspaces from "./ActiveWorkspaces";
import paths from "@/utils/paths";
import useLogo from "@/hooks/useLogo";
import useUser from "@/hooks/useUser";
import { Link } from "react-router-dom";
import Footer from "../Footer";

export default function Sidebar() {
  const { user } = useUser();
  const { logo } = useLogo();
  const sidebarRef = useRef(null);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();

  return (
    <>
      <div
        ref={sidebarRef}
        style={{ height: "calc(100vh - 70px)" }}
        className="transition-all duration-500 relative m-[16px] rounded-[26px] bg-sidebar border-4 border-accent min-w-[250px] p-[18px]"
      >
        <div className="flex flex-col h-full overflow-x-hidden">
          {/* Header Information */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex shrink-0 max-w-[65%] items-center justify-start">
              <img
                src={logo}
                alt="Logo"
                className="rounded max-h-[40px] max-w-[100%]"
                style={{ objectFit: "contain" }}
              />
            </div>
            {(!user || user?.role !== "default") && (
              <div className="flex gap-x-2 items-center text-slate-200">
                <SettingsButton />
              </div>
            )}
          </div>

          {/* Primary Body */}
          <div className="flex-grow flex flex-col">
            <div className="flex flex-col gap-y-2 pb-8 overflow-y-scroll no-scroll">
              <div className="flex gap-x-2 items-center justify-between">
                {(!user || user?.role !== "default") && (
                  <button
                    onClick={showNewWsModal}
                    className="flex flex-grow w-[75%] h-[44px] gap-x-2 py-[5px] px-4 mb-2 bg-white rounded-lg text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
                  >
                    <Plus className="h-5 w-5" />
                    <p className="text-sidebar text-sm font-semibold">
                      New Workspace
                    </p>
                  </button>
                )}
              </div>
              <ActiveWorkspaces />
            </div>
            <div className="flex flex-col flex-grow justify-end mb-2">
              <Footer />
            </div>
          </div>
        </div>
      </div>
      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
    </>
  );
}

function SettingsButton() {
  const { user } = useUser();
  return (
    <Link
      to={!!user?.role ? paths.settings.system() : paths.settings.appearance()}
      className="transition-all duration-300 p-2 flex items-center justify-center rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
    >
      <Wrench className="h-4 w-4" weight="fill" />
    </Link>
  );
}
