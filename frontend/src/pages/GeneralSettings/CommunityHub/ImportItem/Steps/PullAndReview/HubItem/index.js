import SystemPrompt from "./SystemPrompt";
import SlashCommand from "./SlashCommand";
import UnknownItem from "./Unknown";
import AgentSkill from "./AgentSkill";

const HubItemComponent = {
  "agent-skill": AgentSkill,
  "system-prompt": SystemPrompt,
  "slash-command": SlashCommand,
  unknown: UnknownItem,
};

export default HubItemComponent;
