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

export default function DefaultChatContainer() {
  const [mockMsgs, setMockMessages] = useState([]);
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
              Welcome to AnythingLLM, AnythingLLM is an open-source AI tool by
              Mintplex Labs that turns anything into a trained chatbot you can
              query and chat with. AnythingLLM is a BYOK (bring-your-own-keys)
              software so there is no subscription, fee, or charges for this
              software outside of the services you want to use with it.
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
              AnythingLLM is the easiest way to put powerful AI products like
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
                AnythingLLM can run totally locally on your machine with little
                overhead you wont even notice it's there! No GPU needed. Cloud
                and on-premises installation is available as well.
                <br />
                The AI tooling ecosystem gets more powerful everyday.
                AnythingLLM makes it easy to use.
              </span>
              <a
                href={paths.github()}
                target="_blank"
                className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                <GitMerge className="h-4 w-4" />
                <p>Create an issue on Github</p>
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
              How do I get started?!
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
                It's simple. All collections are organized into buckets we call{" "}
                "Workspaces". Workspaces are buckets of files, documents,
                images, PDFs, and other files which will be transformed into
                something LLM's can understand and use in conversation.
                <br />
                <br />
                You can add and remove files at anytime.
              </span>

              <button
                onClick={showNewWsModal}
                className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                <Plus className="h-4 w-4" />
                <p>Create your first workspace</p>
              </button>
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
              Is this like an AI dropbox or something? What about chatting? It
              is a chatbot isn't it?
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

            <span
              className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
            >
              AnythingLLM is more than a smarter Dropbox.
              <br />
              <br />
              AnythingLLM offers two ways of talking with your data:
              <br />
              <br />
              <i>Query:</i> Your chats will return data or inferences found with
              the documents in your workspace it has access to. Adding more
              documents to the Workspace make it smarter!
              <br />
              <br />
              <i>Conversational:</i> Your documents + your on-going chat history
              both contribute to the LLM knowledge at the same time. Great for
              appending real-time text-based info or corrections and
              misunderstandings the LLM might have.
              <br />
              <br />
              You can toggle between either mode{" "}
              <i>in the middle of chatting!</i>
            </span>
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
              Wow, this sounds amazing, let me try it out already!
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
                Have Fun!
              </span>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
                <a
                  href={paths.github()}
                  target="_blank"
                  className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  <GithubLogo className="h-4 w-4" />
                  <p>Star on GitHub</p>
                </a>
                <a
                  href={paths.mailToMintplex()}
                  className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  <EnvelopeSimple className="h-4 w-4" />
                  <p>Contact Mintplex Labs</p>
                </a>
              </div>
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
      className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[26px] bg-main-gradient w-full h-full overflow-y-scroll border-4 border-accent"
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
