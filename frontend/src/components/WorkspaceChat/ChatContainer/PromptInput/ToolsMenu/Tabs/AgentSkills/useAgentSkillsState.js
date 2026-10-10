import { useState, useEffect, useCallback, useRef } from "react";
import Admin from "@/models/admin";
import System from "@/models/system";
import Workspace from "@/models/workspace";
import AgentFlows from "@/models/agentFlows";
import MCPServers from "@/models/mcpServers";
import { getSubSkillPreferenceKeys } from "./skillRegistry";
import useSubSkillPreferences from "./useSubSkillPreferences";
import { toggleAgentSessionTool } from "@/utils/chat/agent";

/**
 * Core hook for managing all agent skill state.
 * Handles fetching, toggling, and persisting skill preferences.
 * A workspace follows the system agent skill settings until its first toggle,
 * which gives it its own copy of every toggle from then on.
 * @param {Object} defaultSkills
 * @param {{slug: string}} workspace
 */
export default function useAgentSkillsState(defaultSkills, workspace) {
  // Core skill state
  const [fileSystemAgentAvailable, setFileSystemAgentAvailable] =
    useState(false);
  const [imageGenerationAvailable, setImageGenerationAvailable] =
    useState(false);
  const [isMultiUser, setIsMultiUser] = useState(false);
  const [disabledDefaults, setDisabledDefaults] = useState([]);
  const [enabledConfigurable, setEnabledConfigurable] = useState([]);
  const [importedSkills, setImportedSkills] = useState([]);
  const [flows, setFlows] = useState([]);
  const [mcpServers, setMcpServers] = useState([]);
  const [workspaceSkills, setWorkspaceSkills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mcpLoading, setMcpLoading] = useState(true);
  const saveQueue = useRef(Promise.resolve());

  // Sub-skill preferences (managed by dedicated hook)
  const subSkillPrefs = useSubSkillPreferences();

  // Fetch all skill settings on mount
  useEffect(() => {
    fetchSkillSettings();
    fetchMcpServers();
  }, [workspace?.slug]);

  async function fetchSkillSettings() {
    try {
      const subSkillPrefKeys = getSubSkillPreferenceKeys();
      const [
        prefs,
        flowsRes,
        fsAgentAvailable,
        multiUserMode,
        imageGenAvailable,
        agentSkills,
      ] = await Promise.all([
        Admin.systemPreferencesByFields([
          "disabled_agent_skills",
          "default_agent_skills",
          "imported_agent_skills",
          ...subSkillPrefKeys,
        ]),
        AgentFlows.listFlows(),
        System.isFileSystemAgentAvailable(),
        System.isMultiUserMode(),
        System.isImageGenerationAvailable(),
        Workspace.agentSkills(workspace?.slug),
      ]);

      if (prefs?.settings) {
        setDisabledDefaults(prefs.settings.disabled_agent_skills ?? []);
        setEnabledConfigurable(prefs.settings.default_agent_skills ?? []);
        setImportedSkills(prefs.settings.imported_agent_skills ?? []);
        subSkillPrefs.loadFromSettings(prefs.settings);
      }
      if (flowsRes?.flows) setFlows(flowsRes.flows);
      setFileSystemAgentAvailable(fsAgentAvailable);
      setImageGenerationAvailable(imageGenAvailable);
      setIsMultiUser(!!multiUserMode);
      setWorkspaceSkills(agentSkills);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMcpServers() {
    try {
      const { servers = [] } = await MCPServers.listServers();
      setMcpServers(servers);
    } catch (e) {
      console.error(e);
    } finally {
      setMcpLoading(false);
    }
  }

  const isOn = useCallback(
    (key, systemEnabled) =>
      workspaceSkills ? workspaceSkills.enabled.includes(key) : systemEnabled,
    [workspaceSkills]
  );

  // Saves run one at a time so each response is the latest workspace state.
  const save = useCallback(
    (change, sessionKey, serverName = null) => {
      saveQueue.current = saveQueue.current.then(async () => {
        const agentSkills = await Workspace.setAgentSkill(
          workspace?.slug,
          change
        );
        if (!agentSkills) return;
        setWorkspaceSkills(agentSkills);
        toggleAgentSessionTool(sessionKey, change.enabled, serverName);
      });
    },
    [workspace?.slug]
  );

  const resetToSystemDefaults = useCallback(async () => {
    if (await Workspace.resetAgentSkills(workspace?.slug))
      setWorkspaceSkills(null);
  }, [workspace?.slug]);

  // Skill enabled/disabled checks
  const isSkillEnabled = useCallback(
    (key) =>
      isOn(
        key,
        key in defaultSkills
          ? !disabledDefaults.includes(key)
          : enabledConfigurable.includes(key)
      ),
    [isOn, defaultSkills, disabledDefaults, enabledConfigurable]
  );
  const isSubSkillEnabled = useCallback(
    (skillKey, subSkillName) =>
      isOn(
        subSkillName,
        subSkillPrefs.isSubSkillEnabled(skillKey, subSkillName)
      ),
    [isOn, subSkillPrefs.isSubSkillEnabled]
  );
  const isImportedSkillEnabled = useCallback(
    (skill) => isOn(skill.hubId, !!skill.active),
    [isOn]
  );
  const isFlowEnabled = useCallback(
    (flow) => isOn(`@@flow_${flow.uuid}`, flow.active),
    [isOn]
  );
  const isMcpToolEnabled = useCallback(
    (server, toolName) => {
      if (!workspaceSkills)
        return !(server.config?.anythingllm?.suppressedTools || []).includes(
          toolName
        );
      // Servers added after this workspace made its copy start off.
      const suppressed = workspaceSkills.mcpSuppressedTools;
      if (!Object.hasOwn(suppressed, server.name)) return false;
      return !suppressed[server.name].includes(toolName);
    },
    [workspaceSkills]
  );

  // Toggle functions
  const toggleSkill = useCallback(
    (key) => save({ skill: key, enabled: !isSkillEnabled(key) }, key),
    [save, isSkillEnabled]
  );
  const toggleSubSkill = useCallback(
    (skillKey, subSkillName) =>
      save(
        {
          skill: subSkillName,
          enabled: !isSubSkillEnabled(skillKey, subSkillName),
        },
        subSkillName
      ),
    [save, isSubSkillEnabled]
  );
  const toggleImportedSkill = useCallback(
    (skill) =>
      save(
        { skill: skill.hubId, enabled: !isImportedSkillEnabled(skill) },
        skill.hubId
      ),
    [save, isImportedSkillEnabled]
  );
  const toggleFlow = useCallback(
    (flow) => {
      const key = `@@flow_${flow.uuid}`;
      save({ skill: key, enabled: !isFlowEnabled(flow) }, key);
    },
    [save, isFlowEnabled]
  );
  const toggleMcpTool = useCallback(
    (server, toolName) =>
      save(
        {
          skill: toolName,
          enabled: !isMcpToolEnabled(server, toolName),
          mcpServer: server.name,
        },
        `${server.name}-${toolName}`,
        server.name
      ),
    [save, isMcpToolEnabled]
  );

  return {
    // State
    fileSystemAgentAvailable,
    imageGenerationAvailable,
    isMultiUser,
    disabledDefaults,
    enabledConfigurable,
    importedSkills,
    flows,
    mcpServers,
    loading,
    mcpLoading,
    hasOwnSkills: !!workspaceSkills,

    // Skill checks
    isSkillEnabled,
    isSubSkillEnabled,
    isImportedSkillEnabled,
    isFlowEnabled,
    isMcpToolEnabled,

    // Toggle functions
    toggleSkill,
    toggleSubSkill,
    toggleImportedSkill,
    toggleFlow,
    toggleMcpTool,
    resetToSystemDefaults,

    // Sub-skill preferences (delegated)
    disabledSubSkills: subSkillPrefs.disabledSubSkills,
  };
}
