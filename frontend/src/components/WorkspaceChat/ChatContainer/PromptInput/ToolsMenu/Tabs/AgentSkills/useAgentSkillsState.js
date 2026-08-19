import { useState, useEffect, useCallback } from "react";
import Admin from "@/models/admin";
import System from "@/models/system";
import Workspace from "@/models/workspace";
import AgentFlows from "@/models/agentFlows";
import MCPServers from "@/models/mcpServers";
import { safeJsonParse } from "@/utils/request";
import { getSubSkillPreferenceKeys } from "./skillRegistry";
import useSubSkillPreferences from "./useSubSkillPreferences";
import { toggleAgentSessionTool } from "@/utils/chat/agent";

/**
 * Core hook for managing all agent skill state.
 * Handles fetching, toggling, and persisting skill preferences.
 * Toggles write an override onto the workspace; the instance-wide settings stay
 * the defaults that workspaces without an override inherit.
 */
export default function useAgentSkillsState(defaultSkills, workspace) {
  // Core skill state
  const [fileSystemAgentAvailable, setFileSystemAgentAvailable] =
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
  }, []);

  async function fetchSkillSettings() {
    try {
      const subSkillPrefKeys = getSubSkillPreferenceKeys();
      const [prefs, flowsRes, fsAgentAvailable, multiUserMode, currWorkspace] =
        await Promise.all([
          Admin.systemPreferencesByFields([
            "disabled_agent_skills",
            "default_agent_skills",
            "imported_agent_skills",
            ...subSkillPrefKeys,
          ]),
          AgentFlows.listFlows(),
          System.isFileSystemAgentAvailable(),
          System.isMultiUserMode(),
          Workspace.bySlug(workspace?.slug),
        ]);

      if (prefs?.settings) {
        setDisabledDefaults(prefs.settings.disabled_agent_skills ?? []);
        setEnabledConfigurable(prefs.settings.default_agent_skills ?? []);
        setImportedSkills(prefs.settings.imported_agent_skills ?? []);
        subSkillPrefs.loadFromSettings(prefs.settings);
      }
      if (flowsRes?.flows) setFlows(flowsRes.flows);
      setOverrides(safeJsonParse(currWorkspace?.agentConfig, {}));
      setFileSystemAgentAvailable(fsAgentAvailable);
      setIsMultiUser(!!multiUserMode);
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

  // On/off state a built-in skill has in the instance-wide settings, ignoring this workspace.
  const instanceSkillEnabled = useCallback(
    (key) =>
      key in defaultSkills
        ? !disabledDefaults.includes(key)
        : enabledConfigurable.includes(key),
    [defaultSkills, disabledDefaults, enabledConfigurable]
  );

  /**
   * Whether a skill is on for this workspace, and the toggle that flips it.
   * Only skills that differ from the instance are stored, so the rest follow it.
   * @param {string} id - skill key, hubId, `@@flow_<uuid>`, MCP `<server>-<tool>`, or sub-skill name
   * @param {boolean} instanceDefault - state of this skill in the instance-wide settings
   * @param {string|null} [opts.serverName] - MCP server name, needed to re-enable an MCP tool mid-session
   * @returns {{enabled: boolean, toggle: function}}
   */
  const skillState = useCallback(
    (id, instanceDefault, { serverName = null } = {}) => {
      const enabled = overrides[id] ?? instanceDefault;
      return {
        enabled,
        toggle: async () => {
          const updated = { ...overrides };
          if (enabled === instanceDefault) updated[id] = !enabled;
          else delete updated[id];

          setOverrides(updated);
          await Workspace.update(workspace.slug, { agentConfig: updated });
          toggleAgentSessionTool(id, !enabled, serverName);
        },
      };
    },
    [overrides, workspace]
  );

  // A running agent session keeps the tools it started with until restarted.
  const resetOverrides = useCallback(async () => {
    setOverrides({});
    await Workspace.update(workspace.slug, { agentConfig: null });
  }, [workspace]);

  return {
    // State
    fileSystemAgentAvailable,
    isMultiUser,
    importedSkills,
    flows,
    mcpServers,
    loading,
    mcpLoading,
    hasOverrides: Object.keys(overrides).length > 0,

    // Skill checks
    instanceSkillEnabled,
    skillState,

    // Toggle functions
    resetOverrides,

    // Sub-skill preferences (delegated)
    isSubSkillEnabled: subSkillPrefs.isSubSkillEnabled,
  };
}
