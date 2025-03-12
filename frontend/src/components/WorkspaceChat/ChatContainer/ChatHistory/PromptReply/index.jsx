import { memo, useRef, useEffect, useState } from "react";
import { Warning } from "@phosphor-icons/react";
import UserIcon from "../../../../UserIcon";
import renderMarkdown from "@/utils/chat/markdown";
import Citations, { CitationDetailModal } from "../Citation";
import {
  THOUGHT_REGEX_CLOSE,
  THOUGHT_REGEX_COMPLETE,
  THOUGHT_REGEX_OPEN,
  ThoughtChainComponent,
} from "../ThoughtContainer";

const PromptReply = ({
  uuid,
  reply,
  pending,
  error,
  workspace,
  sources = [],
  closed = true,
}) => {
  const assistantBackgroundColor = "bg-theme-bg-chat";

  if (!reply && sources.length === 0 && !pending && !error) return null;

  if (pending) {
    return (
      <div
        className={`flex justify-center items-end w-full ${assistantBackgroundColor}`}
      >
        <div className="py-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
          <div className="flex gap-x-5">
            <WorkspaceProfileImage workspace={workspace} />
            <div className="mt-3 ml-5 dot-falling light:invert"></div>
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
        <div className="py-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
          <div className="flex gap-x-5">
            <WorkspaceProfileImage workspace={workspace} />
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
      className={`flex justify-center items-end w-full ${assistantBackgroundColor}`}
    >
      <div className="py-8 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
        <div className="flex gap-x-5">
          <WorkspaceProfileImage workspace={workspace} />
          <RenderAssistantChatContent
            key={`${uuid}-prompt-reply-content`}
            message={reply}
            sources={sources}
          />
        </div>
        <Citations sources={sources} />
      </div>
    </div>
  );
};

export function WorkspaceProfileImage({ workspace }) {
  if (!!workspace.pfpUrl) {
    return (
      <div className="relative w-[35px] h-[35px] rounded-full flex-shrink-0 overflow-hidden">
        <img
          src={workspace.pfpUrl}
          alt="Workspace profile picture"
          className="absolute top-0 left-0 w-full h-full object-cover rounded-full bg-white"
        />
      </div>
    );
  }

  return <UserIcon user={{ uid: workspace.slug }} role="assistant" />;
}

function RenderAssistantChatContent({ message, sources = [] }) {
  const contentRef = useRef("");
  const thoughtChainRef = useRef(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const renderedContentRef = useRef(null);
  
  // DOM 이벤트 리스너 추가
  useEffect(() => {
    const handleCitationClick = (e) => {
      // citation-link 클래스를 가진 링크 클릭 감지
      if (e.target.closest('.citation-link')) {
        e.preventDefault();
        const index = parseInt(e.target.closest('.citation-link').dataset.citationIndex, 10);
        if (sources && sources.length > 0) {
          const sourceIndex = Math.min(index - 1, sources.length - 1);
          if (sourceIndex >= 0 && sources[sourceIndex]) {
            const sourceItem = sources[sourceIndex];
            
            // Citation 컴포넌트에서 사용하는 형식으로 변환
            const { id, title, text, chunkSource = "", score = null } = sourceItem;
            const formattedSource = {
              title: title || id || "Source " + (sourceIndex + 1),
              chunks: [{
                id, 
                text,
                chunkSource, 
                score
              }],
              references: 1
            };
            
            setSelectedSource(formattedSource);
          } else {
            console.warn('인용 소스를 찾을 수 없습니다:', index, sources);
          }
        }
      }
    };
    
    // 컨텐츠가 렌더링된 요소에 이벤트 리스너 추가
    const contentElement = renderedContentRef.current;
    if (contentElement) {
      contentElement.addEventListener('click', handleCitationClick);
    }
    
    return () => {
      if (contentElement) {
        contentElement.removeEventListener('click', handleCitationClick);
      }
    };
  }, [sources]);

  useEffect(() => {
    const thinking =
      message.match(THOUGHT_REGEX_OPEN) && !message.match(THOUGHT_REGEX_CLOSE);

    if (thinking && thoughtChainRef.current) {
      thoughtChainRef.current.updateContent(message);
      return;
    }

    const completeThoughtChain = message.match(THOUGHT_REGEX_COMPLETE)?.[0];
    const msgToRender = message.replace(THOUGHT_REGEX_COMPLETE, "");

    if (completeThoughtChain && thoughtChainRef.current) {
      thoughtChainRef.current.updateContent(completeThoughtChain);
    }

    contentRef.current = msgToRender;
  }, [message]);

  const thinking =
    message.match(THOUGHT_REGEX_OPEN) && !message.match(THOUGHT_REGEX_CLOSE);
  if (thinking)
    return (
      <ThoughtChainComponent ref={thoughtChainRef} content="" expanded={true} />
    );

  return (
    <div className="flex flex-col gap-y-1">
      {message.match(THOUGHT_REGEX_COMPLETE) && (
        <ThoughtChainComponent
          ref={thoughtChainRef}
          content=""
          expanded={true}
        />
      )}
      <span
        ref={renderedContentRef}
        className="break-words"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(contentRef.current) }}
      />
      {selectedSource && (
        <CitationDetailModal
          source={selectedSource}
          onClose={() => setSelectedSource(null)}
        />
      )}
    </div>
  );
}

export default memo(PromptReply);
