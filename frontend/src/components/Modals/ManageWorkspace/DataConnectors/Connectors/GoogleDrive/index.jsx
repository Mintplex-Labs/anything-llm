import React, { useState } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { useTranslation } from "react-i18next";
import { FolderOpen, Info } from "@phosphor-icons/react";

export default function GoogleDriveOptions() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [serviceAccountFile, setServiceAccountFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/json") {
      setServiceAccountFile(file);
    } else {
      showToast("Please select a valid JSON service account file.", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);

    if (!serviceAccountFile) {
      showToast("Please select a service account JSON file.", "error");
      return;
    }

    try {
      setLoading(true);
      showToast(
        "Setting up Google Drive integration - this may take a while.",
        "info",
        {
          clear: true,
          autoClose: false,
        }
      );

      // Read the service account file
      const serviceAccountContent = await serviceAccountFile.text();
      const serviceAccountJson = JSON.parse(serviceAccountContent);

      const { data, error } = await System.dataConnectors.googledrive.collect({
        folderId: form.get("folderId"),
        serviceAccount: serviceAccountJson,
        syncFrequency: form.get("syncFrequency"),
        enableAutoSync: form.get("enableAutoSync") === "on",
        includeSubfolders: form.get("includeSubfolders") === "on",
      });

      if (!!error) {
        showToast(error, "error", { clear: true });
        setLoading(false);
        return;
      }

      showToast(
        `Google Drive folder connected successfully! ${data.processedFiles} files processed. Auto-sync is ${
          form.get("enableAutoSync") === "on" ? "enabled" : "disabled"
        }.`,
        "success",
        { clear: true }
      );
      e.target.reset();
      setServiceAccountFile(null);
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
              {/* Google Drive Folder ID */}
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    Google Drive Folder ID
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    The ID of the Google Drive folder you want to sync. You can
                    find this in the folder URL:{" "}
                    <code className="bg-gray-800 px-1 rounded">
                      drive.google.com/drive/folders/YOUR_FOLDER_ID
                    </code>
                  </p>
                </div>
                <input
                  type="text"
                  name="folderId"
                  className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  placeholder="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                  required={true}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              {/* Service Account File Upload */}
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    Service Account JSON File
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    Upload the service account JSON file from Google Cloud
                    Console. This file should have the necessary permissions to
                    access your Google Drive folder.
                  </p>
                </div>
                <div className="flex gap-x-2">
                  <input
                    type="text"
                    value={
                      serviceAccountFile
                        ? serviceAccountFile.name
                        : "No file selected"
                    }
                    className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    placeholder="Select service account JSON file"
                    readOnly
                  />
                  <label className="px-3 py-2 bg-theme-settings-input-bg border border-none rounded-lg text-white hover:bg-theme-settings-input-bg/80 cursor-pointer">
                    <FolderOpen size={20} />
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Sync Configuration */}
              <div className="flex flex-col pr-10">
                <div className="flex flex-col gap-y-1 mb-4">
                  <label className="text-white text-sm font-bold">
                    Sync Frequency
                  </label>
                  <p className="text-xs font-normal text-theme-text-secondary">
                    How often should the Google Drive folder be checked for
                    changes?
                  </p>
                </div>
                <select
                  name="syncFrequency"
                  className="border-none bg-theme-settings-input-bg text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                  defaultValue="daily"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              {/* Options */}
              <div className="flex flex-col pr-10 gap-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="enableAutoSync"
                    id="enableAutoSync"
                    className="mr-2"
                    defaultChecked={true}
                  />
                  <label htmlFor="enableAutoSync" className="text-white text-sm">
                    Enable automatic synchronization
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="includeSubfolders"
                    id="includeSubfolders"
                    className="mr-2"
                    defaultChecked={true}
                  />
                  <label
                    htmlFor="includeSubfolders"
                    className="text-white text-sm"
                  >
                    Include subfolders in sync
                  </label>
                </div>
              </div>

              {/* Information Box */}
              <div className="flex flex-col pr-10">
                <div className="bg-blue-900/20 border border-blue-900/50 rounded-lg p-4">
                  <div className="flex items-start gap-x-2">
                    <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-blue-300">
                      <p className="font-semibold mb-2">Setup Requirements:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          Create a service account in Google Cloud Console
                        </li>
                        <li>
                          Enable Google Drive API for your project
                        </li>
                        <li>
                          Share your Google Drive folder with the service account
                          email
                        </li>
                        <li>Download the service account JSON key file</li>
                      </ul>
                      <p className="mt-2 font-semibold">Supported File Types:</p>
                      <p>
                        Google Docs, Sheets, Slides, PDFs, Images, Text files,
                        and more
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full justify-end">
            <button
              type="submit"
              disabled={loading}
              className="mt-3 text-sm bg-primary-button py-1 px-4 rounded-lg text-white border border-slate-200 disabled:bg-slate-300 disabled:cursor-not-allowed hover:bg-primary-button focus:border-white"
            >
              {loading ? "Connecting..." : "Connect Google Drive"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 