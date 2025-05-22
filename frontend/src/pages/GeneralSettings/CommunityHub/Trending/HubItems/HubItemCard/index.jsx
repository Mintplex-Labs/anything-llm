import GenericHubCard from "./generic";
import SystemPromptHubCard from "./systemPrompt";
import SlashCommandHubCard from "./slashCommand";
import AgentSkillHubCard from "./agentSkill";
import AgentFlowHubCard from "./agentFlow";

export default function HubItemCard({ type, item }) {
  switch (type) {
    case "systemPrompts":
      return <SystemPromptHubCard item={item} />;
    case "slashCommands":
      return <SlashCommandHubCard item={item} />;
    case "agentSkills":
      return <AgentSkillHubCard item={item} />;
    case "agentFlows":
      return <AgentFlowHubCard item={item} />;
    default:
      return <GenericHubCard item={item} />;
  }
}
