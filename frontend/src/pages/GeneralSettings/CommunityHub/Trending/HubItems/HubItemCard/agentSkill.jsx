import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import pluralize from "pluralize";
import { VisibilityIcon } from "./generic";

export default function AgentSkillHubCard({ item }) {
  return (
    <>
      <Link
        key={item.id}
        to={paths.communityHub.importItem(item.importId)}
        className="bg-black/70 rounded-lg p-3 hover:bg-black/60 transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-400"
      >
        <div className="flex gap-x-2 items-center">
          <p className="text-white text-sm font-medium">{item.name}</p>
          <VisibilityIcon visibility={item.visibility} />
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white/60 text-xs mt-1">{item.description}</p>

          <p className="font-mono text-xs mt-1 text-white/60">
            {item.verified ? (
              <span className="text-green-500">Verified</span>
            ) : (
              <span className="text-red-500">Unverified</span>
            )}{" "}
            Skill
          </p>
          <p className="font-mono text-xs mt-1 text-white/60">
            {item.manifest.files?.length || 0}{" "}
            {pluralize("file", item.manifest.files?.length || 0)} found
          </p>
        </div>
        <div className="flex justify-end mt-2">
          <Link
            to={paths.communityHub.importItem(item.importId)}
            className="text-primary-button hover:text-primary-button/80 text-sm font-medium px-3 py-1.5 rounded-md bg-black/30 group-hover:bg-black/50 transition-all"
          >
            Import →
          </Link>
        </div>
      </Link>
    </>
  );
}
