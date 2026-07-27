const path = require("path");
const fs = require("fs");
const { broadcast } = require("../broadcast");

const UPLOADS_DIR = path.join(process.env.HOME || "/home/agent", "uploads");

function registerUploadWebSocket(uploadWss) {
  uploadWss.on("connection", (ws) => {
    let currentUpload = null;

    ws.on("message", (data, isBinary) => {
      if (isBinary) {
        if (!currentUpload) {
          ws.send(JSON.stringify({ type: "upload_error", error: "No upload in progress" }));
          return;
        }
        try {
          fs.appendFileSync(currentUpload.path, data);
          currentUpload.received++;
          ws.send(JSON.stringify({ type: "chunk_ack", chunk: currentUpload.received }));
        } catch (err) {
          ws.send(JSON.stringify({ type: "upload_error", error: err.message }));
          currentUpload = null;
        }
        return;
      }

      let msg;
      try {
        msg = JSON.parse(data.toString());
      } catch {
        return;
      }

      if (msg.type === "upload_start") {
        try { fs.mkdirSync(UPLOADS_DIR, { recursive: true }); } catch {}
        const safeName = path
          .basename(msg.filename || "file")
          .replace(/[^a-zA-Z0-9._-]/g, "_");
        const destPath = path.join(UPLOADS_DIR, safeName);
        try { fs.writeFileSync(destPath, ""); } catch {}
        currentUpload = {
          id: msg.id,
          filename: safeName,
          path: destPath,
          size: msg.size,
          totalChunks: msg.totalChunks,
          received: 0,
        };
        console.log(
          `[upload] Starting: ${safeName} (${msg.size} bytes, ${msg.totalChunks} chunks)`,
        );
      } else if (msg.type === "upload_end") {
        if (currentUpload) {
          console.log(`[upload] Complete: ${currentUpload.filename}`);
          ws.send(
            JSON.stringify({
              type: "upload_complete",
              filename: currentUpload.filename,
              path: currentUpload.path,
            }),
          );
          broadcast({
            type: "agent_log",
            content: `[upload] File received: ${currentUpload.filename} → ~/uploads/`,
          });
          currentUpload = null;
        }
      }
    });

    ws.on("close", () => {
      currentUpload = null;
    });
  });
}

module.exports = { registerUploadWebSocket };
