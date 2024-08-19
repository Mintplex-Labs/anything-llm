import React, { useEffect, useState } from "react";
import { default as WorkspaceChatContainer } from "../../components/WorkspaceChat";
import Sidebar from "../../components/Sidebar";
import { useParams } from "react-router-dom";
import Workspace from "../../models/workspace";
import { usePasswordModal } from "../../components/Modals/Password";

import { FullScreenLoader } from "../../components/Preloader";
import { FineTuningAlert } from "../FineTuning/Banner";

export default function WorkspaceChat() {
  const { loading } = usePasswordModal();
  if (loading) return <FullScreenLoader />;
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
      // const pfpUrl = await Workspace.fetchPfp(slug);
      setWorkspace({
        ..._workspace,
        suggestedMessages,
        // pfpUrl,
      });
      setLoading(false);
    }
    getWorkspace();
  }, [slug, threadSlug]);

  return (
    <>
      <div
        style={{ height: "calc(100vh - 40px)" }}
        className="w-screen overflow-hidden bg-sidebar flex"
      >
        <Sidebar />
        <WorkspaceChatContainer loading={loading} workspace={workspace} />
      </div>
      <FineTuningAlert />
    </>
  );
}
