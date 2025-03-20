import renderMarkdown from '@/utils/chat/markdown';
import React from 'react'
import Collapsible from '@/components/Collapsible';


const CollapsibleReply = ({ text = '' }) => {

    const splitContent = text.split("</think>");
    const beforeThinking = splitContent[0] || "";
    const afterThinking = splitContent.slice(1).join("</think>");

    return (
        <div>
            {
                splitContent?.length > 1 ?
                    <div>
                        <Collapsible
                            title="Thinking.."
                            hideTitle="Thinking.."
                        >
                            <span
                                className={`whitespace-pre-line flex flex-col gap-y-1 leading-[20px]`}
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(beforeThinking) }}
                            />
                        </Collapsible>
                    </div>
                    : null
            }
            <span
                className={`whitespace-pre-line flex flex-col gap-y-1 leading-[20px] `}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(splitContent?.length > 1 ? afterThinking : text) }}
            />
        </div>
    )
}

export default CollapsibleReply
