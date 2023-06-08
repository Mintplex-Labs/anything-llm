import React, { useRef } from "react";
import { BookOpen, Briefcase, Cpu, GitHub, Key, Plus } from "react-feather";
import IndexCount from "./IndexCount";
import LLMStatus from "./LLMStatus";
import KeysModal, { useKeysModal } from "../Modals/Keys";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "../Modals/NewWorkspace";
import ActiveWorkspaces from "./ActiveWorkspaces";
import paths from "../../utils/paths";

export default function Sidebar() {
  const sidebarRef = useRef(null);
  const {
    showing: showingKeyModal,
    showModal: showKeyModal,
    hideModal: hideKeyModal,
  } = useKeysModal();
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();

  // const handleWidthToggle = () => {
  //   if (!sidebarRef.current) return false;
  //   sidebarRef.current.classList.add('translate-x-[-100%]')
  // }

  return (
    <>
      <div
        ref={sidebarRef}
        style={{ height: "calc(100% - 32px)" }}
        className="transition-all duration-500 relative m-[16px] rounded-[26px] bg-white dark:bg-black-900 min-w-[15.5%] p-[18px] "
      >
        {/* <button onClick={handleWidthToggle} className='absolute -right-[13px] top-[35%] bg-white w-auto h-auto bg-transparent flex items-center'>
        <svg width="16" height="96" viewBox="0 0 16 96" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#141414"><path d="M2.5 0H3C3 20 15 12 15 32V64C15 84 3 76 3 96H2.5V0Z" fill="black" fill-opacity="0.12" stroke="transparent" stroke-width="0px"></path><path d="M0 0H2.5C2.5 20 14.5 12 14.5 32V64C14.5 84 2.5 76 2.5 96H0V0Z" fill="#141414"></path></svg>
        <ChevronLeft className='absolute h-4 w-4 text-white mr-1' />
      </button> */}

        <div className="w-full h-full flex flex-col overflow-x-hidden items-between">
          {/* Header Information */}
          <div className="flex w-full items-center justify-between">
            <p className="text-xl font-base text-slate-600 dark:text-slate-200">
              AnythingLLM
            </p>
            <div className="flex gap-x-2 items-center text-slate-500">
              <button
                onClick={showKeyModal}
                className="transition-all duration-300 p-2 rounded-full bg-slate-200 text-slate-400 dark:bg-stone-800 hover:bg-slate-800 hover:text-slate-200 dark:hover:text-slate-200"
              >
                <Key className="h-4 w-4 " />
              </button>
            </div>
          </div>

          {/* Primary Body */}
          <div className="h-[100%] flex flex-col w-full justify-between pt-4 overflow-y-hidden">
            <div className="h-auto sidebar-items dark:sidebar-items">
              <div className="flex flex-col gap-y-4 h-[65vh] pb-8 overflow-y-scroll no-scroll">
                <div className="flex gap-x-2 items-center justify-between">
                  <button
                    onClick={showNewWsModal}
                    className="flex flex-grow w-[75%] h-[36px] gap-x-2 py-[5px] px-4 border border-slate-400 rounded-lg text-slate-800 dark:text-slate-200 justify-start items-center hover:bg-slate-100 dark:hover:bg-stone-900"
                  >
                    <Plus className="h-4 w-4" />
                    <p className="text-slate-800 dark:text-slate-200 text-xs leading-loose font-semibold">
                      New workspace
                    </p>
                  </button>
                </div>
                <ActiveWorkspaces />
              </div>
            </div>
            <div>
              <div className="flex flex-col gap-y-2">
                <div className="w-full flex items-center justify-between">
                  <LLMStatus />
                  <IndexCount />
                </div>
                <a
                  href={paths.hosting()}
                  target="_blank"
                  className="flex flex-grow w-[100%] h-[36px] gap-x-2 py-[5px] px-4 border border-slate-400 dark:border-transparent rounded-lg text-slate-800 dark:text-slate-200 justify-center items-center hover:bg-slate-100 dark:bg-stone-800 dark:hover:bg-stone-900"
                >
                  <Cpu className="h-4 w-4" />
                  <p className="text-slate-800 dark:text-slate-200 text-xs leading-loose font-semibold">
                    Managed cloud hosting
                  </p>
                </a>
                <a
                  href={paths.hosting()}
                  target="_blank"
                  className="flex flex-grow w-[100%] h-[36px] gap-x-2 py-[5px] px-4 border border-slate-400 dark:border-transparent rounded-lg text-slate-800 dark:text-slate-200 justify-center items-center hover:bg-slate-100  dark:bg-stone-800 dark:hover:bg-stone-900"
                >
                  <Briefcase className="h-4 w-4" />
                  <p className="text-slate-800 dark:text-slate-200 text-xs leading-loose font-semibold">
                    Enterprise Installation
                  </p>
                </a>
              </div>

              {/* Footer */}
              <div className="flex items-end justify-between mt-2">
                <div className="flex gap-x-1 items-center">
                  <a
                    href={paths.github()}
                    className="transition-all duration-300 p-2 rounded-full bg-slate-200 text-slate-400 dark:bg-slate-800 hover:bg-slate-800 hover:text-slate-200 dark:hover:text-slate-200"
                  >
                    <GitHub className="h-4 w-4 " />
                  </a>
                  <a
                    href={paths.docs()}
                    className="transition-all duration-300 p-2 rounded-full bg-slate-200 text-slate-400 dark:bg-slate-800 hover:bg-slate-800 hover:text-slate-200 dark:hover:text-slate-200"
                  >
                    <BookOpen className="h-4 w-4 " />
                  </a>
                </div>
                <a
                  href={paths.mailToMintplex()}
                  className="transition-all duration-300 text-xs text-slate-200 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  @MintplexLabs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showingKeyModal && <KeysModal hideModal={hideKeyModal} />}
      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
    </>
  );
}
