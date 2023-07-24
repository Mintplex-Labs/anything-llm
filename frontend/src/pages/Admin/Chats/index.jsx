import { useEffect, useState } from "react";
import Sidebar, { SidebarMobileHeader } from "../../../components/AdminSidebar";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import usePrefersDarkMode from "../../../hooks/usePrefersDarkMode";
import Admin from "../../../models/admin";
import useQuery from "../../../hooks/useQuery";
import ChatRow from "./ChatRow";

export default function AdminChats() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-orange-100 dark:bg-stone-700 flex">
      {!isMobile && <Sidebar />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[8px] md:my-[16px] md:rounded-[26px] bg-white dark:bg-black-900 md:min-w-[82%] p-[18px] h-full overflow-y-scroll"
      >
        {isMobile && <SidebarMobileHeader />}
        <div className="flex flex-col w-full px-1 md:px-8">
          <div className="w-full flex flex-col gap-y-1">
            <div className="items-center flex gap-x-4">
              <p className="text-3xl font-semibold text-slate-600 dark:text-slate-200">
                Workspace Chats
              </p>
            </div>
            <p className="text-sm font-base text-slate-600 dark:text-slate-200">
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
  const darkMode = usePrefersDarkMode();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [offset, setOffset] = useState(Number(query.get("offset") || 0));
  const [canNext, setCanNext] = useState(false);

  const handlePrevious = () => {
    if (chats.length === 0) {
      setOffset(0);
      return;
    }

    const chat = chats.at(-1);
    if (chat.id - 20 <= 0) {
      setOffset(0);
      return;
    }

    setOffset(chat.id - 1);
  };
  const handleNext = () => {
    setOffset(chats[0].id + 1);
  };

  useEffect(() => {
    async function fetchChats() {
      const { chats: _chats, hasPages = false } = await Admin.chats(offset);
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
        baseColor={darkMode ? "#2a3a53" : null}
        highlightColor={darkMode ? "#395073" : null}
        count={1}
        className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm mt-6"
        containerClassName="flex w-full"
      />
    );
  }

  return (
    <>
      <table className="md:w-full w-full text-sm text-left text-gray-500 dark:text-gray-400 rounded-lg mt-5">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-stone-800 dark:text-gray-400">
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
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {chats.map((chat) => (
            <ChatRow key={chat.id} chat={chat} />
          ))}
        </tbody>
      </table>
      <div className="flex w-full justify-between items-center">
        <button
          onClick={handlePrevious}
          className="px-4 py-2 rounded-lg border border-gray-800 dark:border-slate-200 text-gray-800 text-slate-200 disabled:invisible"
          disabled={offset === 0}
        >
          {" "}
          Previous Page
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg border border-gray-800 dark:border-slate-200 text-gray-800 text-slate-200 disabled:invisible"
          disabled={!canNext}
        >
          Next Page
        </button>
      </div>
    </>
  );
}
