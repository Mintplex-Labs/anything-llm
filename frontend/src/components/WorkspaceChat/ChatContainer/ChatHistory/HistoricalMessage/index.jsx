import { memo, forwardRef } from "react";
import { AlertTriangle } from "react-feather";
import Jazzicon from "../../../../UserIcon";
import renderMarkdown from "../../../../../utils/chat/markdown";
import { userFromStorage } from "../../../../../utils/request";
import Citations from "../Citation";

const HistoricalMessage = forwardRef(
  ({ message, role, workspace, sources = [], error = false }, ref) => {
    const userBackgroundColor = "bg-historical-msg-user";
    const aiBackgroundColor = "bg-historical-msg-system";

    console.log(sources, role);

    return (
      <div ref={ref} className={`flex justify-center items-end w-full ${role === "user" ? userBackgroundColor : aiBackgroundColor}`}>
        <div className={`py-10 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col`}>
          <div className="flex gap-x-5">
            <Jazzicon size={36} user={{ uid: role === "user" ? userFromStorage()?.username : workspace.slug }} role={role} />

            {error ? (
              <span className={`inline-block p-2 rounded-lg bg-red-50 text-red-500`}>
                <AlertTriangle className="h-4 w-4 mb-1 inline-block" /> Could not
                respond to message.
              </span>
            ) : (
              <span
                className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(message) }}
              />
            )}
          </div>
          {role === "assistant" && <Citations sources={sources} />}
        </div>
      </div>
    );
  }
);

export default memo(HistoricalMessage);
