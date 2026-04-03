import { useEffect, useState } from "react";
import ModelRouter from "@/models/modelRouter";

export default function RouterSelection({ workspace, setHasChanges }) {
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
      <div className="mt-4">
        <p className="text-sm text-white text-opacity-60">Loading routers...</p>
      </div>
    );
  }

  if (routers.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-sm text-white text-opacity-60">
          No model routers configured. Create one in Settings first.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 flex flex-col gap-y-1">
      <label className="block input-label">Model Router</label>
      <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
        Select which router to use for this workspace.
      </p>
      <select
        name="router_id"
        defaultValue={workspace?.router_id || ""}
        onChange={() => setHasChanges(true)}
        className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full max-w-[640px] p-2.5"
        required
      >
        <option value="">Select a router</option>
        {routers.map((router) => (
          <option key={router.id} value={router.id}>
            {router.name}
            {router.description ? ` — ${router.description}` : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
