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
            "Create up to 10 charts, graphs, or data visualizations. Generates bar charts, line graphs, pie charts, area charts, or scatter plots to visualize datasets, statistics, trends, or CSV/Excel results.",
          examples: [
            { prompt: "Create a chart from that data" },
            { prompt: "Make a bar graph of the results" },
            { prompt: "Visualize these numbers with three charts comparing sales, profit, and expenses" },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              charts: {
                type: "array",
                description: "An array of up to 10 charts to generate. Use this to display multiple metrics or trends dynamically.",
                items: {
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
                      description: "Title of the chart. Do not leave it blank.",
                    },
                    dataset: {
                      type: "string",
                      description: "Valid JSON array of objects for Recharts/Tremor API. Each element must be an object with 'name' (for the X-axis label) and value keys representing metrics. E.g. [{\"name\": \"Q1\", \"Sales\": 100, \"Profit\": 20}]. Provide JSON string only.",
                    }
                  },
                  required: ["type", "title", "dataset"]
                },
                minItems: 1,
                maxItems: 10
              },
              // Keep old parameters for fallback
              type: {
                type: "string",
                description: "Deprecated: The type of chart to be generated. Use the 'charts' array instead.",
              },
              title: {
                type: "string",
                description: "Deprecated: Title of the chart. Use the 'charts' array instead.",
              },
              dataset: {
                type: "string",
                description: "Deprecated: JSON dataset. Use the 'charts' array instead.",
              }
            },
            additionalProperties: true,
          },
          handler: async function (args) {
            try {
              let charts = [];
              if (Array.isArray(args.charts) && args.charts.length > 0) {
                charts = args.charts;
              } else if (args.type && args.dataset && args.title) {
                // Backwards compatibility fallback
                charts = [{ type: args.type, dataset: args.dataset, title: args.title }];
              } else {
                return "Error: Please provide a valid 'charts' array or the single chart parameters (type, title, dataset).";
              }

              if (this.tracker.isMarkedUnique(this.name)) {
                this.super.handlerProps.log(
                  `${this.name} has been called for this chat response already. It can only be called once per chat.`
                );
                return "The charts were generated and returned to the user. This function completed successfully.";
              }

              const parsedCharts = [];
              for (const chart of charts) {
                const data = safeJsonParse(chart.dataset, null);
                if (data === null) {
                  this.super.introspect(
                    `${this.caller}: ${this.name} provided invalid JSON data for chart "${chart.title}".`
                  );
                  return `Error: Invalid JSON dataset provided for chart "${chart.title}". Please only provide valid JSON.`;
                }
                parsedCharts.push({
                  type: chart.type,
                  dataset: data,
                  title: chart.title,
                });
              }

              this.super.introspect(`${this.caller}: Rendering ${parsedCharts.length} chart(s).`);
              
              // We support sending the array of charts directly
              this.super.socket.send("rechartVisualize", {
                charts: parsedCharts
              });

              // Generate QuickChart fallback images for markdown rendering
              const markdownImages = [];
              const quickchartEndpoint = (process.env.QUICKCHART_ENDPOINT || "https://quickchart.io").replace(/\/$/, "");

              for (const chart of parsedCharts) {
                try {
                  const dataset = chart.dataset;
                  if (Array.isArray(dataset) && dataset.length > 0) {
                    const keys = Object.keys(dataset[0]);
                    const labelKey = keys.includes("name") ? "name" : (keys.includes("label") ? "label" : keys[0]);
                    const labels = dataset.map(item => String(item[labelKey] || ""));
                    
                    const valueKeys = keys.filter(k => k !== labelKey && k !== "value");
                    if (keys.includes("value") && valueKeys.length === 0) {
                      valueKeys.push("value");
                    }
                    if (valueKeys.length === 0) valueKeys.push("value");

                    const chartColors = [
                      { border: "#4F46E5", background: "rgba(79, 70, 229, 0.2)" }, // indigo
                      { border: "#0D9488", background: "rgba(13, 148, 136, 0.2)" }, // teal
                      { border: "#E11D48", background: "rgba(225, 29, 72, 0.2)" }, // rose
                      { border: "#D97706", background: "rgba(217, 119, 6, 0.2)" }, // amber
                      { border: "#059669", background: "rgba(5, 150, 105, 0.2)" }, // emerald
                    ];

                    const datasets = valueKeys.map((key, index) => {
                      const color = chartColors[index % chartColors.length];
                      const isLine = chart.type === "line" || chart.type === "area";
                      return {
                        label: key,
                        data: dataset.map(item => Number(item[key]) || 0),
                        borderColor: color.border,
                        backgroundColor: chart.type === "line" ? "transparent" : color.background,
                        borderWidth: 2,
                        fill: chart.type === "area" || chart.type !== "line",
                      };
                    });

                    const chartConfig = {
                      type: chart.type === "area" ? "line" : (chart.type === "composed" ? "bar" : chart.type),
                      data: {
                        labels: labels,
                        datasets: datasets,
                      },
                      options: {
                        title: {
                          display: true,
                          text: chart.title,
                          fontSize: 16,
                          fontColor: "#1E293B",
                          fontFamily: "Segoe UI",
                        },
                        legend: {
                          position: "bottom",
                        }
                      }
                    };

                    const url = `${quickchartEndpoint}/chart?c=${encodeURIComponent(JSON.stringify(chartConfig))}&w=550&h=320&bkg=white`;
                    markdownImages.push(`![${chart.title}](${url})`);
                  }
                } catch (e) {
                  this.super.handlerProps.log(`Failed to generate QuickChart URL for "${chart.title}": ${e.message}`);
                }
              }

              const imageSection = markdownImages.length > 0 
                ? `\n\n### 📈 Ảnh đồ thị (có thể lưu về):\n${markdownImages.join("\n")}` 
                : "";

              this.super._replySpecialAttributes = {
                saveAsType: "rechartVisualize",
                storedResponse: (additionalText = "") =>
                  JSON.stringify({
                    charts: parsedCharts,
                    caption: `${additionalText}${imageSection}`,
                  }),
                postSave: () => this.tracker.removeUniqueConstraint(this.name),
              };

              this.tracker.markUnique(this.name);
              return `Successfully generated ${parsedCharts.length} chart(s) and returned to the user.${imageSection} Do not call this tool again.`;
            } catch (error) {
              this.super.handlerProps.log(
                `create-chart raised an error. ${error.message}`
              );
              return `An error was raised while generating the chart. ${error.message}`;
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
