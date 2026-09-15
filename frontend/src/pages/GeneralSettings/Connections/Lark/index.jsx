import { CircleNotch } from "@phosphor-icons/react";

// This route shell keeps the standalone settings route resolvable until the
// Lark settings interface is added in the following implementation task.
export default function LarkSettings() {
  return (
    <div className="flex items-center justify-center py-20" aria-busy="true">
      <CircleNotch className="h-8 w-8 animate-spin text-zinc-400" />
    </div>
  );
}
