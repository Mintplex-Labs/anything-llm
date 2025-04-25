import React, { useEffect, useState } from "react";
import SlackConnection from "./SlackConnection";
import { Plus, SlackLogo } from "@phosphor-icons/react";
import NewSlackConnection from "./NewConnectionModal";
import { useModal } from "@/hooks/useModal";
import Admin from "@/models/admin";

export default function AgentSlackConnectorSelection({
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
    Admin.systemPreferencesByFields(["agent_slack_connections"])
      .then((res) => {
        console.log(
          "Retrieved slack connections:",
          res?.settings?.agent_slack_connections
        );
        setConnections(res?.settings?.agent_slack_connections ?? []);
      })
      .catch(() => setConnections([]));
  }, []);

  // Immediately persist connections when they change
  useEffect(() => {
    if (
      connections.length > 0 ||
      connections.some((conn) => conn.action === "remove")
    ) {
      // Only update if we have connections or if we're removing connections
      const persistedConnections = connections.filter(
        (conn) => conn.action !== "remove"
      );
      const data = {
        agent_slack_connections: JSON.stringify(persistedConnections),
      };

      // Save to backend immediately
      Admin.updateSystemPreferences(data)
        .then(() => {
          console.log("Slack connections saved:", persistedConnections);
          // After successful save, remove any connections marked for removal
          setConnections(persistedConnections);
        })
        .catch((err) =>
          console.error("Failed to save slack connections:", err)
        );

      // Mark form as having changes
      setHasChanges(true);
    }
  }, [connections, setHasChanges]);

  const handleAddConnection = (newWorkspace) => {
    setConnections((prev) => [...prev, { ...newWorkspace }]);
  };

  const handleRemoveConnection = (workspaceId) => {
    // Mark for removal first
    setConnections((prev) =>
      prev.map((conn) =>
        conn.workspace_id === workspaceId ? { ...conn, action: "remove" } : conn
      )
    );
  };

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col gap-y-[18px] max-w-[500px]">
          <div className="flex items-center gap-x-2">
            <SlackLogo
              size={24}
              color="var(--theme-text-primary)"
              weight="bold"
            />
            <label
              htmlFor="name"
              className="text-theme-text-primary text-md font-bold"
            >
              Slack Connector
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
            Enable your agent to send messages to Slack channels and interact
            with Slack users.
          </p>
          {enabled && (
            <>
              {/* This hidden input isn't needed anymore since we're updating via API directly */}
              <input
                name="system::agent_slack_connections"
                type="hidden"
                value={JSON.stringify(
                  connections.filter((conn) => conn.action !== "remove")
                )}
              />

              <div className="flex flex-col mt-2 gap-y-2">
                <p className="text-theme-text-primary font-semibold text-sm">
                  Your Slack workspace connections
                </p>
                <div className="flex flex-col gap-y-3">
                  {connections
                    .filter((connection) => connection.action !== "remove")
                    .map((connection) => (
                      <SlackConnection
                        key={connection.workspace_id}
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
                        New Slack connection
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <NewSlackConnection
        isOpen={isOpen}
        closeModal={closeModal}
        onSubmit={handleAddConnection}
      />
    </>
  );
}
