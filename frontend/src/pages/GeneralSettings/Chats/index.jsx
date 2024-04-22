import { useEffect, useState } from "react";
import Sidebar, { SidebarMobileHeader } from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useQuery from "@/hooks/useQuery";
import ChatRow from "./ChatRow";
import showToast from "@/utils/toast";
import System from "@/models/system";


const PAGE_SIZE = 20;
export default function WorkspaceChats() {
  const handleDumpChats = async () => {
    const chats = await System.exportChats();
    if (chats) {
      const blob = new Blob([chats], { type: "application/jsonl" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "chats.jsonl";
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
      showToast(
        "Chats exported successfully. Note: Must have at least 10 chats to be valid for OpenAI fine tuning.",
        "success"
      );
    } else {
      showToast("Failed to export chats.", "error");
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      {!isMobile && <Sidebar />}
      {/* <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
      > */}
        {isMobile && <SidebarMobileHeader />}
        <div className="flex flex-col w-full px-1 md:px-20 md:py-12 py-16">
          {/* <div className="w-full flex flex-col gap-y-1 pb-6 border-white border-b-2 border-opacity-10"> */}
            {/* <div className="items-center flex gap-x-4">
              <p className="text-2xl font-semibold text-white">
                Workspace Chats
              </p>
              <button
                onClick={handleDumpChats}
                className="border border-slate-200 px-4 py-1 rounded-lg text-slate-200 text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800"
              >
                Export Chats to JSONL
              </button>
            </div>
            <p className="text-sm font-base text-white text-opacity-60">
              These are all the recorded chats and messages that have been sent
              by users ordered by their creation date.
            </p> */}
            <ChatsContainer />
          </div>
          
        {/* </div> */}
      {/* </div> */}
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

  // useEffect(() => {
  //   // Dynamically load the Voiceglow script
  //   const script = document.createElement('script');
  //   script.src = "https://storage.googleapis.com/speakwiz-app.appspot.com/vg_live_build/vg_bundle.js";
  //   document.body.appendChild(script);

  //   window.VG_CONFIG = {
  //       ID: "o61yjzsks",
  //       region: 'na', // 'eu' or 'na'corresponding to Europe and North America
  //       render: 'full-width', // popup or full-width
  //       stylesheets: [
  //           "https://storage.googleapis.com/speakwiz-app.appspot.com/vg_live_build/styles.css",
  //           // Add your custom css stylesheets here
  //       ],
  //   };

  //   return () => {
  //       document.body.removeChild(script);
  //   };
  // }, []);

  useEffect(() => {
    // Dynamically load the Voiceglow script
    const script = document.createElement('script');
    script.src = "https://storage.googleapis.com/speakwiz-app.appspot.com/vg_live_build/vg_bundle.js";
    document.body.appendChild(script);

    window.VG_CONFIG = {
        ID: "qk70temx7",
        region: 'na', // 'eu' or 'na'corresponding to Europe and North America
        render: 'full-width', // popup or full-width
        stylesheets: [
            "https://storage.googleapis.com/speakwiz-app.appspot.com/vg_live_build/styles.css",
            // Add your custom css stylesheets here
        ],
    };

    return () => {
        document.body.removeChild(script);
    };
  }, []);
  
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
    <div id="VG_OVERLAY_CONTAINER" style={{ width: '100%', height: '100%' }}>
    {/* Content of your chats container */}
    </div>
  );
}
