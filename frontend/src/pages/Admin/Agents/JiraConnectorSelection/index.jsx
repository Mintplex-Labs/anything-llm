import React, { useEffect, useState } from "react";
import JiraConnection from "./JiraConnection";
import { Plus, ListChecks } from "@phosphor-icons/react";
import NewJiraConnection from "./NewConnectionModal";
import { useModal } from "@/hooks/useModal";
import Admin from "@/models/admin";

export default function AgentJiraConnectorSelection({
  skill,
  settings,
  toggleSkill,
  enabled = false,
  setHasChanges,
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [connections, setConnections] = useState([]);
  
  // Load connections from system preferences
  useEffect(() => {
    Admin.systemPreferencesByFields(["agent_jira_connections"])
      .then((res) => {
        console.log("Retrieved Jira connections:", res?.settings?.agent_jira_connections);
        setConnections(res?.settings?.agent_jira_connections ?? []);
      })
      .catch(() => setConnections([]));
  }, []);

  // Immediately persist connections when they change
  useEffect(() => {
    if (connections.length > 0 || connections.some(conn => conn.action === "remove")) {
      // Only update if we have connections or if we're removing connections
      const persistedConnections = connections.filter(conn => conn.action !== "remove");
      const data = {
        agent_jira_connections: JSON.stringify(persistedConnections)
      };
      
      // Save to backend immediately
      Admin.updateSystemPreferences(data)
        .then(() => {
          console.log("Jira connections saved:", persistedConnections);
          // After successful save, remove any connections marked for removal
          setConnections(persistedConnections);
        })
        .catch(err => console.error("Failed to save Jira connections:", err));
      
      // Mark form as having changes
      setHasChanges(true);
    }
  }, [connections, setHasChanges]);

  const handleAddConnection = (newInstance) => {
    setConnections(prev => [...prev, { ...newInstance }]);
  };

  const handleRemoveConnection = (instanceId) => {
    // Mark for removal first
    setConnections(prev => 
      prev.map(conn => 
        conn.instance_id === instanceId 
          ? { ...conn, action: "remove" } 
          : conn
      )
    );
  };

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col gap-y-[18px] max-w-[500px]">
          <div className="flex items-center gap-x-2">
            <ListChecks
              size={24}
              color="var(--theme-text-primary)"
              weight="bold"
            />
            <label
              htmlFor="name"
              className="text-theme-text-primary text-md font-bold"
            >
              Jira Connector
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
          <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium py-1.5">
            Enable your agent to interact with Jira issues, search for tickets, create new issues, and update existing ones.
          </p>
          {enabled && (
            <>
              <input
                name="system::agent_jira_connections"
                type="hidden"
                value={JSON.stringify(connections.filter(conn => conn.action !== "remove"))}
              />
              
              <div className="flex flex-col mt-2 gap-y-2">
                <p className="text-theme-text-primary font-semibold text-sm">
                  Your Jira instance connections
                </p>
                <div className="flex flex-col gap-y-3">
                  {connections
                    .filter((connection) => connection.action !== "remove")
                    .map((connection) => (
                      <JiraConnection
                        key={connection.instance_id}
                        connection={connection}
                        onRemove={handleRemoveConnection}
                        setHasChanges={setHasChanges}
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
                        New Jira connection
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <NewJiraConnection
        isOpen={isOpen}
        closeModal={closeModal}
        onSubmit={handleAddConnection}
      />
    </>
  );
} 