import React, { useEffect, useState } from "react";
import {
  GithubLogo,
  GitMerge,
  EnvelopeSimple,
  Plus,
} from "@phosphor-icons/react";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "../Modals/NewWorkspace";
import paths from "@/utils/paths";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../Sidebar";
import ChatBubble from "../ChatBubble";
import System from "@/models/system";
import Jazzicon from "../UserIcon";
import { userFromStorage } from "@/utils/request";
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from "@/utils/constants";
import useUser from "@/hooks/useUser";

export default function DefaultChatContainer() {
  const [mockMsgs, setMockMessages] = useState([]);
  const { user } = useUser();
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();
  const popMsg = !window.localStorage.getItem("anythingllm_intro");

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMessages = await System.getWelcomeMessages();
      setFetchedMessages(fetchedMessages);
    };
    fetchData();
  }, []);

  const MESSAGES = [
    <React.Fragment>
      <div
        className={`flex justify-center items-end w-full ${AI_BACKGROUND_COLOR} md:mt-0 mt-[40px]`}
      >
        <div
          className={`pt-10 pb-6 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col`}
        >
          <div className="flex gap-x-5">
            <Jazzicon size={36} user={{ uid: "system" }} role={"assistant"} />

            <span
              className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
            >
              Hey there! I'm your AI companion, here to lend a hand and assist you however I can. Just a heads up, 
              I might not always get things perfect, so I apologize in advance for any slip-ups. If I give you any wrong info,
              feel free to reach out to my creator with your feedback.<br /><br />
              To get the most out of our chats, start conversations with the Hubs in the sidebar. Each Hub has its own 
              specialized training data, which helps me be more knowledgeable about specific topics.<br /><br />
              So, who am I exactly? Well, I'm your friendly AI chat bot, and you can think of me as having a home in 
              data centers. My main spot is in Germany, but my creator might move me around to places like the US, Canada, 
              Australia, and beyond. Don't worry, though—our chats are totally private, and nothing leaves this server. 
              Unlike some other big players out there who use your data to train themselves, I never do that. Once this 
              server is gone, any memory of our conversations is history. <br /><br />
              I rely on NVIDIA GPUs to power my brain, so if I'm not lightning-fast, just hang in there with me. Even 
              AI needs a bit of time to mull things over, right?
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

             
  ];

  useEffect(() => {
    function processMsgs() {
      if (!!window.localStorage.getItem("anythingllm_intro")) {
        setMockMessages([...MESSAGES]);
        return false;
      } else {
        setMockMessages([MESSAGES[0]]);
      }

      var timer = 500;
      var messages = [];

      MESSAGES.map((child) => {
        setTimeout(() => {
          setMockMessages([...messages, child]);
          messages.push(child);
        }, timer);
        timer += 2_500;
      });
      window.localStorage.setItem("anythingllm_intro", 1);
    }

    processMsgs();
  }, []);

  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-main-gradient w-full h-full overflow-y-scroll border-2 border-outline"
    >
      {isMobile && <SidebarMobileHeader />}
      {fetchedMessages.length === 0
        ? mockMsgs.map((content, i) => {
            return <React.Fragment key={i}>{content}</React.Fragment>;
          })
        : fetchedMessages.map((fetchedMessage, i) => {
            return (
              <React.Fragment key={i}>
                <ChatBubble
                  message={
                    fetchedMessage.user === ""
                      ? fetchedMessage.response
                      : fetchedMessage.user
                  }
                  type={fetchedMessage.user === "" ? "response" : "user"}
                  popMsg={popMsg}
                />
              </React.Fragment>
            );
          })}
      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
    </div>
  );
}
