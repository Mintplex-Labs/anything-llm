import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FolderOpen, Info } from "@phosphor-icons/react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { v4 } from "uuid";
import ignore from "ignore";

const BATCH_SIZE = 25;

function chunkFiles(files, maxCount = BATCH_SIZE) {
  const chunks = [];
  let current = [];
  for (const file of files) {
    if (current.length >= maxCount) {
      chunks.push(current);
      current = [];
    }
    current.push(file);
  }
  if (current.length > 0) chunks.push(current);
  return chunks;
}

export default function LocalFolderOptions() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [folderPath, setFolderPath] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFolderPick = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const nonGitFiles = files.filter((f) => {
      const parts = f.webkitRelativePath.split("/");
      return !parts.slice(1).includes(".git");
    });

    const gitSkipped = files.length - nonGitFiles.length;
    if (gitSkipped > 0) {
      console.log(`[LocalFolder]: Excluded .git directory (${gitSkipped} files)`);
    }

    const gitignoreFile = nonGitFiles.find(
      (f) =>
        f.name === ".gitignore" &&
        f.webkitRelativePath.split("/").length === 2
    );

    let gitignoreFilter = null;
    if (gitignoreFile) {
      try {
        const content = await gitignoreFile.text();
        gitignoreFilter = ignore().add(content);
        const ruleCount = content
          .trim()
          .split("\n")
          .filter((l) => l.trim() && !l.trim().startsWith("#"))
          .length;
        console.log(
          `[LocalFolder]: Applied .gitignore (${ruleCount} rules), ` +
          `${files.length} → filtered`
        );
      } catch (err) {
        console.warn("[LocalFolder]: Failed to parse .gitignore:", err);
      }
    }

    let activeFiles = nonGitFiles;
    if (gitignoreFilter) {
      activeFiles = nonGitFiles.filter((f) => {
        const relPath = f.webkitRelativePath.split("/").slice(1).join("/");
        return !gitignoreFilter.ignores(relPath);
      });

      const skipped = nonGitFiles.length - activeFiles.length;
      if (skipped > 0) {
        console.log(`[LocalFolder]: Skipped ${skipped} file(s) via .gitignore`);
      }
    }

    if (activeFiles.length > 0) {
      setSelectedFiles(activeFiles);
      const path = activeFiles[0].webkitRelativePath.split("/")[0];
      setFolderPath(path);
    } else {
      setSelectedFiles([]);
      setFolderPath("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;

    try {
      setLoading(true);
      
      showToast(
        "Importing local folder - this may take a while.", "info", {
          clear: true,
          autoClose: false
      });

      const batchUUId = v4().slice(0, 4);
      const batches = chunkFiles(selectedFiles);
      const totals = { processed: 0, failed: 0, skipped: 0 };
      let stoppedBatch = null;

      for (let b = 0; b < batches.length; b++) {
        const formData = new FormData();
        const filesMeta = [];
        
        batches[b].forEach((file, i) => {
          formData.append("files", file)
          filesMeta.push({
            index: i,
            name: file.name,
            path: file.webkitRelativePath || file.name
          });
          console.log(`[handleSubmit] ${file.webkitRelativePath}`);
        });

        formData.append("files_meta", JSON.stringify(filesMeta));
        formData.append("batch_uuid", batchUUId)

        try {
          const { data, error } = await System.dataConnectors.localFolder.collect(formData);
          if (error) throw new Error(error);
          totals.processed += data.processed || 0;
          totals.failed += data.failed || 0;
          totals.skipped += data.skipped || 0;
        } catch (batchErr) {
          stoppedBatch = b;
          console.error(`Batch ${b + 1}/${batches.length} failed: ${batchErr}`);
          break;
        }

        const done = batches.slice(0, b + 1).reduce((n, c) => n + c.length, 0);
        showToast(
          `Importing files: ${done}/${selectedFiles.length}`,
          "info",
          { autoClose: false, clear: true }
        );
      }

      if (stoppedBatch !== null) {
        showToast(
          `Import stopped at batch ${stoppedBatch + 1}: ${totals.processed}/${selectedFiles.length} files imported`,
          "error",
          { clear: true }
        );
      } else if (totals.failed > 0) {
        showToast(
          `Imported ${totals.processed} files, ${totals.failed} failed`,
          "warning",
          { clear: true }
        );
      } else {
        showToast(
          `Successfully imported ${totals.processed} files from local folder!`,
          "success",
          { clear: true }
        );
      }

      setLoading(false);
      setSelectedFiles([]);
      setFolderPath("");
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
                    {t("connectors.local-folder.folder_warning")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    {t("connectors.local-folder.folder_location")}
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    {t("connectors.local-folder.folder_description")}
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <input
                    type="text"
                    value={folderPath}
                    onChange={(e) => setFolderPath(e.target.value)}
                    placeholder="/path/to/your/folder"
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
                ? t("connectors.local-folder.importing")
                : t("connectors.local-folder.import_folder")}
            </button>
            {loading && (
              <p className="text-xs text-white/50">
                {t("connectors.local-folder.processing_time")}
              </p>
            )}
            {selectedFiles.length > 0 && (
              <>
                <p className="text-xs text-white mt-2 font-bold">
                  {t("connectors.local-folder.selected_files", {
                    count: selectedFiles.length,
                  })}
                </p>

                {selectedFiles.map((file, i) => (
                  <p key={i} className="text-xs text-white mt-2">
                    {file.webkitRelativePath.split("/").slice(1).join("/")}
                  </p>
                ))}
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
