import React, { useEffect, useState } from "react";
import { GitHub, GitMerge, Mail, Plus } from "react-feather";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "../Modals/NewWorkspace";

export default function DefaultChatContainer() {
  const [mockMsgs, setMockMessages] = useState([]);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();
  const popMsg = !window.localStorage.getItem("anythingllm_intro");

  const MESSAGES = [
    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${popMsg ? "chat__message" : ""
          }`}
      >
        <div className="p-4 max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-semibold">
            Welcome to AnythingLLM, AnythingLLM is an open-source AI tool by
            Mintplex Labs that turns <i>anything</i> into a trained chatbot you
            can query and chat with. AnythingLLM is a BYOK (bring-your-own-keys)
            software so there is no subscription, fee, or charges for this
            software outside of the services you want to use with it.
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${popMsg ? "chat__message" : ""
          }`}
      >
        <div className="p-4 max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-semibold">
            AnythingLLM is the easiest way to put powerful AI products like
            OpenAi, GPT-4, LangChain, PineconeDB, ChromaDB, and other services
            together in a neat package with no fuss to increase your
            productivity by 100x.
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${popMsg ? "chat__message" : ""
          }`}
      >
        <div className="p-4 max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-semibold">
            AnythingLLM can run totally locally on your machine with little
            overhead you wont even notice it's there! No GPU needed. Cloud and
            on-premises installation is available as well.
            <br />
            The AI tooling ecosystem gets more powerful everyday. AnythingLLM
            makes it easy to use.
          </p>
          <a
            href=""
            className="mt-4 w-fit flex flex-grow gap-x-2 py-[5px] px-4 border border-slate-400 rounded-lg text-slate-800 dark:text-slate-200 justify-start items-center hover:bg-slate-100 dark:hover:bg-stone-900 dark:bg-stone-900"
          >
            <GitMerge className="h-4 w-4" />
            <p className="text-slate-800 dark:text-slate-200 text-lg leading-loose">
              Create an issue on Github
            </p>
          </a>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-end ${popMsg ? "chat__message" : ""
          }`}
      >
        <div className="p-4 max-w-[75%] bg-slate-200 dark:bg-amber-800 rounded-b-2xl rounded-tl-2xl rounded-tr-sm">
          <p className="text-slate-800 dark:text-slate-200 font-semibold">
            How do I get started?!
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${popMsg ? "chat__message" : ""
          }`}
      >
        <div className="p-4 max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-semibold">
            It's simple. All collections are organized into buckets we call{" "}
            <b>"Workspaces"</b>. Workspaces are buckets of files, documents,
            images, PDFs, and other files which will be transformed into
            something LLM's can understand and use in conversation.
            <br />
            <br />
            You can add and remove files at anytime.
          </p>
          <button
            onClick={showNewWsModal}
            className="mt-4 w-fit flex flex-grow gap-x-2 py-[5px] px-4 border border-slate-400 rounded-lg text-slate-800 dark:text-slate-200 justify-start items-center hover:bg-slate-100 dark:hover:bg-stone-900 dark:bg-stone-900"
          >
            <Plus className="h-4 w-4" />
            <p className="text-slate-800 dark:text-slate-200 text-lg leading-loose">
              Create your first workspace
            </p>
          </button>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-end ${popMsg ? "chat__message" : ""
          }`}
      >
        <div className="p-4 max-w-[75%] bg-slate-200 dark:bg-amber-800 rounded-b-2xl rounded-tl-2xl rounded-tr-sm">
          <p className="text-slate-800 dark:text-slate-200 font-semibold">
            Is this like an AI dropbox or something? What about chatting? It is
            a chatbot isn't it?
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${popMsg ? "chat__message" : ""
          }`}
      >
        <div className="p-4 max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-semibold">
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
            You can toggle between either mode <i>in the middle of chatting!</i>
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-end ${popMsg ? "chat__message" : ""
          }`}
      >
        <div className="p-4 max-w-[75%] bg-slate-200 dark:bg-amber-800 rounded-b-2xl rounded-tl-2xl rounded-tr-sm">
          <p className="text-slate-800 dark:text-slate-200 font-semibold">
            Wow, this sounds amazing, let me try it out already!
          </p>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment>
      <div
        className={`flex w-full mt-2 justify-start ${popMsg ? "chat__message" : ""
          }`}
      >
        <div className="p-4 max-w-[75%] bg-orange-100 dark:bg-stone-700 rounded-b-2xl rounded-tr-2xl rounded-tl-sm">
          <p className="text-slate-800 dark:text-slate-200 font-semibold">
            Have Fun!
          </p>
          <div className="flex items-center gap-x-4">
            <a
              href=""
              className="mt-4 w-fit flex flex-grow gap-x-2 py-[5px] px-4 border border-slate-400 rounded-lg text-slate-800 dark:text-slate-200 justify-start items-center hover:bg-slate-100 dark:hover:bg-stone-900 dark:bg-stone-900"
            >
              <GitHub className="h-4 w-4" />
              <p className="text-slate-800 dark:text-slate-200 text-lg leading-loose">
                Star on GitHub
              </p>
            </a>
            <a
              href=""
              className="mt-4 w-fit flex flex-grow gap-x-2 py-[5px] px-4 border border-slate-400 rounded-lg text-slate-800 dark:text-slate-200 justify-start items-center hover:bg-slate-100 dark:hover:bg-stone-900 dark:bg-stone-900"
            >
              <Mail className="h-4 w-4" />
              <p className="text-slate-800 dark:text-slate-200 text-lg leading-loose">
                Contact Mintplex Labs
              </p>
            </a>
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
      style={{ height: "calc(100% - 32px)" }}
      className="transition-all duration-500 relative ml-[2px] mr-[8px] my-[16px] rounded-[26px] bg-white dark:bg-black-900 min-w-[82%] p-[18px] h-full overflow-y-scroll"
    >
      {mockMsgs.map((content, i) => {
        return <React.Fragment key={i}>{content}</React.Fragment>;
      })}
      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
    </div>
  );
}
