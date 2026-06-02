const {
  getLocalUserStorageLayout,
  createLocalUserStorageManifest,
} = require("../../server/utils/swarmsy/localUserStorageContract");

function getDesktopStorageContract(options = {}) {
  const layout = getLocalUserStorageLayout(options);
  const manifest = createLocalUserStorageManifest({ layout });
  return { layout, manifest };
}

module.exports = {
  getDesktopStorageContract,
};
