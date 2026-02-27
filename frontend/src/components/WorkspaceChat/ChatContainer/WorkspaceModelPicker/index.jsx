import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import useUser from "@/hooks/useUser";
import { useModal } from "@/hooks/useModal";
import LLMSelectorModal from "../PromptInput/LLMSelector/index";
import SetupProvider from "../PromptInput/LLMSelector/SetupProvider";
import {
  SAVE_LLM_SELECTOR_EVENT,
  PROVIDER_SETUP_EVENT,
} from "../PromptInput/LLMSelector/action";
import Workspace from "@/models/workspace";
import System from "@/models/system";

export default function WorkspaceModelPicker({ workspaceSlug = null }) {
  const { slug: urlSlug } = useParams();
  const slug = urlSlug ?? workspaceSlug;
  const { user } = useUser();
  const [showSelector, setShowSelector] = useState(false);
  const [saved, setSaved] = useState(false);
  const [modelName, setModelName] = useState("");
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const {
    isOpen: isSetupProviderOpen,
    openModal: openSetupProviderModal,
    closeModal: closeSetupProviderModal,
  } = useModal();
  const [config, setConfig] = useState({ settings: {}, provider: null });

  // Fetch current model name for display
  useEffect(() => {
    if (!slug) return;
    Promise.all([Workspace.bySlug(slug), System.keys()]).then(
      ([workspace, systemSettings]) => {
        const model = workspace.chatModel ?? systemSettings?.LLMModel ?? "";
        setModelName(model);
      }
    );
  }, [slug, saved]);

  // Close selector and show saved state when model is saved
  useEffect(() => {
    function handleSave() {
      setShowSelector(false);
      setSaved(true);
    }
    window.addEventListener(SAVE_LLM_SELECTOR_EVENT, handleSave);
    return () =>
      window.removeEventListener(SAVE_LLM_SELECTOR_EVENT, handleSave);
  }, []);

  // Reset saved state after brief display
  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 1500);
    return () => clearTimeout(timer);
  }, [saved]);

  // Handle provider setup request
  useEffect(() => {
    function handleProviderSetup(e) {
      const { provider, settings } = e.detail;
      setConfig({ settings, provider });
      setTimeout(() => openSetupProviderModal(), 300);
    }
    window.addEventListener(PROVIDER_SETUP_EVENT, handleProviderSetup);
    return () =>
      window.removeEventListener(PROVIDER_SETUP_EVENT, handleProviderSetup);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!showSelector) return;
    function handleClickOutside(e) {
      // Don't close if clicking inside a modal overlay
      if (document.querySelector(".backdrop-blur-sm")) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setShowSelector(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSelector]);

  // This feature is disabled for multi-user instances where the user is not an admin
  if (!!user && user.role !== "admin") return null;
  if (!slug) return null;

  return (
    <>
      <div className="hidden md:block absolute top-3 md:top-5 left-3 md:left-4 z-30">
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setShowSelector(!showSelector)}
          className={`group border-none cursor-pointer px-2.5 py-1 rounded-full transition-all ${
            showSelector
              ? "bg-zinc-800 light:bg-slate-200"
              : "hover:bg-zinc-800 light:hover:bg-slate-200"
          }`}
        >
          <span
            className={`text-xs ${
              showSelector
                ? "text-white light:text-slate-800"
                : "text-zinc-500 light:text-slate-500 group-hover:text-white light:group-hover:text-slate-800"
            }`}
          >
            {modelName || "Select Model"}
          </span>
        </button>

        {showSelector && (
          <div
            ref={menuRef}
            className="absolute left-0 top-[34px] bg-zinc-800 light:bg-white border border-zinc-700 light:border-slate-300 rounded-xl shadow-lg w-[620px] overflow-hidden"
          >
            <LLMSelectorModal workspaceSlug={slug} />
          </div>
        )}
      </div>

      <SetupProvider
        isOpen={isSetupProviderOpen}
        closeModal={closeSetupProviderModal}
        postSubmit={() => closeSetupProviderModal()}
        settings={config.settings}
        llmProvider={config.provider}
      />
    </>
  );
}
