const VALID_PROTOCOLS = ["https:", "http:"];

function validURL(url) {
  try {
    const destination = new URL(url);
    if (!VALID_PROTOCOLS.includes(destination.protocol)) return false;
    return true;
  } catch {}
  return false;
}

module.exports = {
  validURL,
};
