import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ContextWrapper } from "./AuthContext";
import PrivateRoute, {
  AdminRoute,
  ManagerRoute,
} from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";

const Main = lazy(() => import("./pages/Main"));
const InvitePage = lazy(() => import("./pages/Invite"));
const WorkspaceChat = lazy(() => import("./pages/WorkspaceChat"));
const AdminUsers = lazy(() => import("./pages/Admin/Users"));
const AdminInvites = lazy(() => import("./pages/Admin/Invitations"));
const AdminWorkspaces = lazy(() => import("./pages/Admin/Workspaces"));
const AdminSystem = lazy(() => import("./pages/Admin/System"));
const GeneralChats = lazy(() => import("./pages/GeneralSettings/Chats"));
const GeneralAppearance = lazy(() =>
  import("./pages/GeneralSettings/Appearance")
);
const GeneralApiKeys = lazy(() => import("./pages/GeneralSettings/ApiKeys"));

const GeneralLLMPreference = lazy(() =>
  import("./pages/GeneralSettings/LLMPreference")
);
const GeneralEmbeddingPreference = lazy(() =>
  import("./pages/GeneralSettings/EmbeddingPreference")
);
const GeneralVectorDatabase = lazy(() =>
  import("./pages/GeneralSettings/VectorDatabase")
);
const GeneralExportImport = lazy(() =>
  import("./pages/GeneralSettings/ExportImport")
);
const GeneralSecurity = lazy(() => import("./pages/GeneralSettings/Security"));

const OnboardingFlow = lazy(() => import("./pages/OnboardingFlow"));

export default function App() {
  return (
    <Suspense fallback={<div />}>
      <ContextWrapper>
        <Routes>
          <Route path="/" element={<PrivateRoute Component={Main} />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/workspace/:slug"
            element={<PrivateRoute Component={WorkspaceChat} />}
          />
          <Route path="/accept-invite/:code" element={<InvitePage />} />

          {/* Admin */}
          <Route
            path="/settings/llm-preference"
            element={<AdminRoute Component={GeneralLLMPreference} />}
          />
          <Route
            path="/settings/embedding-preference"
            element={<AdminRoute Component={GeneralEmbeddingPreference} />}
          />
          <Route
            path="/settings/vector-database"
            element={<AdminRoute Component={GeneralVectorDatabase} />}
          />
          {/* Manager */}
          <Route
            path="/settings/export-import"
            element={<ManagerRoute Component={GeneralExportImport} />}
          />
          <Route
            path="/settings/security"
            element={<ManagerRoute Component={GeneralSecurity} />}
          />
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
        </Routes>
        <ToastContainer />
      </ContextWrapper>
    </Suspense>
  );
}
