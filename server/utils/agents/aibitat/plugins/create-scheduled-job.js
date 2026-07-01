const { ScheduledJob } = require("../../../../models/scheduledJob");
const { BackgroundService } = require("../../../BackgroundWorkers");
const {
  buildUtcCronFromSchedule,
  normalizeWeekdays,
} = require("../../../scheduling/cronFromLocal");

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Flatten the Scheduled Jobs tool catalog into a single Set of valid tool IDs.
 * @param {Awaited<ReturnType<typeof ScheduledJob.availableTools>>} catalog
 * @returns {Set<string>}
 */
function catalogIdSet(catalog) {
  const ids = new Set();
  for (const category of catalog) {
    for (const item of category.items || []) ids.add(item.id);
  }
  return ids;
}

/**
 * Filter the catalog down to tools that are configured and ready to use,
 * dropping anything still requiring setup (e.g. Gmail/Calendar/Outlook with no
 * credentials, SQL with no connection). This mirrors the manual Scheduled Jobs
 * UI, which disables selection of `requiresSetup` tools. A tool is treated as
 * not-ready if either the item or its category is flagged `requiresSetup`.
 * @param {Awaited<ReturnType<typeof ScheduledJob.availableTools>>} catalog
 * @returns {Awaited<ReturnType<typeof ScheduledJob.availableTools>>}
 */
function readyToolsCatalog(catalog) {
  return catalog
    .map((category) => ({
      ...category,
      items: (category.items || []).filter(
        (item) => !item.requiresSetup && !category.requiresSetup
      ),
    }))
    .filter((category) => category.items.length > 0);
}

/**
 * Render the tool catalog as a readable, grouped text block for the agent.
 * @param {Awaited<ReturnType<typeof ScheduledJob.availableTools>>} catalog
 * @returns {string}
 */
function renderCatalog(catalog) {
  if (!catalog?.length) return "No tools are available for scheduled jobs.";
  return catalog
    .map((category) => {
      const lines = (category.items || []).map((item) => {
        const setup = item.requiresSetup ? " [requires setup]" : "";
        const desc = item.description ? ` - ${item.description}` : "";
        return `  - ${item.id}${setup}${desc}`;
      });
      return `${category.name}:\n${lines.join("\n")}`;
    })
    .join("\n\n");
}

/**
 * Build an actionable correction message when the agent passes tool IDs that
 * can't be used. Separates tools that exist but still need setup from IDs that
 * don't exist at all, then lists the ready-to-use catalog to choose from.
 * @param {string[]} rejected - The tool IDs that were not in the ready catalog.
 * @param {Awaited<ReturnType<typeof ScheduledJob.availableTools>>} fullCatalog
 * @param {Awaited<ReturnType<typeof ScheduledJob.availableTools>>} readyCatalog
 * @returns {string}
 */
function rejectedToolsMessage(rejected, fullCatalog, readyCatalog) {
  const allIds = catalogIdSet(fullCatalog);
  const needsSetup = rejected.filter((id) => allIds.has(id));
  const unknown = rejected.filter((id) => !allIds.has(id));

  const lines = [];
  if (needsSetup.length > 0)
    lines.push(
      `These tools exist but are not configured yet, so they can't be added to a job: ${needsSetup.join(
        ", "
      )}. The user must set them up first in Settings > Agent Skills.`
    );
  if (unknown.length > 0)
    lines.push(`These tool IDs are not valid: ${unknown.join(", ")}.`);

  return `${lines.join(
    "\n"
  )}\n\nChoose only from these ready-to-use tools:\n\n${renderCatalog(
    readyCatalog
  )}`;
}

/**
 * Build a human-readable description of the schedule for the success message.
 * @param {object} args - The structured schedule args.
 * @param {string} timezone - The resolved IANA timezone.
 * @returns {string}
 */
function describeSchedule(args, timezone) {
  const minute = Number.isInteger(args.minute) ? args.minute : 0;
  const hhmm = (h, m) =>
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  switch (args.frequency) {
    case "minute": {
      const n = args.minuteInterval || 1;
      return n === 1 ? "every minute" : `every ${n} minutes`;
    }
    case "hour":
      return `every hour at :${String(minute).padStart(2, "0")}`;
    case "day":
      return `daily at ${hhmm(args.hour, minute)} ${timezone}`;
    case "week": {
      const days = normalizeWeekdays(args.weekdays)
        .map((d) => WEEKDAY_NAMES[d])
        .join(", ");
      return `weekly on ${days} at ${hhmm(args.hour, minute)} ${timezone}`;
    }
    case "month":
      return `monthly on day ${args.dayOfMonth || 1} at ${hhmm(args.hour, minute)} ${timezone}`;
    default:
      return args.frequency;
  }
}

const createScheduledJob = {
  name: "create-scheduled-job",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        aibitat.function({
          super: aibitat,
          name: this.name,
          description:
            "Create a recurring Scheduled Job that automatically runs an agent prompt on a schedule (e.g. 'every weekday at 9am summarize my inbox and email me'). " +
            "Provide a STRUCTURED schedule (frequency + local time) - do NOT write cron expressions and do NOT convert times to UTC yourself; the server handles timezone conversion. " +
            "Hours are interpreted in the user's local timezone, which is detected automatically. Only pass `timezone` if the user explicitly asks for a different timezone (e.g. 'in London time'). " +
            "IMPORTANT - the job runs later on its own with NO chat context and can ONLY use the tools you list in `tools`. Think about what the prompt needs to actually accomplish the task (e.g. searching the web, scraping a page, sending email) and pass those tool IDs. " +
            "If you are unsure which tool IDs exist, FIRST call this tool with `listTools: true` to get the catalog, then call it again with your chosen `tools`. " +
            "If you omit `tools`, the job will run with NO tools (only the base language model) - so always pass the tools the task needs.",
          examples: [
            {
              prompt: "Every weekday at 9am summarize my inbox and email me",
              call: JSON.stringify({
                name: "Weekday inbox summary",
                prompt:
                  "Summarize my unread inbox emails and send me a summary email.",
                frequency: "week",
                hour: 9,
                minute: 0,
                weekdays: [1, 2, 3, 4, 5],
                tools: [
                  "gmail-agent#gmail-get-inbox",
                  "gmail-agent#gmail-send-email",
                ],
              }),
            },
            {
              prompt: "What tools can a scheduled job use?",
              call: JSON.stringify({ listTools: true }),
            },
          ],
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              listTools: {
                type: "boolean",
                description:
                  "If true, ignore all other arguments and return the catalog of valid tool IDs that can be passed in `tools`. Call this first if unsure which tool IDs to use.",
              },
              name: {
                type: "string",
                description:
                  "Short, human-readable name for the scheduled job.",
              },
              prompt: {
                type: "string",
                description:
                  "The instruction the agent will execute each time the job runs. Be specific and self-contained - the job runs later with no chat context.",
              },
              frequency: {
                type: "string",
                enum: ["minute", "hour", "day", "week", "month"],
                description:
                  "How often the job runs: 'minute' (every N minutes), 'hour' (at minute M of every hour), 'day', 'week' (on specific weekdays), or 'month' (on a day of month).",
              },
              minuteInterval: {
                type: "integer",
                minimum: 1,
                maximum: 59,
                description:
                  "Only for frequency='minute'. Run every N minutes.",
              },
              minute: {
                type: "integer",
                minimum: 0,
                maximum: 59,
                description:
                  "Minute of the hour (0-59). Used for frequency hour/day/week/month. Defaults to 0.",
              },
              hour: {
                type: "integer",
                minimum: 0,
                maximum: 23,
                description:
                  "Hour of the day in the user's LOCAL time (0-23). Required for frequency day/week/month.",
              },
              weekdays: {
                type: "array",
                items: { type: "integer", minimum: 0, maximum: 6 },
                description:
                  "Only for frequency='week'. Days to run on, where 0=Sunday, 1=Monday, ... 6=Saturday.",
              },
              dayOfMonth: {
                type: "integer",
                minimum: 1,
                maximum: 31,
                description:
                  "Only for frequency='month'. Day of the month (1-31).",
              },
              timezone: {
                type: "string",
                description:
                  "Optional IANA timezone override (e.g. 'America/New_York'). Only set this if the user explicitly names a timezone; otherwise the user's detected timezone is used.",
              },
              tools: {
                type: "array",
                items: { type: "string" },
                description:
                  "The tool IDs (from `listTools`) the job is allowed to use when it runs. The job can ONLY use tools listed here, so include every tool the prompt needs to do its work. Omit only if the task genuinely needs no tools - the job will then run with no tools at all.",
              },
            },
            additionalProperties: false,
          },
          handler: async function (args = {}) {
            try {
              return await this.execute(args);
            } catch (error) {
              const message = error?.message ?? JSON.stringify(error);
              this.super.handlerProps.log(
                `create-scheduled-job error: ${message}`
              );
              this.super.introspect(
                `${this.caller}: Failed to create scheduled job: ${message}`
              );
              return `There was an error creating the scheduled job: ${message}`;
            }
          },

          execute: async function (args) {
            // Only offer tools that are configured and ready to use - a job
            // can't use a tool that still needs setup (e.g. Gmail without
            // credentials), exactly like the manual Scheduled Jobs UI.
            const fullCatalog = await ScheduledJob.availableTools();
            const catalog = readyToolsCatalog(fullCatalog);

            // Discovery mode: return the catalog of valid tool IDs.
            if (args.listTools === true) {
              return `Tools available to scheduled jobs (pass any of these IDs in the \`tools\` argument):\n\n${renderCatalog(
                catalog
              )}`;
            }

            // Required fields.
            if (!args.name?.trim()) return "A job `name` is required.";
            if (!args.prompt?.trim()) return "A job `prompt` is required.";
            if (!args.frequency) return "A `frequency` is required.";

            // Hour-bearing frequencies need an hour.
            if (
              ["day", "week", "month"].includes(args.frequency) &&
              !Number.isInteger(args.hour)
            ) {
              return `For a '${args.frequency}' schedule you must provide an \`hour\` (0-23) in the user's local time.`;
            }

            // Resolve the timezone: explicit override > detected (handlerProps) > UTC.
            const timezone =
              args.timezone || this.super.handlerProps.timezone || "UTC";

            // Build the UTC cron. Invalid IANA timezones throw a RangeError here.
            let cron;
            try {
              cron = buildUtcCronFromSchedule({ ...args, timezone });
            } catch (error) {
              if (error instanceof RangeError) {
                return `'${timezone}' is not a valid IANA timezone. Ask the user for their timezone (e.g. 'America/New_York') or omit it to use their detected timezone.`;
              }
              throw error;
            }

            if (!ScheduledJob.isValidCron(cron)) {
              return `The schedule produced an invalid cron expression (${cron}). Please retry with a clearer schedule.`;
            }

            // Resolve the tools the job may use. A scheduled job can ONLY use
            // the tools stored on it, and - exactly like the manual Scheduled
            // Jobs UI - no tools selected means the job runs with NO tools (see
            // server/jobs/run-scheduled-job.js). If the agent supplied tools,
            // validate them against the catalog; otherwise store null.
            let tools = null;
            if (Array.isArray(args.tools) && args.tools.length > 0) {
              const readyIds = catalogIdSet(catalog);
              const rejected = args.tools.filter((id) => !readyIds.has(id));

              if (rejected.length > 0)
                return rejectedToolsMessage(rejected, fullCatalog, catalog);

              tools = args.tools;
            }

            // New jobs are enabled by default, so creating one is an activation.
            const activation = await ScheduledJob.canActivate();
            if (!activation.allowed) {
              return `Cannot create the job: the maximum of ${activation.limit} active scheduled jobs has been reached. Ask the user to disable an existing job first.`;
            }

            const { job, error } = await ScheduledJob.create({
              name: args.name.trim(),
              prompt: args.prompt.trim(),
              tools,
              schedule: cron,
            });
            if (error) return `Failed to create the scheduled job: ${error}`;

            // Register the job with the live scheduler. BackgroundService is a
            // singleton, so this is the same instance the server booted.
            new BackgroundService().addScheduledJob(job);

            this.super.introspect(
              `${this.caller}: Created scheduled job "${job.name}" (cron ${cron}).`
            );

            const human = describeSchedule(args, timezone);
            const nextRun = job.nextRunAt
              ? new Date(job.nextRunAt).toISOString()
              : "unknown";

            // Emit a clickable "job created" card in the chat the user can
            // click to open the job, mirroring how file-download cards work:
            // send it live over the socket AND register it as a pending output
            // so it persists and re-renders when the chat is reloaded.
            const cardPayload = {
              jobId: job.id,
              jobName: job.name,
              schedule: human,
              nextRun,
            };
            this.super.socket?.send?.("scheduledJobCreated", cardPayload);
            if (!Array.isArray(this.super._pendingOutputs))
              this.super._pendingOutputs = [];
            this.super._pendingOutputs.push({
              type: "scheduledJobCreated",
              payload: cardPayload,
            });

            const toolNote = tools?.length
              ? `It may use these tools: ${tools.join(", ")}.`
              : "No tools were selected, so it runs with no tools (base language model only).";
            return (
              `Created scheduled job "${job.name}" (#${job.id}). It runs ${human} ` +
              `(cron \`${cron}\` in UTC). ${toolNote} Next run: ${nextRun}. ` +
              `The user can manage it from Settings > Scheduled Jobs.`
            );
          },
        });
      },
    };
  },
};

module.exports = { createScheduledJob };
