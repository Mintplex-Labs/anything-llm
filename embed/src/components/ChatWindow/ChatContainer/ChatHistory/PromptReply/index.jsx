import { forwardRef, memo } from "react";
import { Warning } from "@phosphor-icons/react";
import renderMarkdown from "@/utils/chat/markdown";
import { embedderSettings } from "@/main";
import AnythingLLMIcon from "@/assets/anything-llm-icon.svg";

const PromptReply = forwardRef(
  ({ uuid, reply, pending, error, sources = [] }, ref) => {
    if (!reply && sources.length === 0 && !pending && !error) return null;

    // if (pending) {
    //   return (
    //     <div
    //       ref={ref}
    //       className={`flex justify-center items-center rounded-lg shadow-[0_4px_14px_rgba(0,0,0,0.25)] border-[#22262833]/20 ${embedderSettings.ASSISTANT_STYLES}`}
    //     >
    //       <div className="py-2 px-2 flex flex-col">
    //         <div className="flex gap-x-5">
    //           <div className="mt-3 ml-5 dot-falling"></div>
    //         </div>
    //       </div>
    //     </div>
    //   );
    // }

    if (pending) {
      return (
        <div className={`flex items-end w-full h-fit justify-start`}>
          <img
            src={AnythingLLMIcon}
            alt="Anything LLM Icon"
            className="w-9 h-9 flex-shrink-0 ml-2"
          />
          <div
            style={{ wordBreak: "break-word" }}
            className={`py-[11px] px-4 flex flex-col ${embedderSettings.ASSISTANT_STYLES} shadow-[0_4px_14px_rgba(0,0,0,0.25)]`}
          >
            {/* <div className="py-2 px-2 flex flex-col"> */}
            <div className="flex gap-x-5">
              <div className="mx-4 my-1 dot-falling"></div>
            </div>
            {/* </div> */}
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
        className={`flex items-end w-full h-fit justify-start`}
      >
        <img
          src={AnythingLLMIcon}
          alt="Anything LLM Icon"
          className="w-9 h-9 flex-shrink-0 ml-2"
        />
        <div
          style={{ wordBreak: "break-word" }}
          className={`py-[11px] px-4 flex flex-col ${
            error ? "bg-red-200" : embedderSettings.ASSISTANT_STYLES
          } shadow-[0_4px_14px_rgba(0,0,0,0.25)]`}
        >
          <div className="flex gap-x-5">
            <span
              className={`reply whitespace-pre-line font-normal text-sm md:text-sm flex flex-col gap-y-1`}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(reply) }}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default memo(PromptReply);
