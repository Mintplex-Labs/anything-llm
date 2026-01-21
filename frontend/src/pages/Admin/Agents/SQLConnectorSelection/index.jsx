import React, { useEffect, useState } from "react";
import DBConnection from "./DBConnection";
import { Plus, Database } from "@phosphor-icons/react";
import NewSQLConnection from "./NewConnectionModal";
import { useModal } from "@/hooks/useModal";
import SQLAgentImage from "@/media/agents/sql-agent.png";
import Admin from "@/models/admin";
import Toggle from "@/components/lib/Toggle";

export default function AgentSQLConnectorSelection({
  skill,
  settings, // unused.
  toggleSkill,
  enabled = false,
  setHasChanges,
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [connections, setConnections] = useState([]);
  useEffect(() => {
    Admin.systemPreferencesByFields(["agent_sql_connections"])
      .then((res) => setConnections(res?.settings?.agent_sql_connections ?? []))
      .catch(() => setConnections([]));
  }, []);

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
                  {connections
                    .filter((connection) => connection.action !== "remove")
                    .map((connection) => (
                      <DBConnection
                        key={connection.database_id}
                        connection={connection}
                        onRemove={handleRemoveConnection}
                      />
                    ))}
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
        onSubmit={(newDb) =>
          setConnections((prev) => [...prev, { action: "add", ...newDb }])
        }
      />
    </>
  );
}
