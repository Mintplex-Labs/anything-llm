import truncate from "truncate";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";

export default function SlashCommandHubCard({ item }) {
  return (
    <>
      <div
        key={item.id}
        className="bg-zinc-800 rounded-lg p-3 hover:bg-zinc-700 transition-all duration-200"
      >
        <p className="text-white text-sm font-medium">{item.name}</p>
        <div className="flex flex-col gap-2">
          <p className="text-white/60 text-xs mt-1">{item.description}</p>
          <p className="text-white/60 text-xs bg-zinc-900 px-2 py-1 rounded-md font-mono">
            {item.command}
            <br />
            <br />
            {truncate(item.prompt, 90)}
          </p>
        </div>
        <div className="flex justify-end mt-2">
          <Link
            className="text-primary-button hover:text-primary-button/80 text-xs"
            to={paths.communityHub.importItem(item.importId)}
          >
            Import →
          </Link>
        </div>
      </div>
    </>
  );
}
