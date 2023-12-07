import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullScreenLoader } from "@/components/Preloader";
import Invite from "@/models/invite";
import NewUserModal from "./NewUserModal";

export default function InvitePage() {
  const { code } = useParams();
  const [result, setResult] = useState({
    status: "loading",
    message: null,
  });

  useEffect(() => {
    async function checkInvite() {
      if (!code) {
        setResult({
          status: "invalid",
          message: "No invite code provided.",
        });
        return;
      }
      const { invite, error } = await Invite.checkInvite(code);
      setResult({
        status: invite ? "valid" : "invalid",
        message: error,
      });
    }
    checkInvite();
  }, []);

  if (result.status === "loading") {
    return (
      <div className="w-screen h-screen overflow-hidden bg-sidebar flex">
        <FullScreenLoader />
      </div>
    );
  }

  if (result.status === "invalid") {
    return (
      <div className="w-screen h-screen overflow-hidden bg-sidebar flex items-center justify-center">
        <p className="text-red-400 text-lg">{result.message}</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-sidebar flex items-center justify-center">
      <NewUserModal />
    </div>
  );
}
