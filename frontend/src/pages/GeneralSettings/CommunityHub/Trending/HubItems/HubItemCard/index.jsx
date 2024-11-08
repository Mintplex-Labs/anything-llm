import GenericHubCard from "./generic";
import SystemPromptHubCard from "./systemPrompt";
import SlashCommandHubCard from "./slashCommand";
export default function HubItemCard({ type, item }) {
  switch (type) {
    case "systemPrompts":
      return <SystemPromptHubCard item={item} />;
    case "slashCommands":
      return <SlashCommandHubCard item={item} />;
    default:
      return <GenericHubCard item={item} />;
  }
}
