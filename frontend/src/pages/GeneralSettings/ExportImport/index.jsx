import { useEffect, useRef, useState } from "react";
import Sidebar, {
  SidebarMobileHeader,
} from "../../../components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import Admin from "../../../models/admin";
import showToast from "../../../utils/toast";
import { CloudArrowUp, DownloadSimple } from "@phosphor-icons/react";
import System from "../../../models/system";
import { API_BASE } from "../../../utils/constants";
import paths from "../../../utils/paths";

export default function GeneralExportImport() {
  const hostname = window?.location?.hostname;
  const isHosted = hostname.includes(".useanything.com");

  if (isHosted) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
        {!isMobile && <Sidebar />}
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-main-gradient md:min-w-[82%] p-[18px] h-full overflow-y-scroll"
        >
          {isMobile && <SidebarMobileHeader />}
          <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
            <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
              <div className="items-center flex gap-x-4">
                <p className="text-2xl font-semibold text-white">
                  Export or Import
                </p>
              </div>
            </div>
          </div>

          <div className="w-full items-center justify-center flex flex-col gap-y-4">
            <p className="text-lg font-base text-white text-opacity-60">
              This feature is temporarily disabled for hosted AnythingLLM
              instances.
            </p>
            <a
              href={`${paths.mailToMintplex()}?Subject=Import/Export disabled on hosted AnythingLLM.`}
              className="text-blue-300 hover:underline"
            >
              Contact Mintplex Labs Inc.
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      {!isMobile && <Sidebar />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-main-gradient md:min-w-[82%] p-[18px] h-full overflow-y-scroll"
      >
        {isMobile && <SidebarMobileHeader />}
        <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="items-center flex gap-x-4">
              <p className="text-2xl font-semibold text-white">
                Export or Import
              </p>
            </div>
            <p className="text-sm font-base text-white text-opacity-60">
              Have multiple AnythingLLM instances or simply want to backup or
              re-import data from another instance? You can do so here.
            </p>
          </div>
          <div className="text-white text-sm font-medium py-4">
            This will not automatically sync your vector database embeddings.
          </div>
          <ImportData />
          <ExportData />
        </div>
      </div>
    </div>
  );
}

function ImportData() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const startInput = () => inputRef?.current?.click();
  const handleUpload = async (e) => {
    setLoading(true);
    e.preventDefault();
    setFile(null);
    setResult(null);

    const file = e.target.files?.[0];
    if (!file) {
      showToast("Invalid file upload", "error");
      return false;
    }

    setFile(file);
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file, file.name);
    const { success, error } = await System.importData(formData);
    if (!success) {
      showToast(`Failed to import data: ${error}`, "error");
    } else {
      setResult(true);
      showToast(`Successfully imported ${file.name}`, "success");
    }

    setLoading(false);
    setFile(null);
  };

  return (
    <div
      onClick={startInput}
      className="max-w-[600px] py-4 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-white border-opacity-60 justify-center items-center inline-flex transition-all duration-300 hover:opacity-60 cursor-pointer"
    >
      <div className="flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex items-center justify-center gap-2 animate-pulse">
            <div className="text-white text-opacity-80 text-sm font-semibold py-1">
              Importing
            </div>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent " />
          </div>
        ) : !!result ? (
          <div className="flex items-center justify-center gap-2">
            <CloudArrowUp className="w-8 h-8 text-green-400" />
            <div className="text-green-400 text-opacity-80 text-sm font-semibold py-1">
              Import Successful
            </div>
          </div>
        ) : (
          <>
            <input
              ref={inputRef}
              onChange={handleUpload}
              name="import"
              type="file"
              multiple="false"
              accept=".zip"
              hidden={true}
            />
            <div className="flex flex-col items-center justify-center">
              <CloudArrowUp className="w-8 h-8 text-white/80" />
              <div className="text-white text-opacity-80 text-sm font-semibold py-1">
                Import AnythingLLM Data
              </div>
              <div className="text-white text-opacity-60 text-xs font-medium py-1">
                This must be an export from an AnythingLLM instance.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ExportData() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const exportData = async function () {
    setLoading(true);
    const { filename, error } = await System.dataExport();
    setLoading(false);

    if (!filename) {
      showToast(`Failed to export data: ${error}`, "error");
    } else {
      setResult(filename);
      const link = document.createElement("a");
      link.href = `${API_BASE}/system/data-exports/${filename}`;
      link.target = "_blank";
      document.body.appendChild(link);
    }
  };

  if (loading) {
    return (
      <button
        onClick={exportData}
        className="transition-all max-w-[600px] bg-white rounded-lg justify-center items-center my-8 text-zinc-900 border-transparent border-2 cursor-not-allowed animate-pulse"
      >
        <div className="flex items-center justify-center gap-2">
          <div className="duration-300 text-center text-sm font-bold py-3">
            Exporting
          </div>
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-zinc-900 border-t-transparent " />
        </div>
      </button>
    );
  }

  if (!!result) {
    return (
      <a
        target="_blank"
        href={`${API_BASE}/system/data-exports/${result}`}
        className="transition-all max-w-[600px] bg-green-100 hover:bg-zinc-900/50 hover:text-white hover:border-white rounded-lg justify-center items-center my-8 text-zinc-900 border-transparent border-2 cursor-pointer"
      >
        <div className="flex items-center justify-center gap-2">
          <div className="duration-300 text-center text-sm font-bold py-3">
            Download Data Export
          </div>
          <DownloadSimple className="w-6 h-6" />
        </div>
      </a>
    );
  }

  return (
    <button
      onClick={exportData}
      className="transition-all max-w-[600px] bg-white rounded-lg justify-center items-center my-8 cursor-pointer text-zinc-900 border-transparent border-2 hover:bg-zinc-900/50 hover:text-white hover:border-white"
    >
      <div className="duration-300 text-center text-sm font-bold py-3">
        Export AnythingLLM Data
      </div>
    </button>
  );
}
