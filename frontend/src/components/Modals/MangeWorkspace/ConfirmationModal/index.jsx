import React from "react";
import { dollarFormat } from "../../../../utils/numbers";

export default function ConfirmationModal({
  directories,
  hideConfirm,
  additions,
  updateWorkspace,
}) {
  function estimateCosts() {
    const cachedTokens = additions.map((filepath) => {
      const [parent, filename] = filepath.split("/");
      const details = directories.items
        .find((folder) => folder.name === parent)
        .items.find((file) => file.name === filename);

      const { token_count_estimate = 0, cached = false } = details;
      return cached ? token_count_estimate : 0;
    });
    const tokenEstimates = additions.map((filepath) => {
      const [parent, filename] = filepath.split("/");
      const details = directories.items
        .find((folder) => folder.name === parent)
        .items.find((file) => file.name === filename);

      const { token_count_estimate = 0 } = details;
      return token_count_estimate;
    });

    const totalTokens = tokenEstimates.reduce((a, b) => a + b, 0);
    const cachedTotal = cachedTokens.reduce((a, b) => a + b, 0);
    const dollarValue = 0.0004 * ((totalTokens - cachedTotal) / 1_000);

    return {
      dollarValue,
      dollarText:
        dollarValue < 0.01 ? "< $0.01" : `about ${dollarFormat(dollarValue)}`,
    };
  }

  const { dollarValue, dollarText } = estimateCosts();
  return (
    <dialog
      open={true}
      style={{ zIndex: 100 }}
      className="fixed top-0 flex bg-black bg-opacity-50 w-[100vw] h-full items-center justify-center "
    >
      <div className="w-fit px-10 p-4 min-w-1/2 rounded-lg bg-white shadow dark:bg-stone-700 text-black dark:text-slate-200">
        <div className="flex flex-col w-full">
          <p className="font-semibold">
            Are you sure you want to embed these documents?
          </p>

          <div className="flex flex-col gap-y-1">
            {dollarValue <= 0 ? (
              <p className="text-base mt-4">
                You will be embedding {additions.length} new documents into this
                workspace.
                <br />
                This will not incur any costs for OpenAI credits.
              </p>
            ) : (
              <p className="text-base mt-4">
                You will be embedding {additions.length} new documents into this
                workspace. <br />
                This will cost {dollarText} in OpenAI credits.
              </p>
            )}
          </div>

          <div className="flex w-full justify-between items-center mt-4">
            <button
              onClick={hideConfirm}
              className="text-gray-800 hover:bg-gray-100 px-4 py-1 rounded-lg dark:text-slate-200 dark:hover:bg-stone-900"
            >
              Cancel
            </button>
            <button
              onClick={updateWorkspace}
              className="border border-gray-800 text-gray-800 hover:bg-gray-100 px-4 py-1 rounded-lg dark:text-slate-200 dark:border-slate-200 dark:hover:bg-stone-900"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}