import { useEffect, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import Workspace from "@/models/workspace";
import Admin from "@/models/admin";
import useQuery from "@/hooks/useQuery";
import moment from "moment";
import { Eye, X, File } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import PreLoader from "@/components/Preloader";
import { decode as HTMLDecode } from "he";

const PAGE_LIMIT = 10;

function omitChunkHeader(text) {
  if (!text.startsWith("<document_metadata>")) return text;
  return text.split("</document_metadata>")[1].trim();
}

export default function FileManagement() {
  const { t } = useTranslation();

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex custom-theme-bg-container">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0 custom-theme-bg-secondary"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div
            className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2 custom-border-secondary"
            style={{ borderTop: 0, borderRight: 0, borderLeft: 0 }}
          >
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary custom-text-secondary">
                {t("settings.file-management")}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <FileManagementTable />
          </div>
        </div>
      </div>
    </div>
  );
}

function FileManagementTable() {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const query = useQuery();
  const [offset, setOffset] = useState(Number(query.get("offset") || 0));
  const [files, setFiles] = useState({
    isLoading: false,
    data: {},
  });
  const [workspaces, setWorkspaces] = useState({
    isLoading: true,
    data: [],
  });

  async function fetchWorkspaces() {
    const _workspaces = await Admin.workspaces();
    setWorkspaces({
      isLoading: false,
      data: _workspaces,
    });
    if (_workspaces?.length) {
      setSelectedWorkspace({
        slug: _workspaces?.[0]?.slug,
      });
    }
  }

  async function fetchWorkspaceFiles(_slug, _offset = 0) {
    setFiles({
      isLoading: true,
      data: {},
    });
    const _files = await Workspace.getFiles(
      _slug,
      `?offset=${_offset}&limit=${PAGE_LIMIT}`
    );
    setFiles({
      isLoading: false,
      data: _files,
    });
  }

  const handlePrevious = (_offset) => {
    setOffset(Math.max(_offset - 1, 0));
    const value = Math.max(_offset - 1, 0) * PAGE_LIMIT;
    fetchWorkspaceFiles(selectedWorkspace?.slug, value);
  };

  const handleNext = (_offset) => {
    setOffset(_offset + 1);
    const value = (_offset + 1) * PAGE_LIMIT;
    fetchWorkspaceFiles(selectedWorkspace?.slug, value);
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  useEffect(() => {
    if (selectedWorkspace?.slug) {
      fetchWorkspaceFiles(selectedWorkspace?.slug, offset);
    }
  }, [selectedWorkspace?.slug]);

  if (workspaces?.isLoading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        // highlightColor="var(--theme-bg-primary)"
        // baseColor="var(--theme-bg-secondary)"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-8"
        containerClassName="flex w-full"
      />
    );
  }

  const canNotNext =
    !files?.data?.data?.length ||
    !(
      files?.data?.totalCount >
      offset * PAGE_LIMIT + files?.data?.data?.length
    );
  const noDataFound = !files?.data?.totalCount || !selectedWorkspace?.slug;
  return (
    <>
      <div className="flex justify-start items-center mb-3">
        <div className="flex flex-col">
          <label className="text-white text-sm font-semibold block mb-1 custom-text-secondary">
            Workspace
          </label>
          <select
            name="workspace_id"
            required={true}
            onChange={(e) => {
              setOffset(0);
              setSelectedWorkspace({
                slug: e?.target?.value,
              });
            }}
            className="min-w-[15rem] rounded-lg bg-theme-settings-input-bg px-4 py-2 text-sm text-white focus:ring-blue-500 focus:border-blue-500 custom-theme-bg-tertiary custom-text-secondary custom-border-secondary"
          >
            {workspaces?.data.map((workspace) => {
              return (
                <option
                  key={workspace?.slug}
                  selected={selectedWorkspace?.slug === workspace?.slug}
                  value={workspace?.slug}
                >
                  {workspace?.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0 custom-primary-table">
          <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Upload Date
              </th>
              <th scope="col" className="px-6 py-3">
                Word Count
              </th>
              <th scope="col" className="px-6 py-3">
                Token Count Estimate
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {files?.data?.data?.map((user, idx) => (
              <FileManagementRow data={user} key={idx} />
            ))}
          </tbody>
        </table>
        {noDataFound && (
          <div className="w-full h-full flex items-center justify-center px-6 py-4">
            <p className="text-white text-opacity-40 text-sm font-medium custom-text-secondary">
              No Files
            </p>
          </div>
        )}
      </div>
      <div className="flex w-full justify-between items-center mt-6">
        <button
          onClick={() => handlePrevious(offset)}
          className="px-4 py-2 rounded-lg border border-theme-text-secondary text-theme-text-secondary text-sm items-center flex gap-x-2 disabled:invisible custom-button-secondary"
          disabled={offset === 0}
        >
          {" "}
          Previous Page
        </button>
        <button
          onClick={() => handleNext(offset)}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 light:text-theme-text-secondary light:border-theme-sidebar-border text-sm items-center flex gap-x-2 disabled:invisible custom-button-secondary"
          disabled={canNotNext}
        >
          Next Page
        </button>
      </div>
    </>
  );
}

function FileManagementRow({ key, data = {} }) {
  const [previewDocId, setPreviewDocId] = useState(null);
  return (
    <>
      {" "}
      <tr
        key={key}
        className="bg-transparent text-white text-opacity-80 text-sm font-medium"
      >
        <td className="px-6 py-4 flex items-start">
          <File className="h-5 w-5 flex-shrink-0" /> &nbsp; {JSON?.parse(data?.metadata)?.title || "-"}
        </td>
        <td className="px-6 py-4">
          {data?.docId || 0}
        </td>
        <td className="px-6 py-4">
          {data?.createdAt
            ? moment(data?.createdAt)?.format("DD/MM/YYYY HH:mm:ss")
            : "-"}
        </td>
        <td className="px-6 py-4">
          {JSON?.parse(data?.metadata)?.wordCount || 0}
        </td>
        <td className="px-6 py-4">
          {JSON?.parse(data?.metadata)?.token_count_estimate || 0}
        </td>
        <td className="px-6 py-4">
          <button
            onClick={() => {
              if (data?.docId) {
                setPreviewDocId(data?.docId);
              }
            }}
            className="border-none font-medium px-2 py-1 rounded-lg text-theme-text-primary"
          >
            <Eye className="h-5 w-5" />
          </button>
        </td>
      </tr>
      <ModalWrapper isOpen={!!previewDocId}>
        <DocumentContentModal
          docId={previewDocId}
          docName={JSON?.parse(data?.metadata)?.title || "-"}
          closeModal={() => setPreviewDocId(null)}
        />
      </ModalWrapper>
    </>
  );
}

function DocumentContentModal({ closeModal, docId = null, docName = "" }) {
  const [docData, setDocData] = useState({
    isLoading: false,
    data: null,
  });
  async function fetchDocumentContent(_docId) {
    setDocData({
      isLoading: true,
      data: null,
    });
    const _fileContent = await Workspace.getFileContent(_docId);
    setDocData({
      isLoading: false,
      data: _fileContent?.content || "",
    });
  }

  useEffect(() => {
    if (docId) {
      fetchDocumentContent(docId);
    }
  }, [docId]);

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-6xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border custom-theme-bg-tertiary border-none">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center pr-6">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap custom-text-secondary">
              {docName || "-"}
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:border-opacity-50 border-transparent border"
          >
            <X
              size={24}
              weight="bold"
              className="text-white custom-text-secondary"
            />
          </button>
        </div>
        <div className="px-7 py-6">
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {docData?.isLoading ? (
              <div className="w-full h-full flex justify-center items-center">
                <PreLoader size={12} />
              </div>
            ) : (
              <div className="flex flex-col w-full justify-start gap-y-1">
                {docData?.data?.length ? (
                  <p className="text-white whitespace-pre-line custom-text-secondary">
                    {HTMLDecode(omitChunkHeader(docData?.data))}
                  </p>
                ) : (
                  <p className="text-white text-opacity-40 text-sm font-medium custom-text-secondary text-center pt-6 pb-6">
                    No Text Found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
