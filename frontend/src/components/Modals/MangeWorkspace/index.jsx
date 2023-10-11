import React, { useState, useEffect } from "react";
import { Archive, Sliders, UploadCloud, X } from "react-feather";
import DocumentSettings from "./Documents";
import WorkspaceSettings from "./Settings";
import { useParams } from "react-router-dom";
import Workspace from "../../../models/workspace";
import System from "../../../models/system";
import UploadToWorkspace from "./Upload";
import { ArrowsDownUp, CloudArrowUp, Plus } from "@phosphor-icons/react";

const TABS = {
  documents: DocumentSettings,
  settings: WorkspaceSettings,
  upload: UploadToWorkspace,
};

const DIALOG_ID = "manage-workspace-modal";

const noop = () => false;
// export default function ManageWorkspace({
//   hideModal = noop,
//   providedSlug = null,
// }) {
//   const { slug } = useParams();
//   const [selectedTab, setSelectedTab] = useState("documents");
//   const [workspace, setWorkspace] = useState(null);
//   const [fileTypes, setFileTypes] = useState(null);

//   useEffect(() => {
//     async function checkSupportedFiletypes() {
//       const acceptedTypes = await System.acceptedDocumentTypes();
//       setFileTypes(acceptedTypes ?? {});
//     }
//     checkSupportedFiletypes();
//   }, []);

//   useEffect(() => {
//     async function fetchWorkspace() {
//       const workspace = await Workspace.bySlug(providedSlug ?? slug);
//       setWorkspace(workspace);
//     }
//     fetchWorkspace();
//   }, [selectedTab, slug]);

//   if (!workspace) return null;

//   const Component = TABS[selectedTab || "documents"];
//   return (
//     <div className="relative max-h-full transition duration-300">
//       {/* Close on click outside of modal */}
//       <div
//         className="flex fixed top-0 left-0 right-0 w-full h-full"
//         onClick={hideModal}
//       />
//       {/*  */}

//       <div className="relative w-full max-w-2xl max-h-full">
//         <div className="relative bg-white rounded-lg shadow dark:bg-stone-700">
//           <div className="flex flex-col gap-y-1 border-b dark:border-gray-600 px-4 pt-4 ">
// <div className="flex items-start justify-between p-8 border-b rounded-t border-gray-500/50">
//             <div className="flex flex-col gap-2">
//               <h3 className="text-xl font-semibold text-white">
//                 {workspace.name}
//               </h3>
//               {/* <p className="text-sm font-base text-white text-opacity-60">
//                 {steps[currentStep].description || ""}
//               </p> */}
//             </div>

//             <button
//               onClick={hideModal}
//               type="button"
//               className="transition-all duration-300 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:border-white/60 bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
//             >
//               <X className="text-gray-300 text-lg" />
//             </button>
//           </div>
//             <WorkspaceSettingTabs
//               selectedTab={selectedTab}
//               changeTab={setSelectedTab}
//             />
//           </div>
//           <Component
//             hideModal={hideModal}
//             workspace={workspace}
//             fileTypes={fileTypes}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

export default function ManageWorkspace({
  hideModal = noop,
  providedSlug = null,
}) {
  const { slug } = useParams();
  const [selectedTab, setSelectedTab] = useState("documents");
  const [workspace, setWorkspace] = useState(null);
  const [fileTypes, setFileTypes] = useState(null);

  useEffect(() => {
    async function checkSupportedFiletypes() {
      const acceptedTypes = await System.acceptedDocumentTypes();
      setFileTypes(acceptedTypes ?? {});

      console.log(acceptedTypes.accept);
    }
    checkSupportedFiletypes();
  }, []);

  useEffect(() => {
    async function fetchWorkspace() {
      const workspace = await Workspace.bySlug(providedSlug ?? slug);
      setWorkspace(workspace);
    }
    fetchWorkspace();
  }, [selectedTab, slug]);

  if (!workspace) return null;

  const Component = TABS[selectedTab || "documents"];
  return (
    <dialog id={DIALOG_ID} className="bg-transparent outline-none">
      <div className={`relative max-h-full transition duration-300`}>
        <div className="relative bg-main-gradient rounded-2xl shadow border-2 border-slate-300/10">
          <div className="flex items-start justify-between p-2 rounded-t border-gray-500/50">
            <button
              onClick={hideModal}
              type="button"
              className="transition-all duration-300 text-gray-400 bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center hover:border-white/60 bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>
          <div className="flex gap-x-6 justify-center">
            {/* My Document */}
            <div className="px-8 pb-8">
              <div className="flex flex-col gap-y-6">
                <div className="flex items-center justify-between w-[560px] px-5">
                  <h3 className="text-white text-base font-bold">
                    My Documents
                  </h3>
                  <div className="flex items-center text-white/80 gap-x-1">
                    <Plus className="text-base font-bold w-4 h-4" />
                    <p>New Folder</p>
                  </div>
                </div>

                <div className="w-[560px] h-[310px] bg-zinc-900 rounded-2xl">
                  {/* Document rows placeholder */}

                  {/* Show if no documents */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-white text-opacity-40 text-sm font-medium">
                      No Documents
                    </p>
                  </div>
                </div>

                {/* Upload file */}
                <div className="border-2 border-dashed rounded-2xl bg-zinc-900/50 p-3">
                  <input
                    name="import"
                    type="file"
                    multiple="false"
                    accept={fileTypes?.accept}
                    hidden={false}
                  />
                  <div className="flex flex-col items-center justify-center">
                    <CloudArrowUp className="w-8 h-8 text-white/80" />
                    <div className="text-white text-opacity-80 text-sm font-semibold py-1">
                      Click to upload or drag and drop
                    </div>
                    <div className="text-white text-opacity-60 text-xs font-medium py-1">
                      Supported file extensions are .mbox .pdf .odt .docx .txt
                      .md
                    </div>
                  </div>
                </div>
                <div className="px-8">
                  <div className="text-center text-white text-opacity-80 text-xs font-medium">
                    These files will be uploaded to the document processor
                    running on this AnythingLLM instance. These files are not
                    sent or shared with a third party.
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <ArrowsDownUp className="text-white text-base font-bold rotate-90 w-11 h-11" />
            </div>

            {/* Current Workspace */}
            <div className="px-8">
              <div className="flex items-center justify-start w-[560px]">
                <h3 className="text-white text-base font-bold ml-5">
                  {workspace.name}
                </h3>
              </div>
              <div className="w-[560px] h-[445px] bg-zinc-900 rounded-2xl mt-5">
                {/* Workspace document rows placeholder */}
                {/* Show if no documents in workspace */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-white text-opacity-40 text-sm font-medium">
                    No Documents
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function WorkspaceSettingTabs({ selectedTab, changeTab }) {
  return (
    <div>
      <ul className="flex md:flex-wrap overflow-x-scroll no-scroll -mb-px text-sm gap-x-2 font-medium text-center text-gray-500 dark:text-gray-400">
        <WorkspaceTab
          active={selectedTab === "documents"}
          displayName="Documents"
          tabName="documents"
          icon={<Archive className="h-4 w-4 flex-shrink-0" />}
          onClick={changeTab}
        />
        <WorkspaceTab
          active={selectedTab === "upload"}
          displayName="Upload Docs"
          tabName="upload"
          icon={<UploadCloud className="h-4 w-4 flex-shrink-0" />}
          onClick={changeTab}
        />
        <WorkspaceTab
          active={selectedTab === "settings"}
          displayName="Settings"
          tabName="settings"
          icon={<Sliders className="h-4 w-4 flex-shrink-0" />}
          onClick={changeTab}
        />
      </ul>
    </div>
  );
}

function WorkspaceTab({
  active = false,
  displayName,
  tabName,
  icon = "",
  onClick,
}) {
  const classes = active
    ? "text-blue-600 border-blue-600 active dark:text-blue-400 dark:border-blue-400 bg-blue-500 bg-opacity-5"
    : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";
  return (
    <li className="mr-2">
      <button
        disabled={active}
        onClick={() => onClick(tabName)}
        className={
          "flex items-center gap-x-1 p-4 border-b-2 rounded-t-lg group whitespace-nowrap " +
          classes
        }
      >
        {icon} {displayName}
      </button>
    </li>
  );
}

export function useManageWorkspaceModal() {
  const [showing, setShowing] = useState(false);

  const showModal = () => {
    document.getElementById(DIALOG_ID)?.showModal();
    setShowing(true);
  };

  const hideModal = () => {
    document.getElementById(DIALOG_ID)?.close();
    setShowing(false);
  };

  return { showing, showModal, hideModal };
}
