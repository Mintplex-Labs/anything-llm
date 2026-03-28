import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FloppyDisk,
  Trash,
  Plus,
  X,
  ChatCircleDots,
  Headset,
  Binoculars,
  MagnifyingGlass,
  MagicWand,
  DotsThreeOutlineVertical,
  PaperPlaneRight,
  Microphone,
  SpeakerHigh,
} from "@phosphor-icons/react";
import showToast from "@/utils/toast";
import Embed from "@/models/embed";
import { API_BASE } from "@/utils/constants";
import { baseHeaders } from "@/utils/request";

const CHAT_ICONS = [
  { id: "chatBubble", label: "Chat-Blase", Icon: ChatCircleDots },
  { id: "support", label: "Support", Icon: Headset },
  { id: "search", label: "Suche", Icon: MagnifyingGlass },
  { id: "search2", label: "Fernglas", Icon: Binoculars },
  { id: "magic", label: "Magie", Icon: MagicWand },
  { id: "plus", label: "Plus", Icon: Plus },
];

const POSITION_OPTIONS = [
  { value: "bottom-left", label: "Links" },
  { value: "bottom-right", label: "Rechts" },
];

const DEFAULT_CONFIG = {
  accentColor: "#607D8B",
  chatIcon: "chatBubble",
  position: "bottom-left",
  name: "",
  greeting: "",
  sendMessageText: "",
  supportEmail: "",
  defaultMessages: [],
  chatbotBubblesMessages: [],
  logoFilename: null,
  logoUrl: null,
};

export default function EmbedAppearance() {
  const { embedId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [embed, setEmbed] = useState(null);
  const [config, setConfig] = useState({ ...DEFAULT_CONFIG });
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    async function load() {
      const embedData = await Embed.getEmbed(embedId);
      if (!embedData) {
        showToast("Einbettung nicht gefunden.", "error");
        navigate("/settings/embed-chat-widgets");
        return;
      }
      setEmbed(embedData);

      let visualConfig = {};
      if (embedData.visual_config) {
        try {
          visualConfig = JSON.parse(embedData.visual_config);
        } catch {}
      }
      setConfig({ ...DEFAULT_CONFIG, ...visualConfig });

      if (visualConfig.logoFilename) {
        setLogoPreview(
          `${API_BASE}/embed/${embedData.uuid}/logo?t=${Date.now()}`
        );
      } else if (visualConfig.logoUrl) {
        setLogoPreview(visualConfig.logoUrl);
      }

      setLoading(false);
    }
    load();
  }, [embedId]);

  const updateField = useCallback((field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { success, error } = await Embed.updateVisualConfig(embedId, config);
    setSaving(false);
    if (success) {
      showToast("Erscheinungsbild gespeichert.", "success");
    } else {
      showToast(error || "Fehler beim Speichern.", "error");
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("logo", file);

    const result = await Embed.uploadEmbedLogo(embedId, formData);
    if (result.success) {
      setLogoPreview(URL.createObjectURL(file));
      setConfig((prev) => ({
        ...prev,
        logoFilename: result.logoFilename,
        logoUrl: null,
      }));
      showToast("Logo hochgeladen.", "success");
    } else {
      showToast(result.error || "Fehler beim Hochladen.", "error");
    }
  };

  const handleLogoRemove = async () => {
    const result = await Embed.removeEmbedLogo(embedId);
    if (result.success) {
      setLogoPreview(null);
      setConfig((prev) => ({
        ...prev,
        logoFilename: null,
        logoUrl: null,
      }));
      showToast("Logo entfernt.", "success");
    }
  };

  const addListItem = (field) => {
    setConfig((prev) => ({
      ...prev,
      [field]: [...(prev[field] || []), ""],
    }));
  };

  const updateListItem = (field, index, value) => {
    setConfig((prev) => {
      const updated = [...(prev[field] || [])];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const removeListItem = (field, index) => {
    setConfig((prev) => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-theme-text-secondary">Laden...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-theme-bg-container overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/settings/embed-chat-widgets")}
            className="text-theme-text-secondary hover:text-white p-1 rounded-lg hover:bg-theme-action-menu-item-hover"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-white text-lg font-semibold">
            Erscheinungsbild: {embed?.workspace?.name || "Embed"}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary-button hover:bg-primary-button-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          <FloppyDisk size={16} />
          {saving ? "Speichern..." : "Speichern"}
        </button>
      </div>

      {/* Content: Settings left, Preview right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Settings Panel */}
        <div className="w-1/2 overflow-y-auto p-6 space-y-6 border-r border-white/10">
          {/* ── Design ── */}
          <SectionGroup title="Design">
            <SettingsSection title="Logo" hint="PNG, JPG, GIF, SVG oder WebP — max. 5 MB, idealerweise quadratisch.">
              <div className="flex items-center gap-4">
                {logoPreview && (
                  <div className="relative">
                    <img
                      src={logoPreview}
                      alt="Logo"
                      className="h-12 w-12 rounded-lg object-contain bg-white/5 border border-white/10"
                    />
                    <button
                      onClick={handleLogoRemove}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
                <label className="cursor-pointer bg-theme-settings-input-bg text-white text-sm rounded-lg px-4 py-2 border border-white/10 hover:bg-theme-action-menu-item-hover transition-colors">
                  {logoPreview ? "Logo aendern" : "Logo hochladen"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </SettingsSection>

            <SettingsSection title="Kundenfarbe (Akzentfarbe)" hint="Wird fuer Buttons, Benutzer-Nachrichten und Links verwendet.">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => updateField("accentColor", e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
                />
                <input
                  type="text"
                  value={config.accentColor}
                  onChange={(e) => updateField("accentColor", e.target.value)}
                  className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-32 border border-white/10"
                  placeholder="#607D8B"
                />
              </div>
            </SettingsSection>

            <SettingsSection title="Chat-Icon" hint="Das Icon auf dem Chat-Button.">
              <div className="flex gap-3 flex-wrap">
                {CHAT_ICONS.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    onClick={() => updateField("chatIcon", id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all ${
                      config.chatIcon === id
                        ? "ring-2 ring-white/50 bg-white/5"
                        : "hover:bg-white/5"
                    }`}
                    title={label}
                  >
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 bg-primary-button"
                    >
                      <Icon size={22} weight="fill" />
                    </div>
                    <span className="text-[10px] text-theme-text-secondary">{label}</span>
                  </button>
                ))}
              </div>
            </SettingsSection>

            <SettingsSection title="Position" hint="Position des Chat-Widgets auf der Webseite.">
              <div className="flex rounded-lg overflow-hidden border border-white/10 w-fit">
                {POSITION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateField("position", opt.value)}
                    className={`px-5 py-2 text-sm font-medium transition-colors ${
                      config.position === opt.value
                        ? "bg-primary-button text-white"
                        : "bg-theme-settings-input-bg text-theme-text-secondary hover:text-white hover:bg-theme-action-menu-item-hover"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </SettingsSection>
          </SectionGroup>

          {/* ── Inhalt ── */}
          <SectionGroup title="Inhalt">
            <SettingsSection title="Name" hint="Name des Chatbots (wird im Header und als Assistenten-Name angezeigt).">
              <input
                type="text"
                value={config.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Ihr Online-Berater"
                className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-full border border-white/10"
              />
            </SettingsSection>

            <SettingsSection title="Begruessung" hint="Willkommensnachricht im Chat-Fenster.">
              <textarea
                value={config.greeting}
                onChange={(e) => updateField("greeting", e.target.value)}
                placeholder="Hallo und herzlich willkommen! Wie kann ich Ihnen helfen?"
                rows={3}
                className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-full border border-white/10 resize-none"
              />
            </SettingsSection>

            <SettingsSection title="Sende-Platzhalter" hint="Platzhaltertext im Eingabefeld.">
              <input
                type="text"
                value={config.sendMessageText}
                onChange={(e) => updateField("sendMessageText", e.target.value)}
                placeholder="Wie kann ich Ihnen helfen?"
                className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-full border border-white/10"
              />
            </SettingsSection>

            <SettingsSection title="Schnellstart-Nachrichten" hint="Klickbare Vorschlaege unter dem Eingabefeld.">
              <MessageList
                items={config.defaultMessages || []}
                onAdd={() => addListItem("defaultMessages")}
                onUpdate={(i, v) => updateListItem("defaultMessages", i, v)}
                onRemove={(i) => removeListItem("defaultMessages", i)}
                placeholder="z.B. Was sind Ihre Oeffnungszeiten?"
              />
            </SettingsSection>

            <SettingsSection title="Willkommens-Bubbles" hint="Automatische Willkommensnachrichten neben dem Chat-Button.">
              <MessageList
                items={config.chatbotBubblesMessages || []}
                onAdd={() => addListItem("chatbotBubblesMessages")}
                onUpdate={(i, v) => updateListItem("chatbotBubblesMessages", i, v)}
                onRemove={(i) => removeListItem("chatbotBubblesMessages", i)}
                placeholder="z.B. Hallo! Kann ich Ihnen helfen?"
              />
            </SettingsSection>

            <SettingsSection title="Support-E-Mail" hint="E-Mail-Adresse fuer den Support-Link im Chat.">
              <input
                type="email"
                value={config.supportEmail}
                onChange={(e) => updateField("supportEmail", e.target.value)}
                placeholder="support@firma.de"
                className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-full border border-white/10"
              />
            </SettingsSection>
          </SectionGroup>
        </div>

        {/* Live Preview Panel — fixed, no scroll */}
        <div className="w-1/2 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-6">
          <WidgetPreview config={config} logoPreview={logoPreview} />
        </div>
      </div>
    </div>
  );
}

function SectionGroup({ title, children }) {
  return (
    <div className="space-y-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-theme-text-secondary border-b border-white/5 pb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SettingsSection({ title, hint, children }) {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-1">{title}</label>
      {hint && (
        <p className="text-theme-text-secondary text-xs mb-2">{hint}</p>
      )}
      {children}
    </div>
  );
}

function MessageList({ items, onAdd, onUpdate, onRemove, placeholder }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
            className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 flex-1 border border-white/10"
          />
          <button
            onClick={() => onRemove(index)}
            className="text-red-400 hover:text-red-300 p-1"
          >
            <Trash size={16} />
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="flex items-center gap-1 text-theme-text-secondary hover:text-white text-sm px-2 py-1"
      >
        <Plus size={14} />
        Hinzufuegen
      </button>
    </div>
  );
}

function WidgetPreview({ config, logoPreview }) {
  const accentColor = config.accentColor || "#607D8B";
  const name = config.name || "Ihr Online-Berater";
  const greeting =
    config.greeting ||
    "Hallo und herzlich willkommen! Wie kann ich Ihnen helfen?";
  const placeholder = config.sendMessageText || "Wie kann ich Ihnen helfen?";

  const isLeft = config.position?.includes("left");
  const alignClass = isLeft ? "items-start" : "items-end";

  const AssistantAvatar = () =>
    logoPreview ? (
      <img src={logoPreview} alt="" className="h-9 w-9 rounded-lg object-contain flex-shrink-0" />
    ) : (
      <div
        className="h-9 w-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: accentColor }}
      >
        {name.charAt(0)}
      </div>
    );

  return (
    <div className={`flex flex-col ${alignClass} gap-4 w-full max-w-[440px]`}>
      {/* Chat Window */}
      <div className="w-full rounded-2xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden bg-white">
        {/* Header — matches real widget */}
        <div
          className="flex items-center relative px-4 h-[64px]"
          style={{ borderBottom: "1px solid #E9E9E9" }}
        >
          <div className="flex items-center flex-1 gap-3">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo"
                className="h-10 w-10 rounded-lg object-contain flex-shrink-0"
              />
            ) : (
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: accentColor }}
              >
                {name.charAt(0)}
              </div>
            )}
            <span className="text-gray-800 font-semibold text-sm truncate">{name}</span>
          </div>
          <div className="flex items-center gap-1">
            <DotsThreeOutlineVertical size={20} weight="fill" className="text-slate-800/60" />
            <X size={20} weight="bold" className="text-slate-800/60" />
          </div>
        </div>

        {/* Chat Area */}
        <div className="p-4 space-y-4 min-h-[320px] bg-white">
          {/* Sample user message */}
          <div className="flex flex-col items-end">
            <div
              className="rounded-t-[18px] rounded-bl-[18px] rounded-br-[4px] px-4 py-[11px] text-white text-sm max-w-[80%]"
              style={{ backgroundColor: accentColor }}
            >
              Wie sind Ihre Oeffnungszeiten?
            </div>
          </div>

          {/* Assistant response */}
          <div>
            <div className="text-[10px] text-gray-400 ml-[48px] mb-1">{name}</div>
            <div className="flex items-start gap-2">
              <AssistantAvatar />
              <div className="rounded-t-[18px] rounded-br-[18px] rounded-bl-[4px] px-4 py-[11px] text-gray-800 text-sm max-w-[80%] shadow-[0_4px_14px_rgba(0,0,0,0.08)]" style={{ backgroundColor: accentColor === "#607D8B" ? "#f3f4f6" : `${accentColor}18` }}>
                {greeting || "Hallo und herzlich willkommen! Wie kann ich Ihnen helfen?"}
                <div className="flex justify-end mt-1">
                  <SpeakerHigh size={14} weight="fill" className="text-slate-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Default Messages */}
          {config.defaultMessages?.length > 0 && (
            <div className="flex flex-wrap gap-2 ml-[48px]">
              {config.defaultMessages
                .filter((m) => m.trim())
                .map((msg, i) => (
                  <button
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {msg}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Input — matches real widget */}
        <div className="bg-white px-4 pb-3 pt-1">
          <div
            className="flex items-center w-full rounded-2xl"
            style={{ border: "1.5px solid #22262833" }}
          >
            <input
              type="text"
              placeholder={placeholder}
              disabled
              className="flex-1 bg-transparent text-sm text-black placeholder:text-slate-800/60 outline-none py-3 px-3"
            />
            <Microphone size={22} weight="fill" className="text-[#222628]/40 mr-1 flex-shrink-0" />
            <PaperPlaneRight size={22} weight="fill" className="text-[#222628]/40 mr-3 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Chat Button — separate, below the window */}
      <div className={`flex ${isLeft ? "flex-row" : "flex-row-reverse"} items-center gap-3`}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg cursor-pointer hover:scale-105 transition-transform"
          style={{ backgroundColor: accentColor }}
        >
          {(() => {
            const match = CHAT_ICONS.find((i) => i.id === config.chatIcon);
            const BtnIcon = match ? match.Icon : ChatCircleDots;
            return <BtnIcon size={24} weight="fill" />;
          })()}
        </div>
        {config.chatbotBubblesMessages?.filter((m) => m.trim()).length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl px-4 py-2 text-sm text-gray-700 shadow-md max-w-[240px]">
            {config.chatbotBubblesMessages.find((m) => m.trim())}
          </div>
        )}
      </div>
    </div>
  );
}
