import renderMarkdown from '@/utils/chat/markdown';
import React from 'react'
import Collapsible from '@/components/Collapsible';


const CollapsibleReply = ({ text = '' }) => {

    const splitContent = text.split("</think>");
    const beforeThink = splitContent[0] || "";
    const afterThink = splitContent.slice(1).join("</think>");

    return (
        <div>
            {
                splitContent?.length > 1 ?
                    <div className="pb-4" >
                        <Collapsible
                            title="Show Thinking"
                            hideTitle="Hide Thinking"
                        >
                            <span
                                className={`whitespace-pre-line flex flex-col gap-y-1 leading-[20px]`}
                                dangerouslySetInnerHTML={{ __html: renderMarkdown(beforeThink) }}
                            />
                        </Collapsible>
                    </div>
                    : null
            }
            <span
                className={`whitespace-pre-line flex flex-col gap-y-1 leading-[20px] `}
                dangerouslySetInnerHTML={{ __html: renderMarkdown(splitContent?.length > 1 ? afterThink : text) }}
            />
        </div>
    )
}

export default CollapsibleReply
