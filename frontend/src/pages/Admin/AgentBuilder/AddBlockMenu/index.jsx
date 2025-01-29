import React from 'react';
import { Plus, CaretDown } from "@phosphor-icons/react";
import { BLOCK_TYPES, BLOCK_INFO } from '../BlockList';

export default function AddBlockMenu({ showBlockMenu, setShowBlockMenu, addBlock }) {
  return (
    <div className="relative mt-4 w-[280px] mx-auto">
      <button
        onClick={() => setShowBlockMenu(!showBlockMenu)}
        className="transition-all duration-300 w-full p-2.5 bg-theme-action-menu-bg hover:bg-theme-action-menu-item-hover border border-white/10 rounded-lg text-white flex items-center justify-center gap-2 text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Block
        <CaretDown className={`w-3.5 h-3.5 transition-transform duration-300 ${showBlockMenu ? 'rotate-180' : ''}`} />
      </button>
      {showBlockMenu && (
        <div className="absolute left-0 right-0 mt-2 bg-theme-action-menu-bg border border-white/10 rounded-lg shadow-lg overflow-hidden z-10 animate-fadeUpIn">
          {Object.entries(BLOCK_INFO).map(([type, info]) => (
            type !== BLOCK_TYPES.START && (
              <button
                key={type}
                onClick={() => {
                  addBlock(type);
                  setShowBlockMenu(false);
                }}
                className="w-full p-2.5 flex items-center gap-3 hover:bg-theme-action-menu-item-hover text-white transition-colors duration-300 group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center">
                  <div className="w-4 h-4 text-white">
                    {info.icon}
                  </div>
                </div>
                <div className="text-left flex-1">
                  <div className="text-sm font-medium">{info.label}</div>
                  <div className="text-xs text-white/60">{info.description}</div>
                </div>
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
}