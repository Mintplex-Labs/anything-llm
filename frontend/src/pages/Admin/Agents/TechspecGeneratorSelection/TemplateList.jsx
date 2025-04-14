import React from "react";
import { FileDoc, PencilSimple, Trash } from "@phosphor-icons/react";

export default function TemplateList({ templates, onEdit, onDelete }) {
  if (!templates || templates.length === 0) {
    return (
      <div className="text-theme-text-secondary text-center text-xs flex flex-col gap-y-2">
        <p>No templates found</p>
        <p>
          Add a template to get started with generating technical specifications.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-theme-bg-secondary text-white rounded-xl w-full">
      {templates.map((template, index) => (
        <div
          key={template.id}
          className={`py-3 px-4 flex items-center justify-between ${
            index === 0 ? "rounded-t-xl" : ""
          } ${
            index === templates.length - 1
              ? "rounded-b-xl"
              : "border-b border-white/10"
          }`}
        >
          <div className="flex items-center gap-x-3">
            <div className="bg-blue-600 p-1 rounded-md flex items-center justify-center w-8 h-8">
              <FileDoc size={18} weight="fill" className="text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold">{template.name}</div>
              <div className="text-xs text-theme-text-secondary">{template.description}</div>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <button
              type="button"
              onClick={() => onEdit(template)}
              className="text-theme-text-secondary hover:text-white p-1"
              title="Edit template"
            >
              <PencilSimple size={18} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(template.id)}
              className="text-theme-text-secondary hover:text-red-500 p-1"
              title="Delete template"
            >
              <Trash size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
} 