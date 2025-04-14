const { SystemSettings } = require("../../../../../models/systemSettings");
const { safeJsonParse } = require("../../../../http");
const markdown = require('markdown-it')();

module.exports.TechspecGeneratorGenerate = {
  name: "techspec-generate",
  plugin: function () {
    return {
      name: "techspec-generate",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Generate a technical specification document using a template and specified content. The template must exist in the system's library.",
          examples: [
            {
              prompt: "Generate a technical design document for our new authentication system",
              call: JSON.stringify({
                template_id: "technical-design-document",
                title: "Authentication System Redesign",
                content: {
                  project_name: "Auth System Redesign",
                  overview: "A complete overhaul of our authentication system to implement OAuth 2.0 and MFA.",
                  goals: "Improve security, support multiple authentication providers, implement MFA",
                  non_goals: "Changing the authorization system, modifying user roles and permissions",
                  background: "Our current authentication system is based on a custom implementation that lacks modern security features.",
                  detailed_design: "The new system will use OAuth 2.0 with JWT tokens for authentication..."
                }
              }),
            },
            {
              prompt: "Create an API specification for our payment API",
              call: JSON.stringify({
                template_id: "api-specification",
                title: "Payment Processing API",
                content: {
                  api_name: "Payment Processing API",
                  base_url: "https://api.example.com/v1",
                  authentication: "Bearer token authentication required for all endpoints",
                  endpoint_name: "Create Payment",
                  endpoint_path: "/payments",
                  http_method: "POST",
                  endpoint_description: "Creates a new payment transaction",
                  request_parameters: "None",
                  request_body: "{ \"amount\": 100, \"currency\": \"USD\", \"description\": \"Payment for order #1234\" }",
                  response_body: "{ \"id\": \"pay_123\", \"status\": \"succeeded\", \"amount\": 100 }",
                  error_codes: "400 - Invalid request, 401 - Unauthorized, 402 - Payment required",
                  rate_limiting: "100 requests per minute per API key",
                  versioning: "API versioning is done through the URL path prefix (e.g., /v1/)"
                }
              }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              template_id: {
                type: "string",
                description:
                  "The ID of the template to use for generation (e.g., 'technical-design-document')",
              },
              title: {
                type: "string",
                description:
                  "Title of the generated document",
              },
              content: {
                type: "object",
                description:
                  "Key-value pairs where keys are template variables and values are their replacements",
                additionalProperties: {
                  type: "string"
                }
              },
              output_format: {
                type: "string",
                enum: ["markdown", "html", "text"],
                description:
                  "Output format of the document (defaults to template's format)",
              },
            },
            required: ["template_id", "title"],
            additionalProperties: false,
          },
          handler: async function ({ template_id, title, content = {}, output_format }) {
            this.super.handlerProps.log(`Using the techspec-generate tool.`);
            this.super.introspect(
              `${this.caller}: Generating a technical specification using template "${template_id}".`
            );

            try {
              // Default templates in case no custom templates are found
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

              // Get all templates from system settings
              const allTemplates = safeJsonParse(
                (await SystemSettings.get({ label: "agent_techspec_templates" }))?.value,
                DEFAULT_TEMPLATES
              );
              
              // Find the requested template
              const template = allTemplates.find(t => t.id === template_id);
              
              if (!template) {
                return JSON.stringify({
                  error: `Template with ID "${template_id}" not found.`,
                  available_templates: allTemplates.map(t => ({ id: t.id, name: t.name }))
                });
              }
              
              // Determine output format
              const format = output_format || template.format || "markdown";
              
              // Add title to content
              const mergedContent = {
                title,
                ...content
              };
              
              // Replace template variables
              let result = template.template;
              const missingVariables = [];
              
              // Find all variables in the template
              const variableRegex = /{([^{}]+)}/g;
              const variables = [...template.template.matchAll(variableRegex)].map(match => match[1]);
              
              // Replace each variable with its content
              variables.forEach(variable => {
                const value = mergedContent[variable];
                if (value) {
                  result = result.replace(new RegExp(`{${variable}}`, 'g'), value);
                } else {
                  // Keep the variable placeholder but note it's missing
                  missingVariables.push(variable);
                }
              });
              
              // If we're converting to HTML and the template is markdown
              let htmlOutput = null;
              if (format === 'html' && template.format === 'markdown') {
                htmlOutput = markdown.render(result);
              }
              
              return JSON.stringify({
                title,
                template_id,
                content: result,
                html: htmlOutput,
                format,
                missing_variables: missingVariables.length > 0 ? missingVariables : undefined
              });
            } catch (error) {
              this.super.handlerProps.log(
                `techspec-generate tool reported error`,
                error.message
              );
              this.super.introspect(`Error: ${error.message}`);
              return JSON.stringify({
                error: `Error generating techspec: ${error.message}`
              });
            }
          },
        });
      },
    };
  },
}; 