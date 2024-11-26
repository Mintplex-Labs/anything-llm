import System from "@/models/system";
import showToast from "@/utils/toast";
import { Gear, Plug } from "@phosphor-icons/react";
import { useEffect, useState, useRef } from "react";
import { sentenceCase } from "text-case";

/**
 * Converts setup_args to inputs for the form builder
 * @param {object} setupArgs - The setup arguments object
 * @returns {object} - The inputs object
 */
function inputsFromArgs(setupArgs) {
  if (
    !setupArgs ||
    setupArgs.constructor?.call?.().toString() !== "[object Object]"
  ) {
    return {};
  }
  return Object.entries(setupArgs).reduce(
    (acc, [key, props]) => ({
      ...acc,
      [key]: props.hasOwnProperty("value")
        ? props.value
        : props?.input?.default || "",
    }),
    {}
  );
}

/**
 * Imported skill config component for imported skills only.
 * @returns {JSX.Element}
 */
export default function ImportedSkillConfig({
  selectedSkill, // imported skill config object
  setImportedSkills, // function to set imported skills since config is file-write
}) {
  const [config, setConfig] = useState(selectedSkill);
  const [hasChanges, setHasChanges] = useState(false);
  const [inputs, setInputs] = useState(
    inputsFromArgs(selectedSkill?.setup_args)
  );

  const hasSetupArgs =
    selectedSkill?.setup_args &&
    Object.keys(selectedSkill.setup_args).length > 0;

  async function toggleSkill() {
    const updatedConfig = { ...selectedSkill, active: !config.active };
    await System.experimentalFeatures.agentPlugins.updatePluginConfig(
      config.hubId,
      { active: !config.active }
    );
    setImportedSkills((prev) =>
      prev.map((s) => (s.hubId === config.hubId ? updatedConfig : s))
    );
    setConfig(updatedConfig);
    showToast(
      `Skill ${updatedConfig.active ? "activated" : "deactivated"}.`,
      "success",
      { clear: true }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = [];
    const updatedConfig = { ...config };

    for (const [key, value] of Object.entries(inputs)) {
      const settings = config.setup_args[key];
      if (settings.required && !value) {
        errors.push(`${key} is required to have a value.`);
        continue;
      }
      if (typeof value !== settings.type) {
        errors.push(`${key} must be of type ${settings.type}.`);
        continue;
      }
      updatedConfig.setup_args[key].value = value;
    }

    if (errors.length > 0) {
      errors.forEach((error) => showToast(error, "error"));
      return;
    }

    await System.experimentalFeatures.agentPlugins.updatePluginConfig(
      config.hubId,
      updatedConfig
    );
    setConfig(updatedConfig);
    setImportedSkills((prev) =>
      prev.map((skill) =>
        skill.hubId === config.hubId ? updatedConfig : skill
      )
    );
    showToast("Skill config updated successfully.", "success");
    setHasChanges(false);
  }

  useEffect(() => {
    setHasChanges(
      JSON.stringify(inputs) !==
        JSON.stringify(inputsFromArgs(selectedSkill.setup_args))
    );
  }, [inputs]);

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col gap-y-[18px] max-w-[500px]">
          <div className="flex items-center gap-x-2">
            <Plug size={24} weight="bold" className="text-white" />
            <label htmlFor="name" className="text-white text-md font-bold">
              {sentenceCase(config.name)}
            </label>
            <label className="border-none relative inline-flex items-center ml-auto cursor-pointer">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={config.active}
                onChange={() => toggleSkill()}
              />
              <div className="peer-disabled:opacity-50 pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
              <span className="ml-3 text-sm font-medium"></span>
            </label>
            <ManageSkillMenu
              config={config}
              setImportedSkills={setImportedSkills}
            />
          </div>
          <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
            {config.description} by{" "}
            <a
              href={config.author_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline"
            >
              {config.author}
            </a>
          </p>

          {hasSetupArgs ? (
            <div className="flex flex-col gap-y-2">
              {Object.entries(config.setup_args).map(([key, props]) => (
                <div key={key} className="flex flex-col gap-y-1">
                  <label htmlFor={key} className="text-white text-sm font-bold">
                    {key}
                  </label>
                  <input
                    type={props?.input?.type || "text"}
                    required={props?.input?.required}
                    defaultValue={
                      props.hasOwnProperty("value")
                        ? props.value
                        : props?.input?.default || ""
                    }
                    onChange={(e) =>
                      setInputs({ ...inputs, [key]: e.target.value })
                    }
                    placeholder={props?.input?.placeholder || ""}
                    className="border-solid bg-transparent border border-white light:border-black rounded-md p-2 text-white text-sm"
                  />
                  <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
                    {props?.input?.hint}
                  </p>
                </div>
              ))}
              {hasChanges && (
                <button
                  onClick={handleSubmit}
                  type="button"
                  className="bg-blue-500 text-white light:text-white rounded-md p-2"
                >
                  Save
                </button>
              )}
            </div>
          ) : (
            <p className="text-white text-opacity-60 text-sm font-medium py-1.5">
              There are no options to modify for this skill.
            </p>
          )}
        </div>
      </div>
    </>
  );
}

function ManageSkillMenu({ config, setImportedSkills }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  async function deleteSkill() {
    if (
      !window.confirm(
        "Are you sure you want to delete this skill? This action cannot be undone."
      )
    )
      return;
    const success = await System.experimentalFeatures.agentPlugins.deletePlugin(
      config.hubId
    );
    if (success) {
      setImportedSkills((prev) => prev.filter((s) => s.hubId !== config.hubId));
      showToast("Skill deleted successfully.", "success");
      setOpen(false);
    } else {
      showToast("Failed to delete skill.", "error");
    }
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!config.hubId) return null;
  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`border-none transition duration-200 hover:rotate-90 outline-none ring-none ${open ? "rotate-90" : ""}`}
      >
        <Gear size={24} weight="bold" />
      </button>
      {open && (
        <div className="absolute w-[100px] -top-1 left-7 mt-1 border-[1.5px] border-white/40 rounded-lg bg-theme-action-menu-bg flex flex-col shadow-[0_4px_14px_rgba(0,0,0,0.25)] text-white z-99 md:z-10">
          <button
            type="button"
            onClick={deleteSkill}
            className="border-none flex items-center rounded-lg gap-x-2 hover:bg-theme-action-menu-item-hover py-1.5 px-2 transition-colors duration-200 w-full text-left"
          >
            <span className="text-sm">Delete Skill</span>
          </button>
        </div>
      )}
    </div>
  );
}
