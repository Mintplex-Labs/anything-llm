async function fileUploadProgress(request, response, next) {
  let progress = 0;
  const fileSize = request.headers["content-length"]
    ? parseInt(request.headers["content-length"])
    : 0;

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
