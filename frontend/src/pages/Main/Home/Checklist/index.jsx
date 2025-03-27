import { HandWaving } from "@phosphor-icons/react";
import paths from "@/utils/paths";

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

export default function Checklist() {
  return (
    <div className="rounded-3xl border border-white/20 p-4 lg:p-6 -mb-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white font-semibold text-lg">Getting Started</h1>
        <div className="flex items-center gap-x-2">
          <p className="text-[#9F9FA0] text-xs">
            {CHECKLIST_ITEMS.filter((item) => !item.completed).length} tasks
            left
          </p>
          <button className="text-[#9F9FA0] text-xs hover:text-white">
            close
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CHECKLIST_ITEMS.map((item, i) => (
          <ChecklistItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
}

function ChecklistItem({ title, description, action, href, completed }) {
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
