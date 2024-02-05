import { forwardRef, memo } from "react";
import { Warning } from "@phosphor-icons/react";
import renderMarkdown from "@/utils/chat/markdown";
import { embedderSettings } from "@/main";

const PromptReply = forwardRef(
  ({ uuid, reply, pending, error, sources = [] }, ref) => {
    if (!reply && sources.length === 0 && !pending && !error) return null;

    if (pending) {
      return (
        <div
          ref={ref}
          className={`flex justify-center items-end rounded-lg w-full ${embedderSettings.AI_BACKGROUND_COLOR}`}
        >
          <div className="py-2 px-2 w-full flex flex-col">
            <div className="flex gap-x-5">
              <div className="mt-3 ml-5 dot-falling"></div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className={`flex justify-center items-end w-full bg-red-200`}>
          <div className="py-2 px-4 w-full flex gap-x-5 flex-col">
            <div className="flex gap-x-5">
              <span
                className={`inline-block p-2 rounded-lg bg-red-50 text-red-500`}
              >
                <Warning className="h-4 w-4 mb-1 inline-block" /> Could not
                respond to message.
                <span className="text-xs">Reason: {error || "unknown"}</span>
              </span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={uuid}
        ref={ref}
        className={`flex justify-center items-end w-full ${embedderSettings.AI_BACKGROUND_COLOR}`}
      >
        <div
          style={{ wordBreak: "break-word" }}
          className="py-2 px-2 w-full flex flex-col"
        >
          <div className="flex gap-x-5">
            <span
              className={`reply whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(reply) }}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default memo(PromptReply);
