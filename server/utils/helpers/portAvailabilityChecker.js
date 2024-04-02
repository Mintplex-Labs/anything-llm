// Get all loopback addresses that are available for use or binding.
function getLocalHosts() {
  const os = require("os");
  const interfaces = os.networkInterfaces();
  const results = new Set([undefined, "0.0.0.0"]);

  for (const _interface of Object.values(interfaces)) {
    for (const config of _interface) {
      results.add(config.address);
    }
  }

  return Array.from(results);
}

function checkPort(options = {}) {
  const net = require("net");
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on("error", reject);

    server.listen(options, () => {
      server.close(() => {
        resolve(true);
      });
    });
  });
}

async function isPortInUse(port, host) {
  try {
    await checkPort({ port, host });
    return true;
  } catch (error) {
    if (!["EADDRNOTAVAIL", "EINVAL"].includes(error.code)) {
      return false;
    }
  }
  return false;
}

module.exports = {
  isPortInUse,
  getLocalHosts,
};
