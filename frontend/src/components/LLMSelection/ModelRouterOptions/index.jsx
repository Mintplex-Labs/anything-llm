import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import paths from "@/utils/paths";
import ModelRouter from "@/models/modelRouter";

export default function ModelRouterOptions({ settings }) {
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
      <div className="w-full flex flex-col gap-y-4">
        <p className="text-sm text-white text-opacity-60">Loading routers...</p>
      </div>
    );
  }

  if (routers.length === 0) {
    return (
      <div className="w-full flex flex-col gap-y-4">
        <p className="text-sm text-white text-opacity-60">
          No model routers configured yet.{" "}
          <Link
            to={paths.settings.modelRouters()}
            className="underline text-white"
          >
            Create one in Model Router settings
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-y-4">
      <div className="w-full flex items-center gap-[36px]">
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-3">
            Model Router
          </label>
          <select
            name="ModelRouterId"
            defaultValue={settings?.ModelRouterId || ""}
            className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg block w-full p-2.5"
            required
          >
            <option value="">Select a router</option>
            {routers.map((router) => (
              <option key={router.id} value={router.id}>
                {router.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
