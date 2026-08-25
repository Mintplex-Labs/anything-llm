import { useEffect, useState } from "react";
import LocalAiConnection from "@/models/localAiConnection";

export default function LocalAiConnectionSelector({
  name = "chatConnectionId",
  value = "",
  onChange,
  onConnectionChange,
  required = false,
  className = "border-none bg-theme-settings-input-bg text-white text-sm rounded-lg block w-full p-2.5",
}) {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    LocalAiConnection.all().then(setConnections);
  }, []);

  function handleChange(event) {
    const nextValue = event.target.value;
    onChange?.(nextValue);
    onConnectionChange?.(
      connections.find((connection) => String(connection.id) === nextValue) ||
        null
    );
  }

  return (
    <select
      name={name}
      value={value || ""}
      onChange={handleChange}
      className={className}
      required={required}
    >
      <option value="">Use system LocalAI settings</option>
      {connections.map((connection) => (
        <option key={connection.id} value={connection.id}>
          {connection.name}
        </option>
      ))}
    </select>
  );
}
