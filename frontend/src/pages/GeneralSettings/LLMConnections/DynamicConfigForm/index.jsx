export default function DynamicConfigForm({
  provider,
  config,
  onChange,
  providerConfig,
}) {
  if (!providerConfig || !providerConfig.fields) {
    return (
      <div className="text-theme-text-secondary text-sm">
        No configuration fields available for this provider.
      </div>
    );
  }

  const handleFieldChange = (fieldName, value) => {
    onChange({
      ...config,
      [fieldName]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="border-t border-theme-modal-border pt-4">
        <h4 className="text-sm font-semibold text-theme-text-primary mb-4">
          Provider Configuration
        </h4>
        {providerConfig.fields.map((field) => (
          <div key={field.name} className="mb-4">
            <label className="block mb-2 text-sm font-medium text-theme-text-primary">
              {field.label} {field.required && "*"}
            </label>
            {field.type === "password" ? (
              <input
                type="password"
                value={config[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : field.type === "number" ? (
              <input
                type="number"
                value={config[field.name] || ""}
                onChange={(e) =>
                  handleFieldChange(
                    field.name,
                    e.target.value ? parseInt(e.target.value) : ""
                  )
                }
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={field.placeholder}
                required={field.required}
              />
            ) : (
              <input
                type="text"
                value={config[field.name] || ""}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                className="bg-theme-settings-input-bg border border-theme-settings-input-border text-theme-text-primary text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                placeholder={field.placeholder}
                required={field.required}
              />
            )}
            {field.description && (
              <p className="text-xs text-theme-text-secondary mt-1">
                {field.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
