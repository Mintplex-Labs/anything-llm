import { useState, useEffect, useRef } from "react";
import { X, CaretUpDown, MagnifyingGlass } from "@phosphor-icons/react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import DynamicConfigForm from "../DynamicConfigForm";
import { PROVIDER_CONFIGS } from "./providerConfigs";

export default function ConnectionModal({ connection, closeModal, onSuccess }) {
  const isEditing = !!connection;
  const [loading, setLoading] = useState(false);
  const [connectionTestSuccess, setConnectionTestSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    provider: "litellm",
    config: {},
    isDefault: false,
  });

  useEffect(() => {
    if (connection) {
      setFormData({
        name: connection.name || "",
        provider: connection.provider || "litellm",
        config: connection.config || {},
        isDefault: connection.isDefault || false,
      });
      // When editing, we assume the connection is already valid
      setConnectionTestSuccess(true);
    } else {
      // For new connections, default name to provider label
      const defaultProvider = "litellm";
      setFormData({
        name: PROVIDER_CONFIGS[defaultProvider]?.label || "",
        provider: defaultProvider,
        config: {},
        isDefault: false,
      });
    }
  }, [connection]);

  const handleProviderChange = (newProvider) => {
    setSearchQuery("");
    setSearchMenuOpen(false);
    setFormData((prev) => ({
      ...prev,
      provider: newProvider,
      config: {},
      // Update name to provider label if it's still the default
      name: PROVIDER_CONFIGS[newProvider]?.label || prev.name,
    }));
  };

  function handleXButton() {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  }

  const filteredProviders = Object.entries(PROVIDER_CONFIGS).filter(([_, config]) =>
    config.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConnectionStatusChange = (status) => {
    setConnectionTestSuccess(status?.success || false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { connection: savedConnection, error } = isEditing
        ? await System.llmConnections.update(connection.id, formData)
        : await System.llmConnections.create(formData);

      if (error) {
        showToast(
          `Error ${isEditing ? "updating" : "creating"} connection: ${error}`,
          "error"
        );
      } else {
        showToast(
          `Connection ${isEditing ? "updated" : "created"} successfully`,
          "success"
        );
        onSuccess();
        closeModal();
      }
    } catch (err) {
      showToast(
        `Error ${isEditing ? "updating" : "creating"} connection: ${
          err.message
        }`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfigChange = (config) => {
    setFormData((prev) => ({ ...prev, config }));
  };

  const providerConfig = PROVIDER_CONFIGS[formData.provider];

  return (
    <div className="relative w-full max-w-2xl max-h-full">
      <div className="relative bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="flex items-start justify-between p-4 border-b rounded-t border-theme-modal-border">
          <h3 className="text-xl font-semibold text-theme-text-primary">
            {isEditing ? "Edit" : "Create"} LLM Connection
          </h3>
          <button
            onClick={closeModal}
            type="button"
            className="text-theme-text-secondary bg-transparent hover:border-theme-text-primary rounded-lg text-sm p-1.5 ml-auto inline-flex items-center bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          >
            <X className="text-theme-text-secondary text-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-6 max-h-[calc(100vh-300px)] overflow-y-auto">
            {/* Provider Selection */}
            <div>
              <label className="block mb-2 text-sm font-medium text-theme-text-primary">
                Provider *
              </label>
              <div className="relative">
                {searchMenuOpen && !isEditing && (
                  <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10"
                    onClick={() => setSearchMenuOpen(false)}
                  />
                )}
                {searchMenuOpen && !isEditing ? (
                  <div className="absolute top-0 left-0 w-full max-h-[310px] min-h-[64px] bg-theme-settings-input-bg rounded-lg flex flex-col justify-between cursor-pointer border-2 border-primary-button z-20">
                    <div className="w-full flex flex-col gap-y-1">
                      <div className="flex items-center sticky top-0 z-10 border-b border-[#9CA3AF] mx-4 bg-theme-settings-input-bg">
                        <MagnifyingGlass
                          size={20}
                          weight="bold"
                          className="absolute left-4 z-30 text-theme-text-primary -ml-4 my-2"
                        />
                        <input
                          type="text"
                          name="provider-search"
                          autoComplete="off"
                          placeholder="Search providers"
                          className="border-none -ml-4 my-2 bg-transparent z-20 pl-12 h-[38px] w-full px-4 py-1 text-sm outline-none text-theme-text-primary placeholder:text-theme-text-primary placeholder:font-medium"
                          onChange={(e) => setSearchQuery(e.target.value)}
                          ref={searchInputRef}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") e.preventDefault();
                          }}
                        />
                        <X
                          size={20}
                          weight="bold"
                          className="cursor-pointer text-theme-text-primary hover:text-x-button"
                          onClick={handleXButton}
                        />
                      </div>
                      <div className="flex-1 pl-4 pr-2 flex flex-col gap-y-1 overflow-y-auto white-scrollbar pb-4 max-h-[245px]">
                        {filteredProviders.map(([value, config]) => (
                          <div
                            key={value}
                            onClick={() => handleProviderChange(value)}
                            className={`w-full p-2 rounded-md hover:cursor-pointer hover:bg-theme-bg-secondary ${
                              formData.provider === value ? "bg-theme-bg-secondary" : ""
                            }`}
                          >
                            <div className="flex gap-x-4 items-center">
                              <img
                                src={config.logo}
                                alt={`${config.label} logo`}
                                className="w-10 h-10 rounded-md"
                              />
                              <div className="flex flex-col">
                                <div className="text-sm font-semibold text-theme-text-primary">
                                  {config.label}
                                </div>
                                <div className="mt-1 text-xs text-theme-text-secondary">
                                  {config.description}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full h-[64px] bg-theme-settings-input-bg rounded-lg flex items-center p-[14px] justify-between cursor-pointer border-2 border-transparent hover:border-primary-button transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="button"
                    onClick={() => !isEditing && setSearchMenuOpen(true)}
                    disabled={isEditing}
                  >
                    <div className="flex gap-x-4 items-center">
                      <img
                        src={providerConfig.logo}
                        alt={`${providerConfig.label} logo`}
                        className="w-10 h-10 rounded-md"
                      />
                      <div className="flex flex-col text-left">
                        <div className="text-sm font-semibold text-theme-text-primary">
                          {providerConfig.label}
                        </div>
                        <div className="mt-1 text-xs text-theme-text-secondary">
                          {providerConfig.description}
                        </div>
                      </div>
                    </div>
                    {!isEditing && (
                      <CaretUpDown size={24} weight="bold" className="text-theme-text-primary" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="!mt-2">
              <label className="block mb-2 text-sm font-medium text-theme-text-primary">
                Connection Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder="e.g., Engineering Team LiteLLM"
                required
              />
              <p className="text-xs text-theme-text-secondary mt-1">
                A unique identifier for this connection
              </p>
            </div>

            {/* Dynamic Config Form */}
            <DynamicConfigForm
              provider={formData.provider}
              config={formData.config}
              onChange={handleConfigChange}
              providerConfig={providerConfig}
              onConnectionStatusChange={handleConnectionStatusChange}
              connectionId={connection?.id || null}
            />

            {/* Is Default */}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isDefault: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-blue-600 bg-theme-settings-input-bg border-theme-settings-input-border rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-theme-text-primary">
                Set as default connection for this provider
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t rounded-b border-theme-modal-border">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-theme-text-secondary bg-transparent border border-theme-modal-border rounded-lg hover:bg-theme-bg-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (!isEditing && !connectionTestSuccess)}
              className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title={!isEditing && !connectionTestSuccess ? "Test connection first" : ""}
            >
              {loading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Connection"
                : "Create Connection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
