
import React, { useState } from 'react'
import { CaretDown, CaretUp } from '@phosphor-icons/react';
export default function Collapsible({ title = "Show More", hideTitle = "Show Less", children }) {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div className={`${!collapsed && "mb-4"} w-full`}>
            <button
                className={`flex items-center text-[var(--theme-button-primary)] ${!collapsed && "mb-2"}`}
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? title : hideTitle}
                {collapsed ? <CaretDown /> : <CaretUp />}
            </button>

            <div
                 className={`transition-[max-height,opacity,padding] duration-500 ease-in-out overflow-hidden bg-[var(--theme-text-primary)] rounded 
                    ${collapsed ? 
                        "max-h-0 p-2 opacity-0" : 
                        "max-h-96 p-3 opacity-100"
                    }`}
            >
                {children}
            </div>
        </div>
    );
}