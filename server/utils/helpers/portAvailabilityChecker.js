const net = require("net");

function isPortInUse(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        resolve(true);
      } else {
        reject(false);
      }
    });

    server.on("listening", () => {
      server.close();
      resolve(false);
    });

    server.listen(port);
  });
}

module.exports = isPortInUse;
