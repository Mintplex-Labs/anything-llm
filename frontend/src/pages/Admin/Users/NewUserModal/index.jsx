import React, { useState } from "react";
import { X } from "@phosphor-icons/react";
import Admin from "@/models/admin";
import { userFromStorage } from "@/utils/request";
import { MessageLimitInput, RoleHintDisplay } from "..";
import { ROLE_LABELS } from "../constants";
import { useTranslation } from "react-i18next";
import {
  USERNAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_PATTERN,
} from "@/utils/username";

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
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              Thêm người dùng vào phiên bản
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div className="p-6">
          <form onSubmit={handleCreate}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Tên đăng nhập
                </label>
                <input
                  name="username"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="Tên đăng nhập của người dùng"
                  minLength={USERNAME_MIN_LENGTH}
                  maxLength={USERNAME_MAX_LENGTH}
                  pattern={USERNAME_PATTERN}
                  required={true}
                  autoComplete="off"
                />
                <p className="mt-2 text-xs text-white/60">
                  {t("common.username_requirements")}
                </p>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Mật khẩu
                </label>
                <input
                  name="password"
                  type="text"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="Mật khẩu ban đầu của người dùng"
                  required={true}
                  autoComplete="off"
                  minLength={8}
                />
                <p className="mt-2 text-xs text-white/60">
                  Mật khẩu phải có ít nhất 8 ký tự
                </p>
              </div>
              <div>
                <label
                  htmlFor="bio"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Tiểu sử
                </label>
                <textarea
                  name="bio"
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="Tiểu sử của người dùng"
                  autoComplete="off"
                  rows={3}
                />
              </div>
              <div>
                <label
                  htmlFor="role"
                  className="block mb-2 text-sm font-medium text-white"
                >
                  Vai trò
                </label>
                <select
                  name="role"
                  required={true}
                  defaultValue={"default"}
                  onChange={(e) => setRole(e.target.value)}
                  className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                >
                  <option value="default">{ROLE_LABELS.default}</option>
                  <option value="manager">{ROLE_LABELS.manager}</option>
                  {user?.role === "admin" && (
                    <option value="admin">{ROLE_LABELS.admin}</option>
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
              {error && <p className="text-red-400 text-sm">Lỗi: {error}</p>}
              <p className="text-white text-xs md:text-sm">
                Sau khi tạo, người dùng cần đăng nhập bằng thông tin ban đầu để
                được cấp quyền truy cập.
              </p>
            </div>
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                Thêm người dùng
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
