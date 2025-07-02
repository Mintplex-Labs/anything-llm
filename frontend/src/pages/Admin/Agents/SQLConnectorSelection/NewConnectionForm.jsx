import { useState } from "react";
import { WarningOctagon } from "@phosphor-icons/react";
import { DB_LOGOS } from "./DBConnection";

function assembleConnectionString({
  engine,
  username = "",
  password = "",
  host = "",
  port = "",
  database = "",
}) {
  if (!username || !password || !host || !database) {
    return `Please fill out all the fields above.`;
  }
  switch (engine) {
    case "postgresql":
      return `postgres://${username}:${password}@${host}:${port}/${database}`;
    case "mysql":
      return `mysql://${username}:${password}@${host}:${port}/${database}`;
    case "sql-server":
      return `mssql://${username}:${password}@${host}:${port}/${database}`;
    default:
      return null;
  }
}

const DEFAULT_ENGINE = "postgresql";
const DEFAULT_CONFIG = {
  username: "",
  password: "",
  host: "",
  port: "",
  database: "",
};

export default function NewSQLConnection({ onSubmit, onCancel }) {
  const [engine, setEngine] = useState(DEFAULT_ENGINE);
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  function handleClose() {
    setEngine(DEFAULT_ENGINE);
    setConfig(DEFAULT_CONFIG);
    onCancel();
  }

  function onFormChange(e) {
    const form = e.target.form;
    if (!form) return;

    const formData = new FormData(form);
    setConfig({
      username: formData.get("username")?.trim() || "",
      password: formData.get("password") || "",
      host: formData.get("host")?.trim() || "",
      port: formData.get("port")?.trim() || "",
      database: formData.get("database")?.trim() || "",
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (
      !config.username ||
      !config.password ||
      !config.host ||
      !config.database
    ) {
      return;
    }
    const form = e.target;
    const formData = new FormData(form);
    onSubmit({
      engine,
      database_id: formData.get("name"),
      connectionString: assembleConnectionString({ engine, ...config }),
    });
    handleClose();
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-white mb-4">
        New SQL Connection
      </h3>
      <form id="sql-connection-form" onSubmit={handleSubmit}>
        <div className="space-y-4">
          <p className="text-xs text-white/60 -mt-2">
            Add the connection information for your database below and it will
            be available for future SQL agent calls.
          </p>
          <div className="flex flex-col w-full">
            <div className="border border-red-800 bg-zinc-800 light:bg-red-200/50 p-4 rounded-lg flex items-center gap-x-2 text-sm text-red-400 light:text-red-500">
              <WarningOctagon size={28} className="shrink-0" />
              <p>
                <b>WARNING:</b> The SQL agent has been <i>instructed</i> to only
                perform non-modifying queries. This <b>does not</b> prevent a
                hallucination from still deleting data. Only connect with a user
                who has <b>READ_ONLY</b> permissions.
              </p>
            </div>

            <label className="block mb-2 text-sm font-semibold text-white mt-4">
              Select your SQL engine
            </label>
            <div className="flex gap-x-6">
              <DBEngine
                provider="postgresql"
                active={engine === "postgresql"}
                onClick={() => setEngine("postgresql")}
              />
              <DBEngine
                provider="mysql"
                active={engine === "mysql"}
                onClick={() => setEngine("mysql")}
              />
              <DBEngine
                provider="sql-server"
                active={engine === "sql-server"}
                onClick={() => setEngine("sql-server")}
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label className="block mb-2 text-sm font-semibold text-white">
              Connection name
            </label>
            <input
              type="text"
              name="name"
              className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="a unique name to identify this SQL connection"
              required={true}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-semibold text-white">
                Database user
              </label>
              <input
                type="text"
                name="username"
                className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="root"
                required={true}
                autoComplete="off"
                spellCheck={false}
                onChange={onFormChange}
                value={config.username}
              />
            </div>
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-semibold text-white">
                Database user password
              </label>
              <input
                type="text"
                name="password"
                className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="password123"
                required={true}
                autoComplete="off"
                spellCheck={false}
                onChange={onFormChange}
                value={config.password}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="block mb-2 text-sm font-semibold text-white">
                Server endpoint
              </label>
              <input
                type="text"
                name="host"
                className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="the hostname or endpoint for your database"
                required={true}
                autoComplete="off"
                spellCheck={false}
                onChange={onFormChange}
                value={config.host}
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-white">
                Port
              </label>
              <input
                type="text"
                name="port"
                className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                placeholder="3306"
                required={false}
                autoComplete="off"
                spellCheck={false}
                onChange={onFormChange}
                value={config.port}
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="block mb-2 text-sm font-semibold text-white">
              Database
            </label>
            <input
              type="text"
              name="database"
              className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
              placeholder="the database the agent will interact with"
              required={true}
              autoComplete="off"
              spellCheck={false}
              onChange={onFormChange}
              value={config.database}
            />
          </div>
          <p className="text-theme-text-secondary text-sm">
            {assembleConnectionString({ engine, ...config })}
          </p>
        </div>
        <div className="flex justify-between items-center mt-6 pt-6">
          <button
            type="button"
            onClick={handleClose}
            className="text-sm font-semibold text-white hover:text-theme-text-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="text-sm font-semibold text-white hover:text-theme-text-secondary"
          >
            Save connection
          </button>
        </div>
      </form>
    </div>
  );
}

function DBEngine({ provider, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="w-[150px] h-[150px] p-0">
      <div
        className={`w-full h-full rounded-lg overflow-hidden transition-all duration-200 ${active ? "outline outline-primary-button outline-2 p-2 bg-theme-bg-secondary" : ""}`}
      >
        <img
          src={DB_LOGOS[provider]}
          className="w-full h-full object-contain rounded-lg transition-all duration-200"
          alt={provider}
        />
      </div>
    </button>
  );
}
