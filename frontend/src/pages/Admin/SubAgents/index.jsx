import SettingsSidebar from "@/components/SettingsSidebar";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";
import Admin from "@/models/admin";
import SubAgentsModel from "@/models/subAgents";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Plus, Trash, PencilSimple, Robot, Brain, Image, MusicNotes, TextT, ArrowLeft, FilmStrip } from "@phosphor-icons/react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function SubAgents() {
  const { t } = useTranslation();
  const [subAgents, setSubAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    input_type: "text",
    output_type: "text",
    provider: "openrouter",
    model: "",
    system_prompt: "",
  });

  const [availableModels, setAvailableModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [fetchingModels, setFetchingModels] = useState(false);

  useEffect(() => {
    async function loadAgents() {
      setLoading(true);
      const agents = await SubAgentsModel.getAll();
      setSubAgents(agents || []);
      setLoading(false);
    }
    loadAgents();
  }, []);

  // Fetch models for chosen provider
  useEffect(() => {
    if (!formData.provider) return;
    async function fetchModels() {
      setFetchingModels(true);
      const { models } = await System.customModels(formData.provider);
      setAvailableModels(models || []);
      setFetchingModels(false);
    }
    fetchModels();
  }, [formData.provider]);

  // Apply strict filtering on OpenRouter models based on input/output types
  useEffect(() => {
    if (formData.provider === "openrouter") {
      const filtered = availableModels.filter((model) => {
        const arch = model.architecture || {};
        
        let hasImageInput = false;
        let hasImageOutput = false;
        let hasAudioOutput = false;
        let hasTextOutput = true; // Default most models to text output

        let hasAudioInput = false;
        let hasVideoInput = false;

        // Determine input modalities
        if (Array.isArray(arch.input_modalities)) {
          hasImageInput = arch.input_modalities.includes("image");
          hasAudioInput = arch.input_modalities.includes("audio");
          hasVideoInput = arch.input_modalities.includes("video");
        } else if (arch.modality) {
          const inModality = arch.modality.split("->")[0] || "";
          hasImageInput = inModality.includes("image");
          hasAudioInput = inModality.includes("audio");
          hasVideoInput = inModality.includes("video");
        }

        let hasVideoOutput = false;

        // Determine output modalities
        if (Array.isArray(arch.output_modalities)) {
          hasImageOutput = arch.output_modalities.includes("image");
          hasAudioOutput = arch.output_modalities.includes("audio");
          hasVideoOutput = arch.output_modalities.includes("video");
          hasTextOutput = arch.output_modalities.includes("text");
        } else if (arch.modality) {
          const outModality = arch.modality.split("->")[1] || "";
          hasImageOutput = outModality.includes("image");
          hasAudioOutput = outModality.includes("audio");
          hasVideoOutput = outModality.includes("video");
          hasTextOutput = outModality.includes("text") || (!hasImageOutput && !hasAudioOutput && !hasVideoOutput);
        }
        
        // Filter based on requested input_type (removed check for text+image as OpenRouter can describe images for text models)
        if (formData.input_type === "text+audio" && !hasAudioInput) return false;
        if (formData.input_type === "video" && !hasVideoInput) return false;

        // Filter based on requested output_type
        if (formData.output_type === "image" && !hasImageOutput) return false;
        if (formData.output_type === "audio" && !hasAudioOutput) return false;
        if (formData.output_type === "video" && !hasVideoOutput) return false;
        if (formData.output_type === "text" && !hasTextOutput) return false;

        return true;
      });
      setFilteredModels(filtered);
    } else {
      // For other providers, show all models as they lack standard modality metadata
      setFilteredModels(availableModels);
    }
  }, [availableModels, formData.input_type, formData.output_type]);

  const handleOpenAdd = () => {
    setEditingAgent(null);
    setFormData({
      name: "",
      description: "",
      input_type: "text",
      output_type: "text",
      provider: "openrouter",
      model: "",
      system_prompt: "",
    });
    setOpenModal(true);
  };

  const handleOpenEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      description: agent.description,
      input_type: agent.input_type || "text",
      output_type: agent.output_type || "text",
      provider: agent.provider || "openrouter",
      model: agent.model || "",
      system_prompt: agent.system_prompt || "",
    });
    setOpenModal(true);
  };

  const handleDelete = async (agentUuid) => {
    if (!window.confirm(t("subAgents.messages.deleteConfirm"))) return;
    const { success, error } = await SubAgentsModel.delete(agentUuid);

    if (success) {
      setSubAgents((prev) => prev.filter((a) => a.uuid !== agentUuid));
      showToast(t("subAgents.messages.deleted"), "success");
    } else {
      showToast(t("subAgents.messages.deleteError", { error }), "error");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.model) {
      showToast(t("subAgents.messages.fillRequired"), "error");
      return;
    }

    if (editingAgent) {
      const { success, subAgent, error } = await SubAgentsModel.update(
        editingAgent.uuid,
        formData
      );
      if (success) {
        setSubAgents((prev) =>
          prev.map((a) => (a.uuid === editingAgent.uuid ? subAgent : a))
        );
        showToast(t("subAgents.messages.updated"), "success");
        setOpenModal(false);
      } else {
        showToast(t("subAgents.messages.updateError", { error }), "error");
      }
    } else {
      const { success, subAgent, error } = await SubAgentsModel.create(formData);
      if (success) {
        setSubAgents((prev) => [subAgent, ...prev]);
        showToast(t("subAgents.messages.created"), "success");
        setOpenModal(false);
      } else {
        showToast(t("subAgents.messages.createError", { error }), "error");
      }
    }
  };

  const getTypeLabel = (type, kind) =>
    t(`subAgents.${kind === "input" ? "inputTypes" : "outputTypes"}.${type}`, type);

  const getTypeIcon = (type) => {
    switch (type) {
      case "image":
      case "text+image":
        return <Image className="w-5 h-5 text-purple-400" />;
      case "audio":
      case "text+audio":
        return <MusicNotes className="w-5 h-5 text-blue-400" />;
      case "video":
        return <FilmStrip className="w-5 h-5 text-pink-400" />;
      default:
        return <TextT className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex bg-theme-bg-container text-white">
      <SettingsSidebar />
      <div className="flex-1 h-full overflow-y-auto p-4 md:p-8 flex flex-col justify-start">
        <div className="w-full flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Robot className="w-8 h-8 text-sky-400" />
              {t("subAgents.title")}
            </h1>
            <p className="text-sm text-theme-text-secondary mt-1">
              {t("subAgents.description")}
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-medium transition-all shadow-md active:scale-95"
          >
            <Plus className="w-5 h-5" />
            {t("subAgents.addButton")}
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Skeleton.default count={3} height={120} className="rounded-xl" />
          </div>
        ) : subAgents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-theme-bg-sidebar border border-theme-sidebar-border rounded-2xl max-w-xl mx-auto w-full shadow-inner mt-10">
            <Brain className="w-16 h-16 text-sky-400/50 mb-4 animate-pulse" />
            <h3 className="text-lg font-semibold mb-2">
              {t("subAgents.empty.title")}
            </h3>
            <p className="text-sm text-theme-text-secondary text-center mb-6">
              {t("subAgents.empty.description")}
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 rounded-lg font-semibold transition-all active:scale-95"
            >
              {t("subAgents.empty.getStarted")}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {subAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex flex-col justify-between p-5 bg-theme-bg-sidebar/50 backdrop-blur-md border border-theme-sidebar-border rounded-2xl hover:border-sky-500/50 transition-all shadow-lg group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-sky-300 flex items-center gap-2">
                      <Robot className="w-6 h-6" />
                      {agent.name}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEdit(agent)}
                        className="p-1.5 hover:bg-theme-bg-secondary rounded-lg transition-colors"
                        title={t("subAgents.card.edit")}
                      >
                        <PencilSimple className="w-5 h-5 text-theme-text-secondary hover:text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(agent.uuid)}
                        className="p-1.5 hover:bg-red-950/30 rounded-lg transition-colors"
                        title={t("subAgents.card.delete")}
                      >
                        <Trash className="w-5 h-5 text-red-500 hover:text-red-400" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-theme-text-secondary line-clamp-2 mb-4">
                    {agent.description || t("subAgents.card.noDescription")}
                  </p>

                  <div className="flex flex-wrap gap-2 text-xs mb-3">
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-theme-bg-secondary rounded-full border border-theme-sidebar-border">
                      {t("subAgents.card.input")}: {getTypeIcon(agent.input_type)}{" "}
                      {getTypeLabel(agent.input_type, "input")}
                    </span>
                    <span className="flex items-center gap-1 px-2.5 py-1 bg-theme-bg-secondary rounded-full border border-theme-sidebar-border">
                      {t("subAgents.card.output")}: {getTypeIcon(agent.output_type)}{" "}
                      {getTypeLabel(agent.output_type, "output")}
                    </span>
                  </div>

                  <div className="text-xs text-theme-text-secondary bg-theme-bg-secondary/40 p-2.5 rounded-lg border border-theme-sidebar-border/30">
                    <div className="font-semibold text-white/60 mb-0.5">
                      {t("subAgents.card.modelPreference")}
                    </div>
                    <div className="truncate font-mono text-sky-400/80">{agent.model}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dynamic Premium Modal */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-theme-bg-sidebar border border-theme-sidebar-border w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
              <div className="p-6 border-b border-theme-sidebar-border flex justify-between items-center bg-theme-bg-sidebar/90">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Robot className="w-6 h-6 text-sky-400" />
                  {editingAgent
                    ? t("subAgents.modal.editTitle", { name: editingAgent.name })
                    : t("subAgents.modal.createTitle")}
                </h2>
                <button
                  onClick={() => setOpenModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-theme-text-primary mb-1">
                    {t("subAgents.modal.agentName")}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t("subAgents.modal.agentNamePlaceholder")}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-theme-text-primary mb-1">
                    {t("subAgents.modal.description")}
                  </label>
                  <textarea
                    required
                    placeholder={t("subAgents.modal.descriptionPlaceholder")}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="w-full bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-theme-text-primary mb-1">
                      {t("subAgents.modal.inputType")}
                    </label>
                    <select
                      value={formData.input_type}
                      onChange={(e) => setFormData({ ...formData, input_type: e.target.value })}
                      className="w-full bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="text">{t("subAgents.inputTypes.text")}</option>
                      <option value="text+image">
                        {t("subAgents.inputTypes.text+image")}
                      </option>
                      <option value="text+audio">
                        {t("subAgents.inputTypes.text+audio")}
                      </option>
                      <option value="video">{t("subAgents.inputTypes.video")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-theme-text-primary mb-1">
                      {t("subAgents.modal.outputType")}
                    </label>
                    <select
                      value={formData.output_type}
                      onChange={(e) => setFormData({ ...formData, output_type: e.target.value })}
                      className="w-full bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="text">{t("subAgents.outputTypes.text")}</option>
                      <option value="image">{t("subAgents.outputTypes.image")}</option>
                      <option value="audio">{t("subAgents.outputTypes.audio")}</option>
                      <option value="video">{t("subAgents.outputTypes.video")}</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-theme-text-primary mb-1">
                      {t("subAgents.modal.modelProvider")}
                    </label>
                    <select
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value, model: "" })}
                      className="w-full bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500"
                    >
                      <option value="openrouter">OpenRouter</option>
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="gemini">Google Gemini</option>
                      <option value="groq">Groq</option>
                      <option value="ollama">{t("subAgents.providers.ollama")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-theme-text-primary mb-1 flex items-center gap-1.5">
                      {t("subAgents.modal.model")}
                      {fetchingModels && <div className="w-3.5 h-3.5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>}
                    </label>
                    <select
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      disabled={fetchingModels}
                      className="w-full bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500 disabled:opacity-55"
                    >
                      <option value="">{t("subAgents.modal.selectModel")}</option>
                      {filteredModels.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name || m.id}
                        </option>
                      ))}
                    </select>
                    {formData.provider === "openrouter" && filteredModels.length === 0 && !fetchingModels && (
                      <p className="text-xs text-amber-400 mt-1">
                        ⚠️ {t("subAgents.modal.noMatchingModels")}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-theme-text-primary mb-1">
                    {t("subAgents.modal.systemPrompt")}
                  </label>
                  <textarea
                    required
                    placeholder={t("subAgents.modal.systemPromptPlaceholder")}
                    value={formData.system_prompt}
                    onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                    rows={4}
                    className="w-full bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg px-3.5 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-theme-sidebar-border">
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="px-5 py-2 bg-theme-bg-secondary hover:bg-theme-bg-secondary/80 rounded-lg text-theme-text-primary transition-colors"
                  >
                    {t("subAgents.modal.cancel")}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-sky-600 hover:bg-sky-500 rounded-lg text-white font-semibold transition-all shadow-md active:scale-95"
                  >
                    {t("subAgents.modal.save")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
