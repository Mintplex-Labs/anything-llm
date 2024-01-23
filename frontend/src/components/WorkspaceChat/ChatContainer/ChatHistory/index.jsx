import HistoricalMessage from "./HistoricalMessage";
import PromptReply from "./PromptReply";
import { useEffect, useRef } from "react";
import { useManageWorkspaceModal } from "../../../Modals/MangeWorkspace";
import ManageWorkspace from "../../../Modals/MangeWorkspace";
import { v4 } from "uuid";

export default function ChatHistory({ history = [], workspace }) {
  const replyRef = useRef(null);
  const { showing, showModal, hideModal } = useManageWorkspaceModal();

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleScroll = () => {
    const diff =
      replyRef.current.scrollHeight -
      replyRef.current.scrollTop -
      replyRef.current.clientHeight;
    // Fuzzy margin for what qualifies as "bottom". Stronger than straight comparison since that may change over time.
    const isBottom = diff <= 10;
    setIsAtBottom(isBottom);
  };

  const debouncedScroll = debounce(handleScroll, 100);
  useEffect(() => {
    function watchScrollEvent() {
      if (!replyRef.current) return null;
      const chatHistoryElement = replyRef.current;
      if (!chatHistoryElement) return null;
      chatHistoryElement.addEventListener("scroll", debouncedScroll);
    }
    watchScrollEvent();
  }, []);

  const scrollToBottom = () => {
    if (replyRef.current) {
      replyRef.current.scrollTo({
        top: replyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col h-full md:mt-0 pb-48 w-full justify-end items-center">
        <div className="flex flex-col items-start">
          <p className="text-white/60 text-lg font-base py-4">
            Welcome to your new workspace.
          </p>
          <div className="w-full text-center">
            <p className="text-white/60 text-lg font-base inline-grid md:inline-flex items-center gap-x-2">
              To get started either{" "}
              <span
                className="underline font-medium cursor-pointer"
                onClick={showModal}
              >
                upload a document
              </span>
              or <b className="font-medium italic">send a chat.</b>
            </p>
          </div>
        </div>
        {showing && (
          <ManageWorkspace
            hideModal={hideModal}
            providedSlug={workspace.slug}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="h-full md:h-[83%] pb-[100px] pt-6 md:pt-0 md:pb-20 md:mx-0 overflow-y-scroll flex flex-col justify-start no-scroll"
      id="chat-history"
    >
      {history.map((props, index) => {
        const isLastMessage = index === history.length - 1;
        const isLastBotReply =
          index === history.length - 1 && props.role === "assistant";

        if (isLastBotReply && props.animate) {
          return (
            <PromptReply
              key={props.uuid}
              ref={isLastMessage ? replyRef : null}
              uuid={props.uuid}
              reply={props.content}
              pending={props.pending}
              sources={props.sources}
              error={props.error}
              workspace={workspace}
              closed={props.closed}
            />
          );
        }

        return (
          <HistoricalMessage
            key={index}
            ref={isLastMessage ? replyRef : null}
            message={props.content}
            role={props.role}
            workspace={workspace}
            sources={props.sources}
            error={props.error}
          />
        );
      })}
      {showing && (
        <ManageWorkspace hideModal={hideModal} providedSlug={workspace.slug} />
      )}
    </div>
  );
}
