import React, { useState, useRef, useEffect } from "react";
import Workspace from "../../../../models/workspace";
import paths from "../../../../utils/paths";
import { filter } from "@metamask/jazzicon/colors";

export default function ExportContents({ workspace }) {
  const formEl = useRef(null);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [data, setData] = useState();

  useEffect(() => {
    function setTimer() {
      if (success !== null) {
        setTimeout(() => {
          setSuccess(null);
        }, 3_000);
      }

      if (error !== null) {
        setTimeout(() => {
          setError(null);
        }, 3_000);
      }
    }
    setTimer();
  }, [success, error]);

  const handleUpdate = async (e) => {
    //nothing to do
  };

  const adjustTextArea = (event) => {
    const element = event.target;
    element.style.height = "1px";
    element.style.height =
      event.target.value.length !== 0
        ? 25 + element.scrollHeight + "px"
        : "1px";
  };

  const exporthistory = async () => {
      const chathistory = await Workspace.chatHistory(workspace?.slug);
      //TODO: UI to enable filtering and header removal.
      const filter_participant = "";
      var history = chathistory.filter(h => h.role !== filter_participant).map(h =>  "\n" + h.role.toUpperCase() + "\n" + h.content + '\n');
      history = history.join("");   //to strip the commas
      setData(history);
    };

  return (
    <form ref={formEl} onSubmit={handleUpdate}>
      <div className="p-6 flex h-full w-full max-h-[80vh] overflow-y-scroll">
        <div className="flex flex-col gap-y-1 w-full">
          <div className="flex flex-col mb-2">
            <p className="text-gray-800 dark:text-stone-200 text-base ">
              Export the workspace history
            </p>
          </div>
          <div>
              <input
                type="text"
                disabled={true}
                defaultValue={workspace?.name}
                className="bg-gray-50 border disabled:bg-gray-400 disabled:text-gray-700 disabled:border-gray-400 disabled:dark:bg-stone-800 disabled:dark:border-stone-900 disabled:dark:text-stone-600 disabled:cursor-not-allowed border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-stone-600 dark:border-stone-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required={true}
                autoComplete="off"
              />
          </div>

          <div className="p-2 flex h-full w-full ">
            <textarea
            disabled={true}
            required={true}
            maxLength={5000}
            onChange={(e) => setData(e.target.value)}
            value={data}
            onBlur={(e) => {
              adjustTextArea(e);
            }}
            className="cursor-text md:min-h-[400px] max-h-[100px] md:min-h-[40px] block mx-2 md:mx-4 p-2.5 w-full text-[16px] md:text-sm rounded-lg border bg-gray-50 border-gray-300 placeholder-gray-400 text-gray-900 dark:text-white dark:bg-stone-600 dark:border-stone-700 dark:placeholder-stone-400"
            />
          </div>

            
          <div className="flex items-center justify-between p-2 md:p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <button
            onClick={exporthistory}
            type="button"
            className="border border-transparent text-gray-500 bg-white hover:bg-red-100 rounded-lg whitespace-nowrap text-sm font-medium px-5 py-2.5 hover:text-red-900 focus:z-10 dark:bg-transparent dark:text-gray-300 dark:hover:text-white dark:hover:bg-red-600"
          >
            Export History
          </button>
          
        </div>
        </div>
      </div>
    </form>
  );
}
