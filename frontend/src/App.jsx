import React, { Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { ContextWrapper } from "@/AuthContext";
import { READY_EVENT_NAME } from "@/utils/constants";
import i18n from "./i18n";

import PrivateRoute, {
  AdminRoute,
  ManagerRoute,
} from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { PfpProvider } from "./PfpContext";
import { LogoProvider } from "./LogoContext";
import { FullScreenLoader } from "@/components/Preloader";
import AnythingLLMLogo from "./assets/logo/anything-llm-splash.png";
import MintplexLabsLogo from "./assets/logo/mintplexlabs.png";
import Login from "./pages/Login";
import Main from "./pages/Main";
import WorkspaceChat from "./pages/WorkspaceChat";
import GeneralApiKeys from "./pages/GeneralSettings/ApiKeys";
import GeneralChats from "./pages/GeneralSettings/Chats";
import GeneralAppearance from "./pages/GeneralSettings/Appearance";
import GeneralLLMPreference from "./pages/GeneralSettings/LLMPreference";
import GeneralTranscriptionPreference from "./pages/GeneralSettings/TranscriptionPreference";
import GeneralAudioPreference from "./pages/GeneralSettings/AudioPreference";
import GeneralEmbeddingPreference from "./pages/GeneralSettings/EmbeddingPreference";
import EmbeddingTextSplitterPreference from "./pages/GeneralSettings/EmbeddingTextSplitterPreference";
import GeneralVectorDatabase from "./pages/GeneralSettings/VectorDatabase";
import OnboardingFlow from "./pages/OnboardingFlow";
import AdminLogs from "./pages/Admin/Logging";
import AdminAgents from "./pages/Admin/Agents";
import WorkspaceSettings from "./pages/WorkspaceSettings";
import PrivacyAndData from "./pages/GeneralSettings/PrivacyAndData";
import ExperimentalFeatures from "@/pages/Admin/ExperimentalFeatures";
import LiveDocumentSyncManage from "@/pages/Admin/ExperimentalFeatures/Features/LiveSync/manage";

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BootLoader>
      <Suspense fallback={<FullScreenLoader />}>
        <ContextWrapper>
          <LogoProvider>
            <PfpProvider>
              <I18nextProvider i18n={i18n}>
                <Routes>
                  <Route path="/" element={<PrivateRoute Component={Main} />} />
                  <Route path="/login" element={<Login />} />
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

                  {/* Manager */}
                  {/* <Route
                  path="/settings/security"
                  element={<ManagerRoute Component={GeneralSecurity} />}
                /> */}
                  <Route
                    path="/settings/appearance"
                    element={<ManagerRoute Component={GeneralAppearance} />}
                  />
                  <Route
                    path="/settings/api-keys"
                    element={<ManagerRoute Component={GeneralApiKeys} />}
                  />
                  <Route
                    path="/settings/workspace-chats"
                    element={<ManagerRoute Component={GeneralChats} />}
                  />

                  {/* <Route
                  path="/settings/system-preferences"
                  element={<ManagerRoute Component={AdminSystem} />}
                /> */}
                  {/* <Route
                  path="/settings/invites"
                  element={<ManagerRoute Component={AdminInvites} />}
                /> */}
                  {/* <Route
                  path="/settings/users"
                  element={<ManagerRoute Component={AdminUsers} />}
                /> */}
                  {/* <Route
                  path="/settings/workspaces"
                  element={<ManagerRoute Component={AdminWorkspaces} />}
                /> */}
                  <Route
                    path="/settings/event-logs"
                    element={<AdminRoute Component={AdminLogs} />}
                  />
                  <Route
                    path="/settings/privacy"
                    element={<AdminRoute Component={PrivacyAndData} />}
                  />

                  <Route
                    path="/settings/beta-features"
                    element={<AdminRoute Component={ExperimentalFeatures} />}
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
                </Routes>
                <ToastContainer />
              </I18nextProvider>
            </PfpProvider>
          </LogoProvider>
        </ContextWrapper>
      </Suspense>
    </BootLoader>
  );
}

function BootLoader({ children }) {
  const [ready, setReady] = useState(false);
  window.addEventListener(READY_EVENT_NAME, () => setReady(true));

  if (ready) return <>{children}</>;
  return (
    <div className="fixed left-0 top-0 z-999999 flex h-screen w-screen bg-fullscreen-loader">
      <div className="flex w-full justify-center items-center flex-col">
        <img src={AnythingLLMLogo} className="w-[317px]" />
        <p className="text-sm text-gray-400 mt-4 animate-pulse">
          loading workspaces...
        </p>
      </div>
      <div className="absolute bottom-[40px] flex w-full justify-center">
        <img src={MintplexLabsLogo} className="w-[244px] h-[61px]" />
      </div>
    </div>
  );
}
