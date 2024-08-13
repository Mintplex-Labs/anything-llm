import React, { useEffect, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "../Modals/NewWorkspace";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../Sidebar";
import ChatBubble from "../ChatBubble";
import System from "@/models/system";
import UserIcon from "../UserIcon";
import { userFromStorage } from "@/utils/request";
import { AI_BACKGROUND_COLOR, USER_BACKGROUND_COLOR } from "@/utils/constants";
import useUser from "@/hooks/useUser";
import { useTranslation } from "react-i18next";

export default function DefaultChatContainer() {
  const [mockMsgs, setMockMessages] = useState([]);
  const { user } = useUser();
  const { t } = useTranslation();
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
    <React.Fragment key="message-1">
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
              {t("dashboard.openingMessages.message_1")}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="message-2">
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
                {t("dashboard.openingMessages.message_2.p1")}
                <br />
                <br />
                {t("dashboard.openingMessages.message_2.p2")}
              </span>

              {(!user || user?.role !== "default") && (
                <button
                  onClick={showNewWsModal}
                  className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                >
                  <Plus className="h-4 w-4" />
                  <p>{t("dashboard.openingMessages.message_2.button")}</p>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="message-3">
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
              {t("dashboard.openingMessages.message_3")}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="message-4">
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
              {t("dashboard.openingMessages.message_4.span1")}
              <br />
              <br />
              {t("dashboard.openingMessages.message_4.span2")}
              <br />
              <br />
              <i>{t("dashboard.openingMessages.message_4.query.title")}</i>
              {t("dashboard.openingMessages.message_4.query.description")}
              <br />
              <br />
              <i>
                {t("dashboard.openingMessages.message_4.conversational.title")}
              </i>
              {t(
                "dashboard.openingMessages.message_4.conversational.description"
              )}
              <br />
              <br />
              {t("dashboard.openingMessages.message_4.span3")}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="message-5">
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
              {t("dashboard.openingMessages.message_5")}
            </span>
          </div>
        </div>
      </div>
    </React.Fragment>,

    <React.Fragment key="message-6">
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
                {t("dashboard.openingMessages.message_6")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>,
  ];

  useEffect(() => {
    function processMsgs() {
      if (window.localStorage.getItem("anythingllm_intro")) {
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
