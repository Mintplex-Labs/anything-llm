import React, { useEffect, useState } from "react";
import DBConnection from "./DBConnection";
import { Plus, Database } from "@phosphor-icons/react";
import NewSQLConnection from "./NewConnectionModal";
import { useModal } from "@/hooks/useModal";
import SQLAgentImage from "@/media/agents/sql-agent.png";
import Admin from "@/models/admin";

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

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col gap-y-[18px] max-w-[500px]">
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
            <label className="border-none relative inline-flex items-center ml-auto cursor-pointer">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={enabled}
                onChange={() => toggleSkill(skill)}
              />
              <div className="peer-disabled:opacity-50 pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
              <span className="ml-3 text-sm font-medium"></span>
            </label>
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
                        onRemove={(databaseId) => {
                          setHasChanges(true);
                          setConnections((prev) =>
                            prev.map((conn) => {
                              if (conn.database_id === databaseId)
                                return { ...conn, action: "remove" };
                              return conn;
                            })
                          );
                        }}
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
        onSubmit={(newDb) =>
          setConnections((prev) => [...prev, { action: "add", ...newDb }])
        }
      />
    </>
  );
}
