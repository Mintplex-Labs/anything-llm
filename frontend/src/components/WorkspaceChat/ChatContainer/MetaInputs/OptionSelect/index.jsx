import { PaperPlaneRight } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

const OptionSelect = ({ data, settings, submit, message, setMessage }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitMessage, setSubmitMessage] = useState(false);

  useEffect(() => {
    if (submitMessage) {
      submit();
      setSubmitMessage(false);
    }
  }, [message]);

  const handleSelection = (value) => {
    const currentIndex = selectedOptions.indexOf(value);
    const newSelectedOptions = [...selectedOptions];

    if (currentIndex === -1) {
      newSelectedOptions.push(value);
    } else {
      newSelectedOptions.splice(currentIndex, 1);
    }

    setSelectedOptions(newSelectedOptions);
    setMessage(newSelectedOptions.join(", "));
  };

  const handleSubmit = () => {
    setSubmitMessage(true);
  };

  // Grid of Buttons
  if (settings.displayType === "buttons") {
    return (
      <div className=" mb-2 w-full p-4 backdrop-blur-sm rounded-t-xl overflow-hidden py-4 px-6 border-l border-t border-r border-[#2f3238]">
        <Label label={data?.label} />
        <div className=" pb-0 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-xs  ">
          {data.options.map((option, index) => (
            <button
              key={index}
              className="group relative shadow-lg hover:shadow-sm transition-all duration-200 ease-in-out text-left p-2.5 border rounded-xl border-white/20 bg-sidebar hover:bg-sidebar/50 overflow-hidden "
              onClick={() => {
                {
                  handleSelection(option.value);
                  handleSubmit();
                }
              }}
            >
              <p className="truncate max-w-xl group-hover:max-w-xl group-hover:truncate-0">
                <span className="text-white/50 mr-1">{index + 1}.</span>{" "}
                {option.label}
              </p>
              <span className="absolute invisible group-hover:visible bg-black text-white text-xs rounded-lg p-2 left-0 bottom-full mb-2">
                <span className="text-white/50 mr-1">{index + 1}.</span>{" "}
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Normal List with Hyperlinks
  if (settings.displayType === "list") {
    return (
      <div className=" text-white/70 text-xs w-full backdrop-blur-sm rounded-t-xl overflow-hidden py-4 px-6 border-l border-t border-r border-[#2f3238]">
        <Label {...data} />
        {data.options.map((option, index) => (
          <a
            key={index}
            href={option.href} // assuming `href` is available in your option object
            className="block p-2.5 border-b border-white/10 last:border-0 hover:bg-sidebar/50 cursor-pointer"
            onClick={() => {
              {
                handleSelection(option.value);
                handleSubmit();
              }
            }}
          >
            <p className="">
              <span className="text-white/50 mr-1">{index + 1}.</span>{" "}
              {option.label}
            </p>
          </a>
        ))}
      </div>
    );
  }

  // Checkbox
  if (settings.displayType === "checkbox") {
    return (
      <div className="w-full p-4 backdrop-blur-sm rounded-t-xl overflow-hidden py-4 px-6 border-l border-t border-r border-[#2f3238]">
        <Label label={data?.label} />
        <div className="pb-0 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-white/80 text-xs">
          {data.options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={option.value}
                checked={selectedOptions.includes(option.value)}
                onChange={() => {
                  handleSelection(option.value);
                }}
                className="checkbox"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
        {selectedOptions.length > 0 && (
          <button
            className="flex items-center justify-center p-2 mt-4 text-sm  text-white/60 hover:text-white  rounded"
            onClick={() => {
              handleSelection(selectedOptions.join(", "));
              handleSubmit();
            }}
          >
            <PaperPlaneRight className="h-6 w-6 mr-2" /> Send
          </button>
        )}
      </div>
    );
  }

  // Dropdown Menu
  return (
    <div className="mt-5 mb-5  w-full backdrop-blur-sm rounded-t-xl  py-4 px-6 border-l border-t border-r border-[#2f3238]">
      <Label {...data} />
      <select
        name="optionSelect"
        id="optionSelect"
        multiple={settings.allowMultiple}
        required={true}
        disabled={settings.disabled}
        className="shadow-xl mt-3 bg-sidebar text-white text-xs rounded-xl p-2.5 w-full border border-white/20 focus:ring-blue-500 focus:border-blue-500"
        onChange={(e) => {
          handleSelection(e.target.value);
          handleSubmit();
        }}
      >
        <option value="placeholder" disabled selected>
          Select an option
        </option>
        {settings.waitingForModels ? (
          <option disabled={true} selected={true}>
            -- waiting for models --
          </option>
        ) : (
          data.options.map((option, index) => (
            <option key={index} value={option.value}>
              <span className="text-white/50 mr-1">{index + 1}.</span>{" "}
              {option.label}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

const Label = ({ label, description }) => {
  return (
    <div className="hidden md:flex flex-col">
      {label && (
        <label
          htmlFor="chatModel"
          className="block input-label text-white text-opacity-60 text-xs font-medium py-1.5"
        >
          {label}
        </label>
      )}
      {description && (
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {description}
        </p>
      )}
    </div>
  );
};

export default OptionSelect;
