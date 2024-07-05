import WorkspaceFiles from "@/components/Modals/ManageWorkspace/Documents/WorkspaceFiles";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { FullScreenLoader } from "@/components/Preloader";
import Sidebar from "@/components/Sidebar";
import { default as WorkspaceChatContainer } from "@/components/WorkspaceChat";
import Workspace from "@/models/workspace";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useParams } from "react-router-dom";

export default function WorkspaceChat() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return <ShowWorkspaceChat />;
}

function ShowWorkspaceChat() {
  const { slug } = useParams();
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
      const pfpUrl = await Workspace.fetchPfp(slug);
      setWorkspace({
        ..._workspace,
        suggestedMessages,
        pfpUrl,
      });
      setLoading(false);
    }
    getWorkspace();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      {!isMobile && <Sidebar />}
      <WorkspaceChatContainer loading={loading} workspace={workspace} />
      <WorkspaceFiles workspace={workspace} />
    </div>
  );
}
