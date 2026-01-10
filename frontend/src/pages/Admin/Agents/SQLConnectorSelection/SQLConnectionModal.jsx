import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ModalWrapper from "@/components/ModalWrapper";
import { WarningOctagon, X } from "@phosphor-icons/react";
import { DB_LOGOS } from "./DBConnection";
import System from "@/models/system";
import showToast from "@/utils/toast";

// Simple slugify function to match backend behavior
function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

function assembleConnectionString({
  engine,
  username = "",
  password = "",
  host = "",
  port = "",
  database = "",
  encrypt = false,
}) {
  if ([username, password, host, database].every((i) => !!i) === false)
    return `Please fill out all the fields above.`;
  switch (engine) {
    case "postgresql":
      return `postgres://${username}:${password}@${host}:${port}/${database}`;
    case "mysql":
      return `mysql://${username}:${password}@${host}:${port}/${database}`;
    case "sql-server":
      return `mssql://${username}:${password}@${host}:${port}/${database}?encrypt=${encrypt}`;
    default:
      return null;
  }
}

const DEFAULT_ENGINE = "postgresql";
const DEFAULT_CONFIG = {
  name: "",
  username: null,
  password: null,
  host: null,
  port: null,
  database: null,
  schema: null,
  encrypt: false,
};

export default function SQLConnectionModal({
  isOpen,
  closeModal,
  onSubmit,
  setHasChanges,
  existingConnection = null, // { database_id, engine } for edit mode
  connections = [], // List of all existing connections for duplicate detection
}) {
  const [engine, setEngine] = useState(DEFAULT_ENGINE);
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [originalDatabaseId, setOriginalDatabaseId] = useState(null);
  const isEditMode = !!existingConnection;

  // Fetch connection details when in edit mode
  useEffect(() => {
    async function fetchConnectionDetails() {
      if (!isEditMode || !isOpen) return;

      setIsLoadingDetails(true);
      try {
        const { success, connection, error } =
          await System.getSQLConnectionDetails(existingConnection.database_id);

        if (!success) {
          showToast(error || "Failed to load connection details", "error", {
            clear: true,
          });
          closeModal();
          return;
        }

        setEngine(connection.engine);
        setConfig({
          username: connection.username,
          password: connection.password,
          host: connection.host,
          port: connection.port,
          database: connection.database,
          encrypt: connection.encrypt,
        });
        setOriginalDatabaseId(connection.database_id);
      } catch (error) {
        console.error("Error fetching connection details:", error);
        showToast("Failed to load connection details", "error", {
          clear: true,
        });
        closeModal();
      } finally {
        setIsLoadingDetails(false);
      }
    }

    fetchConnectionDetails();
  }, [isEditMode, isOpen, existingConnection?.database_id]);

  if (!isOpen) return null;

  function handleClose() {
    setEngine(DEFAULT_ENGINE);
    setConfig(DEFAULT_CONFIG);
    setOriginalDatabaseId(null);
    closeModal();
  }

  function onFormChange(e) {
    const form = new FormData(e.target.form);
    setConfig({
      name: form.get("name").trim(),
      username: form.get("username").trim(),
      password: form.get("password"),
      host: form.get("host").trim(),
      port: form.get("port").trim(),
      database: form.get("database").trim(),
      encrypt: form.get("encrypt") === "true",
    });
  }

  /**
   * Checks if a connection name (slugified) already exists in the connections list.
   * For edit mode, excludes the original connection being edited.
   * @param {string} slugifiedName - The slugified name to check
   * @returns {boolean} - True if duplicate exists, false otherwise
   */
  function isDuplicateConnectionName(slugifiedName) {
    // Get active connections (not marked for removal)
    const activeConnections = connections.filter(
      (conn) => conn.action !== "remove"
    );

    // Check for duplicates, excluding the original connection in edit mode
    return activeConnections.some((conn) => {
      // In edit mode, skip the original connection being edited
      if (isEditMode && conn.database_id === originalDatabaseId) {
        return false;
      }
      return conn.database_id === slugifiedName;
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    e.stopPropagation();
    const form = new FormData(e.target);
    const connectionString = assembleConnectionString({ engine, ...config });

    // Slugify the database_id immediately to match backend behavior
    const slugifiedDatabaseId = slugify(form.get("name"));

    // Check for duplicate connection names before validation
    if (isDuplicateConnectionName(slugifiedDatabaseId)) {
      showToast(
        `A connection with the name "${slugifiedDatabaseId}" already exists. Please choose a different name.`,
        "error",
        { clear: true }
      );
      return;
    }

    setIsValidating(true);
    try {
      const { success, error } = await System.validateSQLConnection(
        engine,
        connectionString
      );
      if (!success) {
        showToast(
          error ||
            "Failed to establish database connection. Please check your connection details.",
          "error",
          { clear: true }
        );
        setIsValidating(false);
        return;
      }

      const connectionData = {
        engine,
        database_id: slugifiedDatabaseId,
        connectionString,
      };

      if (isEditMode) {
        // When editing, include the original database_id and mark as update
        onSubmit({
          ...connectionData,
          action: "update",
          originalDatabaseId: originalDatabaseId,
        });
      } else {
        // When creating, mark as add
        onSubmit({
          ...connectionData,
          action: "add",
        });
      }

      setHasChanges(true);
      handleClose();
    } catch (error) {
      console.error("Error validating connection:", error);
      showToast(
        error?.message ||
          "Failed to validate connection. Please check your connection details.",
        "error",
        { clear: true }
      );
    } finally {
      setIsValidating(false);
    }
    return false;
  }

  // Cannot do nested forms, it will cause all sorts of issues, so we portal this out
  // to the parent container form so we don't have nested forms.
  return createPortal(
    <ModalWrapper isOpen={isOpen}>
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
        <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
          <div className="relative p-6 border-b rounded-t border-theme-modal-border">
            <div className="w-full flex gap-x-2 items-center">
              <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
                {isEditMode ? "Edit SQL Connection" : "New SQL Connection"}
              </h3>
            </div>
            <button
              onClick={handleClose}
              type="button"
              className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
            >
              <X size={24} weight="bold" className="text-white" />
            </button>
          </div>
          <form
            id="sql-connection-form"
            onChange={onFormChange}
            onSubmit={handleUpdate}
          >
            <div className="px-7 py-6">
              {isLoadingDetails ? (
                <div className="flex items-center justify-center py-10">
                  <div className="text-white text-sm">
                    Loading connection details...
                  </div>
                </div>
              ) : (
                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                  <p className="text-sm text-white/60">
                    {isEditMode
                      ? "Update the connection information for your database below."
                      : "Add the connection information for your database below and it will be available for future SQL agent calls."}
                  </p>
                  <div className="flex flex-col w-full">
                    <div className="border border-red-800 bg-zinc-800 light:bg-red-200/50 p-4 rounded-lg flex items-center gap-x-2 text-sm text-red-400 light:text-red-500">
                      <WarningOctagon size={28} className="shrink-0" />
                      <p>
                        <b>WARNING:</b> The SQL agent has been <i>instructed</i>{" "}
                        to only perform non-modifying queries. This{" "}
                        <b>does not</b> prevent a hallucination from still
                        deleting data. Only connect with a user who has{" "}
                        <b>READ_ONLY</b> permissions.
                      </p>
                    </div>

                    <label className="block mb-2 text-sm font-medium text-white mt-4">
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
                    </div>
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block mb-2 text-sm font-medium text-white">
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
                      defaultValue={originalDatabaseId || ""}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <label className="block mb-2 text-sm font-medium text-white">
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
                        defaultValue={config.username || ""}
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="block mb-2 text-sm font-medium text-white">
                        Database user password
                      </label>
                      <input
                        type="password"
                        name="password"
                        className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                        placeholder="password123"
                        required={true}
                        autoComplete="off"
                        spellCheck={false}
                        defaultValue={config.password || ""}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="block mb-2 text-sm font-medium text-white">
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
                        defaultValue={config.host || ""}
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-sm font-medium text-white">
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
                        defaultValue={config.port || ""}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="block mb-2 text-sm font-medium text-white">
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
                      defaultValue={config.database || ""}
                    />
                  </div>

                  {engine === "postgresql" && (
                    <div className="flex flex-col">
                      <label className="block mb-2 text-sm font-medium text-white">
                        Schema (optional)
                      </label>
                      <input
                        type="text"
                        name="schema"
                        className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                        placeholder="public (default schema if not specified)"
                        required={false}
                        autoComplete="off"
                        spellCheck={false}
                        defaultValue={config.schema || ""}
                      />
                    </div>
                  )}

                  {engine === "sql-server" && (
                    <div className="flex items-center justify-between">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name="encrypt"
                          value="true"
                          className="sr-only peer"
                          checked={config.encrypt}
                          onChange={(e) =>
                            setConfig({ ...config, encrypt: e.target.checked })
                          }
                        />
                        <div className="w-11 h-6 bg-theme-settings-input-bg peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        <span className="ml-3 text-sm font-medium text-white">
                          Enable Encryption
                        </span>
                      </label>
                    </div>
                  )}

                  <p className="text-theme-text-secondary text-sm">
                    {assembleConnectionString({ engine, ...config })}
                  </p>
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border px-7 pb-6">
              <button
                type="button"
                onClick={handleClose}
                className="transition-all duration-300 text-white hover:bg-zinc-700 light:hover:bg-theme-bg-primary px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="sql-connection-form"
                disabled={isValidating}
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm disabled:opacity-50"
              >
                {isValidating ? "Validating..." : "Save connection"}
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
      className={`flex flex-col p-4 border border-white/40 bg-zinc-800 light:bg-theme-settings-input-bg rounded-lg w-fit hover:bg-zinc-700 ${
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
