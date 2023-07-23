import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { ContextWrapper } from "./AuthContext";
import PrivateRoute, { AdminRoute } from "./components/PrivateRoute";

const Main = lazy(() => import("./pages/Main"));
const WorkspaceChat = lazy(() => import("./pages/WorkspaceChat"));
const AdminUsers = lazy(() => import("./pages/Admin/Users"));

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

          {/* Admin Routes */}
          <Route
            path="/admin/users"
            element={<AdminRoute Component={AdminUsers} />}
          />
        </Routes>
      </ContextWrapper>
    </Suspense>
  );
}
