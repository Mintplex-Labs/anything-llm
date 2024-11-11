import truncate from "truncate";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";

export default function SlashCommandHubCard({ item }) {
  return (
    <>
      <Link
        key={item.id}
        to={paths.communityHub.importItem(item.importId)}
        className="bg-black/70 rounded-lg p-3 hover:bg-black/60 transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-400"
      >
        <p className="text-white text-sm font-medium">{item.name}</p>
        <div className="flex flex-col gap-2">
          <p className="text-white/60 text-xs mt-1">{item.description}</p>
          <label className="text-white/60 text-xs font-semibold mt-4">
            Command
          </label>
          <p className="text-white/60 text-xs bg-zinc-900 px-2 py-1 rounded-md font-mono border border-slate-800">
            {item.command}
          </p>

          <label className="text-white/60 text-xs font-semibold mt-4">
            Prompt
          </label>
          <p className="text-white/60 text-xs bg-zinc-900 px-2 py-1 rounded-md font-mono border border-slate-800">
            {truncate(item.prompt, 90)}
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
