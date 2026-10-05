import { useState, useEffect, useCallback } from "react";
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
 * Toggles are saved as overrides on this workspace, everything else follows the
 * global agent skill settings.
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
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(true);
  const [mcpLoading, setMcpLoading] = useState(true);

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
        workspaceOverrides,
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
        Workspace.agentSkillOverrides(workspace?.slug),
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
      setOverrides(workspaceOverrides);
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

  // A workspace override wins over the global setting.
  const withOverride = useCallback(
    (key, globallyEnabled) => overrides[key] ?? globallyEnabled,
    [overrides]
  );

  // Save a toggle as a workspace override and apply it to a running agent session.
  // Landing back on the global setting clears the override so the workspace
  // follows future global changes again.
  const saveOverride = useCallback(
    async (key, enabled, globallyEnabled, serverName = null) => {
      const value = enabled === globallyEnabled ? null : enabled;
      setOverrides((prev) => {
        const next = { ...prev };
        if (value === null) delete next[key];
        else next[key] = value;
        return next;
      });

      const saved = await Workspace.setAgentSkillOverride(
        workspace?.slug,
        key,
        value
      );
      if (!saved) {
        setOverrides(await Workspace.agentSkillOverrides(workspace?.slug));
        return;
      }
      setOverrides(saved);
      toggleAgentSessionTool(key, enabled, serverName);
    },
    [workspace?.slug]
  );

  // Global state of each skill type, before workspace overrides
  const skillGloballyEnabled = useCallback(
    (key) =>
      key in defaultSkills
        ? !disabledDefaults.includes(key)
        : enabledConfigurable.includes(key),
    [defaultSkills, disabledDefaults, enabledConfigurable]
  );
  const mcpToolKey = (server, toolName) => `${server.name}-${toolName}`;
  const mcpToolGloballyEnabled = (server, toolName) =>
    !(server.config?.anythingllm?.suppressedTools || []).includes(toolName);

  // Skill enabled/disabled checks
  const isSkillEnabled = useCallback(
    (key) => withOverride(key, skillGloballyEnabled(key)),
    [withOverride, skillGloballyEnabled]
  );
  const isSubSkillEnabled = useCallback(
    (skillKey, subSkillName) =>
      withOverride(
        subSkillName,
        subSkillPrefs.isSubSkillEnabled(skillKey, subSkillName)
      ),
    [withOverride, subSkillPrefs.isSubSkillEnabled]
  );
  const isImportedSkillEnabled = useCallback(
    (skill) => withOverride(skill.hubId, !!skill.active),
    [withOverride]
  );
  const isFlowEnabled = useCallback(
    (flow) => withOverride(`@@flow_${flow.uuid}`, flow.active),
    [withOverride]
  );
  const isMcpToolEnabled = useCallback(
    (server, toolName) =>
      withOverride(
        mcpToolKey(server, toolName),
        mcpToolGloballyEnabled(server, toolName)
      ),
    [withOverride]
  );

  // Toggle functions
  const toggleSkill = useCallback(
    (key) => saveOverride(key, !isSkillEnabled(key), skillGloballyEnabled(key)),
    [saveOverride, isSkillEnabled, skillGloballyEnabled]
  );
  const toggleSubSkill = useCallback(
    (skillKey, subSkillName) =>
      saveOverride(
        subSkillName,
        !isSubSkillEnabled(skillKey, subSkillName),
        subSkillPrefs.isSubSkillEnabled(skillKey, subSkillName)
      ),
    [saveOverride, isSubSkillEnabled, subSkillPrefs.isSubSkillEnabled]
  );
  const toggleImportedSkill = useCallback(
    (skill) =>
      saveOverride(skill.hubId, !isImportedSkillEnabled(skill), !!skill.active),
    [saveOverride, isImportedSkillEnabled]
  );
  const toggleFlow = useCallback(
    (flow) =>
      saveOverride(`@@flow_${flow.uuid}`, !isFlowEnabled(flow), flow.active),
    [saveOverride, isFlowEnabled]
  );
  const toggleMcpTool = useCallback(
    (server, toolName) =>
      saveOverride(
        mcpToolKey(server, toolName),
        !isMcpToolEnabled(server, toolName),
        mcpToolGloballyEnabled(server, toolName),
        server.name
      ),
    [saveOverride, isMcpToolEnabled]
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

    // Sub-skill preferences (delegated)
    disabledSubSkills: subSkillPrefs.disabledSubSkills,
  };
}
