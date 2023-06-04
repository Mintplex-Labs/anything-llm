import React, { useEffect, useState } from "react";
import Workspace from "../../models/workspace";
import LoadingChat from "./LoadingChat";
import ChatContainer from "./ChatContainer";
import paths from "../../utils/paths";

export default function WorkspaceChat({ loading, workspace }) {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    async function getHistory() {
      if (loading) return;
      if (!workspace?.slug) {
        setLoadingHistory(false);
        return false;
      }

      const chatHistory = await Workspace.chatHistory(workspace.slug);
      setHistory(chatHistory);
      setLoadingHistory(false);
    }
    getHistory();
  }, [workspace, loading]);

  if (loadingHistory) return <LoadingChat />;
  if (!loading && !loadingHistory && !workspace)
    return (
      <>
        {loading === false && !workspace && (
          <dialog
            open={true}
            style={{ zIndex: 100 }}
            className="fixed top-0 flex bg-black bg-opacity-50 w-[100vw] h-full items-center justify-center "
          >
            <div className="w-fit px-10 p-4 w-1/4 rounded-lg bg-white shadow dark:bg-stone-700 text-black dark:text-slate-200">
              <div className="flex flex-col w-full">
                <p className="font-semibold text-red-500">
                  We cannot locate this workspace!
                </p>
                <p className="text-sm mt-4">
                  It looks like a workspace by this name is not available.
                </p>

                <div className="flex w-full justify-center items-center mt-4">
                  <a
                    href={paths.home()}
                    className="border border-gray-800 text-gray-800 hover:bg-gray-100 px-4 py-1 rounded-lg dark:text-slate-200 dark:border-slate-200 dark:hover:bg-stone-900"
                  >
                    Go back to homepage
                  </a>
                </div>
              </div>
            </div>
          </dialog>
        )}
        <LoadingChat />
      </>
    );

  return <ChatContainer workspace={workspace} knownHistory={history} />;
}
