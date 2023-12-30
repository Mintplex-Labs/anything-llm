import React, { useEffect, useState } from "react";
import { default as ThreadChatContainer } from "@/components/ThreadChat";
import Sidebar from "@/components/Sidebar";
import { useParams } from "react-router-dom";
import Workspace from "@/models/workspace";
import PasswordModal, { usePasswordModal } from "@/components/Modals/Password";
import { isMobile } from "react-device-detect";
import { FullScreenLoader } from "@/components/Preloader";

export default function ThreadChat() {
  const { loading, requiresAuth, mode } = usePasswordModal();

  if (loading) return <FullScreenLoader />;
  if (requiresAuth !== false) {
    return <>{requiresAuth !== null && <PasswordModal mode={mode} />}</>;
  }

  return <ShowThreadChat />;
}

function ShowThreadChat() {
  const { slug, thread: threadId } = useParams();
  const [workspace, setWorkspace] = useState(null);
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getWorkspaceAndThread() {
      if (!slug || !threadId) return;
      const _workspace = await Workspace.bySlug(slug);
      const _thread = await _workspace.threads.find((t) => t.id === Number(threadId));
      if (!threadId) return;

      setWorkspace(_workspace);
      setThread(_thread);
      setLoading(false);
    }
    getWorkspaceAndThread();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
      {!isMobile && <Sidebar />}
      <ThreadChatContainer loading={loading} workspace={workspace} thread={thread} />
    </div>
  );
}
