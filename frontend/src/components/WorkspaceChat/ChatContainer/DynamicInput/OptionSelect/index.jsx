const OptionSelect = ({ data, settings }) => {
  const handleSelection = (value) => {
    // Implement your logic to handle selection
    console.log(value);
  };

  // Grid of Buttons
  if (settings.displayType === "buttons") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/60 text-xs mt-10 w-full justify-center">
        {data.options.map((option, index) => (
          <button
            key={index}
            className="text-left p-2.5 border rounded-xl border-white/20 bg-sidebar hover:bg-workspace-item-selected-gradient"
            onClick={() => handleSelection(option.value)}
          >
            <p className="font-semibold">{option.label}</p>
          </button>
        ))}
      </div>
    );
  }

  // Normal List with Hyperlinks
  if (settings.displayType === "list") {
    return (
      <div className="mt-10 text-white/60 text-xs w-full">
        {data.options.map((option, index) => (
          <a
            key={index}
            href={option.href} // assuming `href` is available in your option object
            className="block p-2.5 border-b border-white/20 last:border-0 hover:bg-workspace-item-selected-gradient"
          >
            <p className="font-semibold">{option.label}</p>
          </a>
        ))}
      </div>
    );
  }

  // Dropdown Menu
  return (
    <div className="mt-5  w-full">
      <div className="flex flex-col">
        <label
          htmlFor="chatModel"
          className="block input-label text-white text-opacity-60 text-xs font-medium py-1.5"
        >
          {data?.label}
        </label>
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {data?.description}
        </p>
      </div>
      <select
        name="optionSelect"
        id="optionSelect"
        multiple={settings.allowMultiple}
        required={true}
        disabled={settings.disabled}
        className="bg-sidebar text-white text-xs rounded-xl p-2.5 w-full border border-white/20 focus:ring-blue-500 focus:border-blue-500"
      >
        {settings.waitingForModels ? (
          <option disabled={true} selected={true}>
            -- waiting for models --
          </option>
        ) : (
          data.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.label}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default OptionSelect;
