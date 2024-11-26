import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useQuery from "@/hooks/useQuery";
import ChatRow from "./ChatRow";
import showToast from "@/utils/toast";
import System from "@/models/system";
import { CaretDown, Download, Sparkle, Trash } from "@phosphor-icons/react";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import paths from "@/utils/paths";
import { CanViewChatHistory } from "@/components/CanViewChatHistory";

const exportOptions = {
  csv: {
    name: "CSV",
    mimeType: "text/csv",
    fileExtension: "csv",
    filenameFunc: () => {
      return `anythingllm-chats-${new Date().toLocaleDateString()}`;
    },
  },
  json: {
    name: "JSON",
    mimeType: "application/json",
    fileExtension: "json",
    filenameFunc: () => {
      return `anythingllm-chats-${new Date().toLocaleDateString()}`;
    },
  },
  jsonl: {
    name: "JSONL",
    mimeType: "application/jsonl",
    fileExtension: "jsonl",
    filenameFunc: () => {
      return `anythingllm-chats-${new Date().toLocaleDateString()}-lines`;
    },
  },
  jsonAlpaca: {
    name: "JSON (Alpaca)",
    mimeType: "application/json",
    fileExtension: "json",
    filenameFunc: () => {
      return `anythingllm-chats-${new Date().toLocaleDateString()}-alpaca`;
    },
  },
};

export default function WorkspaceChats() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const openMenuButton = useRef();
  const query = useQuery();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [offset, setOffset] = useState(Number(query.get("offset") || 0));
  const [canNext, setCanNext] = useState(false);
  const { t } = useTranslation();

  const handleDumpChats = async (exportType) => {
    const chats = await System.exportChats(exportType, "workspace");
    if (!!chats) {
      const { name, mimeType, fileExtension, filenameFunc } =
        exportOptions[exportType];
      const blob = new Blob([chats], { type: mimeType });
      saveAs(blob, `${filenameFunc()}.${fileExtension}`);
      showToast(`Chats exported successfully as ${name}.`, "success");
    } else {
      showToast("Failed to export chats.", "error");
    }
  };

  const handleClearAllChats = async () => {
    if (
      !window.confirm(
        `Are you sure you want to clear all chats?\n\nThis action is irreversible.`
      )
    )
      return false;
    await System.deleteChat(-1);
    setChats([]);
    showToast("Cleared all chats.", "success");
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !openMenuButton.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    async function fetchChats() {
      const { chats: _chats = [], hasPages = false } =
        await System.chats(offset);
      setChats(_chats);
      setCanNext(hasPages);
      setLoading(false);
    }
    fetchChats();
  }, [offset]);

  return (
    <CanViewChatHistory>
      <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
        <Sidebar />
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
        >
          <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
            <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
              <div className="flex flex-wrap gap-4 items-center">
                <p className="text-lg leading-6 font-bold text-theme-text-primary">
                  {t("recorded.title")}
                </p>
                <div className="relative">
                  <button
                    ref={openMenuButton}
                    onClick={toggleMenu}
                    className="flex items-center gap-x-2 px-4 py-1 rounded-lg bg-primary-button hover:light:bg-theme-bg-primary hover:text-theme-text-primary text-xs font-semibold hover:bg-secondary shadow-[0_4px_14px_rgba(0,0,0,0.25)] h-[34px] w-fit"
                  >
                    <Download size={18} weight="bold" />
                    {t("recorded.export")}
                    <CaretDown size={18} weight="bold" />
                  </button>
                  <div
                    ref={menuRef}
                    className={`${
                      showMenu ? "slide-down" : "slide-up hidden"
                    } z-20 w-fit rounded-lg absolute top-full right-0 bg-secondary light:bg-theme-bg-secondary mt-2 shadow-md`}
                  >
                    <div className="py-2">
                      {Object.entries(exportOptions).map(([key, data]) => (
                        <button
                          key={key}
                          onClick={() => {
                            handleDumpChats(key);
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-4 py-2 text-white text-sm hover:bg-[#3D4147] light:hover:bg-theme-sidebar-item-hover"
                        >
                          {data.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                {chats.length > 0 && (
                  <>
                    <button
                      onClick={handleClearAllChats}
                      className="flex items-center gap-x-2 px-4 py-1 border hover:border-transparent light:border-theme-sidebar-border border-white/40 text-white/40 light:text-theme-text-secondary rounded-lg bg-transparent hover:light:text-theme-bg-primary hover:text-theme-text-primary text-xs font-semibold hover:bg-red-500 shadow-[0_4px_14px_rgba(0,0,0,0.25)] h-[34px] w-fit"
                    >
                      <Trash size={18} weight="bold" />
                      Clear Chats
                    </button>
                    <a
                      href={paths.orderFineTune()}
                      className="flex items-center gap-x-2 px-4 py-1 border hover:border-transparent border-yellow-300 light:border-yellow-600 text-yellow-300/80 light:text-yellow-600 rounded-lg bg-transparent hover:light:text-yellow-800 hover:text-theme-text-primary text-xs font-semibold hover:bg-yellow-300/75 shadow-[0_4px_14px_rgba(0,0,0,0.25)] h-[34px] w-fit"
                    >
                      <Sparkle size={18} weight="bold" />
                      Order Fine-Tune Model
                    </a>
                  </>
                )}
              </div>
              <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
                {t("recorded.description")}
              </p>
            </div>
            <div className="overflow-x-auto mt-6">
              <ChatsContainer
                loading={loading}
                chats={chats}
                setChats={setChats}
                offset={offset}
                setOffset={setOffset}
                canNext={canNext}
                t={t}
              />
            </div>
          </div>
        </div>
      </div>
    </CanViewChatHistory>
  );
}

function ChatsContainer({
  loading,
  chats,
  setChats,
  offset,
  setOffset,
  canNext,
  t,
}) {
  const handlePrevious = () => {
    setOffset(Math.max(offset - 1, 0));
  };
  const handleNext = () => {
    setOffset(offset + 1);
  };

  const handleDeleteChat = async (chatId) => {
    await System.deleteChat(chatId);
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
  };

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="var(--theme-bg-primary)"
        baseColor="var(--theme-bg-secondary)"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <>
      <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0">
        <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase light:border-theme-sidebar-border border-white/10 border-b">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-tl-lg">
              {t("recorded.table.id")}
            </th>
            <th scope="col" className="px-6 py-3">
              {t("recorded.table.by")}
            </th>
            <th scope="col" className="px-6 py-3">
              {t("recorded.table.workspace")}
            </th>
            <th scope="col" className="px-6 py-3">
              {t("recorded.table.prompt")}
            </th>
            <th scope="col" className="px-6 py-3">
              {t("recorded.table.response")}
            </th>
            <th scope="col" className="px-6 py-3">
              {t("recorded.table.at")}
            </th>
            <th scope="col" className="px-6 py-3 rounded-tr-lg">
              {" "}
            </th>
          </tr>
        </thead>
        <tbody>
          {!!chats &&
            chats.map((chat) => (
              <ChatRow key={chat.id} chat={chat} onDelete={handleDeleteChat} />
            ))}
        </tbody>
      </table>
      <div className="flex w-full justify-between items-center mt-6">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 rounded-lg border border-theme-text-secondary text-theme-text-secondary text-sm items-center flex gap-x-2 hover:bg-theme-text-secondary hover:text-theme-bg-secondary disabled:invisible"
          disabled={offset === 0}
        >
          {" "}
          Previous Page
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 light:text-theme-text-secondary light:border-theme-sidebar-border text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:invisible"
          disabled={!canNext}
        >
          Next Page
        </button>
      </div>
    </>
  );
}
