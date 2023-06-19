async function fileUploadProgress(request, response, next) {
  let progress = 0;
  const fileSize = request.headers["content-length"]
    ? parseInt(request.headers["content-length"])
    : 0;

  // Note(tcarambat): While this is chunked it does not stream back to the UI for some reason.
  // It just waits for the entire requests to finish. Likely because it is not using EventSource on frontend
  // which is limited to GET.
  // TODO: Someone smarter than me add streaming here to report back real-time progress.
  response.writeHead(200);
  request.on("data", (chunk) => {
    progress += chunk.length;
    const percentage = (progress / fileSize) * 100;
    response.write(`${JSON.stringify({ progress, fileSize, percentage })}\n`);
    if (progress >= fileSize) {
      response.end();
    }
  });

  next();
}

module.exports = {
  fileUploadProgress,
};
