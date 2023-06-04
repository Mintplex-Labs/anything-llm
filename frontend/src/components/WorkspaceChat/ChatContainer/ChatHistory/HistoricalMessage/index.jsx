import { useEffect, useRef, memo, useState } from "react";
import { AlertTriangle } from "react-feather";
import Jazzicon from "../../../../UserIcon";
import { v4 } from "uuid";
import { decode as HTMLDecode } from "he";

function HistoricalMessage({
  message,
  role,
  workspace,
  sources = [],
  error = false,
}) {
  const replyRef = useRef(null);
  useEffect(() => {
    if (replyRef.current)
      replyRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [replyRef.current]);

  if (role === "user") {
    return (
      <div className="flex justify-end mb-4 items-start">
        <div className="mr-2 py-1 px-4 max-w-[75%] bg-slate-200 dark:bg-amber-800 rounded-b-2xl rounded-tl-2xl rounded-tr-sm">
          <span
            className={`inline-block p-2 rounded-lg whitespace-pre-line text-slate-800 dark:text-slate-200 font-semibold`}
          >
            {message}
          </span>
        </div>
        <Jazzicon size={30} user={{ uid: "user" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-start mb-4 items-end">
        <Jazzicon size={30} user={{ uid: workspace.slug }} />
        <div className="ml-2 max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-t-2xl rounded-br-2xl rounded-bl-sm">
          <span
            className={`inline-block p-2 rounded-lg bg-red-50 text-red-500`}
          >
            <AlertTriangle className="h-4 w-4 mb-1 inline-block" /> Could not
            respond to message.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div ref={replyRef} className="flex justify-start items-end mb-4">
      <Jazzicon size={30} user={{ uid: workspace.slug }} />
      <div className="ml-2 py-3 px-4 max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-t-2xl rounded-br-2xl rounded-bl-sm">
        <span className="whitespace-pre-line text-slate-800 dark:text-slate-200 font-semibold">
          {message}
        </span>
        <Citations sources={sources} />
      </div>
    </div>
  );
}

const Citations = ({ sources = [] }) => {
  const [show, setShow] = useState(false);
  if (sources.length === 0) return null;

  return (
    <div className="flex flex-col mt-4 justify-left">
      <button
        type="button"
        onClick={() => setShow(!show)}
        className="w-fit text-gray-700 dark:text-stone-400 italic text-xs"
      >
        {show ? "hide" : "show"} citations{show && "*"}
      </button>
      {show && (
        <>
          <div className="w-full flex flex-wrap items-center gap-4 mt-1 doc__source">
            {sources.map((source) => {
              const { id = null, title, url } = source;
              const handleClick = () => {
                if (!url) return false;
                window.open(url, "_blank");
              };
              return (
                <button
                  key={id || v4()}
                  onClick={handleClick}
                  className="italic transition-all duration-300 w-fit bg-gray-400 text-gray-900 py-[1px] hover:text-slate-200 hover:bg-gray-500 hover:dark:text-gray-900 dark:bg-stone-400 dark:hover:bg-stone-300 rounded-full px-2 text-xs leading-tight"
                >
                  "{HTMLDecode(title)}"
                </button>
              );
            })}
          </div>
          <p className="w-fit text-gray-700 dark:text-stone-400 text-xs mt-1">
            *citation may not be relevant to end result.
          </p>
        </>
      )}
    </div>
  );
};

export default memo(HistoricalMessage);
