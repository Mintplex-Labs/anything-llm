import React, { useEffect, useRef, useState } from "react";
import illustration from "@/media/illustrations/create-workspace.png";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import Workspace from "@/models/workspace";
import { useTranslation } from "react-i18next";

export default function CreateWorkspace({
  setHeader,
  setForwardBtn,
  setBackBtn,
}) {
  const { t } = useTranslation();
  const [workspaceName, setWorkspaceName] = useState("");
  const navigate = useNavigate();
  const createWorkspaceRef = useRef();
  const TITLE = t("onboarding.workspace.title");
  const DESCRIPTION = t("onboarding.workspace.description");

  useEffect(() => {
    setHeader({ title: TITLE, description: DESCRIPTION });
    setBackBtn({ showing: false, disabled: false, onClick: handleBack });
  }, []);

  useEffect(() => {
    setForwardBtn({
      showing: true,
      disabled: workspaceName.length === 0,
      onClick: handleForward,
    });
  }, [workspaceName]);

  const handleCreate = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const { workspace, error } = await Workspace.new({
      name: form.get("name"),
      onboardingComplete: true,
    });
    if (!!workspace) {
      showToast("已成功建立工作區！即將跳轉...", "success");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      navigate(paths.home());
    } else {
      showToast(`⚠️ 建立失敗：${error}`, "error");
    }
  };

  function handleForward() {
    createWorkspaceRef.current.click();
  }

  function handleBack() {
    navigate(paths.onboarding.survey());
  }

  return (
    <form
      onSubmit={handleCreate}
      className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 px-6 py-12 rounded-xl shadow-md"
    >
      <h2 className="text-3xl font-bold text-blue-700 mb-2">
        🎉 歡迎使用鋼鐵材料 AI 助手
      </h2>
      <p className="text-base text-gray-600 mb-6">
        請為您的第一個工作區命名，我們將協助您快速開始使用。
      </p>

      <img
        src={illustration}
        alt="Create workspace"
        className="w-28 h-28 mb-6 rounded-full shadow"
      />

      <div className="flex flex-col gap-y-4 w-full max-w-[600px]">
        <div className="w-full">
          <label
            htmlFor="name"
            className="block mb-2 text-base font-medium text-blue-800"
          >
            工作區名稱
          </label>
          <input
            name="name"
            type="text"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none placeholder-gray-400 text-sm"
            placeholder="請輸入工作區名稱"
            required={true}
            autoComplete="off"
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        ref={createWorkspaceRef}
        hidden
        aria-hidden="true"
      ></button>
    </form>
  );
}
