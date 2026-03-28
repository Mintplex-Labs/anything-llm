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
          {/* ── Identitaet ── */}
          <SectionGroup title="Identitaet">
            <SettingsSection title="Name" hint="Name des Chatbots (wird im Header und als Assistenten-Name angezeigt).">
              <input
                type="text"
                value={config.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Ihr Online-Berater"
                className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-full border border-white/10"
              />
            </SettingsSection>

            <SettingsSection title="Logo" hint="Wird als Markenlogo und Assistenten-Icon angezeigt.">
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
              <div className="mt-2">
                <input
                  type="text"
                  value={config.logoUrl || ""}
                  onChange={(e) => {
                    updateField("logoUrl", e.target.value || null);
                    if (e.target.value) {
                      setLogoPreview(e.target.value);
                      updateField("logoFilename", null);
                    }
                  }}
                  placeholder="Oder Logo-URL eingeben..."
                  className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-full border border-white/10"
                />
              </div>
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
          </SectionGroup>

          {/* ── Design ── */}
          <SectionGroup title="Design">
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

            <SettingsSection title="Sende-Platzhalter" hint="Platzhaltertext im Eingabefeld.">
              <input
                type="text"
                value={config.sendMessageText}
                onChange={(e) => updateField("sendMessageText", e.target.value)}
                placeholder="Wie kann ich Ihnen helfen?"
                className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-full border border-white/10"
              />
            </SettingsSection>
          </SectionGroup>

          {/* ── Nachrichten ── */}
          <SectionGroup title="Nachrichten">
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
          </SectionGroup>

          {/* ── Erweitert ── */}
          <SectionGroup title="Erweitert">
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

        {/* Live Preview Panel */}
        <div className="w-1/2 overflow-y-auto bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="min-h-full flex flex-col items-center justify-center p-8 gap-4">
            <WidgetPreview config={config} logoPreview={logoPreview} />
          </div>
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

  return (
    <div className={`flex flex-col ${alignClass} gap-3 w-full max-w-[420px]`}>
      {/* Chat Window */}
      <div className="w-full rounded-2xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden bg-white">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-white">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo"
              className="h-8 w-8 rounded object-contain"
            />
          ) : (
            <div
              className="h-8 w-8 rounded flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: accentColor }}
            >
              {name.charAt(0)}
            </div>
          )}
          <span className="text-gray-800 font-medium text-sm">{name}</span>
        </div>

        {/* Chat Area */}
        <div className="p-4 space-y-3 min-h-[340px] bg-white">
          {/* Greeting */}
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-0.5">
              {logoPreview ? (
                <img src={logoPreview} alt="" className="h-6 w-6 rounded object-contain" />
              ) : (
                <div
                  className="h-6 w-6 rounded flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: accentColor }}
                >
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <div className="bg-gray-100 rounded-t-2xl rounded-br-2xl rounded-bl px-4 py-2 text-gray-800 text-sm max-w-[80%]">
              {greeting}
            </div>
          </div>

          {/* Default Messages */}
          {config.defaultMessages?.length > 0 && (
            <div className="flex flex-wrap gap-2 ml-8">
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

          {/* Sample user message */}
          <div className="flex justify-end">
            <div
              className="rounded-t-2xl rounded-bl-2xl rounded-br px-4 py-2 text-white text-sm max-w-[80%]"
              style={{ backgroundColor: accentColor }}
            >
              Wie sind Ihre Oeffnungszeiten?
            </div>
          </div>

          {/* Sample assistant response */}
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 mt-0.5">
              {logoPreview ? (
                <img src={logoPreview} alt="" className="h-6 w-6 rounded object-contain" />
              ) : (
                <div
                  className="h-6 w-6 rounded flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: accentColor }}
                >
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <div className="bg-gray-100 rounded-t-2xl rounded-br-2xl rounded-bl px-4 py-2 text-gray-800 text-sm max-w-[80%]">
              Wir sind{" "}
              <span style={{ color: accentColor, fontWeight: 500 }}>
                Mo-Fr von 8-17 Uhr
              </span>{" "}
              fuer Sie erreichbar.
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-200 bg-white">
          <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2">
            <input
              type="text"
              placeholder={placeholder}
              disabled
              className="flex-1 bg-transparent text-sm text-gray-500 outline-none"
            />
            <div
              className="ml-2 w-7 h-7 rounded-full flex items-center justify-center"
              style={{ backgroundColor: accentColor }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </div>
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
