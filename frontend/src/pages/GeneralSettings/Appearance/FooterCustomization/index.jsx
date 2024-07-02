import React, { useState, useEffect } from "react";
import showToast from "@/utils/toast";
import { safeJsonParse } from "@/utils/request";
import NewIconForm from "./NewIconForm";
import Admin from "@/models/admin";
import System from "@/models/system";
import { useTranslation } from "react-i18next";

export default function FooterCustomization() {
  const [footerIcons, setFooterIcons] = useState(Array(3).fill(null));
  const { t } = useTranslation();
  useEffect(() => {
    async function fetchFooterIcons() {
      const settings = (await Admin.systemPreferences())?.settings;
      if (settings && settings.footer_data) {
        const parsedIcons = safeJsonParse(settings.footer_data, []);
        setFooterIcons((prevIcons) => {
          const updatedIcons = [...prevIcons];
          parsedIcons.forEach((icon, index) => {
            updatedIcons[index] = icon;
          });
          return updatedIcons;
        });
      }
    }
    fetchFooterIcons();
  }, []);

  const updateFooterIcons = async (updatedIcons) => {
    const { success, error } = await Admin.updateSystemPreferences({
      footer_data: JSON.stringify(updatedIcons.filter((icon) => icon !== null)),
    });

    if (!success) {
      showToast(`Failed to update footer icons - ${error}`, "error", {
        clear: true,
      });
      return;
    }

    window.localStorage.removeItem(System.cacheKeys.footerIcons);
    setFooterIcons(updatedIcons);
    showToast("Successfully updated footer icons.", "success", { clear: true });
  };

  const handleRemoveIcon = (index) => {
    const updatedIcons = [...footerIcons];
    updatedIcons[index] = null;
    updateFooterIcons(updatedIcons);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col gap-y-1">
        <h2 className="text-base leading-6 font-bold text-white">
          {t("appearance.icons.title")}
        </h2>
        <p className="text-xs leading-[18px] font-base text-white/60">
          {t("appearance.icons.description")}
        </p>
      </div>
      <div className="mt-3 flex gap-x-3 font-bold text-white text-sm">
        <div>{t("appearance.icons.icon")}</div>
        <div>{t("appearance.icons.link")}</div>
      </div>
      <div className="mt-2 flex flex-col gap-y-[10px]">
        {footerIcons.map((icon, index) => (
          <NewIconForm
            key={index}
            icon={icon?.icon}
            url={icon?.url}
            onSave={(newIcon, newUrl) => {
              const updatedIcons = [...footerIcons];
              updatedIcons[index] = { icon: newIcon, url: newUrl };
              updateFooterIcons(updatedIcons);
            }}
            onRemove={() => handleRemoveIcon(index)}
          />
        ))}
      </div>
    </div>
  );
}
