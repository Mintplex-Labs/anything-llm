import React from 'react';
import { Plus, CaretDown } from "@phosphor-icons/react";
import { BLOCK_TYPES, BLOCK_INFO } from '../BlockList';

export default function AddBlockMenu({ showBlockMenu, setShowBlockMenu, addBlock }) {
  return (
    <div className="relative mt-4 w-[280px] mx-auto">
      <button
        onClick={() => setShowBlockMenu(!showBlockMenu)}
        className="w-full p-3 bg-theme-bg-secondary hover:bg-theme-bg-hover border border-theme-sidebar-border rounded-lg text-theme-text-primary flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Block
        <CaretDown className="w-4 h-4" />
      </button>
      {showBlockMenu && (
        <div className="absolute left-0 right-0 mt-2 bg-theme-bg-secondary border border-theme-sidebar-border rounded-lg shadow-lg overflow-hidden z-10">
          {Object.entries(BLOCK_INFO).map(([type, info]) => (
            type !== BLOCK_TYPES.START && (
              <button
                key={type}
                onClick={() => {
                  addBlock(type);
                  setShowBlockMenu(false);
                }}
                className="w-full p-3 flex items-center gap-3 hover:bg-theme-bg-hover text-theme-text-primary"
              >
                <div className="w-8 h-8 rounded-lg bg-theme-bg-primary flex items-center justify-center border border-theme-sidebar-border">
                  {info.icon}
                </div>
                <div className="text-left">
                  <div className="font-medium">{info.label}</div>
                  <div className="text-sm text-theme-text-secondary">{info.description}</div>
                </div>
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}