import { useState } from "react";
import { createPortal } from "react-dom";
import ModalWrapper from "@/components/ModalWrapper";
import { Warehouse, WarningOctagon, X } from "@phosphor-icons/react";
import { DB_LOGOS } from "./DBConnection";

function assembleConnectionString({
  engine,
  username = "",
  password = "",
  host = "",
  port = "",
  database = "",
  privateKeyPassPhrase = "",
}) {
  if ([username, password, host, database].every((i) => !!i) === false)
    return `Please fill out all the fields above.`;
  switch (engine) {
    case "postgresql":
      return `postgres://${username}:${password}@${host}:${port}/${database}`;
    case "mysql":
      return `mysql://${username}:${password}@${host}:${port}/${database}`;
    case "sql-server":
      return `mssql://${username}:${password}@${host}:${port}/${database}`;
    case "snowflake":
      const snowflake = {
        username: username,
        privateKey: password,
        privateKeyPassPhrase: privateKeyPassPhrase,
        host: host,
        warehouse: port,
        database: database,
      }
      return JSON.stringify(snowflake);
    default:
      return null;
  }
}

const DEFAULT_ENGINE = "postgresql";
const DEFAULT_CONFIG = {
  username: null,
  password: null,
  privateKeyPassPhrase: null,
  host: null,
  port: null,
  database: null,
};

export default function NewSQLConnection({ isOpen, closeModal, onSubmit }) {
  const [engine, setEngine] = useState(DEFAULT_ENGINE);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  if (!isOpen) return null;

  function handleClose() {
    setEngine(DEFAULT_ENGINE);
    setConfig(DEFAULT_CONFIG);
    closeModal();
  }

  function onFormChange() {
    const form = new FormData(document.getElementById("sql-connection-form"));
    setConfig({
      username: form.get("username").trim(),
      password: form.get("password"),
      privateKeyPassPhrase: form.get("privateKeyPassPhrase"),
      host: form.get("host").trim(),
      port: form.get("port").trim(),
      database: form.get("database").trim(),
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    e.stopPropagation();
    const form = new FormData(e.target);
    onSubmit({
      engine,
      database_id: form.get("name"),
      connectionString: assembleConnectionString({ engine, ...config }),
    });
    handleClose();
    return false;
  }

  // Cannot do nested forms, it will cause all sorts of issues, so we portal this out
  // to the parent container form so we don't have nested forms.
  return createPortal(
    <ModalWrapper isOpen={isOpen}>
      <div className="relative w-full md:w-1/3 max-w-2xl max-h-full md:mt-8">
        <div className="relative bg-main-gradient rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.25)] max-h-[85vh] overflow-y-scroll no-scroll">
          <div className="flex items-start justify-between p-4 border-b rounded-t border-gray-500/50">
            <h3 className="text-xl font-semibold text-white">
              New SQL Connection
            </h3>
            <button
              onClick={handleClose}
              type="button"
              className="border-none transition-all duration-300 text-gray-400 bg-transparent hover:border-white/60 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
              data-modal-hide="staticModal"
            >
              <X className="text-gray-300 text-lg" />
            </button>
          </div>

          <form
            id="sql-connection-form"
            onSubmit={handleUpdate}
            onChange={onFormChange}
          >
            <div className="py-[17px] px-[20px] flex flex-col gap-y-6">
              <p className="text-sm text-white">
                Add the connection information for your database below and it
                will be available for future SQL agent calls.
              </p>
              <div className="flex flex-col w-full">
                <div className="border border-red-800 bg-zinc-800 p-4 rounded-lg flex items-center gap-x-2 text-sm text-red-400">
                  <WarningOctagon size={28} className="shrink-0" />
                  <p>
                    <b>WARNING:</b> The SQL agent has been <i>instructed</i> to
                    only perform non-modifying queries. This <b>does not</b>{" "}
                    prevent a hallucination from still deleting data. Only
                    connect with a user who has <b>READ_ONLY</b> permissions.
                  </p>
                </div>

                <label className="text-white text-sm font-semibold block my-4">
                  Select your SQL engine
                </label>
                <div className="grid md:grid-cols-4 gap-4 grid-cols-2">
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
                  <DBEngine
                    provider="snowflake"
                    active={engine === "snowflake"}
                    onClick={() => setEngine("snowflake")}
                  />
                </div>
              </div>

              <div className="flex flex-col w-full">
                <label className="text-white text-sm font-semibold block mb-3">
                  Connection name
                </label>
                <input
                  type="text"
                  name="name"
                  className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="a unique name to identify this SQL connection"
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col">
                  <label className="text-white text-sm font-semibold block mb-3">
                    Database user
                  </label>
                  <input
                    type="text"
                    name="username"
                    className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="root"
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                {engine === "snowflake" ? (
                <div className="flex flex-col">
                  <label className="text-white text-sm font-semibold block mb-3">
                    Private Key Passphrase
                  </label>
                  <input
                    type="text"
                    name="privateKeyPassPhrase"
                    className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="password123"
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                ) : (
                <div className="flex flex-col">
                  <label className="text-white text-sm font-semibold block mb-3">
                    Database user password
                  </label>
                      <input
                        type="text"
                        name="password"
                        className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                        placeholder="password123"
                        required={true}
                        autoComplete="off"
                        spellCheck={false}
                      />
                </div>
                )}
              </div>
              {engine === "snowflake" ? (
              <div className="flex flex-col">
                <label className="text-white text-sm font-semibold block mb-3">
                  Private Key
                </label>
                    <textarea 
                    rows={5}
                    name="password" 
                    className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5" 
                    placeholder="-----BEGIN PRIVATE KEY----- MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDQ7  ..." 
                    required={true} 
                    autoComplete="off" 
                    spellCheck={false} />
              </div>
              ) : null}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="text-white text-sm font-semibold block mb-3">
                    {engine === "snowflake" ? (
                    "Account"
                    ) : (
                    "Server endpoint"
                    )}
                  </label>
                  <input
                    type="text"
                    name="host"
                    className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder={engine === "snowflake" ? (
                      "the account for your snowflake instance"
                      ) : (
                      "the hostname or endpoint for your database"
                      )}
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
                <div>
                  <label className="text-white text-sm font-semibold block mb-3">
                  {engine === "snowflake" ? (
                    "Warehouse"
                    ) : (
                    "Port"
                    )}
                  </label>
                  <input
                    type="text"
                    name="port"
                    className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder={engine === "snowflake" ? (
                      "WAREHOUSE"
                      ) : (
                      "3306"
                      )}
                    required={false}
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-white text-sm font-semibold block mb-3">
                  Database
                </label>
                <input
                  type="text"
                  name="database"
                  className="border-none bg-zinc-900 text-white placeholder:text-white/20 text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="the database the agent will interact with"
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <p className="text-white/40 text-sm">
                {assembleConnectionString({ engine, ...config })}
              </p>
            </div>
            <div className="flex w-full justify-between items-center p-3 space-x-2 border-t rounded-b border-gray-500/50">
              <button
                type="button"
                onClick={handleClose}
                className="border-none text-xs px-2 py-1 font-semibold rounded-lg bg-white hover:bg-transparent border-2 border-transparent hover:border-white hover:text-white h-[32px] w-fit -mr-8 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="sql-connection-form"
                className="border-none text-xs px-2 py-1 font-semibold rounded-lg bg-primary-button hover:bg-secondary border-2 border-transparent hover:border-primary-button hover:text-white h-[32px] w-fit -mr-8 whitespace-nowrap shadow-[0_4px_14px_rgba(0,0,0,0.25)]"
              >
                Save connection
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>,
    document.getElementById("workspace-agent-settings-container")
  );
}

function DBEngine({ provider, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col p-4 border border-white/40 bg-zinc-800 rounded-lg w-fit hover:bg-zinc-700 ${
        active ? "!bg-blue-500/50" : ""
      }`}
    >
      <img
        src={DB_LOGOS[provider]}
        className="h-[100px] rounded-md"
        alt={provider}
      />
    </button>
  );
}
