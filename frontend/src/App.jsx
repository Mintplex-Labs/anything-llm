import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ContextWrapper } from "./AuthContext";
import PrivateRoute, { AdminRoute } from "./components/PrivateRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = lazy(() => import("./pages/Main"));
const InvitePage = lazy(() => import("./pages/Invite"));
const WorkspaceChat = lazy(() => import("./pages/WorkspaceChat"));
const AdminUsers = lazy(() => import("./pages/Admin/Users"));
const AdminInvites = lazy(() => import("./pages/Admin/Invitations"));
const AdminWorkspaces = lazy(() => import("./pages/Admin/Workspaces"));
const AdminChats = lazy(() => import("./pages/Admin/Chats"));
const AdminSystem = lazy(() => import("./pages/Admin/System"));
const AdminAppearance = lazy(() => import("./pages/Admin/Appearance"));
const AdminApiKeys = lazy(() => import("./pages/Admin/ApiKeys"));

export default function App() {
  return (
    <Suspense fallback={<div />}>
      <ContextWrapper>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route
            path="/workspace/:slug"
            element={<PrivateRoute Component={WorkspaceChat} />}
          />
          <Route path="/accept-invite/:code" element={<InvitePage />} />

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
          <Route
            path="/admin/workspace-chats"
            element={<AdminRoute Component={AdminChats} />}
          />
          <Route
            path="/admin/appearance"
            element={<AdminRoute Component={AdminAppearance} />}
          />
          <Route
            path="/admin/api-keys"
            element={<AdminRoute Component={AdminApiKeys} />}
          />
        </Routes>
        <ToastContainer />
      </ContextWrapper>
    </Suspense>
  );
}
