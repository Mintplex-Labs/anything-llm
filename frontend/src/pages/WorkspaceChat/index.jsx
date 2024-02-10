import React, { useEffect, useState } from "react";
import { default as WorkspaceChatContainer } from "../../components/WorkspaceChat";
import Sidebar from "../../components/Sidebar";
import { useParams } from "react-router-dom";
import Workspace from "../../models/workspace";
import PasswordModal, {
  usePasswordModal,
} from "../../components/Modals/Password";

import { FullScreenLoader } from "../../components/Preloader";

export default function WorkspaceChat() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return <ShowWorkspaceChat />;
}

function ShowWorkspaceChat() {
  const { slug, threadSlug = null } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWorkspace() {
      if (!slug) return;
      const _workspace = await Workspace.bySlug(slug);
      if (!_workspace) {
        setLoading(false);
        return;
      }
      const suggestedMessages = await Workspace.getSuggestedMessages(slug);
      setWorkspace({
        ..._workspace,
        suggestedMessages,
      });
      setLoading(false);
    }
    getWorkspace();
  }, [slug, threadSlug]);

  return (
    <div
      style={{ height: "calc(100vh - 40px)" }}
      className="w-screen overflow-hidden bg-sidebar flex"
    >
      <Sidebar />
      <WorkspaceChatContainer loading={loading} workspace={workspace} />
    </div>
  );
}
