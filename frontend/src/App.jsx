import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ContextWrapper } from "@/AuthContext";
import PrivateRoute, {
  AdminRoute,
  ManagerRoute,
} from "@/components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "@/pages/Login";
import OnboardingFlow from "@/pages/OnboardingFlow";

import { PfpProvider } from "./PfpContext";
import { LogoProvider } from "./LogoContext";

const Main = lazy(() => import("@/pages/Main"));
const InvitePage = lazy(() => import("@/pages/Invite"));
const WorkspaceChat = lazy(() => import("@/pages/WorkspaceChat"));
const AdminUsers = lazy(() => import("@/pages/Admin/Users"));
const AdminInvites = lazy(() => import("@/pages/Admin/Invitations"));
const AdminWorkspaces = lazy(() => import("@/pages/Admin/Workspaces"));
const AdminSystem = lazy(() => import("@/pages/Admin/System"));
const AdminLogs = lazy(() => import("@/pages/Admin/Logging"));
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
const GeneralEmbeddingPreference = lazy(
  () => import("@/pages/GeneralSettings/EmbeddingPreference")
);
const GeneralVectorDatabase = lazy(
  () => import("@/pages/GeneralSettings/VectorDatabase")
);
const GeneralSecurity = lazy(() => import("@/pages/GeneralSettings/Security"));
const WorkspaceSettings = lazy(() => import("@/pages/WorkspaceSettings"));
const EmbedConfigSetup = lazy(
  () => import("@/pages/GeneralSettings/EmbedConfigs")
);
const EmbedChats = lazy(() => import("@/pages/GeneralSettings/EmbedChats"));
const PrivacyAndData = lazy(
  () => import("@/pages/GeneralSettings/PrivacyAndData")
);

export default function App() {
  return (
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
                path="/settings/embedding-preference"
                element={<AdminRoute Component={GeneralEmbeddingPreference} />}
              />
              <Route
                path="/settings/vector-database"
                element={<AdminRoute Component={GeneralVectorDatabase} />}
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
                path="/settings/api-keys"
                element={<AdminRoute Component={GeneralApiKeys} />}
              />
              <Route
                path="/settings/workspace-chats"
                element={<ManagerRoute Component={GeneralChats} />}
              />
              <Route
                path="/settings/system-preferences"
                element={<ManagerRoute Component={AdminSystem} />}
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
              <Route path="/onboarding/:step" element={<OnboardingFlow />} />
            </Routes>
            <ToastContainer />
          </PfpProvider>
        </LogoProvider>
      </ContextWrapper>
    </Suspense>
  );
}
