import React, { useState } from "react";
import DBConnection from "./DBConnection";
import { Plus } from "@phosphor-icons/react";
import NewSQLConnection from "./NewConnectionModal";
import { useModal } from "@/hooks/useModal";

export default function AgentSQLConnectorSelection({
  skill,
  settings,
  toggleSkill,
  enabled = false,
  setHasChanges,
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [connections, setConnections] = useState(
    settings?.preferences?.agent_sql_connections || []
  );

  return (
    <>
      <div className="border-b border-white/40 pb-4">
        <div className="flex flex-col">
          <div className="flex w-full justify-between items-center">
            <label htmlFor="name" className="block input-label">
              SQL Agent
            </label>
            <label className="border-none relative inline-flex cursor-pointer items-center mt-2">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={enabled}
                onClick={() => toggleSkill(skill)}
              />
              <div className="pointer-events-none peer h-6 w-11 rounded-full bg-stone-400 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border after:border-gray-600 after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-lime-300 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300"></span>
            </label>
          </div>
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            Enable your agent to be able to leverage SQL to answer you questions
            by connecting to various SQL database providers.
          </p>
        </div>
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
              <p className="text-white font-semibold text-sm">
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
                        setConnections((prev) =>
                          prev.map((conn) => {
                            if (conn.database_id === databaseId)
                              return { ...conn, action: "remove" };
                            return conn;
                          })
                        );
                      }}
                      setHasChanges={setHasChanges}
                    />
                  ))}
                <button
                  type="button"
                  onClick={openModal}
                  className="w-fit relative flex h-[40px] items-center border-none hover:bg-slate-600/20 rounded-lg"
                >
                  <div className="flex w-full gap-x-2 items-center p-4">
                    <div className="bg-zinc-600 p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
                      <Plus
                        weight="bold"
                        size={14}
                        className="shrink-0 text-slate-100"
                      />
                    </div>
                    <p className="text-left text-slate-100 text-sm">
                      New SQL connection
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}
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
