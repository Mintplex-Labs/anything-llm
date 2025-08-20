import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import { VisibilityIcon } from "./generic";

export default function AgentFlowHubCard({ item }) {
  const flow = JSON.parse(item.flow);
  return (
    <Link
      to={paths.communityHub.importItem(item.importId)}
      className="bg-black/70 light:bg-card rounded-lg p-3 hover:bg-black/60 light:hover:bg-card transition-all duration-200 cursor-pointer group border border-transparent hover:border-slate-400 flex flex-col h-full"
    >
      <div className="flex gap-x-2 items-center">
        <p className="text-foreground text-sm font-medium">{item.name}</p>
        <VisibilityIcon visibility={item.visibility} />
      </div>
      <div className="flex flex-col gap-2 flex-1">
        <p className="text-foreground/60 text-xs mt-1">{item.description}</p>
        <label className="text-foreground/60 text-xs font-semibold mt-4">
          Steps ({flow.steps.length}):
        </label>
        <p className="text-foreground/60 text-xs bg-zinc-900 light:bg-card px-2 py-1 rounded-md font-mono border border-slate-800 light:border-slate-300">
          <ul className="list-disc pl-4">
            {flow.steps.map((step, index) => (
              <li key={index}>{step.type}</li>
            ))}
          </ul>
        </p>
      </div>
      <div className="flex justify-end mt-2">
        <Link
          to={paths.communityHub.importItem(item.importId)}
          className="text-primary-button hover:text-primary-button/80 text-sm font-medium px-3 py-1.5 rounded-md bg-black/30 light:bg-card group-hover:bg-black/50 light:group-hover:bg-card transition-all"
        >
          Import →
        </Link>
      </div>
    </Link>
  );
}
