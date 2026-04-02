import { useEffect, useState, useCallback } from "react";
import Telegram from "@/models/telegram";
import ConnectedBotCard from "./ConnectedBotCard";
import DetailsSection from "./DetailsSection";
import UsersSection from "./UsersSection";
import DisconnectedView from "./DisconnectedView";

export default function ConnectedView({
  config,
  onDisconnected,
  onReconnected,
}) {
  const connected = config.connected;
  const [newToken, setNewToken] = useState("");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);

  const fetchUsers = useCallback(async () => {
    const [pending, approved] = await Promise.all([
      Telegram.getPendingUsers(),
      Telegram.getApprovedUsers(),
    ]);
    setPendingUsers(pending?.users || []);
    setApprovedUsers(approved?.users || []);
  }, []);

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5_000);
    return () => clearInterval(interval);
  }, [fetchUsers]);

  if (!connected) {
    return (
      <DisconnectedView
        config={config}
        onReconnected={onReconnected}
        newToken={newToken}
        setNewToken={setNewToken}
      />
    );
  }

  return (
    <div className="flex flex-col gap-y-8 mt-8">
      <ConnectedBotCard config={config} />
      <DetailsSection config={config} onDisconnected={onDisconnected} />
      <UsersSection
        pendingUsers={pendingUsers}
        approvedUsers={approvedUsers}
        fetchUsers={fetchUsers}
      />
    </div>
  );
}
