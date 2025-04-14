const { SystemSettings } = require("../../../../../models/systemSettings");
const { safeJsonParse } = require("../../../../http");

module.exports.TechspecGeneratorListTemplates = {
  name: "techspec-list-templates",
  plugin: function () {
    return {
      name: "techspec-list-templates",
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "List all available technical specification templates that can be used to generate documentation.",
          examples: [
            {
              prompt: "What techspec templates are available?",
              call: JSON.stringify({}),
            },
            {
              prompt: "Show me available specification formats",
              call: JSON.stringify({}),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          handler: async function () {
            this.super.handlerProps.log(`Using the techspec-list-templates tool.`);
            this.super.introspect(
              `${this.caller}: Getting a list of available techspec templates.`
            );

            // Default templates in case no custom templates are found
            const DEFAULT_TEMPLATES = [
              {
                id: "architectural-decision-record",
                name: "Architectural Decision Record (ADR)",
                description: "Standard format for documenting architectural decisions",
                format: "markdown"
              },
              {
                id: "technical-design-document",
                name: "Technical Design Document (TDD)",
                description: "Comprehensive design document for technical implementation",
                format: "markdown"
              },
              {
                id: "api-specification",
                name: "API Specification",
                description: "Detailed API endpoint documentation",
                format: "markdown"
              }
            ];

            try {
              // Get the templates from system settings
              const templates = safeJsonParse(
                (await SystemSettings.get({ label: "agent_techspec_templates" }))?.value,
                DEFAULT_TEMPLATES
              );
              
              // Don't expose the actual template content, just metadata
              const templateMetadata = templates.map(template => {
                const { template: _, ...meta } = template;
                return meta;
              });
              
              return JSON.stringify({
                templates: templateMetadata,
                count: templateMetadata.length
              });
            } catch (error) {
              this.super.handlerProps.log(
                `techspec-list-templates tool reported error`,
                error.message
              );
              this.super.introspect(`Error: ${error.message}`);
              return JSON.stringify({
                error: `Error listing techspec templates: ${error.message}`,
                templates: DEFAULT_TEMPLATES.map(template => {
                  const { template: _, ...meta } = template;
                  return meta;
                })
              });
            }
          },
        });
      },
    };
  },
}; 