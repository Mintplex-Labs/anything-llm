import { useEffect, useState, useRef } from "react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useQuery from "@/hooks/useQuery";
import ChatRow from "./ChatRow";
import Embed from "@/models/embed";
import { useTranslation } from "react-i18next";
import { CaretDown, Download } from "@phosphor-icons/react";
import showToast from "@/utils/toast";
import { saveAs } from "file-saver";
import System from "@/models/system";

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
  const menuRef = useRef();
  const query = useQuery();
  const openMenuButton = useRef();
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [offset, setOffset] = useState(Number(query.get("offset") || 0));
  const [canNext, setCanNext] = useState(false);

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
    async function fetchChats() {
      setLoading(true);
      await Embed.chats(offset)
        .then(({ chats: _chats, hasPages = false }) => {
          setChats(_chats);
          setCanNext(hasPages);
        })
        .finally(() => {
          setLoading(false);
        });
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
        </div>
        <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
          {t("embed-chats.description")}
        </p>
      </div>
      <div className="overflow-x-auto mt-6">
        <table className="w-full text-xs text-left rounded-lg min-w-[640px] border-spacing-0">
          <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-tl-lg">
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
              <th scope="col" className="px-6 py-3 rounded-tr-lg">
                {" "}
              </th>
            </tr>
          </thead>
          <tbody>
            {chats.map((chat) => (
              <ChatRow key={chat.id} chat={chat} onDelete={handleDeleteChat} />
            ))}
          </tbody>
        </table>
        {(offset > 0 || canNext) && (
          <div className="flex items-center justify-end gap-2 mt-4 pb-6">
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
