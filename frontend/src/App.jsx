import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ContextWrapper } from "./AuthContext";
import PrivateRoute, { AdminRoute } from "./components/PrivateRoute";
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

          {/* General Routes */}
          <Route
            path="/general/llm-preference"
            element={<PrivateRoute Component={GeneralLLMPreference} />}
          />
          <Route
            path="/general/embedding-preference"
            element={<PrivateRoute Component={GeneralEmbeddingPreference} />}
          />
          <Route
            path="/general/vector-database"
            element={<PrivateRoute Component={GeneralVectorDatabase} />}
          />
          <Route
            path="/general/export-import"
            element={<PrivateRoute Component={GeneralExportImport} />}
          />
          <Route
            path="/general/security"
            element={<PrivateRoute Component={GeneralSecurity} />}
          />
          <Route
            path="/general/appearance"
            element={<PrivateRoute Component={GeneralAppearance} />}
          />
          <Route
            path="/general/api-keys"
            element={<PrivateRoute Component={GeneralApiKeys} />}
          />
          <Route
            path="/general/workspace-chats"
            element={<PrivateRoute Component={GeneralChats} />}
          />

          {/* Admin Routes */}
          <Route
            path="/admin/system-preferences"
            element={<AdminRoute Component={AdminSystem} />}
          />
          <Route
            path="/admin/invites"
            element={<AdminRoute Component={AdminInvites} />}
          />
          <Route
            path="/admin/users"
            element={<AdminRoute Component={AdminUsers} />}
          />
          <Route
            path="/admin/workspaces"
            element={<AdminRoute Component={AdminWorkspaces} />}
          />
          {/* Onboarding Flow */}
          <Route path="/onboarding" element={<OnboardingFlow />} />
        </Routes>
        <ToastContainer />
      </ContextWrapper>
    </Suspense>
  );
}
