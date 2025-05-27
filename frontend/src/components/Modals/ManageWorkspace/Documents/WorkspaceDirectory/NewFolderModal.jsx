import { memo, useState } from "react";
import { X } from "@phosphor-icons/react";
import { useTranslation } from "react-i18next";

function NewFolderModal({ onClose, onCreate }) {
  const { t } = useTranslation();
  const [folderName, setFolderName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName.trim()) {
      onCreate(folderName.trim());
    }
  };

  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-99">
      <div
        className="backdrop h-full w-full absolute top-0 z-10"
        onClick={onClose}
      />
      <div className="absolute max-h-full w-fit transition duration-300 z-20 md:overflow-y-auto py-10">
        <div className="relative bg-theme-bg-secondary rounded-[12px] shadow border-2 border-theme-modal-border">
          <div className="flex items-start justify-between p-2 rounded-t border-theme-modal-border relative">
            <button
              onClick={onClose}
              type="button"
              className="z-29 text-white bg-transparent rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
            >
              <X size={20} weight="bold" className="text-white" />
            </button>
          </div>

          <div className="p-6">
            <h3 className="text-white text-lg font-bold mb-4">
              {t("connectors.directory.create-folder")}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="folderName"
                  className="block text-sm font-medium text-white mb-2"
                >
                  {t("connectors.directory.folder-name")}
                </label>
                <input
                  type="text"
                  id="folderName"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="w-full px-3 py-2 bg-theme-settings-input-bg border border-theme-modal-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-button"
                  placeholder={t("connectors.directory.enter-folder-name")}
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-white bg-theme-modal-border rounded-lg hover:bg-opacity-80"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={!folderName.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-button rounded-lg hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("common.create")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(NewFolderModal);
