const { editMessage, upsertMessage } = require("../utils");
const { escapeHTML } = require("../utils/format");

function createThoughtHandler(ctx, chatId) {
  const thoughts = [];
  let messageId = null,
    lastText = "",
    pending = null,
    disposed = false;
  const format = (done) => {
    const header = done
      ? "✓ <b>Agent completed:</b>"
      : "🤔 <b>Agent is thinking:</b>";
    const icon = done ? "✓" : "⏳";
    const content = thoughts
      .map((thought) => {
        const escaped = escapeHTML(thought);
        return (
          icon +
          " " +
          (escaped.length > 100 ? escaped.slice(0, 100) + "..." : escaped)
        );
      })
      .join("\n");
    const body = header + "\n" + content;
    const tag = body.length > 200 ? "blockquote expandable" : "blockquote";
    return "<" + tag + ">" + body + "</blockquote>";
  };
  const timer = setInterval(() => {
    if (disposed || pending || !thoughts.length) return;
    const text = format(false);
    if (text === lastText) return;
    lastText = text;
    pending = upsertMessage(ctx.bot, chatId, messageId, text, ctx.log, {
      html: true,
      disableLinkPreview: true,
    })
      .then((id) => {
        messageId = id;
      })
      .catch(() => {})
      .finally(() => {
        pending = null;
      });
  }, 1500);
  return {
    append(text) {
      thoughts.push(text);
    },
    async complete() {
      disposed = true;
      clearInterval(timer);
      if (pending) await pending;
      if (messageId && thoughts.length)
        await editMessage(ctx.bot, chatId, messageId, format(true), ctx.log, {
          html: true,
          disableLinkPreview: true,
        });
    },
    dispose() {
      disposed = true;
      clearInterval(timer);
    },
  };
}

async function sendFilesAsTelegramDocuments(ctx, chatId, files) {
  const createFilesLib = require("../../agents/aibitat/plugins/create-files/lib");
  for (const file of files) {
    try {
      ctx.log?.info?.(`Retrieving file: ${file.storageFilename}`);
      const result = await createFilesLib.getGeneratedFile(
        file.storageFilename
      );
      if (!result?.buffer) {
        ctx.log?.warn?.(
          `Could not retrieve generated file: ${file.storageFilename}`
        );
        continue;
      }

      const extension = file.storageFilename.split(".").pop() || "";
      const mimeType = createFilesLib.getMimeType(extension);

      ctx.log?.info?.(
        `Sending document: ${file.filename} (${result.buffer.length} bytes, ${mimeType})`
      );
      await ctx.bot.sendDocument(
        chatId,
        result.buffer,
        { caption: file.filename },
        {
          filename: file.filename,
          contentType: mimeType,
        }
      );
      ctx.log?.info?.(`Successfully sent document: ${file.filename}`);
    } catch (err) {
      ctx.log?.error?.(
        `Failed to send document ${file.filename}:`,
        err.message
      );
    }
  }
}

/**
 * Render a chart to a PNG buffer using chartjs-node-canvas.
 * @param {object} chart - { type, title, dataset }
 * @returns {Promise<Buffer>}
 */
async function renderChartToBuffer(chart) {
  const { ChartJSNodeCanvas } = require("chartjs-node-canvas");
  const canvas = new ChartJSNodeCanvas({ width: 600, height: 400 });

  const data = JSON.parse(chart.dataset);
  const labels = data.map((d) => d.name);
  const valueKey = Object.keys(data[0]).find((k) => k !== "name");
  const values = data.map((d) => d[valueKey]);

  const config = {
    type: chart.type === "area" ? "line" : chart.type,
    data: {
      labels,
      datasets: [
        {
          label: chart.title,
          data: values,
          fill: chart.type === "area",
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
        },
      ],
    },
    options: {
      plugins: { title: { display: true, text: chart.title } },
    },
  };

  return await canvas.renderToBuffer(config);
}

module.exports = {
  createThoughtHandler,
  sendFilesAsTelegramDocuments,
  renderChartToBuffer,
};
