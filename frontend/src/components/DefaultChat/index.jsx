import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../Sidebar";
import UserIcon from "../UserIcon";
import { userFromStorage } from "@/utils/request";
import useUser from "@/hooks/useUser";
import { useTranslation, Trans } from "react-i18next";
import { useChatMessageAlignment } from "@/hooks/useChatMessageAlignment";

export default function DefaultChatContainer() {
  const { getMessageAlignment } = useChatMessageAlignment();
  const [mockMsgs, setMockMessages] = useState([]);
  const { user } = useUser();
  const { t } = useTranslation();
  const popMsg = !window.localStorage.getItem("anythingllm_intro");

  const MESSAGES = [
    <React.Fragment key="msg1">
      <MessageContainer>
        <MessageContent alignmentCls={getMessageAlignment("assistant")}>
          <UserIcon user={{ uid: "system" }} role={"assistant"} />
          <MessageText>{t("welcomeMessage.part1")}</MessageText>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg2">
      <MessageContainer>
        <MessageContent alignmentCls={getMessageAlignment("user")}>
          <UserIcon user={{ uid: userFromStorage()?.username }} role={"user"} />
          <MessageText>{t("welcomeMessage.user1")}</MessageText>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg3">
      <MessageContainer>
        <MessageContent alignmentCls={getMessageAlignment("assistant")}>
          <UserIcon user={{ uid: "system" }} role={"assistant"} />
          <MessageText>{t("welcomeMessage.part4")}</MessageText>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg4">
      <MessageContainer>
        <MessageContent alignmentCls={getMessageAlignment("user")}>
          <UserIcon user={{ uid: userFromStorage()?.username }} role={"user"} />
          <MessageText>{t("welcomeMessage.user2")}</MessageText>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg5">
      <MessageContainer>
        <MessageContent alignmentCls={getMessageAlignment("assistant")}>
          <UserIcon user={{ uid: "system" }} role={"assistant"} />
          <MessageText>
            <Trans
              i18nKey="welcomeMessage.part5"
              components={{ i: <i />, br: <br /> }}
            />
          </MessageText>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg6">
      <MessageContainer>
        <MessageContent alignmentCls={getMessageAlignment("user")}>
          <UserIcon user={{ uid: userFromStorage()?.username }} role={"user"} />
          <MessageText>{t("welcomeMessage.user3")}</MessageText>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg7">
      <MessageContainer>
        <MessageContent alignmentCls={getMessageAlignment("assistant")}>
          <UserIcon user={{ uid: "system" }} role={"assistant"} />
          <MessageText>{t("welcomeMessage.part6")}</MessageText>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,
  ];

  useEffect(() => {
    function processMsgs() {
      if (window.localStorage.getItem("anythingllm_intro")) {
        setMockMessages([...MESSAGES]);
        return;
      }

      let timer = 500;
      let messages = [];

      MESSAGES.forEach((child) => {
        setTimeout(() => {
          messages.push(child);
          setMockMessages([...messages]);
        }, timer);
        timer += 2500;
      });

      window.localStorage.setItem("anythingllm_intro", 1);
    }

    processMsgs();
  }, []);

  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className={`transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary light:border-[1px] light:border-theme-sidebar-border w-full h-full overflow-y-scroll`}
    >
      {isMobile && <SidebarMobileHeader />}
      {mockMsgs.map((content, i) => (
        <React.Fragment key={i}>{content}</React.Fragment>
      ))}
    </div>
  );
}

function MessageContainer({ children }) {
  return (
    <div className="flex justify-center items-end w-full">
      <div className="py-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
        {children}
      </div>
    </div>
  );
}

function MessageContent({ children, alignmentCls = "" }) {
  return <div className={`flex gap-x-5 ${alignmentCls}`}>{children}</div>;
}

function MessageText({ children }) {
  return (
    <span className="text-white/80 light:text-theme-text-primary font-light text-[14px] flex flex-col gap-y-1 mt-2">
      {children}
    </span>
  );
}