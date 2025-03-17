
import React, { useState } from 'react'
import { CaretDown, CaretUp } from '@phosphor-icons/react';
export default function Collapsible({ title = "Show More", hideTitle = "Show Less", children }) {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div className="w-full">
            <button
                className={`flex items-center w-full  justify-between bg-[var(--think-header-bg)] ${!collapsed && "mb-2"} py-2 px-3 rounded border common-hover`}
                onClick={() => setCollapsed(!collapsed)}
            >
                {collapsed ? title : hideTitle}
                {collapsed ? <CaretDown /> : <CaretUp />}
            </button>

            <div
                className={`transition-all duration-300 overflow-hidden italic ${collapsed ? "max-h-0 opacity-0" : "p-4  bg-[var(--think-content-bg)] rounded max-h-auto opacity-100"
                    }`}
            >
                {children}
            </div>
        </div>
    );
}