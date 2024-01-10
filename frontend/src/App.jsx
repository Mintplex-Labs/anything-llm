import React, { Suspense, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Main from "./pages/Main";
import WorkspaceChat from "./pages/WorkspaceChat";
import GeneralChats from "./pages/GeneralSettings/Chats";
import GeneralAppearance from "./pages/GeneralSettings/Appearance";
import GeneralLLMPreference from "./pages/GeneralSettings/LLMPreference";
import GeneralEmbeddingPreference from "./pages/GeneralSettings/EmbeddingPreference";
import GeneralVectorDatabase from "./pages/GeneralSettings/VectorDatabase";
import OnboardingFlow from "./pages/OnboardingFlow";
import DataConnectors from "./pages/GeneralSettings/DataConnectors";
import DataConnectorSetup from "./pages/GeneralSettings/DataConnectors/Connectors";

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
                  path="/workspace/:slug"
                  element={<PrivateRoute Component={WorkspaceChat} />}
                />

                {/* Admin */}
                <Route
                  path="/settings/llm-preference"
                  element={<AdminRoute Component={GeneralLLMPreference} />}
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
                {/* <Route
                  path="/settings/api-keys"
                  element={<ManagerRoute Component={GeneralApiKeys} />}
                /> */}
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
                  path="/settings/data-connectors"
                  element={<ManagerRoute Component={DataConnectors} />}
                />
                <Route
                  path="/settings/data-connectors/:connector"
                  element={<ManagerRoute Component={DataConnectorSetup} />}
                />
                {/* Onboarding Flow */}
                <Route path="/onboarding" element={<OnboardingFlow />} />
                <Route path="/onboarding/:step" element={<OnboardingFlow />} />

                <Route path="*" element={<Navigate replace to="/" />} />
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
