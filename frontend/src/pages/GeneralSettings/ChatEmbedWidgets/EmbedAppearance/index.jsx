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
  Check,
} from "@phosphor-icons/react";
import showToast from "@/utils/toast";
import CTAButton from "@/components/lib/CTAButton";
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

const DEFAULT_LOGO = "https://www.kufer.de/typo3conf/ext/kubuslayout/Resources/Public/Icons/augenbrauen-3.png";

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
  const [initialConfig, setInitialConfig] = useState({ ...DEFAULT_CONFIG });
  const [activeTab, setActiveTab] = useState("inhalt");
  const [logoPreview, setLogoPreview] = useState(null);

  const hasChanges =
    JSON.stringify(config) !== JSON.stringify(initialConfig);

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
      const loadedConfig = { ...DEFAULT_CONFIG, ...visualConfig };
      setConfig(loadedConfig);
      setInitialConfig(loadedConfig);

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
      setInitialConfig({ ...config });
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
    <div className="w-screen h-screen flex flex-col bg-theme-bg-container overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-6 pr-16 md:pr-24 pt-[2.25rem] pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/settings/embed-chat-widgets")}
            className="text-theme-text-secondary hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg leading-6 font-bold text-white">
              Erscheinungsbild
            </h1>
            <p className="text-xs leading-[18px] font-base text-white text-opacity-60">
              {embed?.workspace?.name || "Embed"}
            </p>
          </div>
        </div>
      </div>

      {/* Content: Settings left, Preview right */}
      <div className="flex flex-1 overflow-hidden">
        {/* Settings Panel */}
        <div className="w-1/2 max-w-[600px] flex flex-col border-r border-white/10">
          {/* Tabs */}
          <div className="flex border-b border-white/10 px-5 pt-3">
            {[
              { id: "inhalt", label: "Inhalt" },
              { id: "design", label: "Aussehen" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? "text-primary-button"
                    : "text-theme-text-secondary hover:text-primary-button/70"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-2 right-2 h-[2px] bg-primary-button rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {activeTab === "design" && (
              <>
                <SettingsSection title="Logo" hint="PNG, JPG, GIF, SVG oder WebP — max. 5 MB, idealerweise quadratisch.">
                  <div className="flex items-center gap-4">
                    <div className="relative group">
                      <img
                        src={logoPreview || DEFAULT_LOGO}
                        alt="Logo"
                        className="h-12 w-12 rounded-lg object-contain bg-white/5 border border-white/10"
                      />
                      {logoPreview && (
                        <button
                          onClick={handleLogoRemove}
                          className="absolute -top-1.5 -right-1.5 bg-theme-bg-container text-theme-text-secondary hover:text-red-400 rounded-full p-0.5 border border-white/10 transition-colors"
                        >
                          <X size={12} weight="bold" />
                        </button>
                      )}
                    </div>
                    <label className="cursor-pointer bg-theme-settings-input-bg text-white text-sm rounded-lg px-4 py-2 border border-white/10 hover:bg-theme-action-menu-item-hover transition-all">
                      {logoPreview ? "Logo ändern" : "Logo hochladen"}
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/gif,image/svg+xml,image/webp"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </SettingsSection>

                <SettingsSection title="Kundenfarbe (Akzentfarbe)" hint="Wird für Buttons, Benutzer-Nachrichten und Links verwendet.">
                  <div className="relative flex items-center bg-theme-settings-input-bg rounded-lg border border-white/10 hover:border-white/25 transition-colors w-44 cursor-pointer">
                    <div className="relative flex-shrink-0 ml-1.5">
                      <div
                        className="w-8 h-8 rounded-md"
                        style={{ backgroundColor: config.accentColor }}
                      />
                      <input
                        type="color"
                        value={config.accentColor}
                        onChange={(e) => updateField("accentColor", e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                    <input
                      type="text"
                      value={config.accentColor}
                      onChange={(e) => updateField("accentColor", e.target.value)}
                      className="bg-transparent text-white text-sm px-2.5 py-2.5 w-full font-mono outline-none"
                      placeholder="#607D8B"
                    />
                  </div>
                </SettingsSection>

                <SettingsSection title="Chat-Icon" hint="Das Icon auf dem Chat-Button.">
                  <div className="flex gap-2.5 flex-wrap">
                    {CHAT_ICONS.map(({ id, label, Icon }) => {
                      const isSelected = config.chatIcon === id;
                      return (
                        <button
                          key={id}
                          onClick={() => updateField("chatIcon", id)}
                          className="flex flex-col items-center gap-1.5 p-1.5 rounded-lg transition-all"
                          title={label}
                        >
                          <div
                            className={`relative w-11 h-11 rounded-full flex items-center justify-center text-white shadow-md transition-all hover:scale-110 ${
                              isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-theme-bg-container" : ""
                            }`}
                            style={{ backgroundColor: config.accentColor || "#607D8B" }}
                          >
                            <Icon size={22} weight="fill" color="#ffffff" />
                          </div>
                          <span className={`text-[10px] transition-colors ${isSelected ? "text-white" : "text-theme-text-secondary"}`}>
                            {label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </SettingsSection>

                <SettingsSection title="Position" hint="Position des Chat-Widgets auf der Webseite.">
                  <div className="flex rounded-lg overflow-hidden border border-white/10 w-fit">
                    {POSITION_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => updateField("position", opt.value)}
                        className={`px-5 py-2 text-sm font-medium transition-all ${
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
              </>
            )}

            {activeTab === "inhalt" && (
              <>
                <SettingsSection title="Name" hint="Name des Chatbots (wird im Header und als Assistenten-Name angezeigt).">
                  <input
                    type="text"
                    value={config.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Ihr Online-Berater"
                    className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-full border border-white/10 focus:border-white/25 focus:outline-none transition-colors"
                  />
                </SettingsSection>

                <SettingsSection title="Begrüßung" hint="Zentrierter Text beim ersten Öffnen des Chats, bevor eine Unterhaltung beginnt.">
                  <textarea
                    value={config.greeting}
                    onChange={(e) => updateField("greeting", e.target.value)}
                    placeholder="Hallo und herzlich willkommen! Wie kann ich Ihnen helfen?"
                    rows={5}
                    className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-full border border-white/10 focus:border-white/25 focus:outline-none resize-none transition-colors"
                  />
                </SettingsSection>

                <SettingsSection title="Platzhalter" hint="Grauer Text im Eingabefeld, bevor der Nutzer tippt.">
                  <input
                    type="text"
                    value={config.sendMessageText}
                    onChange={(e) => updateField("sendMessageText", e.target.value)}
                    placeholder="Wie kann ich Ihnen helfen?"
                    className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-full border border-white/10 focus:border-white/25 focus:outline-none transition-colors"
                  />
                </SettingsSection>

                <SettingsSection title="Startvorschläge" hint="Klickbare Nachrichtenblöcke in der Akzentfarbe, die vor dem ersten Chat angezeigt werden.">
                  <MessageList
                    items={config.defaultMessages || []}
                    onAdd={() => addListItem("defaultMessages")}
                    onUpdate={(i, v) => updateListItem("defaultMessages", i, v)}
                    onRemove={(i) => removeListItem("defaultMessages", i)}
                    placeholder="z.B. Was sind Ihre Öffnungszeiten?"
                  />
                </SettingsSection>

                <SettingsSection title="Willkommensblasen" hint="Sprechblasen neben dem Chat-Button, bevor der Chat geöffnet wird.">
                  <MessageList
                    items={config.chatbotBubblesMessages || []}
                    onAdd={() => addListItem("chatbotBubblesMessages")}
                    onUpdate={(i, v) => updateListItem("chatbotBubblesMessages", i, v)}
                    onRemove={(i) => removeListItem("chatbotBubblesMessages", i)}
                    placeholder="z.B. Hallo! Kann ich Ihnen helfen?"
                  />
                </SettingsSection>

                <SettingsSection title="Support-E-Mail" hint="E-Mail-Adresse für den Support-Link im Chat.">
                  <input
                    type="email"
                    value={config.supportEmail}
                    onChange={(e) => updateField("supportEmail", e.target.value)}
                    placeholder="support@firma.de"
                    className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 w-full border border-white/10 focus:border-white/25 focus:outline-none transition-colors"
                  />
                </SettingsSection>
              </>
            )}
          </div>
          {/* Save Footer — nur bei Änderungen */}
          {hasChanges && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-white/10 bg-theme-bg-container">
              <p className="text-xs font-semibold text-theme-text-secondary">
                Ungespeicherte Änderungen
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setConfig({ ...initialConfig });
                  }}
                  className="text-xs px-4 py-1 font-medium rounded-lg border border-white/10 text-theme-text-secondary hover:text-white hover:bg-white/5 h-[34px] whitespace-nowrap transition-all"
                >
                  Verwerfen
                </button>
                <CTAButton
                  onClick={handleSave}
                  disabled={saving}
                  className="!-mr-0"
                >
                  {saving ? "Speichern..." : "Speichern"}
                </CTAButton>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Panel — fixed, no scroll */}
        <div className="flex-1 overflow-hidden flex items-center justify-center relative"
          style={{
            background: "linear-gradient(135deg, #f0f2f5 0%, #e4e8ec 50%, #dde1e6 100%)",
            backgroundImage: `
              linear-gradient(135deg, #f0f2f5 0%, #e4e8ec 50%, #dde1e6 100%),
              radial-gradient(circle at 20% 80%, rgba(0,0,0,0.02) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(0,0,0,0.02) 0%, transparent 50%)
            `,
          }}
        >
          <WidgetPreview config={config} logoPreview={logoPreview} />
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, hint, children }) {
  return (
    <div>
      <label className="block text-white text-sm font-medium mb-0.5">{title}</label>
      {hint && (
        <p className="text-theme-text-secondary text-xs mb-2.5 leading-relaxed">{hint}</p>
      )}
      {children}
    </div>
  );
}

function MessageList({ items, onAdd, onUpdate, onRemove, placeholder }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2 group">
          <input
            type="text"
            value={item}
            onChange={(e) => onUpdate(index, e.target.value)}
            placeholder={placeholder}
            className="bg-theme-settings-input-bg text-white text-sm rounded-lg px-3 py-2 flex-1 border border-white/10 focus:border-white/25 focus:outline-none transition-colors"
          />
          <button
            onClick={() => onRemove(index)}
            className="text-theme-text-secondary hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash size={15} />
          </button>
        </div>
      ))}
      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 text-theme-text-secondary hover:text-white text-xs px-1 py-1 transition-colors"
      >
        <Plus size={13} weight="bold" />
        Hinzufügen
      </button>
    </div>
  );
}

function WidgetPreview({ config, logoPreview }) {
  const [previewOpen, setPreviewOpen] = useState(true);
  const accentColor = config.accentColor || "#607D8B";
  const name = config.name || "Ihr Online-Berater";
  const logoSrc = logoPreview || DEFAULT_LOGO;
  const greeting =
    config.greeting ||
    "Hallo und herzlich willkommen! Wie kann ich Ihnen helfen?";
  const placeholder = config.sendMessageText || "Wie kann ich Ihnen helfen?";

  const isLeft = config.position?.includes("left");
  const bubbles = config.chatbotBubblesMessages?.filter((m) => m.trim()) || [];
  const btnAlign = isLeft ? "self-start" : "self-end";

  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="w-[370px] flex flex-col items-stretch">
      {/* Chat Window */}
      {previewOpen && (
        <div
          className="w-full rounded-2xl flex flex-col overflow-hidden bg-white"
          style={{
            height: "540px",
            maxHeight: "calc(100vh - 200px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center px-4 h-[64px] flex-shrink-0"
            style={{ borderBottom: "1px solid #E9E9E9" }}
          >
            <div className="flex items-center flex-1 gap-3 min-w-0">
              <img
                src={logoSrc}
                alt="Logo"
                className="h-10 w-10 rounded-lg object-contain flex-shrink-0"
              />
              <span className="text-gray-800 font-semibold text-sm truncate">{name}</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <DotsThreeOutlineVertical size={18} weight="fill" className="text-slate-400" />
              <button onClick={() => setPreviewOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} weight="bold" />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col justify-center px-4 bg-white">
            <div className="text-center text-gray-400 text-[13px] px-2 mb-4 leading-relaxed">
              {greeting}
            </div>
            {config.defaultMessages?.length > 0 && (
              <div className="flex flex-col gap-2">
                {config.defaultMessages
                  .filter((m) => m.trim())
                  .map((msg, i) => (
                    <div
                      key={i}
                      className="rounded-xl px-5 py-3 text-white text-[13px] text-center font-medium"
                      style={{ backgroundColor: accentColor }}
                    >
                      {msg}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="bg-white px-4 pb-3 pt-1 flex-shrink-0">
            <div
              className="flex items-center w-full rounded-2xl"
              style={{ border: "1.5px solid #22262833" }}
            >
              <input
                type="text"
                placeholder={placeholder}
                disabled
                className="flex-1 bg-transparent text-[13px] text-black placeholder:text-slate-800/50 outline-none py-3 px-3.5"
              />
              <Microphone size={20} weight="fill" className="text-[#222628]/35 mr-1.5 flex-shrink-0" />
              <PaperPlaneRight size={20} weight="fill" className="text-[#222628]/35 mr-3 flex-shrink-0" />
            </div>
          </div>
        </div>
      )}

      {/* Willkommensblasen — only when closed */}
      {!previewOpen && bubbles.length > 0 && (
        <div className={`w-[300px] flex flex-col gap-2 mb-3 ${isLeft ? "self-start" : "self-end"}`}>
          {bubbles.map((msg, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl px-4 py-2.5 text-[13px] text-gray-700 w-full"
              style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}
            >
              {msg}
            </div>
          ))}
        </div>
      )}

      {/* Chat Button + Hint — directly below chat window, respects position */}
      <div className={`flex items-center gap-3 mt-4 ${isLeft ? "self-start" : "self-end flex-row-reverse"}`}>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer transition-transform hover:scale-110 flex-shrink-0"
          style={{
            backgroundColor: accentColor,
            boxShadow: `0 4px 14px ${accentColor}40`,
          }}
          onClick={() => setPreviewOpen(!previewOpen)}
        >
          {(() => {
            const match = CHAT_ICONS.find((i) => i.id === config.chatIcon);
            const BtnIcon = match ? match.Icon : ChatCircleDots;
            return <BtnIcon size={24} weight="fill" color="#ffffff" />;
          })()}
        </div>
        <span className="text-xs text-gray-500 select-none whitespace-nowrap">
          Klicken zum {previewOpen ? "Schließen" : "Öffnen"}
        </span>
      </div>
      </div>
    </div>
  );
}
