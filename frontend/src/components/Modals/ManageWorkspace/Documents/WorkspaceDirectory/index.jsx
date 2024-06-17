import PreLoader from "@/components/Preloader";
import { dollarFormat } from "@/utils/numbers";
import WorkspaceFileRow from "./WorkspaceFileRow";
import { memo, useEffect, useState } from "react";
import ModalWrapper from "@/components/ModalWrapper";
import { PushPin } from "@phosphor-icons/react";
import { SEEN_DOC_PIN_ALERT } from "@/utils/constants";

function WorkspaceDirectory({
  workspace,
  files,
  highlightWorkspace,
  loading,
  loadingMessage,
  setLoadingMessage,
  setLoading,
  fetchKeys,
  hasChanges,
  saveChanges,
  embeddingCosts,
  movedItems,
}) {
  if (loading) {
    return (
      <div className="px-8">
        <div className="flex items-center justify-start w-[560px]">
          <h3 className="text-white text-base font-bold ml-5">
            {workspace.name}
          </h3>
        </div>
        <div className="relative w-[560px] h-[445px] bg-zinc-900 rounded-2xl mt-5">
          <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-8">
            <p className="col-span-5">Name</p>
            <p className="col-span-2" />
          </div>
          <div className="w-full h-full flex items-center justify-center flex-col gap-y-5">
            <PreLoader />
            <p className="text-white/80 text-sm font-semibold animate-pulse text-center w-1/3">
              {loadingMessage}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-8">
        <div className="flex items-center justify-start w-[560px]">
          <h3 className="text-white text-base font-bold ml-5">
            {workspace.name}
          </h3>
        </div>
        <div
          className={`relative w-[560px] h-[445px] bg-zinc-900 rounded-2xl mt-5 overflow-y-auto border-4 ${
            highlightWorkspace ? "border-cyan-300/80" : "border-transparent"
          }`}
        >
          <div className="text-white/80 text-xs grid grid-cols-12 py-2 px-8 border-b border-white/20 bg-zinc-900 sticky top-0 z-10">
            <p className="col-span-5">Name</p>
            <p className="col-span-2" />
          </div>
          <div className="w-full h-full flex flex-col z-0">
            {Object.values(files.items).some(
              (folder) => folder.items.length > 0
            ) || movedItems.length > 0 ? (
              <>
                {files.items.map((folder) =>
                  folder.items.map((item, index) => (
                    <WorkspaceFileRow
                      key={index}
                      item={item}
                      folderName={folder.name}
                      workspace={workspace}
                      setLoading={setLoading}
                      setLoadingMessage={setLoadingMessage}
                      fetchKeys={fetchKeys}
                      hasChanges={hasChanges}
                      movedItems={movedItems}
                    />
                  ))
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white text-opacity-40 text-sm font-medium">
                  No Documents
                </p>
              </div>
            )}
          </div>
        </div>
        {hasChanges && (
          <div className="flex items-center justify-between py-6">
            <div className="text-white/80">
              <p className="text-sm font-semibold">
                {embeddingCosts === 0
                  ? ""
                  : `Estimated Cost: ${
                      embeddingCosts < 0.01
                        ? `< $0.01`
                        : dollarFormat(embeddingCosts)
                    }`}
              </p>
              <p className="mt-2 text-xs italic" hidden={embeddingCosts === 0}>
                *One time cost for embeddings
              </p>
            </div>

            <button
              onClick={saveChanges}
              className="border border-slate-200 px-5 py-2.5 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              Save and Embed
            </button>
          </div>
        )}
      </div>
      <PinAlert />
    </>
  );
}

const PinAlert = memo(() => {
  const [showAlert, setShowAlert] = useState(false);
  function dismissAlert() {
    setShowAlert(false);
    window.localStorage.setItem(SEEN_DOC_PIN_ALERT, "1");
    window.removeEventListener(handlePinEvent);
  }

  function handlePinEvent() {
    if (!!window?.localStorage?.getItem(SEEN_DOC_PIN_ALERT)) return;
    setShowAlert(true);
  }

  useEffect(() => {
    if (!window || !!window?.localStorage?.getItem(SEEN_DOC_PIN_ALERT)) return;
    window?.addEventListener("pinned_document", handlePinEvent);
  }, []);

  return (
    <ModalWrapper isOpen={showAlert} noPortal={true}>
      <div className="relative w-full max-w-2xl max-h-full">
        <div className="relative bg-main-gradient rounded-lg shadow">
          <div className="flex items-start justify-between p-4 rounded-t border-gray-500/50">
            <div className="flex items-center gap-2">
              <PushPin className="text-red-600 text-lg w-6 h-6" weight="fill" />
              <h3 className="text-xl font-semibold text-white">
                What is document pinning?
              </h3>
            </div>
          </div>
          <div className="w-full p-6 text-white text-md flex flex-col gap-y-2">
            <p>
              When you <b>pin</b> a document in AnythingLLM we will inject the
              entire content of the document into your prompt window for your
              LLM to fully comprehend.
            </p>
            <p>
              This works best with <b>large-context models</b> or small files
              that are critical to its knowledge-base.
            </p>
            <p>
              If you are not getting the answers you desire from AnythingLLM by
              default then pinning is a great way to get higher quality answers
              in a click.
            </p>
          </div>

          <div className="flex w-full justify-between items-center p-6 space-x-2 border-t rounded-b border-gray-500/50">
            <button disabled={true} className="invisible" />
            <button
              onClick={dismissAlert}
              className="border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              Okay, got it
            </button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
});

export default memo(WorkspaceDirectory);
