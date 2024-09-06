import React from "react";
import { DefaultBadge } from "../Badges/default";
import { useTranslation } from "react-i18next";

export default function DefaultSkillPanel({ title, description, image, icon }) {
  const { t } = useTranslation();
  return (
    <div className="p-2">
      <div className="flex flex-col gap-y-[18px] max-w-[500px]">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-x-2">
            {icon &&
              React.createElement(icon, {
                size: 24,
                color: "white",
                weight: "bold",
              })}
            <label htmlFor="name" className="text-white text-md font-bold">
              {t(title)}
            </label>
            <DefaultBadge title={title} />
          </div>
        </div>
        <img src={image} alt={title} className="w-full rounded-md" />
        <p className="text-white text-opacity-60 text-xs font-medium py-1.5">
          {t(description)}
        </p>
      </div>
    </div>
  );
}
