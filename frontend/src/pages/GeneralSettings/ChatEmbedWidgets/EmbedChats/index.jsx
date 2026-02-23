import { useEffect, useState, useRef } from "react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useQuery from "@/hooks/useQuery";
import ChatRow from "./ChatRow";
import Embed from "@/models/embed";
import { useTranslation } from "react-i18next";
import { CaretDown, Download, Trash } from "@phosphor-icons/react";
import showToast from "@/utils/toast";
import { saveAs } from "file-saver";
import System from "@/models/system";
import useUser from "@/hooks/useUser";

const exportOptions = {
  csv: {
    name: "CSV",
    mimeType: "text/csv",
    fileExtension: "csv",
    filenameFunc: () => {
      return `anythingllm-embed-chats-${new Date().toLocaleDateString()}`;
    },
  },
  json: {
    name: "JSON",
    mimeType: "application/json",
    fileExtension: "json",
    filenameFunc: () => {
      return `anythingllm-embed-chats-${new Date().toLocaleDateString()}`;
    },
  },
  jsonl: {
    name: "JSONL",
    mimeType: "application/jsonl",
    fileExtension: "jsonl",
    filenameFunc: () => {
      return `anythingllm-embed-chats-${new Date().toLocaleDateString()}-lines`;
    },
  },
  jsonAlpaca: {
    name: "JSON (Alpaca)",
    mimeType: "application/json",
    fileExtension: "json",
    filenameFunc: () => {
      return `anythingllm-embed-chats-${new Date().toLocaleDateString()}-alpaca`;
    },
  },
};

export default function EmbedChatsView() {
  const { t } = useTranslation();
  const { user } = useUser();
  const menuRef = useRef();
  const query = useQuery();
  const openMenuButton = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [offset, setOffset] = useState(Number(query.get("offset") || 0));
  const [canNext, setCanNext] = useState(false);
  const isReadOnly = user?.role === "default";
  const [retentionInfo, setRetentionInfo] = useState({});

  const handleDumpChats = async (exportType) => {
    const chats = await System.exportChats(exportType, "embed");
    if (!!chats) {
      const { name, mimeType, fileExtension, filenameFunc } =
        exportOptions[exportType];
      const blob = new Blob([chats], { type: mimeType });
      saveAs(blob, `${filenameFunc()}.${fileExtension}`);
      showToast(`Embed chats exported successfully as ${name}.`, "success");
    } else {
      showToast("Failed to export embed chats.", "error");
    }
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
    async function loadEmbedConfigs() {
      const embeds = await Embed.embeds();
      if (embeds && embeds.length > 0) {
        const retentionMap = {};
        embeds.forEach(e => {
          if (e.chat_retention_days && e.chat_retention_days > 0) {
            retentionMap[e.id] = {
              days: e.chat_retention_days,
              workspace: e.workspace?.name || `Embed #${e.id}`
            };
          }
        });
        setRetentionInfo(retentionMap);
      }
    }
    loadEmbedConfigs();
  }, []);

  useEffect(() => {
    async function fetchChats() {
      setLoading(true);
      const { chats: _chats = [], hasPages = false } =
        await Embed.chats(offset);
      setChats(_chats);
      setCanNext(hasPages);
      setLoading(false);
    }
    fetchChats();
  }, [offset]);

  const handlePrevious = () => {
    setOffset(Math.max(offset - 1, 0));
  };

  const handleNext = () => {
    setOffset(offset + 1);
  };

  const handleDeleteChat = (chatId) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
  };

  const handleClearAllChats = async () => {
    if (
      !window.confirm(
        t("embed-chats.clear-all-confirm")
      )
    )
      return;

    const { success, deletedCount } = await Embed.clearAllChats();
    if (success) {
      showToast(
        t("embed-chats.clear-all-success", { count: deletedCount }),
        "success"
      );
      setChats([]);
      setOffset(0);
    } else {
      showToast(t("embed-chats.clear-all-error"), "error");
    }
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
    <div className="flex flex-col w-full p-4 overflow-none">
      <div className="w-full flex flex-col gap-y-1">
        <div className="flex flex-wrap gap-4 items-center">
          <p className="text-lg leading-6 font-bold text-theme-text-primary">
            {t("embed-chats.title")}
          </p>
          <div className="relative">
            <button
              ref={openMenuButton}
              onClick={toggleMenu}
              className="flex items-center gap-x-2 px-4 py-1 rounded-lg text-theme-bg-chat bg-primary-button hover:bg-secondary hover:text-white text-xs font-semibold h-[34px] w-fit"
            >
              <Download size={18} weight="bold" />
              {t("embed-chats.export")}
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
          {!isReadOnly && (
            <button
              onClick={handleClearAllChats}
              className="flex items-center gap-x-2 px-4 py-1 rounded-lg border border-red-400 text-red-400 hover:border-transparent hover:text-white text-xs font-semibold hover:bg-red-500 h-[34px] w-fit transition-all duration-200"
            >
              <Trash size={18} weight="bold" />
              {t("embed-chats.clear-all")}
            </button>
          )}
        </div>
        <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
          {t("embed-chats.description")}
        </p>
      </div>

      {/* DSGVO Retention Notice */}
      {Object.keys(retentionInfo).length > 0 && (() => {
        const formatDate = (date) => {
          return date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          });
        };

        return (
          <div className="mb-4 mt-6 p-4 bg-blue-500/10 border-l-4 border-blue-400 rounded-lg light:bg-blue-50 light:border-blue-600">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-400 light:text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="text-blue-300 text-sm light:text-blue-700 space-y-1.5 flex-1">
                <p className="font-medium">
                  {t("embed-chats.retention-header")}
                </p>
                <div className="space-y-0.5 text-xs">
                  {Object.entries(retentionInfo).map(([embedId, info]) => {
                    const expiryDate = new Date();
                    expiryDate.setDate(expiryDate.getDate() + info.days);
                    expiryDate.setHours(0, 0, 0, 0);

                    return (
                      <p key={embedId}>
                        • {info.workspace}: {t("embed-chats.cutoff-date", { days: info.days, date: formatDate(expiryDate) })}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm text-left rounded-lg min-w-[800px]">
          <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-b border-white/10">
            <tr>
              <th scope="col" className="px-6 py-3">
                {t("embed-chats.table.embed")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("embed-chats.table.sender")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("embed-chats.table.message")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("embed-chats.table.response")}
              </th>
              <th scope="col" className="px-6 py-3">
                {t("embed-chats.table.at")}
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {chats.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-12 text-theme-text-secondary">
                  {t("embed-chats.no-chats")}
                </td>
              </tr>
            ) : (
              chats.map((chat) => (
                <ChatRow
                  key={chat.id}
                  chat={chat}
                  onDelete={handleDeleteChat}
                  isReadOnly={isReadOnly}
                />
              ))
            )}
          </tbody>
        </table>
        {(offset > 0 || canNext) && (
          <div className="flex items-center justify-end gap-2 mt-6 pb-6">
            <button
              onClick={handlePrevious}
              disabled={offset === 0}
              className={`px-4 py-2 text-sm rounded-lg ${
                offset === 0
                  ? "bg-theme-bg-secondary text-theme-text-disabled cursor-not-allowed"
                  : "bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-hover"
              }`}
            >
              {t("common.previous")}
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext}
              className={`px-4 py-2 text-sm rounded-lg ${
                !canNext
                  ? "bg-theme-bg-secondary text-theme-text-disabled cursor-not-allowed"
                  : "bg-theme-bg-secondary text-theme-text-primary hover:bg-theme-hover"
              }`}
            >
              {t("common.next")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
