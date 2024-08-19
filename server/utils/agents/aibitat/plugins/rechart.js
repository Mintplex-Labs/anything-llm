const { safeJsonParse } = require("../../../http");
const { Deduplicator } = require("../utils/dedupe");

const rechart = {
  name: "create-chart",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        // Scrape a website and summarize the content based on objective if the content is too large.',
        aibitat.function({
          super: aibitat,
          name: this.name,
          tracker: new Deduplicator(),
          description:
            "Generates the JSON data required to generate a RechartJS chart to the user based on their prompt and available data.",
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: [
                  "area",
                  "bar",
                  "line",
                  "composed",
                  "scatter",
                  "pie",
                  "radar",
                  "radialBar",
                  "treemap",
                  "funnel",
                ],
                description: "The type of chart to be generated.",
              },
              title: {
                type: "string",
                description:
                  "Title of the chart. There MUST always be a title. Do not leave it blank.",
              },
              dataset: {
                type: "string",
                description: `Valid JSON in which each element is an object for Recharts API for the 'type' of chart defined WITHOUT new line characters. Strictly using this FORMAT and naming:
{ "name": "a", "value": 12 }].
Make sure field "name" always stays named "name". Instead of naming value field value in JSON, name it based on user metric and make it the same across every item.
Make sure the format use double quotes and property names are string literals. Provide JSON data only.`,
              },
            },
            additionalProperties: false,
          },
          required: ["type", "title", "dataset"],
          handler: async function ({ type, dataset, title }) {
            try {
              if (!this.tracker.isUnique(this.name)) {
                this.super.handlerProps.log(
                  `${this.name} has been run for this chat response already. It can only be called once per chat.`
                );
                return "The chart was generated and returned to the user. This function completed successfully. Do not call this function again.";
              }

              const data = safeJsonParse(dataset, null);
              if (data === null) {
                this.super.introspect(
                  `${this.caller}: ${this.name} provided invalid JSON data - so we cant make a ${type} chart.`
                );
                return "Invalid JSON provided. Please only provide valid RechartJS JSON to generate a chart.";
              }

              this.super.introspect(`${this.caller}: Rendering ${type} chart.`);
              this.super.socket.send("rechartVisualize", {
                type,
                dataset,
                title,
              });

              this.super._replySpecialAttributes = {
                saveAsType: "rechartVisualize",
                storedResponse: (additionalText = "") =>
                  JSON.stringify({
                    type,
                    dataset,
                    title,
                    caption: additionalText,
                  }),
                postSave: () => this.tracker.removeUniqueConstraint(this.name),
              };

              this.tracker.markUnique(this.name);
              return "The chart was generated and returned to the user. This function completed successfully. Do not make another chart.";
            } catch (error) {
              this.super.handlerProps.log(
                `create-chart raised an error. ${error.message}`
              );
              return `Let the user know this action was not successful. An error was raised while generating the chart. ${error.message}`;
            }
          },
        });
      },
    };
  },
};

module.exports = {
  rechart,
};
