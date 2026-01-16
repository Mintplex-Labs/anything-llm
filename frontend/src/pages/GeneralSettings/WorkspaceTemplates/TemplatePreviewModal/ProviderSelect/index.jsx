import { AVAILABLE_LLM_PROVIDERS } from "@/pages/GeneralSettings/LLMPreference";
import { ENABLED_PROVIDERS as AGENT_ENABLED_PROVIDERS } from "@/pages/WorkspaceSettings/AgentConfig/AgentLLMSelection";
import CustomSelect from "../CustomSelect";

export default function ProviderSelect({
  value,
  onChange,
  type = "chat", // "chat" or "agent"
  className = "",
}) {
  const providers = type === "agent"
    ? AVAILABLE_LLM_PROVIDERS.filter((p) => AGENT_ENABLED_PROVIDERS.includes(p.value))
    : AVAILABLE_LLM_PROVIDERS;

  const defaultLabel = type === "agent" ? "System Default" : "System default";

  const options = [
    { value: "", label: defaultLabel },
    ...providers.map((provider) => ({
      value: provider.value,
      label: provider.name,
    })),
  ];

  return (
    <CustomSelect
      value={value || ""}
      options={options}
      onChange={onChange}
      placeholder={defaultLabel}
      className={className}
    />
  );
}
