import React, { useState } from "react";
import Admin from "@/models/admin";
import { MessageLimitInput, RoleHintDisplay } from "../..";
import { AUTH_USER } from "@/utils/constants";
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
  ModalSecondaryButton,
  ModalInput,
  ModalTextarea,
  ModalLabel,
} from "@/components/lib/Modal";

export default function EditUserModal({ currentUser, user, closeModal }) {
  const [role, setRole] = useState(user.role);
  const [error, setError] = useState(null);
  const [messageLimit, setMessageLimit] = useState({
    enabled: user.dailyMessageLimit !== null,
    limit: user.dailyMessageLimit || 10,
  });
  const { t } = useTranslation();

  const handleUpdate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) {
      if (!value || value === null) continue;
      data[key] = value;
    }
    if (messageLimit.enabled) {
      data.dailyMessageLimit = messageLimit.limit;
    } else {
      data.dailyMessageLimit = null;
    }

    const { success, error } = await Admin.updateUser(user.id, data);
    if (success) {
      // Update local storage if we're editing our own user
      if (currentUser && currentUser.id === user.id) {
        currentUser.username = data.username;
        currentUser.bio = data.bio;
        currentUser.role = data.role;
        localStorage.setItem(AUTH_USER, JSON.stringify(currentUser));
      }

      window.location.reload();
    }
    setError(error);
  };

  return (
    <form onSubmit={handleUpdate} className="flex flex-col gap-y-5">
      <ModalHeader title={`Edit ${user.username}`} onClose={closeModal} />
      <ModalBody>
        <ModalInput
          label="Username"
          name="username"
          type="text"
          placeholder="User's username"
          defaultValue={user.username}
          minLength={USERNAME_MIN_LENGTH}
          maxLength={USERNAME_MAX_LENGTH}
          pattern={USERNAME_PATTERN}
          required={true}
          autoComplete="off"
          hint={t("common.username_requirements")}
        />
        <ModalInput
          label="New Password"
          name="password"
          type="text"
          placeholder={`${user.username}'s new password`}
          autoComplete="off"
          minLength={8}
          hint="Password must be at least 8 characters long"
        />
        <ModalTextarea
          label="Bio"
          name="bio"
          placeholder="User's bio"
          defaultValue={user.bio}
          autoComplete="off"
          rows={3}
        />
        <div className="flex flex-col gap-y-1.5 w-full">
          <ModalLabel htmlFor="role">Role</ModalLabel>
          <select
            name="role"
            required={true}
            defaultValue={user.role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-[34px] px-3.5 text-sm rounded-lg outline-none bg-zinc-800 border border-zinc-800 text-zinc-100 light:bg-white light:border-slate-300 light:text-slate-900 focus:border-sky-500 light:focus:border-sky-500"
          >
            <option value="default">Default</option>
            <option value="manager">Manager</option>
            {currentUser?.role === "admin" && (
              <option value="admin">Administrator</option>
            )}
          </select>
          <RoleHintDisplay role={role} />
        </div>
        <MessageLimitInput
          role={role}
          enabled={messageLimit.enabled}
          limit={messageLimit.limit}
          updateState={setMessageLimit}
        />
        {error && <p className="text-red-400 text-sm">Error: {error}</p>}
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton onClick={closeModal} type="button">
          Cancel
        </ModalSecondaryButton>
        <ModalPrimaryButton type="submit">Update user</ModalPrimaryButton>
      </ModalFooter>
    </form>
  );
}
