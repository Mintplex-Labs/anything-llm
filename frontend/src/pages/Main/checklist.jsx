import React from "react";
import PropTypes from "prop-types";
import { HandWaving } from "@phosphor-icons/react";
import paths from "@/utils/paths";

export const CHECKLIST_ITEMS = [
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

export function ChecklistItem({ title, description, action, href, completed }) {
  return (
    <a
      href={href}
      className="flex items-center gap-x-4 hover:opacity-80 transition-colors"
    >
      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
        <HandWaving size={24} className="text-white" />
      </div>
      <div className="flex-1">
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

ChecklistItem.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  completed: PropTypes.bool.isRequired,
};
