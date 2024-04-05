import React, { Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { ContextWrapper } from "./AuthContext";
import { READY_EVENT_NAME } from "./utils/constants";
import PrivateRoute, {
  AdminRoute,
  ManagerRoute,
} from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import { PfpProvider } from "./PfpContext";
import { LogoProvider } from "./LogoContext";
import AnythingLLMLogo from "./assets/logo/anything-llm.png";
import Login from "./pages/Login";
import Main from "./pages/Main";
import WorkspaceChat from "./pages/WorkspaceChat";
import GeneralApiKeys from "./pages/GeneralSettings/ApiKeys";
import GeneralChats from "./pages/GeneralSettings/Chats";
import GeneralAppearance from "./pages/GeneralSettings/Appearance";
import GeneralLLMPreference from "./pages/GeneralSettings/LLMPreference";
import GeneralTranscriptionPreference from "./pages/GeneralSettings/TranscriptionPreference";
import GeneralEmbeddingPreference from "./pages/GeneralSettings/EmbeddingPreference";
import GeneralVectorDatabase from "./pages/GeneralSettings/VectorDatabase";
import OnboardingFlow from "./pages/OnboardingFlow";
import AdminLogs from "./pages/Admin/Logging";
import WorkspaceSettings from "./pages/WorkspaceSettings";
import PrivacyAndData from "./pages/GeneralSettings/PrivacyAndData";

import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BootLoader>
      <Suspense fallback={<div />}>
        <ContextWrapper>
          <LogoProvider>
            <PfpProvider>
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
                  path="/settings/embedding-preference"
                  element={
                    <AdminRoute Component={GeneralEmbeddingPreference} />
                  }
                />
                <Route
                  path="/settings/vector-database"
                  element={<AdminRoute Component={GeneralVectorDatabase} />}
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
                {/* Onboarding Flow */}
                <Route path="/onboarding" element={<OnboardingFlow />} />
                <Route path="/onboarding/:step" element={<OnboardingFlow />} />
              </Routes>
              <ToastContainer />
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
    <div className="fixed left-0 top-0 z-999999 flex h-screen w-screen items-center justify-center bg-sidebar">
      <div className="flex flex-col gap-y-1 items-center">
        <img src={AnythingLLMLogo} className="w-[50%]" />
        <p className="text-xs text-white">by Mintplex Labs Inc</p>
        <p className="text-xs text-gray-400 mt-4  animate-pulse">
          loading workspaces...
        </p>
      </div>
    </div>
  );
}
