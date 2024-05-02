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
              "Welcome to ChatLTT! I'm your AI companion, ready to assist you. 
              ChatLTT is powered by robust GPUs housed in German data centers, 
              ensuring top-notch performance. Our focus is on hosting Large Language 
              Models (LLMs) to offer you a seamless AI chat experience. We aim to simplify 
              the process for you by handling all the technical aspects—hosting, installation, 
              and maintenance of LLMs. Your privacy is our priority; all your chats are 
              completely private and automatically deleted when you close your account.
              Say goodbye to the hassle of managing technical details and enjoy effortless 
              AI conversations with us. Let's chat!".
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex justify-center items-end w-full ${AI_BACKGROUND_COLOR}`}
      >
        <div
          className={`pb-4 pt-2 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col`}
        >
          <div className="flex gap-x-5">
            <Jazzicon size={36} user={{ uid: "system" }} role={"assistant"} />

            <span
              className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
            >
              ChatLTT is the easiest way to put powerful AI products like
              OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB, and other services
              together in a neat package with no fuss to increase your
              productivity by 100x.
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex justify-center items-end w-full ${AI_BACKGROUND_COLOR}`}
      >
        <div
          className={`pt-2 pb-6 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col`}
        >
          <div className="flex gap-x-5">
            <Jazzicon size={36} user={{ uid: "system" }} role={"assistant"} />
            <div>
              <span
                className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
              >
                "With our paid plans, you'll enjoy complete privacy. You can create Workspaces, 
                train your LLM models with text, PDFs, and audio notes. Utilize agents to browse 
                the internet and answer your queries. Engage in uncensored chats that are wiped 
                out after you leave. Rest assured, we never use your chats to train our models; 
                everything operates locally on your GPU servers. Plus, you can have a multi-user 
                account and invite your team, colleagues, or friends to converse with your trained 
                model. The possibilities are endless. <br /><br />Dive into our blogs to explore different use cases."
                <br />
                </span>
                <a
                href="https://chatltt.com"
                target="_blank"
                className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                <GitMerge className="h-4 w-4" />
                <p>Check our paid plans</p>
                </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex justify-center items-end w-full ${USER_BACKGROUND_COLOR}`}
      >
        <div
          className={`py-6 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col`}
        >
          <div className="flex gap-x-5">
            <Jazzicon
              size={36}
              user={{ uid: userFromStorage()?.username }}
              role={"user"}
            />

            <span
              className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
            >
              What is Workspace or these categories at the side bar?!
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex justify-center items-end w-full ${AI_BACKGROUND_COLOR}`}
      >
        <div
          className={`py-6 px-4 w-full flex gap-x-5 md:max-w-[800px] flex-col`}
        >
          <div className="flex gap-x-5">
            <Jazzicon size={36} user={{ uid: "system" }} role={"assistant"} />
            <div>
              <span
                className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
              >
                Paid Plans: Users can access and train their own Workspaces using a collection of text files, 
                audio scripts, and PDFs tailored to their specific subjects of interest. They have the flexibility
                to create multiple customized Workspaces according to their needs.
                <br />
                <br />
                Free Plan: We provide pre-tuned Workspaces featuring Large Trained Transformers
                (LTT) for users to explore and engage with. These pre-tuned libraries cover 
                a wide range of topics and are readily available for use without any additional
                training required.
                
              </span>

              </div>
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
