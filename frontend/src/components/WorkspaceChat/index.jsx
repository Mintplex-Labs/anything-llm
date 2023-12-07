import React, { useEffect, useState } from "react";
import Workspace from "@/models/workspace";
import LoadingChat from "./LoadingChat";
import ChatContainer from "./ChatContainer";
import paths from "@/utils/paths";

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
  if (!loading && !loadingHistory && !workspace) {
    return (
      <>
        {loading === false && !workspace && (
          <dialog
            open={true}
            style={{ zIndex: 100 }}
            className="fixed top-0 flex bg-black bg-opacity-50 w-full md:w-[100vw] h-full items-center justify-center"
          >
            <div className="relative w-full md:max-w-2xl max-h-full bg-main-gradient rounded-lg shadow p-4">
              <div className="flex flex-col gap-y-4 w-full p-6 text-center">
                <p className="font-semibold text-red-500 text-xl">
                  Workspace not found!
                </p>
                <p className="text-sm mt-4 text-white">
                  It looks like a workspace by this name is not available.
                </p>

                <div className="flex w-full justify-center items-center mt-4">
                  <a
                    href={paths.home()}
                    className="border border-slate-200 text-white hover:bg-slate-200 hover:text-slate-800 px-4 py-2 rounded-lg text-sm items-center flex gap-x-2 transition-all duration-300"
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
  }

  return <ChatContainer workspace={workspace} knownHistory={history} />;
}
