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
import UserIcon from "../UserIcon";
import { userFromStorage } from "@/utils/request";
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from "@/utils/constants";
import useUser from "@/hooks/useUser";
import { useTranslation, Trans } from "react-i18next";

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
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMessages = await System.getWelcomeMessages();
      setFetchedMessages(fetchedMessages);
    };
    fetchData();
  }, []);

  const MESSAGES = [
    <React.Fragment key="msg1">
      <div
        className={`flex justify-center items-end w-full ${AI_BACKGROUND_COLOR} md:mt-0 mt-[40px]`}
      >
        <div
          className={`pt-10 pb-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}
        >
          <div className="flex gap-x-5">
            <UserIcon user={{ uid: "system" }} role={"assistant"} />

            <span
              className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
            >
              {t("welcomeMessage.part1")}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="msg2">
      <div
        className={`flex justify-center items-end w-full ${AI_BACKGROUND_COLOR}`}
      >
        <div
          className={`pb-4 pt-2 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}
        >
          <div className="flex gap-x-5">
            <UserIcon user={{ uid: "system" }} role={"assistant"} />

            <span
              className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
            >
              {t("welcomeMessage.part2")}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="msg3">
      <div
        className={`flex justify-center items-end w-full ${AI_BACKGROUND_COLOR}`}
      >
        <div
          className={`pt-2 pb-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}
        >
          <div className="flex gap-x-5">
            <UserIcon user={{ uid: "system" }} role={"assistant"} />
            <div>
              <span
                className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
              >
                {t("welcomeMessage.part3")}
              </span>
              <a
                href={paths.github()}
                target="_blank"
                rel="noreferrer"
                className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                <GitMerge className="h-4 w-4" />
                <p>{t("welcomeMessage.githubIssue")}</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="msg4">
      <div
        className={`flex justify-center items-end w-full ${USER_BACKGROUND_COLOR}`}
      >
        <div
          className={`py-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}
        >
          <div className="flex gap-x-5">
            <UserIcon
              user={{ uid: userFromStorage()?.username }}
              role={"user"}
            />

            <span
              className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
            >
              {t("welcomeMessage.user1")}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="msg5">
      <div
        className={`flex justify-center items-end w-full ${AI_BACKGROUND_COLOR}`}
      >
        <div
          className={`py-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}
        >
          <div className="flex gap-x-5">
            <UserIcon user={{ uid: "system" }} role={"assistant"} />
            <div>
              <span
                className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
              >
                {t("welcomeMessage.part4")}
              </span>

              {(!user || user?.role !== "default") && (
                <button
                  onClick={showNewWsModal}
                  className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  <Plus className="h-4 w-4" />
                  <p>{t("welcomeMessage.createWorkspace")}</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="msg6">
      <div
        className={`flex justify-center items-end w-full ${USER_BACKGROUND_COLOR}`}
      >
        <div
          className={`py-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}
        >
          <div className="flex gap-x-5">
            <UserIcon
              user={{ uid: userFromStorage()?.username }}
              role={"user"}
            />

            <span
              className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
            >
              {t("welcomeMessage.user2")}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="msg7">
      <div
        className={`flex justify-center items-end w-full ${AI_BACKGROUND_COLOR}`}
      >
        <div
          className={`py-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}
        >
          <div className="flex gap-x-5">
            <UserIcon user={{ uid: "system" }} role={"assistant"} />

            <span
              className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
            >
              <Trans
                i18nKey="welcomeMessage.part5"
                components={{
                  i: <i />,
                  br: <br />,
                }}
              />
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="msg8">
      <div
        className={`flex justify-center items-end w-full ${USER_BACKGROUND_COLOR}`}
      >
        <div
          className={`py-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}
        >
          <div className="flex gap-x-5">
            <UserIcon
              user={{ uid: userFromStorage()?.username }}
              role={"user"}
            />

            <span
              className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
            >
              {t("welcomeMessage.user3")}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="msg9">
      <div
        className={`flex justify-center items-end w-full ${AI_BACKGROUND_COLOR}`}
      >
        <div
          className={`py-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col`}
        >
          <div className="flex gap-x-5">
            <UserIcon user={{ uid: "system" }} role={"assistant"} />
            <div>
              <span
                className={`whitespace-pre-line text-white font-normal text-sm md:text-sm flex flex-col gap-y-1 mt-2`}
              >
                {t("welcomeMessage.part6")}
              </span>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
                <a
                  href={paths.github()}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  <GithubLogo className="h-4 w-4" />
                  <p>{t("welcomeMessage.starOnGithub")}</p>
                </a>
                <a
                  href={paths.mailToMintplex()}
                  className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  <EnvelopeSimple className="h-4 w-4" />
                  <p>{t("welcomeMessage.contact")}</p>
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
