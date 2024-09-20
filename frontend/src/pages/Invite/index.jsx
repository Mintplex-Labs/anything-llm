import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FullScreenLoader } from "@/components/Preloader";
import Invite from "@/models/invite";
import NewUserModal from "./NewUserModal";
import ModalWrapper from "@/components/ModalWrapper";
import { useTranslation } from "react-i18next";

export default function InvitePage() {
  const { t } = useTranslation();
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
          message: t("invitePage.noInviteCode"),
        });
        return;
      }
      const { invite, error } = await Invite.checkInvite(code);
      setResult({
        status: invite ? "valid" : "invalid",
        message: error || t("invitePage.invalidInvite"),
      });
    }
    checkInvite();
  }, [code, t]);

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
      <ModalWrapper isOpen={true}>
        <NewUserModal />
      </ModalWrapper>
    </div>
  );
}
