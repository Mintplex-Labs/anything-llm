import System from "@/models/system";
import { ICON_COMPONENTS } from "@/utils/constants";
import paths from "@/utils/paths";
import { BookOpen, DiscordLogo, GithubLogo } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";

export default function Footer() {
  const [footerData, setFooterData] = useState([]);

  useEffect(() => {
    async function fetchFooterData() {
      const now = Date.now();
      const cache = localStorage.getItem("footerData");
      const { data, lastFetched } = cache
        ? JSON.parse(cache)
        : { data: null, lastFetched: 0 };

      if (!data || now - lastFetched > 3600000) {
        const response = await System.fetchFooterData();
        if (response.footerData) {
          const newData = JSON.parse(response.footerData);
          localStorage.setItem(
            "footerData",
            JSON.stringify({ data: newData, lastFetched: Date.now() })
          );
          setFooterData(newData);
        }
      } else {
        setFooterData(data);
      }
    }
    fetchFooterData();
  }, []);

  if (footerData.length === 0) {
    return (
      <div className="flex justify-center mt-2">
        <div className="flex space-x-4">
          <a
            href={paths.github()}
            className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          >
            <GithubLogo weight="fill" className="h-5 w-5 " />
          </a>
          <a
            href={paths.docs()}
            className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          >
            <BookOpen weight="fill" className="h-5 w-5 " />
          </a>
          <a
            href={paths.discord()}
            className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          >
            <DiscordLogo
              weight="fill"
              className="h-5 w-5 stroke-slate-200 group-hover:stroke-slate-200"
            />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-2">
      <div className="flex space-x-4">
        {footerData.map((item, index) => (
          <a
            key={index}
            href={item.url}
            className="transition-all duration-300 p-2 rounded-full text-white bg-sidebar-button hover:bg-menu-item-selected-gradient hover:border-slate-100 hover:border-opacity-50 border-transparent border"
          >
            {React.createElement(ICON_COMPONENTS[item.icon], {
              weight: "fill",
              className: "h-5 w-5",
            })}
          </a>
        ))}
      </div>
    </div>
  );
}
