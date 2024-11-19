import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
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

import { PfpProvider } from "./PfpContext";
import { LogoProvider } from "./LogoContext";
import { FullScreenLoader } from "./components/Preloader";
import { ThemeProvider } from "./ThemeContext";

const Main = lazy(() => import("@/pages/Main"));
const InvitePage = lazy(() => import("@/pages/Invite"));
const WorkspaceChat = lazy(() => import("@/pages/WorkspaceChat"));
const AdminUsers = lazy(() => import("@/pages/Admin/Users"));
const AdminInvites = lazy(() => import("@/pages/Admin/Invitations"));
const AdminWorkspaces = lazy(() => import("@/pages/Admin/Workspaces"));
const AdminLogs = lazy(() => import("@/pages/Admin/Logging"));
const AdminAgents = lazy(() => import("@/pages/Admin/Agents"));
const GeneralChats = lazy(() => import("@/pages/GeneralSettings/Chats"));
const GeneralAppearance = lazy(
  () => import("@/pages/GeneralSettings/Appearance")
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
const FineTuningWalkthrough = lazy(() => import("@/pages/FineTuning"));

const CommunityHubTrending = lazy(
  () => import("@/pages/GeneralSettings/CommunityHub/Trending")
);
const CommunityHubAuthentication = lazy(
  () => import("@/pages/GeneralSettings/CommunityHub/Authentication")
);
const CommunityHubImportItem = lazy(
  () => import("@/pages/GeneralSettings/CommunityHub/ImportItem")
);

export default function App() {
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
                    path="/settings/appearance"
                    element={<ManagerRoute Component={GeneralAppearance} />}
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
                    path="/fine-tuning"
                    element={<AdminRoute Component={FineTuningWalkthrough} />}
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
    </ThemeProvider>
  );
}
