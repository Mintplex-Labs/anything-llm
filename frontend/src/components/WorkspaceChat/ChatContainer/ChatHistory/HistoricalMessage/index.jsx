import { useEffect, useRef, memo } from "react";
import { AlertTriangle } from "react-feather";
import Jazzicon from "../../../../UserIcon";
import renderMarkdown from "../../../../../utils/chat/markdown";
import { userFromStorage } from "../../../../../utils/request";
import Citations from "../Citation";

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
        <div className="mr-2 py-1 px-4 w-fit md:max-w-[75%] bg-slate-200 dark:bg-amber-800 rounded-b-2xl rounded-tl-2xl rounded-tr-sm">
          <span
            className={`inline-block p-2 rounded-lg whitespace-pre-line text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base`}
          >
            {message}
          </span>
        </div>
        <Jazzicon size={30} user={{ uid: userFromStorage()?.username }} />
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
      <div className="ml-2 py-3 px-4 overflow-x-scroll w-fit md:max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-t-2xl rounded-br-2xl rounded-bl-sm">
        <span
          className="no-scroll whitespace-pre-line text-slate-800 dark:text-slate-200 font-[500] md:font-semibold text-sm md:text-base flex flex-col gap-y-1"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message) }}
        />
        <Citations sources={sources} />
      </div>
    </div>
  );
}

export default memo(HistoricalMessage);
