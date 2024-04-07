import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useQuery from "@/hooks/useQuery";
import ChatRow from "./ChatRow";
import showToast from "@/utils/toast";
import System from "@/models/system";
import { CaretDown, Download } from "@phosphor-icons/react";
import { saveAs } from "file-saver";

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
  const handleDumpChats = async (exportType) => {
    const chats = await System.exportChats(exportType);
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

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10">
            <div className="flex gap-x-4 items-center">
              <p className="text-lg leading-6 font-bold text-white">
                Workspace Chats
              </p>
              <div className="relative">
                <button
                  ref={openMenuButton}
                  onClick={toggleMenu}
                  className="flex items-center gap-x-2 px-4 py-2 rounded-lg bg-[#2C2F36] text-white text-sm hover:bg-[#3D4147] shadow-md border border-[#3D4147]"
                >
                  <Download size={18} weight="bold" />
                  Export
                  <CaretDown size={18} weight="bold" />
                </button>
                <div
                  ref={menuRef}
                  className={`${
                    showMenu ? "slide-down" : "slide-up hidden"
                  } z-20 w-fit rounded-lg absolute top-full right-0 bg-[#2C2F36] mt-2 shadow-md`}
                >
                  <div className="py-2">
                    {Object.entries(exportOptions).map(([key, data]) => (
                      <button
                        key={key}
                        onClick={() => {
                          handleDumpChats(key);
                          setShowMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-white text-sm hover:bg-[#3D4147]"
                      >
                        {data.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              These are all the recorded chats and messages that have been sent
              by users ordered by their creation date.
            </p>
          </div>
          <ChatsContainer />
        </div>
      </div>
    </div>
  );
}

function ChatsContainer() {
  const query = useQuery();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [offset, setOffset] = useState(Number(query.get("offset") || 0));
  const [canNext, setCanNext] = useState(false);

  const handlePrevious = () => {
    setOffset(Math.max(offset - 1, 0));
  };
  const handleNext = () => {
    setOffset(offset + 1);
  };

  const handleDeleteChat = (chatId) => {
    setChats((prevChats) => prevChats.filter((chat) => chat.id !== chatId));
  };

  useEffect(() => {
    async function fetchChats() {
      const { chats: _chats, hasPages = false } = await System.chats(offset);
      setChats(_chats);
      setCanNext(hasPages);
      setLoading(false);
    }
    fetchChats();
  }, [offset]);

  if (loading) {
    return (
      <Skeleton.default
        height="80vh"
        width="100%"
        highlightColor="#3D4147"
        baseColor="#2C2F35"
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <>
      <table className="w-full text-sm text-left rounded-lg mt-6">
        <thead className="text-white text-opacity-80 text-xs leading-[18px] font-bold uppercase border-white border-b border-opacity-60">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-tl-lg">
              Id
            </th>
            <th scope="col" className="px-6 py-3">
              Sent By
            </th>
            <th scope="col" className="px-6 py-3">
              Workspace
            </th>
            <th scope="col" className="px-6 py-3">
              Prompt
            </th>
            <th scope="col" className="px-6 py-3">
              Response
            </th>
            <th scope="col" className="px-6 py-3">
              Sent At
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
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:invisible"
          disabled={offset === 0}
        >
          {" "}
          Previous Page
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 disabled:invisible"
          disabled={!canNext}
        >
          Next Page
        </button>
      </div>
    </>
  );
}
