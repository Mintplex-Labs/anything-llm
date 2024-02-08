import React, { useState, useEffect, useRef } from "react";
import showToast from "@/utils/toast";
import Admin from "@/models/admin";
import { Plus, X } from "@phosphor-icons/react";
import { ICON_COMPONENTS } from "@/components/Footer";
import { safeJsonParse } from "@/utils/request";

export default function FooterCustomization() {
  const [footerIcons, setFooterIcons] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddIcon, setShowAddIcon] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchFooterIcons() {
      const { settings } = await Admin.systemPreferences();
      if (settings && settings.footer_data) {
        setFooterIcons(safeJsonParse(settings.footer_data, []));
      }
    }
    fetchFooterIcons();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const removeFooterIcon = async (index) => {
    const updatedIcons = footerIcons.filter((_, i) => i !== index);
    const { success, error } = await Admin.updateSystemPreferences({
      footer_data: JSON.stringify(updatedIcons),
    });

    if (!success) {
      showToast(`Failed to remove footer: ${error}`, "error");
      return;
    }
    window.localStorage.removeItem("footerData");
    setFooterIcons(updatedIcons);
    showToast("Successfully removed footer icon.", "success");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const icon = form.get("icon");
    const url = form.get("url");

    const newIcon = { icon, url };
    setFooterIcons([...footerIcons, newIcon]);

    const { success, error } = await Admin.updateSystemPreferences({
      footer_data: JSON.stringify([...footerIcons, newIcon]),
    });

    if (!success) {
      showToast(`Failed to update footer: ${error}`, "error");
      return;
    }
    window.localStorage.removeItem("footerData");

    setShowAddIcon(false);
    showToast("Successfully updated footer.", "success");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-y-2 ">
        <h2 className="leading-tight font-medium text-white">
          Custom Footer Icons
        </h2>
        <p className="text-sm font-base text-white/60">
          Customize the footer icons displayed on the bottom of the sidebar.
        </p>
      </div>
      {footerIcons.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
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
      )}
      <form onSubmit={onSubmit} className="flex justify-start">
        {footerIcons.length < 4 && showAddIcon && (
          <div className="mt-6 mb-6 flex flex-col bg-zinc-900 rounded-lg px-6 py-4">
            <div className="flex gap-x-4 items-center">
              <div
                className="relative flex flex-col items-center gap-y-4"
                ref={dropdownRef}
              >
                <label className="text-sm font-medium text-white">Icon</label>
                <button
                  className={`${
                    isDropdownOpen
                      ? "bg-menu-item-selected-gradient border-slate-100/50"
                      : ""
                  }border-transparent transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border`}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsDropdownOpen(!isDropdownOpen);
                  }}
                >
                  {selectedIcon
                    ? React.createElement(ICON_COMPONENTS[selectedIcon], {
                        className: "h-5 w-5 text-white",
                        weight: "fill",
                      })
                    : "Pick icon"}
                </button>
                {isDropdownOpen && (
                  <div className="absolute z-10 grid grid-cols-4 gap-4 bg-zinc-800 -mt-20 ml-44 p-1 rounded-md w-56 h-28 overflow-y-auto border border-slate-100/10">
                    {Object.keys(ICON_COMPONENTS).map((iconName) => (
                      <button
                        key={iconName}
                        className="flex justify-center items-center border border-transparent hover:bg-menu-item-selected-gradient hover:border-slate-100 rounded-full"
                        onClick={() => {
                          setSelectedIcon(iconName);
                          setIsDropdownOpen(false);
                        }}
                      >
                        {React.createElement(ICON_COMPONENTS[iconName], {
                          className: "h-5 w-5 text-white m-2.5",
                          weight: "fill",
                        })}
                      </button>
                    ))}
                  </div>
                )}
                <input type="hidden" name="icon" value={selectedIcon} />
              </div>
              <div className="flex flex-col gap-y-4">
                <label className="text-sm font-medium text-white">Link</label>
                <input
                  type="url"
                  name="url"
                  required={true}
                  placeholder="https://example.com"
                  className="bg-sidebar text-white placeholder-white/60 rounded-md p-2"
                />
              </div>
              {selectedIcon !== "" && (
                <div className="flex justify-center py-6">
                  <button
                    type="submit"
                    className="transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </form>
      {!showAddIcon && footerIcons.length < 4 && (
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setShowAddIcon(true)}
            className="flex gap-x-2 items-center justify-center text-white text-sm hover:text-sky-400 transition-all duration-300"
          >
            Add new footer icon
            <Plus className="" size={24} weight="fill" />
          </button>
        </div>
      )}
    </div>
  );
}

const IconPreview = ({ icon: IconComponent }) => (
  <div className="border-transparent transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border mx-1">
    <IconComponent className="h-5 w-5 text-white" weight="fill" />
  </div>
);
