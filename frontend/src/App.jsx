import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { ContextWrapper } from "@/AuthContext";
import PrivateRoute, {
  AdminRoute,
  ManagerRoute,
} from "@/components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "@/pages/Login";
import SimpleSSOPassthrough from "@/pages/Login/SSO/simple";
import OnboardingFlow from "@/pages/OnboardingFlow";
import i18n from "./i18n";
import paths from "@/utils/paths";

import { PfpProvider } from "./PfpContext";
import { LogoProvider } from "./LogoContext";
import { FullScreenLoader } from "./components/Preloader";
import { ThemeProvider } from "./ThemeContext";
import KeyboardShortcutsModal from "@/components/Modals/KeyboardShortcutsModal";

const Main = lazy(() => import("@/pages/Main"));
const InvitePage = lazy(() => import("@/pages/Invite"));
const WorkspaceChat = lazy(() => import("@/pages/WorkspaceChat"));
const AdminUsers = lazy(() => import("@/pages/Admin/Users"));
const AdminInvites = lazy(() => import("@/pages/Admin/Invitations"));
const AdminWorkspaces = lazy(() => import("@/pages/Admin/Workspaces"));
const AdminLogs = lazy(() => import("@/pages/Admin/Logging"));
const AdminAgents = lazy(() => import("@/pages/Admin/Agents"));
const GeneralChats = lazy(() => import("@/pages/GeneralSettings/Chats"));
const InterfaceSettings = lazy(
  () => import("@/pages/GeneralSettings/Settings/Interface")
);
const BrandingSettings = lazy(
  () => import("@/pages/GeneralSettings/Settings/Branding")
);

const ChatSettings = lazy(
  () => import("@/pages/GeneralSettings/Settings/Chat")
);

const GeneralApiKeys = lazy(() => import("@/pages/GeneralSettings/ApiKeys"));
const GeneralLLMPreference = lazy(
  () => import("@/pages/GeneralSettings/LLMPreference")
);
const GeneralTranscriptionPreference = lazy(
  () => import("@/pages/GeneralSettings/TranscriptionPreference")
);
const GeneralAudioPreference = lazy(
  () => import("@/pages/GeneralSettings/AudioPreference")
);
const GeneralEmbeddingPreference = lazy(
  () => import("@/pages/GeneralSettings/EmbeddingPreference")
);
const EmbeddingTextSplitterPreference = lazy(
  () => import("@/pages/GeneralSettings/EmbeddingTextSplitterPreference")
);
const GeneralVectorDatabase = lazy(
  () => import("@/pages/GeneralSettings/VectorDatabase")
);
const GeneralSecurity = lazy(() => import("@/pages/GeneralSettings/Security"));
const GeneralBrowserExtension = lazy(
  () => import("@/pages/GeneralSettings/BrowserExtensionApiKey")
);
const WorkspaceSettings = lazy(() => import("@/pages/WorkspaceSettings"));
const EmbedConfigSetup = lazy(
  () => import("@/pages/GeneralSettings/EmbedConfigs")
);
const EmbedChats = lazy(() => import("@/pages/GeneralSettings/EmbedChats"));
const PrivacyAndData = lazy(
  () => import("@/pages/GeneralSettings/PrivacyAndData")
);
const ExperimentalFeatures = lazy(
  () => import("@/pages/Admin/ExperimentalFeatures")
);
const LiveDocumentSyncManage = lazy(
  () => import("@/pages/Admin/ExperimentalFeatures/Features/LiveSync/manage")
);
const AgentBuilder = lazy(() => import("@/pages/Admin/AgentBuilder"));
const CommunityHubTrending = lazy(
  () => import("@/pages/GeneralSettings/CommunityHub/Trending")
);
const CommunityHubAuthentication = lazy(
  () => import("@/pages/GeneralSettings/CommunityHub/Authentication")
);
const CommunityHubImportItem = lazy(
  () => import("@/pages/GeneralSettings/CommunityHub/ImportItem")
);
const SystemPromptVariables = lazy(
  () => import("@/pages/Admin/SystemPromptVariables")
);

export default function App() {
  const navigate = useNavigate();

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Detect platform
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      
      // Skip if user is typing in an input field
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }
      
      // Settings shortcuts
      // macOS: Cmd+, (Command + comma)
      if (isMac && e.key === "," && e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(paths.settings.interface());
        return;
      }
      
      // Windows/Linux: Ctrl+, (Control + comma) - standard behavior
      if (!isMac && e.key === "," && e.ctrlKey && !e.metaKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(paths.settings.interface());
        return;
      }

      // Alternative Windows shortcut: Windows key + I (if specifically requested)
      // Note: Windows key maps to metaKey on Windows
      if (!isMac && e.key === "i" && e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(paths.settings.interface());
        return;
      }

      // Home navigation - Ctrl/Cmd + H
      if (e.key === "h" && (isMac ? e.metaKey : e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(paths.home());
        return;
      }

      // Workspaces management - Ctrl/Cmd + W
      if (e.key === "w" && (isMac ? e.metaKey : e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(paths.settings.workspaces());
        return;
      }

      // API Keys - Ctrl/Cmd + K
      if (e.key === "k" && (isMac ? e.metaKey : e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(paths.settings.apiKeys());
        return;
      }

      // LLM Preferences - Ctrl/Cmd + L
      if (e.key === "l" && (isMac ? e.metaKey : e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(paths.settings.llmPreference());
        return;
      }

      // Users management - Ctrl/Cmd + U
      if (e.key === "u" && (isMac ? e.metaKey : e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(paths.settings.users());
        return;
      }

      // Chat settings - Ctrl/Cmd + Shift + C
      if (e.key === "c" && (isMac ? e.metaKey : e.ctrlKey) && e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(paths.settings.chat());
        return;
      }

      // Vector Database settings - Ctrl/Cmd + V
      if (e.key === "v" && (isMac ? e.metaKey : e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(paths.settings.vectorDatabase());
        return;
      }

      // Security settings - Ctrl/Cmd + S
      if (e.key === "s" && (isMac ? e.metaKey : e.ctrlKey) && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(paths.settings.security());
        return;
      }

      // Help/Keyboard shortcuts - Ctrl/Cmd + ? or F1
      if ((e.key === "?" && (isMac ? e.metaKey : e.ctrlKey) && !e.shiftKey && !e.altKey) || 
          e.key === "F1") {
        e.preventDefault();
        // Dispatch custom event to show help modal
        window.dispatchEvent(new CustomEvent('show-keyboard-shortcuts-help'));
        return;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  return (
    <ThemeProvider>
      <Suspense fallback={<FullScreenLoader />}>
        <ContextWrapper>
          <LogoProvider>
            <PfpProvider>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route path="/" element={<PrivateRoute Component={Main} />} />
                  <Route path="/login" element={<Login />} />
                  <Route
                    path="/sso/simple"
                    element={<SimpleSSOPassthrough />}
                  />

                  <Route
                    path="/workspace/:slug/settings/:tab"
                    element={<ManagerRoute Component={WorkspaceSettings} />}
                  />
                  <Route
                    path="/workspace/:slug"
                    element={<PrivateRoute Component={WorkspaceChat} />}
                  />
                  <Route
                    path="/workspace/:slug/t/:threadSlug"
                    element={<PrivateRoute Component={WorkspaceChat} />}
                  />
                  <Route path="/accept-invite/:code" element={<InvitePage />} />

                  {/* Admin */}
                  <Route
                    path="/settings/llm-preference"
                    element={<AdminRoute Component={GeneralLLMPreference} />}
                  />
                  <Route
                    path="/settings/transcription-preference"
                    element={
                      <AdminRoute Component={GeneralTranscriptionPreference} />
                    }
                  />
                  <Route
                    path="/settings/audio-preference"
                    element={<AdminRoute Component={GeneralAudioPreference} />}
                  />
                  <Route
                    path="/settings/embedding-preference"
                    element={
                      <AdminRoute Component={GeneralEmbeddingPreference} />
                    }
                  />
                  <Route
                    path="/settings/text-splitter-preference"
                    element={
                      <AdminRoute Component={EmbeddingTextSplitterPreference} />
                    }
                  />
                  <Route
                    path="/settings/vector-database"
                    element={<AdminRoute Component={GeneralVectorDatabase} />}
                  />
                  <Route
                    path="/settings/agents"
                    element={<AdminRoute Component={AdminAgents} />}
                  />
                  <Route
                    path="/settings/agents/builder"
                    element={
                      <AdminRoute
                        Component={AgentBuilder}
                        hideUserMenu={true}
                      />
                    }
                  />
                  <Route
                    path="/settings/agents/builder/:flowId"
                    element={
                      <AdminRoute
                        Component={AgentBuilder}
                        hideUserMenu={true}
                      />
                    }
                  />
                  <Route
                    path="/settings/event-logs"
                    element={<AdminRoute Component={AdminLogs} />}
                  />
                  <Route
                    path="/settings/embed-config"
                    element={<AdminRoute Component={EmbedConfigSetup} />}
                  />
                  <Route
                    path="/settings/embed-chats"
                    element={<AdminRoute Component={EmbedChats} />}
                  />
                  {/* Manager */}
                  <Route
                    path="/settings/security"
                    element={<ManagerRoute Component={GeneralSecurity} />}
                  />
                  <Route
                    path="/settings/privacy"
                    element={<AdminRoute Component={PrivacyAndData} />}
                  />
                  <Route
                    path="/settings/interface"
                    element={<ManagerRoute Component={InterfaceSettings} />}
                  />
                  <Route
                    path="/settings/branding"
                    element={<ManagerRoute Component={BrandingSettings} />}
                  />
                  <Route
                    path="/settings/chat"
                    element={<ManagerRoute Component={ChatSettings} />}
                  />
                  <Route
                    path="/settings/beta-features"
                    element={<AdminRoute Component={ExperimentalFeatures} />}
                  />
                  <Route
                    path="/settings/api-keys"
                    element={<AdminRoute Component={GeneralApiKeys} />}
                  />
                  <Route
                    path="/settings/system-prompt-variables"
                    element={<AdminRoute Component={SystemPromptVariables} />}
                  />
                  <Route
                    path="/settings/browser-extension"
                    element={
                      <ManagerRoute Component={GeneralBrowserExtension} />
                    }
                  />
                  <Route
                    path="/settings/workspace-chats"
                    element={<ManagerRoute Component={GeneralChats} />}
                  />
                  <Route
                    path="/settings/invites"
                    element={<ManagerRoute Component={AdminInvites} />}
                  />
                  <Route
                    path="/settings/users"
                    element={<ManagerRoute Component={AdminUsers} />}
                  />
                  <Route
                    path="/settings/workspaces"
                    element={<ManagerRoute Component={AdminWorkspaces} />}
                  />
                  {/* Onboarding Flow */}
                  <Route path="/onboarding" element={<OnboardingFlow />} />
                  <Route
                    path="/onboarding/:step"
                    element={<OnboardingFlow />}
                  />

                  {/* Experimental feature pages  */}
                  {/* Live Document Sync feature */}
                  <Route
                    path="/settings/beta-features/live-document-sync/manage"
                    element={<AdminRoute Component={LiveDocumentSyncManage} />}
                  />

                  <Route
                    path="/settings/community-hub/trending"
                    element={<AdminRoute Component={CommunityHubTrending} />}
                  />
                  <Route
                    path="/settings/community-hub/authentication"
                    element={
                      <AdminRoute Component={CommunityHubAuthentication} />
                    }
                  />
                  <Route
                    path="/settings/community-hub/import-item"
                    element={<AdminRoute Component={CommunityHubImportItem} />}
                  />
                </Routes>
                <ToastContainer />
              </I18nextProvider>
            </PfpProvider>
          </LogoProvider>
        </ContextWrapper>
      </Suspense>
      <KeyboardShortcutsModal />
    </ThemeProvider>
  );
}
