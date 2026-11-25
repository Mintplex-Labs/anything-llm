import React, { useState } from "react";
import Invite from "@/models/invite";
import paths from "@/utils/paths";
import { useParams } from "react-router-dom";
import { AUTH_TOKEN, AUTH_USER } from "@/utils/constants";
import System from "@/models/system";
import { useTranslation } from "react-i18next";
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_PATTERN,
} from "@/utils/username";
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPrimaryButton,
  ModalInput,
} from "@/components/lib/Modal";

export default function NewUserModal() {
  const { code } = useParams();
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    const { success, error } = await Invite.acceptInvite(code, data);
    if (success) {
      const { valid, user, token, message } = await System.requestToken(data);
      if (valid && !!token && !!user) {
        window.localStorage.setItem(AUTH_USER, JSON.stringify(user));
        window.localStorage.setItem(AUTH_TOKEN, token);
        window.location = paths.home();
      } else {
        setError(message);
      }
      return;
    }
    setError(error);
  };

  return (
    <form onSubmit={handleCreate} className="flex flex-col gap-y-5">
      <ModalHeader title="Create a new account" />
      <ModalBody>
        <ModalInput
          label="Username"
          name="username"
          type="text"
          placeholder="My username"
          minLength={USERNAME_MIN_LENGTH}
          maxLength={USERNAME_MAX_LENGTH}
          pattern={USERNAME_PATTERN}
          required={true}
          autoComplete="off"
          hint={t("common.username_requirements")}
        />
        <ModalInput
          label="Password"
          name="password"
          type="password"
          placeholder="Your password"
          required={true}
          minLength={8}
          autoComplete="off"
        />
        {error && <p className="text-red-400 text-sm">Error: {error}</p>}
        <p className="text-zinc-300 light:text-slate-700 text-xs md:text-sm">
          After creating your account you will be able to login with these
          credentials and start using workspaces.
        </p>
      </ModalBody>
      <ModalFooter>
        <ModalPrimaryButton type="submit" className="w-full">
          Accept Invitation
        </ModalPrimaryButton>
      </ModalFooter>
    </form>
  );
}
