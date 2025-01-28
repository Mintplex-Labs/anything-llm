import React from 'react';

export default function BaseNode({ data }) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-theme-bg-secondary border border-theme-sidebar-border min-w-[150px]">
      <div className="flex items-center">
        {data.icon && (
          <div className="rounded-full w-8 h-8 flex items-center justify-center bg-theme-bg-primary">
            {data.icon}
          </div>
        )}
        <div className="ml-2">
          <div className="text-sm font-bold text-theme-text-primary">{data.label}</div>
          {data.description && (
            <div className="text-xs text-theme-text-secondary">{data.description}</div>
          )}
        </div>
      </div>
    </div>
  );
}
