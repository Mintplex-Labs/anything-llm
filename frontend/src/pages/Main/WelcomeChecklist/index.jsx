import React, { useEffect, useState } from "react";
import paths from "@/utils/paths";
import { ArrowCircleUpRight, HandWaving } from "@phosphor-icons/react";
import { isMobile } from "react-device-detect";
import WelcomeBanner from "./Banner";
import Sidebar, { SidebarMobileHeader } from "@/components/Sidebar";

const CHECKLIST_ITEMS = [
  {
    title: "Create a workspace",
    description: "Short task description",
    action: "Create",
    href: paths.home(),
    completed: true,
  },
  {
    title: "Send a chat",
    description: "Short task description",
    action: "Chat",
    href: paths.home(),
    completed: false,
  },
  {
    title: "Embed a document",
    description: "Short task description",
    action: "Embed",
    href: paths.home(),
    completed: false,
  },
  {
    title: "Set up a system prompt",
    description: "Short task description",
    action: "Set Up",
    href: paths.home(),
    completed: false,
  },
  {
    title: "Define a slash command",
    description: "Short task description",
    action: "Define",
    href: paths.home(),
    completed: false,
  },
  {
    title: "Visit Community Hub",
    description: "Short task description",
    action: "Browse",
    href: paths.home(),
    completed: false,
  },
];

const FOOTER_LINKS = [
  {
    title: "Docs",
    href: paths.docs(),
  },
  {
    title: "Tutorials",
    href: paths.docs(),
  },
  {
    title: "Github",
    href: paths.github(),
  },
];

export default function WelcomeChecklist() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      {!isMobile ? <Sidebar /> : <SidebarMobileHeader />}
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-container w-full h-full"
      >
        <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto">
          <div className="w-full max-w-[1200px] flex flex-col items-center gap-y-6 p-4 pt-20 md:pt-16 md:p-12">
            <WelcomeBanner />
            <div className="w-full max-w-[680px] min-h-[450px] flex flex-col rounded-[24px] border border-white/20 py-8 px-9">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-white font-semibold text-lg">
                  Getting Started
                </h1>
                <p className="text-[#9F9FA0] text-xs">
                  {CHECKLIST_ITEMS.filter((item) => !item.completed).length}{" "}
                  tasks left
                </p>
              </div>
              <div className="flex-1 flex flex-col gap-6">
                {CHECKLIST_ITEMS.map((item, i) => (
                  <ChecklistItem key={i} {...item} />
                ))}
              </div>
            </div>
            <button className="text-white text-sm hover:opacity-70 transition-opacity mt-5">
              Skip
            </button>
            <div className="flex justify-start items-center gap-8 mt-12">
              {FOOTER_LINKS.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-white text-sm hover:opacity-70 transition-opacity"
                >
                  {link.title}
                  <ArrowCircleUpRight size={18} weight="fill" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChecklistItem({ title, description, action, href, completed }) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 h-10 hover:opacity-80 transition-colors"
    >
      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
        <HandWaving size={24} weight="fill" className="text-white" />
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-white text-sm">{title}</h3>
        <p className="text-[#9F9FA0] text-xs">{description}</p>
      </div>
      {completed ? (
        <div className="w-3.5 h-3.5 rounded-full border border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-[#6CE9A6] rounded-full" />
        </div>
      ) : (
        <button className="w-[78px] h-9 rounded-md bg-[#36BFFA] text-black font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center">
          {action}
        </button>
      )}
    </a>
  );
}
