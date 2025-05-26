import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FolderOpen, Info } from "@phosphor-icons/react";
import System from "@/models/system";
import showToast from "@/utils/toast";

export default function ObsidianOptions() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [vaultPath, setVaultPath] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFolderPick = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Filter for .md files only
    const markdownFiles = files.filter((file) => file.name.endsWith(".md"));
    setSelectedFiles(markdownFiles);

    // Set the folder path from the first file
    if (markdownFiles.length > 0) {
      const path = markdownFiles[0].webkitRelativePath.split("/")[0];
      setVaultPath(path);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    try {
      setLoading(true);
      showToast("Importing Obsidian vault - this may take a while.", "info", {
        clear: true,
        autoClose: false,
      });

      // Read all files and prepare them for submission
      const fileContents = await Promise.all(
        selectedFiles.map(async (file) => {
          const content = await file.text();
          return {
            name: file.name,
            path: file.webkitRelativePath,
            content: content,
          };
        })
      );

      const { data, error } = await System.dataConnectors.obsidian.collect({
        files: fileContents,
      });

      if (!!error) {
        showToast(error, "error", { clear: true });
        setLoading(false);
        setSelectedFiles([]);
        setVaultPath("");
        return;
      }

      // Show results
      const successCount = data.processed;
      const failCount = data.failed;
      const totalCount = data.total;

      if (successCount === totalCount) {
        showToast(
          `Successfully imported ${successCount} files from your vault!`,
          "success",
          { clear: true }
        );
      } else {
        showToast(
          `Imported ${successCount} files, ${failCount} failed`,
          "warning",
          { clear: true }
        );
      }

      setLoading(false);
    } catch (e) {
      console.error(e);
      showToast(e.message, "error", { clear: true });
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full">
      <div className="flex flex-col w-full px-1 md:pb-6 pb-16">
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col py-2">
            <div className="w-full flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-x-2 text-white mb-4 bg-blue-800/30 w-fit rounded-lg px-4 py-2">
                <div className="gap-x-2 flex items-center">
                  <Info className="shrink-0" size={25} />
                  <p className="text-sm">
                    {t("connectors.obsidian.vault_warning")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    {t("connectors.obsidian.vault_location")}
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.obsidian.vault_description")}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <input
                    type="text"
                    value={vaultPath}
                    onChange={(e) => setVaultPath(e.target.value)}
                    placeholder="/path/to/your/vault"
                    className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    required={true}
                    autoComplete="off"
                    spellCheck={false}
                    readOnly
                  />
                  <label className="px-3 py-2 bg-theme-settings-input-bg border border-none rounded-lg text-white hover:bg-theme-settings-input-bg/80 cursor-pointer">
                    <FolderOpen size={20} />
                    <input
                      type="file"
                      webkitdirectory=""
                      onChange={handleFolderPick}
                      className="hidden"
                    />
                  </label>
                </div>
                {selectedFiles.length > 0 && (
                  <>
                    <p className="text-xs text-white mt-2 font-bold">
                      {t("connectors.obsidian.selected_files", {
                        count: selectedFiles.length,
                      })}
                    </p>

                    {selectedFiles.map((file, i) => (
                      <p key={i} className="text-xs text-white mt-2">
                        {file.webkitRelativePath}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-2 w-full pr-10">
            <button
              type="submit"
              disabled={loading || selectedFiles.length === 0}
              className="border-none mt-2 w-full justify-center px-4 py-2 rounded-lg text-dark-text light:text-white text-sm font-bold items-center flex gap-x-2 bg-theme-home-button-primary hover:bg-theme-home-button-primary-hover disabled:bg-theme-home-button-primary-hover disabled:cursor-not-allowed"
            >
              {loading
                ? t("connectors.obsidian.importing")
                : t("connectors.obsidian.import_vault")}
            </button>
            {loading && (
              <p className="text-xs text-white/50">
                {t("connectors.obsidian.processing_time")}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
