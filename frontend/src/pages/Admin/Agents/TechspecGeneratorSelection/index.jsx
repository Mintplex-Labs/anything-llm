import React, { useEffect, useState } from "react";
import { FileDoc, Plus, PencilSimple } from "@phosphor-icons/react";
import { useModal } from "@/hooks/useModal";
import Admin from "@/models/admin";
import TemplateList from "./TemplateList";
import TemplateEditor from "./TemplateEditor";

export default function AgentTechspecGeneratorSelection({
  skill,
  settings,
  toggleSkill,
  enabled = false,
  setHasChanges,
}) {
  const { isOpen, openModal, closeModal } = useModal();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  
  // Default templates
  const DEFAULT_TEMPLATES = [
    {
      id: "architectural-decision-record",
      name: "Architectural Decision Record (ADR)",
      description: "Standard format for documenting architectural decisions",
      format: "markdown",
      template: `# Title: {title}

## Status
{status}

## Context
{context}

## Decision
{decision}

## Consequences
{consequences}

## References
{references}`
    },
    {
      id: "technical-design-document",
      name: "Technical Design Document (TDD)",
      description: "Comprehensive design document for technical implementation",
      format: "markdown",
      template: `# {project_name} Technical Design Document

## Overview
{overview}

## Goals and Non-Goals
### Goals
{goals}

### Non-Goals
{non_goals}

## Background
{background}

## Detailed Design
{detailed_design}

## System Architecture
{system_architecture}

## Alternative Approaches
{alternatives}

## Performance Considerations
{performance}

## Security Considerations
{security}

## Testing Plan
{testing_plan}

## Deployment Plan
{deployment_plan}

## Monitoring and Alerting
{monitoring}

## Future Work
{future_work}`
    },
    {
      id: "api-specification",
      name: "API Specification",
      description: "Detailed API endpoint documentation",
      format: "markdown",
      template: `# {api_name} API Specification

## Base URL
\`{base_url}\`

## Authentication
{authentication}

## Endpoints

### {endpoint_name}
- **URL:** \`{endpoint_path}\`
- **Method:** \`{http_method}\`
- **Description:** {endpoint_description}

#### Request Parameters
{request_parameters}

#### Request Body
\`\`\`json
{request_body}
\`\`\`

#### Response
\`\`\`json
{response_body}
\`\`\`

#### Error Codes
{error_codes}

## Rate Limiting
{rate_limiting}

## Versioning
{versioning}`
    }
  ];
  
  // Load templates from system preferences
  useEffect(() => {
    Admin.systemPreferencesByFields(["agent_techspec_templates"])
      .then((res) => {
        console.log("Retrieved techspec templates:", res?.settings?.agent_techspec_templates);
        const savedTemplates = res?.settings?.agent_techspec_templates ?? [];
        
        // If no templates saved yet, use defaults
        if (savedTemplates.length === 0) {
          setTemplates(DEFAULT_TEMPLATES);
        } else {
          setTemplates(savedTemplates);
        }
      })
      .catch(() => setTemplates(DEFAULT_TEMPLATES));
  }, []);

  // Immediately persist templates when they change
  useEffect(() => {
    if (templates.length > 0) {
      const data = {
        agent_techspec_templates: JSON.stringify(templates)
      };
      
      // Save to backend immediately
      Admin.updateSystemPreferences(data)
        .then(() => {
          console.log("Techspec templates saved:", templates);
        })
        .catch(err => console.error("Failed to save techspec templates:", err));
      
      // Mark form as having changes
      setHasChanges(true);
    }
  }, [templates, setHasChanges]);

  const handleAddTemplate = (newTemplate) => {
    setTemplates(prev => [...prev, { ...newTemplate, id: `template-${Date.now()}` }]);
  };

  const handleEditTemplate = (template) => {
    setCurrentTemplate(template);
    setEditModalOpen(true);
  };

  const handleUpdateTemplate = (updatedTemplate) => {
    setTemplates(prev => 
      prev.map(template => 
        template.id === updatedTemplate.id 
          ? updatedTemplate 
          : template
      )
    );
    setEditModalOpen(false);
    setCurrentTemplate(null);
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm("Are you sure you want to delete this template? This cannot be undone.")) {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
    }
  };

  return (
    <>
      <div className="p-2">
        <div className="flex flex-col gap-y-[18px] max-w-[500px]">
          <div className="flex items-center gap-x-2">
            <FileDoc
              size={24}
              color="var(--theme-text-primary)"
              weight="bold"
            />
            <label
              htmlFor="name"
              className="text-theme-text-primary text-md font-bold"
            >
              Techspec Generator
            </label>
            <label className="border-none relative inline-flex items-center ml-auto cursor-pointer">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={enabled}
                onChange={() => toggleSkill(skill)}
              />
              <div className="peer-disabled:opacity-50 pointer-events-none peer h-6 w-11 rounded-full bg-[#CFCFD0] after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:shadow-xl after:border-none after:bg-white after:box-shadow-md after:transition-all after:content-[''] peer-checked:bg-[#32D583] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-transparent"></div>
              <span className="ml-3 text-sm font-medium"></span>
            </label>
          </div>
          <p className="text-theme-text-secondary text-opacity-60 text-xs font-medium py-1.5">
            Generate technical specifications in customizable formats from your embedded documents and knowledge base.
          </p>
          {enabled && (
            <>
              <input
                name="system::agent_techspec_templates"
                type="hidden"
                value={JSON.stringify(templates)}
              />
              
              <div className="flex flex-col mt-2 gap-y-2">
                <p className="text-theme-text-primary font-semibold text-sm">
                  Available templates
                </p>
                <div className="flex flex-col gap-y-3">
                  <TemplateList 
                    templates={templates}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentTemplate({
                        name: "",
                        description: "",
                        format: "markdown",
                        template: ""
                      });
                      setEditModalOpen(true);
                    }}
                    className="w-fit relative flex h-[40px] items-center border-none hover:bg-theme-bg-secondary rounded-lg"
                  >
                    <div className="flex w-full gap-x-2 items-center p-4">
                      <div className="bg-theme-bg-secondary p-2 rounded-lg h-[24px] w-[24px] flex items-center justify-center">
                        <Plus
                          weight="bold"
                          size={14}
                          className="shrink-0 text-theme-text-primary"
                        />
                      </div>
                      <p className="text-left text-theme-text-primary text-sm">
                        New template
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <TemplateEditor
        isOpen={editModalOpen}
        closeModal={() => {
          setEditModalOpen(false);
          setCurrentTemplate(null);
        }}
        template={currentTemplate}
        onSave={currentTemplate?.id ? handleUpdateTemplate : handleAddTemplate}
      />
    </>
  );
} 