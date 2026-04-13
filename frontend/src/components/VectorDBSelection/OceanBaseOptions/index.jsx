import { Info } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";

export default function OceanBaseOptions({ settings }) {
  return (
    <div className="w-full flex flex-col gap-y-7">
      <div className="w-full flex flex-wrap items-start gap-[24px] mt-1.5">
        <div className="flex flex-col w-56 min-w-[200px]">
          <div className="flex items-center gap-x-1 mb-3">
            <label className="text-white text-sm font-semibold block">
              OceanBase Host
            </label>
            <Info
              size={16}
              className="text-theme-text-secondary cursor-pointer"
              data-tooltip-id="oceanbase-host-tooltip"
              data-tooltip-place="right"
            />
            <Tooltip
              delayHide={300}
              id="oceanbase-host-tooltip"
              className="max-w-md z-99"
              clickable={true}
            >
              <p className="text-md whitespace-pre-line break-words">
                Hostname or IP of the OceanBase instance (MySQL protocol).
              </p>
            </Tooltip>
          </div>
          <input
            type="text"
            name="OceanBaseHost"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="127.0.0.1"
            defaultValue={settings?.OceanBaseHost || ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-40 min-w-[120px]">
          <label className="text-white text-sm font-semibold block mb-3">
            Port
          </label>
          <input
            type="text"
            name="OceanBasePort"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="2881"
            defaultValue={settings?.OceanBasePort || ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-56 min-w-[200px]">
          <label className="text-white text-sm font-semibold block mb-3">
            Username
          </label>
          <input
            type="text"
            name="OceanBaseUser"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="root"
            defaultValue={settings?.OceanBaseUser || ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-56 min-w-[200px]">
          <label className="text-white text-sm font-semibold block mb-3">
            Password
          </label>
          <input
            type="password"
            name="OceanBasePassword"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="••••••••"
            defaultValue={settings?.OceanBasePassword ? "*".repeat(20) : ""}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="flex flex-col w-56 min-w-[200px]">
          <div className="flex items-center gap-x-1 mb-3">
            <label className="text-white text-sm font-semibold block">
              Database
            </label>
            <Info
              size={16}
              className="text-theme-text-secondary cursor-pointer"
              data-tooltip-id="oceanbase-db-tooltip"
              data-tooltip-place="right"
            />
            <Tooltip
              delayHide={300}
              id="oceanbase-db-tooltip"
              className="max-w-md z-99"
              clickable={true}
            >
              <p className="text-md whitespace-pre-line break-words">
                Target database name. Workspace embeddings are stored as tables
                named <code>VTB_&lt;workspace_slug&gt;</code> with a VECTOR
                column.
              </p>
            </Tooltip>
          </div>
          <input
            type="text"
            name="OceanBaseDataBase"
            className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
            placeholder="test"
            defaultValue={settings?.OceanBaseDataBase || ""}
            required={true}
            autoComplete="off"
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
}
