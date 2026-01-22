import { useState } from "react";
import {
  ArrowClockwise,
  CircleNotch,
  MagnifyingGlass,
} from "@phosphor-icons/react";

export default function ModelTableLayout({
  children,
  fetchModels = null,
  searchQuery = "",
  setSearchQuery = () => {},
  loading = false,
}) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  async function refreshModels() {
    setIsRefreshing(true);
    try {
      await fetchModels?.();
    } catch {
    } finally {
      setIsRefreshing(false);
    }
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex gap-x-2 items-center pb-[8px]">
        <label className="text-theme-text-primary text-base font-semibold">
          Available Models
        </label>
      </div>
      <div className="flex w-full items-center gap-x-[16px]">
        <div className="relative flex-1 flex-grow">
          <MagnifyingGlass
            size={16}
            weight="bold"
            color="var(--theme-text-primary)"
            className="absolute left-[9px] top-[10px] text-theme-settings-input-placeholder peer-focus:invisible"
          />
          <input
            type="search"
            placeholder="Search models"
            value={searchQuery}
            disabled={loading}
            className="min-h-[32px] border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 pl-[30px] py-2 search-input disabled:opacity-50 disabled:cursor-not-allowed"
            onChange={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSearchQuery(e.target.value);
            }}
          />
        </div>
        {!!fetchModels && (
          <button
            type="button"
            onClick={refreshModels}
            disabled={isRefreshing || loading}
            className="border-none text-theme-text-secondary text-sm font-medium hover:bg-white/10 light:hover:bg-black/5 rounded-lg px-2 h-full flex items-center gap-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <CircleNotch className="w-4 h-4 text-theme-text-secondary animate-spin" />
            ) : (
              <ArrowClockwise
                weight="bold"
                className="w-4 h-4 text-theme-text-secondary"
              />
            )}
            <span
              className={`text-sm font-medium ${isRefreshing ? "hidden" : "text-theme-text-secondary"}`}
            >
              Refresh Models
            </span>
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
