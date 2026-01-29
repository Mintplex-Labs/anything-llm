import { useEffect, useState } from "react";
import { Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import System from "@/models/system";
import { Link } from "react-router-dom";

export default function PrivateModeOptions({ settings }) {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(!!settings?.PrivateModeBasePath);
  const [basePath, setBasePath] = useState(settings?.PrivateModeBasePath);
  const [model, setModel] = useState(settings?.PrivateModeModelPref || "");

  useEffect(() => {
    setModel(settings?.PrivateModeModelPref || "");
  }, [settings?.PrivateModeModelPref]);

  useEffect(() => {
    async function fetchModels() {
      try {
        setLoading(true);
        if (!basePath) throw new Error("Base path is required");
        const { models, error } = await System.customModels(
          "privatemode",
          null,
          basePath
        );
        if (error) throw new Error(error);
        setModels(models);
      } catch (error) {
        console.error("Error fetching Private Mode models:", error);
        setModels([]);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, [basePath]);

  return (
    <div className="flex flex-col gap-y-7">
      <div className="flex gap-[36px] mt-1.5 flex-wrap">
        <div className="flex flex-col w-60">
          <div className="flex items-center gap-1 mb-2">
            <label className="text-white text-sm font-semibold">
              Privatemode Proxy URL
            </label>
            <Info
              size={18}
              className="text-theme-text-secondary cursor-pointer"
              data-tooltip-id="private-mode-base-url"
            />
            <Tooltip
              id="private-mode-base-url"
              place="top"
              delayShow={300}
              clickable={true}
              className="tooltip !text-xs !opacity-100"
              style={{
                maxWidth: "250px",
                whiteSpace: "normal",
                wordWrap: "break-word",
              }}
            >
              Enter the URL where Privatemode Proxy is running.
              <br />
              <br />
              <Link
                to="https://docs.privatemode.ai/quickstart#2-run-the-proxy"
                target="_blank"
                className="text-blue-500 hover:underline"
              >
                Learn more &rarr;
              </Link>
            </Tooltip>
          </div>
          <input
            type="url"
            name="PrivateModeBasePath"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="eg: http://127.0.0.1:8080"
            defaultValue={settings?.PrivateModeBasePath}
            required={true}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setBasePath(e.target.value)}
          />
        </div>
        <div className="flex flex-col w-60">
          <label className="text-white text-sm font-semibold block mb-2">
            Chat Model
          </label>
          {loading ? (
            <select
              name="PrivateModeModelPref"
              required={true}
              disabled={true}
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            >
              <option>---- Loading ----</option>
            </select>
          ) : (
            <select
              name="PrivateModeModelPref"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required={true}
              className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            >
              {models.length > 0 ? (
                <>
                  <option value="">-- Select a model --</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </>
              ) : (
                <option disabled value="">
                  No models found
                </option>
              )}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
