import { forwardRef, memo } from "react";
import { Warning } from "@phosphor-icons/react";
import Jazzicon from "../../../../UserIcon";
import renderMarkdown from "@/utils/chat/markdown";
import Citations from "../Citation";

const PromptReply = forwardRef(
  (
    { uuid, reply, pending, error, workspace, sources = [], closed = true },
    ref
  ) => {
    const assistantBackgroundColor = "bg-historical-msg-system";

    if (!reply && sources.length === 0 && !pending && !error) return null;

    if (pending) {
      return (
        <div
          ref={ref}
          className={`flex justify-center items-end w-full ${assistantBackgroundColor}`}
        >
          <div className="py-8 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col">
            <div className="flex gap-x-5">
              <Jazzicon
                size={36}
                user={{ uid: workspace.slug }}
                role="assistant"
              />
              <div className="mt-3 ml-5 dot-falling"></div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          className={`flex justify-center items-end w-full ${assistantBackgroundColor}`}
        >
          <div className="py-8 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col">
            <div className="flex gap-x-5">
              <Jazzicon
                size={36}
                user={{ uid: workspace.slug }}
                role="assistant"
              />
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
        className={`flex justify-center items-end w-full ${assistantBackgroundColor}`}
      >
        <div className="py-8 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col">
          <div className="flex gap-x-5">
            <Jazzicon
              size={36}
              user={{ uid: workspace.slug }}
              role="assistant"
            />
            <span
              className={`reply whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(reply) }}
            />
          </div>
          <Citations sources={sources} />
        </div>
      </div>
    );
  }
);

export default memo(PromptReply);
