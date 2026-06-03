import React, { useState } from "react";
import Admin from "@/models/admin";
import { userFromStorage } from "@/utils/request";
import { MessageLimitInput, RoleHintDisplay } from "..";
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

export default function NewUserModal({ closeModal }) {
  const [error, setError] = useState(null);
  const [role, setRole] = useState("default");
  const [messageLimit, setMessageLimit] = useState({
    enabled: false,
    limit: 10,
  });
  const { t } = useTranslation();

  const handleCreate = async (e) => {
    setError(null);
    e.preventDefault();
    const data = {};
    const form = new FormData(e.target);
    for (var [key, value] of form.entries()) data[key] = value;
    data.dailyMessageLimit = messageLimit.enabled ? messageLimit.limit : null;

    const { user, error } = await Admin.newUser(data);
    if (!!user) window.location.reload();
    setError(error);
  };

  const user = userFromStorage();

  return (
    <form onSubmit={handleCreate} className="flex flex-col gap-y-5">
      <ModalHeader title="Add user to instance" onClose={closeModal} />
      <ModalBody>
        <ModalInput
          label="Username"
          name="username"
          type="text"
          placeholder="User's username"
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
          type="text"
          placeholder="User's initial password"
          required={true}
          autoComplete="off"
          minLength={8}
          hint="Password must be at least 8 characters long"
        />
        <ModalTextarea
          label="Bio"
          name="bio"
          placeholder="User's bio"
          autoComplete="off"
          rows={3}
        />
        <div className="flex flex-col gap-y-1.5 w-full">
          <ModalLabel htmlFor="role">Role</ModalLabel>
          <select
            name="role"
            required={true}
            defaultValue={"default"}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-[34px] px-3.5 text-sm rounded-lg outline-none bg-zinc-800 border border-zinc-800 text-zinc-100 light:bg-white light:border-slate-300 light:text-slate-900 focus:border-sky-500"
          >
            <option value="default">Default</option>
            <option value="manager">Manager</option>
            {user?.role === "admin" && (
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
        <p className="text-zinc-300 light:text-slate-700 text-xs md:text-sm">
          After creating a user they will need to login with their initial login
          to get access.
        </p>
      </ModalBody>
      <ModalFooter>
        <ModalSecondaryButton onClick={closeModal} type="button">
          Cancel
        </ModalSecondaryButton>
        <ModalPrimaryButton type="submit">Add user</ModalPrimaryButton>
      </ModalFooter>
    </form>
  );
}
