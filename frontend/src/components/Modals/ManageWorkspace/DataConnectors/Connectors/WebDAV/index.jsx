import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import DataConnector from "@/models/dataConnector";
import showToast from "@/utils/toast";
import { CheckCircle, Warning, FloppyDisk } from "@phosphor-icons/react";
import System from "@/models/system";

export default function WebDAVConnector({ onSuccess }) {
  const { t } = useTranslation();
  const { refreshWorkspace } = useWorkspaceContext();
  const [formData, setFormData] = useState({
    url: "",
    username: "",
    password: "",
    path: "/",
    recursive: true,
    fileTypes: [],
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [saving, setSaving] = useState(false);

  // Load saved settings on component mount
  useEffect(() => {
    loadSavedSettings();
  }, []);

  // Load saved WebDAV settings
  const loadSavedSettings = async () => {
    try {
      const { settings, error } = await DataConnector.webdav.loadSettings();
      if (error) {
        console.error("Failed to load WebDAV settings:", error);
        return;
      }
      if (settings) {
        setFormData(prev => ({
          ...prev,
          url: settings.url || "",
          username: settings.username || "",
          path: settings.path || "/",
          recursive: settings.recursive !== undefined ? settings.recursive : true,
          fileTypes: settings.fileTypes || [],
        }));
      }
    } catch (error) {
      console.error("Error loading WebDAV settings:", error);
    }
  };

  // Save WebDAV settings
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Debug: Log the form data being sent
      console.log("Saving WebDAV settings:", formData);
      
      // Validate required fields before sending
      if (!formData.url || !formData.username) {
        showToast("URL and username are required", "error");
        return;
      }
      
      const { success, error } = await DataConnector.webdav.saveSettings(formData);
      if (error) {
        showToast(error, "error");
        return;
      }
      if (success) {
        showToast("WebDAV settings saved successfully!", "success");
      }
    } catch (error) {
      console.error("Error saving WebDAV settings:", error);
      showToast("Failed to save WebDAV settings", "error");
    } finally {
      setSaving(false);
    }
  };

  // Test connection handler
  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      // Debug: Log the test connection data
      console.log("Testing WebDAV connection:", {
        url: formData.url,
        username: formData.username,
        password: formData.password ? "***" : "(empty)"
      });
      
      // Validate required fields before testing
      if (!formData.url || !formData.username || !formData.password) {
        setTestResult({ success: false, message: "URL, username, and password are required for testing." });
        setTesting(false);
        return;
      }
      
      const res = await DataConnector.webdav.testConnection({
        url: formData.url,
        username: formData.username,
        password: formData.password,
      });
      
      console.log("Test connection response:", res);
      
      if (res.success) {
        setTestResult({ success: true, message: t("Connection successful!") });
        setFolders(res.folders || []);
      } else {
        setTestResult({ success: false, message: res.error || t("Connection failed.") });
        setFolders([]);
      }
    } catch (e) {
      console.error("Test connection error:", e);
      setTestResult({ success: false, message: e.message || t("Connection failed.") });
      setFolders([]);
    }
    setTesting(false);
  };

  // Folder picker UI
  const renderFolderPicker = () => {
    if (!folders.length) return null;
    return (
      <div style={{ marginTop: 12 }}>
        <label>{t("Select Folder")}</label>
        <select
          value={selectedFolder}
          onChange={e => {
            setSelectedFolder(e.target.value);
            setFormData(prev => ({ ...prev, path: e.target.value }));
          }}
        >
          <option value="/">/</option>
          {folders.map(folder => (
            <option key={folder} value={folder}>{folder}</option>
          ))}
        </select>
      </div>
    );
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileTypeChange = (fileType, checked) => {
    setFormData((prev) => ({
      ...prev,
      fileTypes: checked
        ? [...prev.fileTypes, fileType]
        : prev.fileTypes.filter((type) => type !== fileType),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsConnecting(true);
    try {
      const { data, error } = await DataConnector.webdav.collect(formData);
      if (error) {
        showToast(error, "error");
        return;
      }
      if (data) {
        showToast(t("connectors.webdav.success"), "success");
        await refreshWorkspace();
      }
    } catch (error) {
      console.error("WebDAV connection error:", error);
      showToast(error.message || "Failed to connect to WebDAV server", "error");
    } finally {
      setIsConnecting(false);
    }
  };

  const supportedFileTypes = [
    { value: "pdf", label: "PDF Files" },
    { value: "txt", label: "Text Files" },
    { value: "md", label: "Markdown Files" },
    { value: "docx", label: "Word Documents" },
    { value: "xlsx", label: "Excel Spreadsheets" },
    { value: "csv", label: "CSV Files" },
    { value: "html", label: "HTML Files" },
    { value: "json", label: "JSON Files" },
  ];

  return (
    <div className="w-full">
      <div className="mb-6">
        <h3 className="text-white text-lg font-semibold mb-2">
          {t("connectors.webdav.name")}
        </h3>
        <p className="text-white/60 text-sm">
          {t("connectors.webdav.description")}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* WebDAV URL */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            {t("connectors.webdav.url")}
          </label>
          <input
            type="url"
            required
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            placeholder="https://webdav.example.com"
            className="w-full px-3 py-2 bg-theme-settings-input-bg border border-slate-300/40 rounded-lg text-white placeholder:text-theme-settings-input-placeholder focus:outline-none focus:border-primary-button"
          />
          <p className="text-white/60 text-xs mt-1">
            {t("connectors.webdav.url_explained")}
          </p>
        </div>
        {/* Username */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            {t("connectors.webdav.username")}
          </label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            placeholder="username"
            className="w-full px-3 py-2 bg-theme-settings-input-bg border border-slate-300/40 rounded-lg text-white placeholder:text-theme-settings-input-placeholder focus:outline-none focus:border-primary-button"
          />
        </div>
        {/* Password */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            {t("connectors.webdav.password")}
          </label>
          <input
            type="password"
            required
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="password"
            className="w-full px-3 py-2 bg-theme-settings-input-bg border border-slate-300/40 rounded-lg text-white placeholder:text-theme-settings-input-placeholder focus:outline-none focus:border-primary-button"
          />
        </div>
        {/* Path */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            {t("connectors.webdav.path")}
          </label>
          <input
            type="text"
            value={formData.path}
            onChange={(e) => handleInputChange("path", e.target.value)}
            placeholder="/"
            className="w-full px-3 py-2 bg-theme-settings-input-bg border border-slate-300/40 rounded-lg text-white placeholder:text-theme-settings-input-placeholder focus:outline-none focus:border-primary-button"
          />
          <p className="text-white/60 text-xs mt-1">
            {t("connectors.webdav.path_explained")}
          </p>
        </div>
        {/* Recursive Option */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="recursive"
            checked={formData.recursive}
            onChange={(e) => handleInputChange("recursive", e.target.checked)}
            className="w-4 h-4 text-primary-button bg-theme-settings-input-bg border-slate-300/40 rounded focus:ring-primary-button focus:ring-2"
          />
          <label htmlFor="recursive" className="text-white text-sm">
            {t("connectors.webdav.recursive")}
          </label>
        </div>
        <p className="text-white/60 text-xs">
          {t("connectors.webdav.recursive_explained")}
        </p>
        {/* File Types */}
        <div>
          <label className="block text-white text-sm font-medium mb-2">
            {t("connectors.webdav.file_types")}
          </label>
          <div className="flex flex-wrap gap-2">
            {supportedFileTypes.map((type) => (
              <label key={type.value} className="flex items-center space-x-1 text-white text-xs">
                <input
                  type="checkbox"
                  checked={formData.fileTypes.includes(type.value)}
                  onChange={(e) => handleFileTypeChange(type.value, e.target.checked)}
                  className="w-4 h-4 text-primary-button bg-theme-settings-input-bg border-slate-300/40 rounded focus:ring-primary-button focus:ring-2"
                />
                <span>{type.label}</span>
              </label>
            ))}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Save Settings Button */}
          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg flex items-center gap-2"
          >
            <FloppyDisk size={16} />
            {saving ? t("Saving...") : t("Save Settings")}
          </button>
          
          {/* Test Connection Button */}
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >
            {testing ? t("Testing...") : t("Test Connection")}
          </button>
        </div>
        
        {testResult && (
          <div className={`text-sm ${testResult.success ? "text-green-500" : "text-red-500"}`}>
            {testResult.message}
          </div>
        )}
        
        {renderFolderPicker()}
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isConnecting}
            className="px-4 py-2 bg-primary-button text-white rounded-lg w-full"
          >
            {isConnecting ? t("Connecting...") : t("Connect")}
          </button>
        </div>
      </form>
    </div>
  );
} 