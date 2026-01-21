import React, { useState, useEffect } from "react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Automation from "@/models/automation";
import paths from "@/utils/paths";
import { useParams } from "react-router-dom";
import { Gauge, ChartLine, Users, Briefcase } from "@phosphor-icons/react";

// Category icons mapping
const CATEGORY_ICONS = {
  business: Briefcase,
  marketing: ChartLine,
  sales: Gauge,
  hr: Users,
};

// Default categories with their metadata
const DEFAULT_CATEGORIES = [
  {
    slug: "business",
    name: "Business",
    description: "Business process automations",
  },
  {
    slug: "marketing",
    name: "Marketing",
    description: "Marketing campaign automations",
  },
  {
    slug: "sales",
    name: "Sales",
    description: "Sales pipeline automations",
  },
  {
    slug: "hr",
    name: "HR",
    description: "HR and recruitment automations",
  },
];

export default function ActiveAutomations() {
  const { categorySlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function getCategories() {
      const fetchedCategories = await Automation.categories();
      setLoading(false);
      // Use fetched categories if available, otherwise use defaults
      setCategories(
        fetchedCategories.length > 0 ? fetchedCategories : DEFAULT_CATEGORIES
      );
    }
    getCategories();
  }, []);

  if (loading) {
    return (
      <Skeleton.default
        height={40}
        width="100%"
        count={4}
        baseColor="var(--theme-sidebar-item-default)"
        highlightColor="var(--theme-sidebar-item-hover)"
        enableAnimation={true}
        className="my-1"
      />
    );
  }

  return (
    <div
      role="list"
      aria-label="Automation Categories"
      className="flex flex-col gap-y-2"
    >
      {categories.map((category) => {
        const isActive = category.slug === categorySlug;
        const IconComponent = CATEGORY_ICONS[category.slug] || Briefcase;

        return (
          <div key={category.slug} className="flex flex-col w-full group">
            <div className="flex gap-x-2 items-center justify-between">
              <a
                href={isActive ? null : paths.automations.category(category.slug)}
                data-tooltip-id="category-name"
                data-tooltip-content={category.description || category.name}
                aria-current={isActive ? "page" : ""}
                className={`
                  transition-all duration-[200ms]
                  flex flex-grow w-full gap-x-2 py-[6px] pl-[8px] pr-[6px] rounded-[4px] text-white justify-start items-center
                  bg-theme-sidebar-item-default
                  hover:bg-theme-sidebar-subitem-hover hover:font-bold
                  ${
                    isActive
                      ? "bg-theme-sidebar-item-selected font-bold light:outline-2 light:outline light:outline-blue-400 light:outline-offset-[-2px]"
                      : ""
                  }
                `}
              >
                <div className="flex flex-row justify-between w-full items-center">
                  <div className="flex items-center space-x-2 overflow-hidden flex-grow">
                    <IconComponent
                      size={20}
                      color="var(--theme-sidebar-item-workspace-active)"
                      weight={isActive ? "fill" : "regular"}
                      className="flex-shrink-0"
                    />
                    <div className="overflow-hidden flex-grow">
                      <p
                        className={`
                          text-[14px] leading-loose whitespace-nowrap overflow-hidden text-white
                          ${isActive ? "font-bold" : "font-medium"} truncate
                          w-full group-hover:font-bold group-hover:duration-200
                        `}
                      >
                        {category.name}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
