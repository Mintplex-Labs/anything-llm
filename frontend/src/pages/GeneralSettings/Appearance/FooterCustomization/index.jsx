import React, { useState, useEffect } from "react";
import showToast from "@/utils/toast";
import { Plus, X } from "@phosphor-icons/react";
import { ICON_COMPONENTS, MAX_ICONS } from "@/components/Footer";
import { safeJsonParse } from "@/utils/request";
import NewIconForm from "./NewIconForm";
import Admin from "@/models/admin";
import System from "@/models/system";

export default function FooterCustomization() {
  const [loading, setLoading] = useState(true);
  const [footerIcons, setFooterIcons] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchFooterIcons() {
      const settings = (await Admin.systemPreferences())?.settings;
      if (settings && settings.footer_data) {
        setFooterIcons(safeJsonParse(settings.footer_data, []));
      }
      setLoading(false);
    }
    fetchFooterIcons();
  }, []);

  const removeFooterIcon = async (index) => {
    const updatedIcons = footerIcons.filter((_, i) => i !== index);
    const { success, error } = await Admin.updateSystemPreferences({
      footer_data: JSON.stringify(updatedIcons),
    });

    if (!success) {
      showToast(`Failed to remove footer icon - ${error}`, "error", {
        clear: true,
      });
      return;
    }

    window.localStorage.removeItem(System.cacheKeys.footerIcons);
    setFooterIcons(updatedIcons);
    showToast("Successfully removed footer icon.", "success", { clear: true });
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
      showToast(`Failed to add footer icon - ${error}`, "error", {
        clear: true,
      });
      return;
    }
    window.localStorage.removeItem(System.cacheKeys.footerIcons);

    setShowForm(false);
    showToast("Successfully added footer icon.", "success", { clear: true });
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col gap-y-2">
        <h2 className="leading-tight font-medium text-white">
          Custom Footer Icons
        </h2>
        <p className="text-sm font-base text-white/60">
          Customize the footer icons displayed on the bottom of the sidebar.
        </p>
      </div>
      <CurrentIcons footerIcons={footerIcons} remove={removeFooterIcon} />
      <NewIconForm
        handleSubmit={onSubmit}
        showing={footerIcons.length < MAX_ICONS && showForm}
      />
      <div hidden={!(!showForm && footerIcons.length < MAX_ICONS) || loading}>
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setShowForm(true)}
            className="flex gap-x-2 items-center justify-center text-white text-sm hover:text-sky-400 transition-all duration-300"
          >
            Add new footer icon
            <Plus className="" size={24} weight="fill" />
          </button>
        </div>
      </div>
    </div>
  );
}

function CurrentIcons({ footerIcons, remove }) {
  if (footerIcons.length === 0) return null;
  return (
    <div className="flex flex-col w-fit gap-y-2 mt-4">
      {footerIcons.map((icon, index) => (
        <div
          key={index}
          className="flex items-center justify-between bg-zinc-900 p-2 rounded-md gap-x-4"
        >
          <div className="flex items-center gap-x-2">
            <IconPreview symbol={icon.icon} disabled={true} />
            <span className="text-white/60">{icon.url}</span>
          </div>

          <button
            type="button"
            className="transition-all duration-300 text-neutral-700 bg-transparent rounded-full hover:bg-zinc-600 hover:border-zinc-600 hover:text-white border-transparent border shadow-lg mr-2"
            onClick={() => remove(index)}
          >
            <X className="m-[1px]" size={20} />
          </button>
        </div>
      ))}
    </div>
  );
}

const IconPreview = ({ symbol, disabled = false }) => {
  const IconComponent = ICON_COMPONENTS.hasOwnProperty(symbol)
    ? ICON_COMPONENTS[symbol]
    : ICON_COMPONENTS.Info;

  return (
    <button
      type="button"
      disabled={disabled}
      className="disabled:pointer-events-none border-transparent transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border mx-1"
    >
      <IconComponent className="h-5 w-5 text-white" weight="fill" />
    </button>
  );
};
