import React, { useRef } from "react";
import { Plus } from "@phosphor-icons/react";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "../Modals/NewWorkspace";
import ActiveWorkspaces from "./ActiveWorkspaces";
import useLogo from "@/hooks/useLogo";
import useUser from "@/hooks/useUser";
import { Link } from "react-router-dom";
import Footer from "../Footer";
import SettingsButton from "../SettingsButton";
import paths from "@/utils/paths";

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
    <div>
      <Link
        to={paths.home()}
        className="flex shrink-0 max-w-[55%] items-center justify-start mx-[38px] my-[18px]"
      >
        <img
          src={logo}
          alt="Logo"
          className="rounded max-h-[24px]"
          style={{ objectFit: "contain" }}
        />
      </Link>
      <div
        ref={sidebarRef}
        style={{ height: "calc(100vh - 116px)" }}
        className="relative m-[16px] rounded-[26px] bg-sidebar border-4 border-accent min-w-[250px] p-[10px]"
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
                    className="flex flex-grow w-[75%] h-[44px] gap-x-2 py-[5px] px-2.5 mb-2 bg-white rounded-[8px] text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
                  >
                    <Plus size={18} weight="bold" />
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
    </div>
  );
}
