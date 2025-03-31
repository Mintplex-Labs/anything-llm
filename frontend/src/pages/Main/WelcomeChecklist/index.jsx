import React, { useEffect, useState } from "react";
import paths from "@/utils/paths";
import { ArrowCircleUpRight } from "@phosphor-icons/react";
import WelcomeBanner from "./Banner";
import { CHECKLIST_ITEMS, ChecklistItem } from "../checklist";
import { CHECKLIST_STORAGE_KEY } from "../Home/Checklist";

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

export default function WelcomeChecklist({ onSkip }) {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const stored = window.localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (stored) {
      const completedItems = JSON.parse(stored);
      setCompletedCount(Object.keys(completedItems).length);
    }
  }, []);

  return (
    <div className="w-full max-w-[1200px] flex flex-col items-center gap-y-6 p-4 pt-20 md:pt-16 md:p-12">
      <WelcomeBanner />
      <div className="w-full max-w-[680px] min-h-[450px] flex flex-col rounded-[24px] border border-white/20 py-8 px-9">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-white font-semibold text-lg">Getting Started</h1>
          <p className="text-[#9F9FA0] text-xs">
            {CHECKLIST_ITEMS.length - completedCount} tasks left
          </p>
        </div>
        <div className="flex-1 flex flex-col gap-6">
          {CHECKLIST_ITEMS.map((item, i) => (
            <ChecklistItem key={i} {...item} />
          ))}
        </div>
      </div>
      <button
        onClick={onSkip}
        className="text-white text-sm hover:opacity-70 transition-opacity mt-5"
      >
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
  );
}
