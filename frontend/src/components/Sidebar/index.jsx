import React, { useEffect, useRef, useState } from "react";
import { Plus, List } from "@phosphor-icons/react";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "../Modals/NewWorkspace";
import ActiveWorkspaces from "./ActiveWorkspaces";
import useLogo from "@/hooks/useLogo";
import useUser from "@/hooks/useUser";
import Footer from "../Footer";
import SettingsButton from "../SettingsButton";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import { useTranslation } from "react-i18next";
import { useSidebarToggle, ToggleSidebarButton } from "./SidebarToggle";

export default function Sidebar() {
  const { user } = useUser();
  const { logo } = useLogo();
  const sidebarRef = useRef(null);
  const { showSidebar, setShowSidebar, canToggleSidebar } = useSidebarToggle();
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();
  const { t } = useTranslation();

  return (
    <>
      <div
        style={{
          width: showSidebar ? "292px" : "0px",
          paddingLeft: showSidebar ? "0px" : "16px",
        }}
        className="transition-all duration-500"
      >
        <div className="flex shrink-0 w-full justify-center my-[18px]">
          <div className="flex justify-between w-[250px] min-w-[250px]">
            <Link to={paths.home()} aria-label="Home">
              <img
                src={logo}
                alt="Logo"
                className={`rounded max-h-[24px] object-contain transition-opacity duration-500 ${showSidebar ? "opacity-100" : "opacity-0"}`}
              />
            </Link>
            {canToggleSidebar && (
              <ToggleSidebarButton
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
              />
            )}
          </div>
        </div>
        <div
          ref={sidebarRef}
          className="relative m-[16px] rounded-[16px] bg-theme-bg-sidebar border-[2px] border-theme-sidebar-border light:border-none min-w-[250px] p-[10px] h-[calc(100%-76px)]"
        >
          <div className="flex flex-col h-full overflow-x-hidden">
            <div className="flex-grow flex flex-col min-w-[235px]">
              <div className="relative h-[calc(100%-60px)] flex flex-col w-full justify-between pt-[10px] overflow-y-scroll no-scroll">
                <div className="flex flex-col gap-y-2 pb-[60px] overflow-y-scroll no-scroll">
                  <div className="flex gap-x-2 items-center justify-between">
                    {(!user || user?.role !== "default") && (
                      <button
                        onClick={showNewWsModal}
                        className="light:bg-[#C2E7FE] light:hover:bg-[#7CD4FD] flex flex-grow w-[75%] h-[44px] gap-x-2 py-[5px] px-2.5 mb-2 bg-white rounded-[8px] text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
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
              <div className="absolute bottom-0 left-0 right-0 pt-4 pb-3 rounded-b-[16px] bg-theme-bg-sidebar bg-opacity-80 backdrop-filter backdrop-blur-md z-1">
                <Footer />
              </div>
            </div>
          </div>
        </div>
        {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
      </div>
    </>
  );
}

export function SidebarMobileHeader() {
  const { logo } = useLogo();
  const sidebarRef = useRef(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBgOverlay, setShowBgOverlay] = useState(false);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();
  const { user } = useUser();
  const { t } = useTranslation();

  useEffect(() => {
    // Darkens the rest of the screen
    // when sidebar is open.
    function handleBg() {
      if (showSidebar) {
        setTimeout(() => {
          setShowBgOverlay(true);
        }, 300);
      } else {
        setShowBgOverlay(false);
      }
    }
    handleBg();
  }, [showSidebar]);

  return (
    <>
      <div
        aria-label="Show sidebar"
        className="fixed top-0 left-0 right-0 z-10 flex justify-between items-center px-4 py-2 bg-theme-bg-sidebar light:bg-white text-slate-200 shadow-lg h-16"
      >
        <button
          onClick={() => setShowSidebar(true)}
          className="rounded-md p-2 flex items-center justify-center text-theme-text-secondary"
        >
          <List className="h-6 w-6" />
        </button>
        <div className="flex items-center justify-center flex-grow">
          <img
            src={logo}
            alt="Logo"
            className="block mx-auto h-6 w-auto"
            style={{ maxHeight: "40px", objectFit: "contain" }}
          />
        </div>
        <div className="w-12"></div>
      </div>
      <div
        style={{
          transform: showSidebar ? `translateX(0vw)` : `translateX(-100vw)`,
        }}
        className={`z-99 fixed top-0 left-0 transition-all duration-500 w-[100vw] h-[100vh]`}
      >
        <div
          className={`${
            showBgOverlay
              ? "transition-all opacity-1"
              : "transition-none opacity-0"
          }  duration-500 fixed top-0 left-0 bg-theme-bg-secondary bg-opacity-75 w-screen h-screen`}
          onClick={() => setShowSidebar(false)}
        />
        <div
          ref={sidebarRef}
          className="relative h-[100vh] fixed top-0 left-0  rounded-r-[26px] bg-theme-bg-sidebar w-[80%] p-[18px] "
        >
          <div className="w-full h-full flex flex-col overflow-x-hidden items-between">
            {/* Header Information */}
            <div className="flex w-full items-center justify-between gap-x-4">
              <div className="flex shrink-1 w-fit items-center justify-start">
                <img
                  src={logo}
                  alt="Logo"
                  className="rounded w-full max-h-[40px]"
                  style={{ objectFit: "contain" }}
                />
              </div>
              {(!user || user?.role !== "default") && (
                <div className="flex gap-x-2 items-center text-slate-500 shink-0">
                  <SettingsButton />
                </div>
              )}
            </div>

            {/* Primary Body */}
            <div className="h-full flex flex-col w-full justify-between pt-4 ">
              <div className="h-auto md:sidebar-items">
                <div className=" flex flex-col gap-y-4 overflow-y-scroll no-scroll pb-[60px]">
                  <div className="flex gap-x-2 items-center justify-between">
                    {(!user || user?.role !== "default") && (
                      <button
                        onClick={showNewWsModal}
                        className="flex flex-grow w-[75%] h-[44px] gap-x-2 py-[5px] px-4 bg-white rounded-lg text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
                      >
                        <Plus className="h-5 w-5" />
                        <p className="text-sidebar text-sm font-semibold">
                          {t("new-workspace.title")}
                        </p>
                      </button>
                    )}
                  </div>
                  <ActiveWorkspaces />
                </div>
              </div>
              <div className="z-99 absolute bottom-0 left-0 right-0 pt-2 pb-6 rounded-br-[26px] bg-theme-bg-sidebar bg-opacity-80 backdrop-filter backdrop-blur-md">
                <Footer />
              </div>
            </div>
          </div>
        </div>
        {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
      </div>
    </>
  );
}
