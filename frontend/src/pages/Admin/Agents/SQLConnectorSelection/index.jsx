import React, { useEffect, useState, useRef } from "react";
import DBConnection from "./DBConnection";
import { Plus, Database, CircleNotch } from "@phosphor-icons/react";
import NewSQLConnection from "./SQLConnectionModal";
import { useModal } from "@/hooks/useModal";
import SQLAgentImage from "@/media/agents/sql-agent.png";
import Admin from "@/models/admin";
import Toggle from "@/components/lib/Toggle";
import { Tooltip } from "react-tooltip";

export default function AgentSQLConnectorSelection({
  skill,
  toggleSkill,
  enabled = false,
  setHasChanges,
  hasChanges = false,
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevHasChanges = useRef(hasChanges);

  // Load connections on mount
  useEffect(() => {
    setLoading(true);
    Admin.systemPreferencesByFields(["agent_sql_connections"])
      .then((res) => setConnections(res?.settings?.agent_sql_connections ?? []))
      .catch(() => setConnections([]))
      .finally(() => setLoading(false));
  }, []);

  // Refresh connections from backend when save completes (hasChanges: true -> false)
  // This ensures we get clean data without stale action properties
  useEffect(() => {
    if (prevHasChanges.current === true && hasChanges === false) {
      Admin.systemPreferencesByFields(["agent_sql_connections"])
        .then((res) =>
          setConnections(res?.settings?.agent_sql_connections ?? [])
        )
        .catch(() => {});
    }
    prevHasChanges.current = hasChanges;
  }, [hasChanges]);

  /**
   * Marks a connection for removal by adding action: "remove".
   * The connection stays in the array (for undo capability) until saved.
   * @param {string} databaseId - The database_id of the connection to remove
   */
  function handleRemoveConnection(databaseId) {
    setHasChanges(true);
    setConnections((prev) =>
      prev.map((conn) => {
        if (conn.database_id === databaseId)
          return { ...conn, action: "remove" };
        return conn;
      })
    );
  }

  /**
   * Updates an existing connection by replacing it in the local state.
   * This removes the old connection (by originalDatabaseId) and adds the updated version.
   *
   * Note: The old connection is removed from local state immediately, but the backend
   * handles the actual update logic when saved. See mergeConnections in server/models/systemSettings.js
   *
   * @param {Object} updatedConnection - The updated connection data
   * @param {string} updatedConnection.originalDatabaseId - The original database_id before the update
   * @param {string} updatedConnection.database_id - The new database_id
   * @param {string} updatedConnection.action - Should be "update"
   */
  function handleUpdateConnection(updatedConnection) {
    setHasChanges(true);
    setConnections((prev) =>
      prev.map((conn) =>
        conn.database_id === updatedConnection.originalDatabaseId
          ? updatedConnection
          : conn
      )
    );
  }
  /**
   * Adds a new connection to the local state with action: "add".
   * The backend will validate and deduplicate when saved.
   * @param {Object} newConnection - The new connection data with action: "add"
   */
  function handleAddConnection(newConnection) {
    setHasChanges(true);
    setConnections((prev) => [...prev, newConnection]);
  }

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col gap-y-[18px] max-w-[500px]">
          <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-x-2">
              <Database
                size={24}
                color="var(--theme-text-primary)"
                weight="bold"
              />
              <label
                htmlFor="name"
                className="text-theme-text-primary text-md font-bold"
              >
                SQL Agent
              </label>
            </div>
            <Toggle
              size="lg"
              enabled={enabled}
              onChange={() => toggleSkill(skill)}
            />
          </div>
          <img
            src={SQLAgentImage}
            alt="SQL Agent"
            className="w-full rounded-md"
          />
          <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium py-1.5">
            Enable your agent to be able to leverage SQL to answer you questions
            by connecting to various SQL database providers.
          </p>
          {enabled && (
            <>
              <input
                name="system::agent_sql_connections"
                type="hidden"
                value={JSON.stringify(connections)}
              />
              <input
                type="hidden"
                value={JSON.stringify(
                  connections.filter((conn) => conn.action !== "remove")
                )}
              />
              <div className="flex flex-col mt-2 gap-y-2">
                <p className="text-theme-text-primary font-semibold text-sm">
                  Your database connections
                </p>
                <div className="flex flex-col gap-y-3">
                  {loading ? (
                    <div className="flex items-center justify-center py-4">
                      <CircleNotch
                        size={24}
                        className="animate-spin text-theme-text-primary"
                      />
                    </div>
                  ) : (
                    connections
                      .filter((connection) => connection.action !== "remove")
                      .map((connection) => (
                        <DBConnection
                          key={connection.database_id}
                          connection={connection}
                          onRemove={handleRemoveConnection}
                          onUpdate={handleUpdateConnection}
                          setHasChanges={setHasChanges}
                          connections={connections}
                        />
                      ))
                  )}
                  <button
                    type="button"
                    onClick={openModal}
                    className="w-fit relative flex h-[40px] items-center border-none hover:bg-theme-bg-secondary rounded-lg"
                  >
                    <div className="flex w-full gap-x-2 items-center p-4">
                      <div className="bg-theme-bg-secondary p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
                        <Plus
                          weight="bold"
                          size={14}
                          className="shrink-0 text-theme-text-primary"
                        />
                      </div>
                      <p className="text-left text-theme-text-primary text-sm">
                        New SQL connection
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <NewSQLConnection
        isOpen={isOpen}
        closeModal={closeModal}
        setHasChanges={setHasChanges}
        onSubmit={handleAddConnection}
        connections={connections}
      />
      <Tooltip
        id="edit-sql-connection-tooltip"
        content="Edit SQL connection"
        place="top"
        delayShow={300}
        className="tooltip !text-xs !opacity-100"
        style={{
          maxWidth: "250px",
          whiteSpace: "normal",
          wordWrap: "break-word",
        }}
      />
      <Tooltip
        id="delete-sql-connection-tooltip"
        content="Delete SQL connection"
        place="top"
        delayShow={300}
        className="tooltip !text-xs !opacity-100"
        style={{
          maxWidth: "250px",
          whiteSpace: "normal",
          wordWrap: "break-word",
        }}
      />
    </>
  );
}
