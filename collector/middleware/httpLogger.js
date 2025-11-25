const httpLogger =
  ({ enableTimestamps = false }) =>
  (req, res, next) => {
    // Capture the original res.end to log response status
    const originalEnd = res.end;

    res.end = function (chunk, encoding) {
      // Log the request method, status code, and path
      const statusColor = res.statusCode >= 400 ? "\x1b[31m" : "\x1b[32m"; // Red for errors, green for success
      console.log(
        `\x1b[32m[HTTP]\x1b[0m ${statusColor}${res.statusCode}\x1b[0m ${
          req.method
        } -> ${req.path} ${
          enableTimestamps
            ? `@ ${new Date().toLocaleTimeString("en-US", { hour12: true })}`
            : ""
        }`.trim()
      );

      // Call the original end method
      return originalEnd.call(this, chunk, encoding);
    };

    next();
  };

module.exports = {
  httpLogger,
};
