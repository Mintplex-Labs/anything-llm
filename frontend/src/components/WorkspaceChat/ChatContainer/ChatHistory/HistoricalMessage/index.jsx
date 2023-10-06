import { memo, forwardRef } from "react";
import { AlertTriangle } from "react-feather";
import Jazzicon from "../../../../UserIcon";
import renderMarkdown from "../../../../../utils/chat/markdown";
import { userFromStorage } from "../../../../../utils/request";
import Citations from "../Citation";

const HistoricalMessage = forwardRef(
  ({ message, role, workspace, sources = [], error = false }, ref) => {
    const userBackgroundColor = "bg-chat-msg-user-gradient";
    const aiBackgroundColor = "bg-white/5";

    return (
      <div ref={ref} className="flex justify-start items-end mb-4 w-full">
        <Jazzicon size={30} user={{ uid: role === "user" ? userFromStorage()?.username : workspace.slug }} />
        <div className={`ml-2 py-10 px-4 w-full ${role === "user" ? userBackgroundColor : aiBackgroundColor} rounded-lg`}>
          {error ? (
            <span
              className={`inline-block p-2 rounded-lg bg-red-50 text-red-500`}
            >
              <AlertTriangle className="h-4 w-4 mb-1 inline-block" /> Could not
              respond to message.
            </span>
          ) : (
            <span
              className={`whitespace-pre-line text-white font-normal text-sm md:text-base flex flex-col gap-y-1`}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(message) }}
            />
          )}
          {role === "system" && <Citations sources={sources} />}
        </div>
      </div>
    );
  }
);

export default memo(HistoricalMessage);
