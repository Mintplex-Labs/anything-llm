import paths from "@/utils/paths";
import { Eye, LockSimple } from "@phosphor-icons/react";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tooltip";

export default function GenericHubCard({ item }) {
  return (
    <div
      key={item.id}
      className="bg-zinc-800 light:bg-slate-100 rounded-lg p-3 hover:bg-zinc-700 light:hover:bg-slate-200 transition-all duration-200"
    >
      <p className="text-white text-sm font-medium">{item.name}</p>
      <p className="text-white/60 text-xs mt-1">{item.description}</p>
      <div className="flex justify-end mt-2">
        <Link
          className="text-primary-button hover:text-primary-button/80 text-xs"
          to={paths.communityHub.importItem(item.importId)}
        >
          Import →
        </Link>
      </div>
    </div>
  );
}

export function VisibilityIcon({ visibility = "public" }) {
  const Icon = visibility === "private" ? LockSimple : Eye;

  return (
    <>
      <div
        data-tooltip-id="visibility-icon"
        data-tooltip-content={`This item is ${visibility === "private" ? "private" : "public"}`}
      >
        <Icon className="w-4 h-4 text-white/60" />
      </div>
      <Tooltip
        id="visibility-icon"
        place="top"
        delayShow={300}
        className="allm-tooltip !allm-text-xs"
      />
    </>
  );
}
