import SystemPrompt from "./SystemPrompt";
import SlashCommand from "./SlashCommand";
import UnknownItem from "./Unknown";
import AgentSkill from "./AgentSkill";
import AgentFlow from "./AgentFlow";

const HubItemComponent = {
  "agent-skill": AgentSkill,
  "system-prompt": SystemPrompt,
  "slash-command": SlashCommand,
  "agent-flow": AgentFlow,
  unknown: UnknownItem,
};

export default HubItemComponent;
