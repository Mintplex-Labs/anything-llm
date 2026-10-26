const bcrypt = require("bcryptjs");

// Cost 10, the same cost used for stored passwords and recovery codes.
const DUMMY_HASH =
  "$2b$10$qzQR.bFtxgps4KO3T5MC/OuPm5I0FYBttMoqn6xd4YOBXYvEh10g.";

/**
 * Runs bcrypt comparisons against a throwaway hash so a request for a username
 * that does not exist takes as long as one for a username that does.
 * @param {string} value - The submitted password or code.
 * @param {number} times - How many comparisons the real check would have run.
 * @returns {false} Always false, since nothing can match the throwaway hash.
 */
function dummyHashCompare(value = "", times = 1) {
  for (let i = 0; i < times; i++) bcrypt.compareSync(String(value), DUMMY_HASH);
  return false;
}

module.exports = { dummyHashCompare };
