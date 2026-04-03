import { useEffect, useState } from "react";
import ModelRouter from "@/models/modelRouter";

export default function RouterPickerSelection({
  selectedRouterId,
  setSelectedRouterId,
  setHasChanges,
}) {
  const [routers, setRouters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRouters() {
      const results = await ModelRouter.getAll();
      setRouters(results);
      setLoading(false);
    }
    fetchRouters();
  }, []);

  if (loading) {
    return (
      <select
        disabled
        className="bg-zinc-900 light:bg-white text-white light:text-slate-900 text-sm rounded-lg h-8 w-full px-2.5 outline-none border border-zinc-900 light:border-slate-400 cursor-not-allowed"
      >
        <option>Loading routers...</option>
      </select>
    );
  }

  if (routers.length === 0) {
    return (
      <p className="text-xs text-zinc-400 light:text-slate-500">
        No routers configured. Create one in Settings &gt; AI Providers &gt;
        Model Router.
      </p>
    );
  }

  return (
    <select
      value={selectedRouterId || ""}
      onChange={(e) => {
        setSelectedRouterId(Number(e.target.value));
        setHasChanges(true);
      }}
      className="bg-zinc-900 light:bg-white text-white light:text-slate-900 text-sm rounded-lg h-8 w-full px-2.5 outline-none border border-zinc-900 light:border-slate-400 cursor-pointer"
    >
      <option value="">Select a router</option>
      {routers.map((router) => (
        <option key={router.id} value={router.id}>
          {router.name}
          {router.ruleCount != null ? ` (${router.ruleCount} rules)` : ""}
        </option>
      ))}
    </select>
  );
}
