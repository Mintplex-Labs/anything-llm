import React, { useState, useEffect } from "react";
import showToast from "@/utils/toast";
import Admin from "@/models/admin";
import { Plus, X } from "@phosphor-icons/react";
import { ICON_COMPONENTS } from "@/utils/constants";

export default function FooterCustomization() {
  const [footerIcons, setFooterIcons] = useState([]);
  const [initialFooterIcons, setInitialFooterIcons] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [iconUrl, setIconUrl] = useState("");

  useEffect(() => {
    async function fetchFooterIcons() {
      const { settings } = await Admin.systemPreferences();
      if (settings && settings.footer_data) {
        setFooterIcons(JSON.parse(settings.footer_data));
        setInitialFooterIcons(JSON.parse(settings.footer_data));
      }
    }
    fetchFooterIcons();
  }, []);

  const addFooterIcon = () => {
    if (!selectedIcon || !iconUrl) {
      showToast("Please select an icon and enter a URL.", "warning");
      return;
    }
    if (footerIcons.length >= 4) {
      showToast("Maximum of 4 icons allowed.", "warning");
      return;
    }
    const newIcon = { icon: selectedIcon, url: iconUrl };
    setFooterIcons([...footerIcons, newIcon]);
    setSelectedIcon("");
    setIconUrl("");
  };

  const removeFooterIcon = (index) => {
    const updatedIcons = footerIcons.filter((_, i) => i !== index);
    setFooterIcons(updatedIcons);
  };

  const saveFooterChanges = async () => {
    const { success, error } = await Admin.updateSystemPreferences({
      footer_data: JSON.stringify(footerIcons),
    });

    if (!success) {
      showToast(`Failed to update footer: ${error}`, "error");
      return;
    }
    localStorage.removeItem("footerData");

    showToast("Successfully updated footer.", "success");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const hasChanges =
    JSON.stringify(footerIcons) !== JSON.stringify(initialFooterIcons);

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-y-2 mb-6">
        <h2 className="leading-tight font-medium text-white">
          Custom Footer Icons
        </h2>
        <p className="text-sm font-base text-white/60">
          Customize the footer icons displayed to your users.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {footerIcons.map((icon, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-zinc-900 p-2 rounded-md mb-2"
          >
            <IconPreview icon={ICON_COMPONENTS[icon.icon]} />
            <span className="text-white ml-4">{icon.url}</span>
            <button
              className="transition-all duration-300 text-neutral-700 bg-white rounded-full hover:bg-zinc-600 hover:border-zinc-600 hover:text-white border-transparent border shadow-lg mr-2"
              onClick={() => removeFooterIcon(index)}
            >
              <X className="m-[1px]" size={20} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-start">
        {footerIcons.length < 4 && (
          <div className="mt-6 mb-6 flex flex-col bg-zinc-900 rounded-lg px-6 py-4">
            <div className="flex gap-2">
              {Object.keys(ICON_COMPONENTS).map((iconName) => (
                <IconOption
                  key={iconName}
                  iconName={iconName}
                  selected={selectedIcon === iconName}
                  onSelect={() => setSelectedIcon(iconName)}
                />
              ))}
            </div>
            <label className="text-white/80 text-sm mt-2 mb-1">Link</label>
            <input
              type="text"
              placeholder="https://example.com"
              value={iconUrl}
              onChange={(e) => setIconUrl(e.target.value)}
              className="bg-sidebar text-white placeholder-white/60 rounded-md p-2"
            />

            <div className="flex gap-2 mt-6">
              <button
                type="button"
                onClick={addFooterIcon}
                className="flex gap-x-2 items-center justify-center text-white text-sm hover:text-sky-400 transition-all duration-300"
              >
                Add new footer icon{" "}
                <Plus className="" size={24} weight="fill" />
              </button>
            </div>
          </div>
        )}
      </div>
      {hasChanges && (
        <div className="flex justify-center py-6">
          <button
            className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            onClick={saveFooterChanges}
          >
            Save Footer Icons
          </button>
        </div>
      )}
    </div>
  );
}

const IconOption = ({ iconName, selected, onSelect }) => {
  const Icon = ICON_COMPONENTS[iconName];
  return (
    <div
      onClick={onSelect}
      className={`${
        selected
          ? "bg-menu-item-selected-gradient border-slate-100 border-opacity-50 border"
          : "bg-sidebar-button border-transparent"
      } hover:bg-blue-700} cursor-pointer transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border mx-1`}
    >
      <Icon className="h-5 w-5 text-white" weight="fill" />
    </div>
  );
};

const IconPreview = ({ icon: IconComponent }) => (
  <div className="border-transparent transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border mx-1">
    <IconComponent className="h-5 w-5 text-white" weight="fill" />
  </div>
);
