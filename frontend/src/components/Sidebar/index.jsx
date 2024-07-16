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
import paths from "@/utils/paths";
import { useTranslation } from "react-i18next";

export default function Sidebar() {
  const { user } = useUser();
  const { logo } = useLogo();
  const sidebarRef = useRef(null);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();
  const { t } = useTranslation();

  return (
    <div>
      <Link
        to={paths.home()}
        className="flex shrink-0 max-w-[55%] items-center justify-start mx-[38px] my-[18px]"
        aria-label="Home"
      >
        <img
          src={logo}
          alt="Logo"
          className="rounded max-h-[24px] object-contain"
        />
      </Link>
      <div
        ref={sidebarRef}
        style={{ height: "calc(100vh - 116px)" }}
        className="relative m-[16px] rounded-[16px] bg-sidebar border-2 border-outline min-w-[250px] p-[10px]"
      >
        <div className="flex flex-col h-full overflow-x-hidden">
          <div className="flex-grow flex flex-col min-w-[235px]">
            <div className="relative h-[calc(100%-60px)] flex flex-col w-full justify-between pt-[10px] overflow-y-scroll no-scroll">
              <div className="flex flex-col gap-y-2 pb-[60px] overflow-y-scroll no-scroll">
                <div className="flex gap-x-2 items-center justify-between">
                  {(!user || user?.role !== "default") && (
                    <button
                      onClick={showNewWsModal}
                      className="flex flex-grow w-[75%] h-[44px] gap-x-2 py-[5px] px-2.5 mb-2 bg-white rounded-[8px] text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
                    >
                      <Plus size={18} weight="bold" />
                      <p className="text-sidebar text-sm font-semibold">
                        {t("new-workspace.title")}
                      </p>
                    </button>
                  )}
                </div>
                <ActiveWorkspaces />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 pt-4 pb-3 rounded-b-[16px] bg-sidebar bg-opacity-80 backdrop-filter backdrop-blur-md z-10">
              <Footer />
            </div>
          </div>
        </div>
      </div>
      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
    </div>
  );
}
