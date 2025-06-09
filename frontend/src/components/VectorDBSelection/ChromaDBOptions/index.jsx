import { useState } from "react";

export default function ChromaDBOptions({ settings }) {
  const [isCloud, setIsCloud] = useState(settings?.ChromaCloud === "true");

  return (
    <div className="flex flex-col w-full gap-y-7">
      <div className="w-full flex items-center gap-[36px] mt-1.5">
        <div className="flex flex-col w-60">
          <label className="block mb-3 text-sm font-semibold text-white">
            Chroma Endpoint
          </label>
          <input
            type="url"
            name="ChromaEndpoint"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="http://localhost:8000"
            defaultValue={settings?.ChromaEndpoint}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="block mb-3 text-sm font-semibold text-white">
            API Header
          </label>
          <input
            name="ChromaApiHeader"
            autoComplete="off"
            type="text"
            defaultValue={settings?.ChromaApiHeader}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="X-Api-Key"
          />
        </div>

        <div className="flex flex-col w-60">
          <label className="block mb-3 text-sm font-semibold text-white">
            API Key
          </label>
          <input
            name="ChromaApiKey"
            autoComplete="off"
            type="password"
            defaultValue={settings?.ChromaApiKey ? "*".repeat(20) : ""}
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="sk-myApiKeyToAccessMyChromaInstance"
          />
        </div>
      </div>
      <div className="relative w-full max-h-full">
        <div className="relative rounded-lg">
          <div className="flex items-start justify-between px-6 py-4"></div>
          <div className="flex w-full h-full space-y-6">
            <div className="flex flex-col w-full gap-y-4">
              <div className="">
                <label className="block mb-3 text-sm font-semibold text-white">
                  Using Chroma Cloud?
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    name="ChromaCloudController"
                    type="checkbox"
                    onChange={(e) => {
                      setIsCloud(e.target.checked);
                    }}
                    checked={isCloud}
                    className="sr-only peer"
                  />
                  <input
                    name="ChromaCloud"
                    type="hidden"
                    value={isCloud.toString()}
                  />
                  <div className="peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent" />
                </label>
              </div>
              <div
                className={`w-full flex items-center gap-[36px] mt-1.5 ${
                  !isCloud ? "hidden" : ""
                }`}
              >
                <div className="flex flex-col w-60">
                  <label className="block mb-3 text-sm font-semibold text-white">
                    Tenant ID
                  </label>
                  <input
                    name="ChromaTenantId"
                    type="text"
                    className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="Your Chroma Cloud Tenant ID"
                    defaultValue={settings?.ChromaTenantId}
                    required={isCloud}
                    autoComplete="off"
                  />
                </div>
                <div className="flex flex-col w-60">
                  <label className="block mb-3 text-sm font-semibold text-white">
                    Database Name
                  </label>
                  <input
                    name="ChromaDatabaseName"
                    type="text"
                    className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="Your Chroma Cloud Database"
                    defaultValue={settings?.ChromaDatabaseName}
                    required={isCloud}
                    autoComplete="off"
                  />
                </div>
              </div>
              {!isCloud && (
                <>
                  <input type="hidden" name="ChromaTenantId" value="" />
                  <input type="hidden" name="ChromaDatabaseName" value="" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
