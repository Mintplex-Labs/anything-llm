import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import ModalWrapper from "@/components/ModalWrapper";
import { X, FileDoc } from "@phosphor-icons/react";

export default function TemplateEditor({ isOpen, closeModal, template, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    format: "markdown",
    template: "",
  });

  useEffect(() => {
    if (template) {
      setFormData({
        id: template.id,
        name: template.name || "",
        description: template.description || "",
        format: template.format || "markdown",
        template: template.template || "",
      });
    }
  }, [template]);

  if (!isOpen) return null;

  function handleClose() {
    setFormData({
      name: "",
      description: "",
      format: "markdown",
      template: "",
    });
    closeModal();
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Ensure we have all required fields
    if (!formData.name || !formData.template) {
      alert("Please fill in all required fields (name and template)");
      return;
    }
    
    onSave(formData);
  }

  return createPortal(
    <ModalWrapper isOpen={isOpen}>
      <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
        <div className="relative w-full max-w-4xl h-[80vh] bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border flex flex-col">
          <div className="relative p-6 border-b rounded-t border-theme-modal-border flex-shrink-0">
            <div className="w-full flex gap-x-2 items-center">
              <FileDoc size={24} weight="fill" className="text-blue-500" />
              <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
                {template?.id ? "Edit Template" : "Create New Template"}
              </h3>
            </div>
            <button
              onClick={handleClose}
              type="button"
              className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
            >
              <X size={24} weight="bold" className="text-white" />
            </button>
          </div>
          <form
            id="template-form"
            onSubmit={handleSubmit}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="px-7 py-6 flex-1 overflow-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex flex-col w-full">
                    <label className="block mb-2 text-sm font-medium text-white">
                      Template Name*
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                      placeholder="e.g., Technical Design Document"
                      required={true}
                      autoComplete="off"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block mb-2 text-sm font-medium text-white">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                      placeholder="Brief description of this template"
                      autoComplete="off"
                    />
                  </div>

                  <div className="flex flex-col w-full">
                    <label className="block mb-2 text-sm font-medium text-white">
                      Format
                    </label>
                    <select
                      name="format"
                      value={formData.format}
                      onChange={handleChange}
                      className="border-none bg-theme-settings-input-bg w-full text-white text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5"
                    >
                      <option value="markdown">Markdown</option>
                      <option value="html">HTML</option>
                      <option value="text">Plain Text</option>
                    </select>
                  </div>
                  
                  <div className="p-4 border border-theme-bg-primary rounded-lg bg-theme-bg-secondary">
                    <h4 className="text-white text-sm font-medium mb-2">Template Variables</h4>
                    <p className="text-theme-text-secondary text-xs mb-2">
                      Use variables in curly braces like {`{variable_name}`} in your template.
                      The agent will replace these with content from RAG data.
                    </p>
                    <div className="text-theme-text-secondary text-xs">
                      <p>Common variables:</p>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li>{`{title}`} - Main title of the document</li>
                        <li>{`{description}`} - Brief description</li>
                        <li>{`{content}`} - Main content</li>
                        <li>{`{author}`} - Author name</li>
                        <li>{`{date}`} - Current date</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col w-full h-full">
                  <label className="block mb-2 text-sm font-medium text-white">
                    Template*
                  </label>
                  <textarea
                    name="template"
                    value={formData.template}
                    onChange={handleChange}
                    className="border-none bg-theme-settings-input-bg w-full text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg focus:outline-primary-button active:outline-primary-button outline-none block w-full p-2.5 flex-1 font-mono h-[400px]"
                    placeholder="# {title}
                    
## Overview
{overview}

## Details
{details}"
                    required={true}
                    spellCheck={false}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-6 border-t border-theme-modal-border mt-auto">
              <button
                type="button"
                onClick={handleClose}
                className="transition-all duration-300 text-white hover:bg-zinc-700 light:hover:bg-theme-bg-primary px-4 py-2 rounded-lg text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="template-form"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                {template?.id ? "Update Template" : "Create Template"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ModalWrapper>,
    document.body
  );
} 