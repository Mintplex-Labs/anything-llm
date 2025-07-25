const { MobileDevice } = require("../../../models/mobileDevice");
const { SystemSettings } = require("../../../models/systemSettings");
const { User } = require("../../../models/user");

/**
 * Validates the device id from the request headers by checking if the device
 * exists in the database and is approved.
 * @param {import("express").Request} request
 * @param {import("express").Response} response
 * @param {import("express").NextFunction} next
 */
async function validDeviceToken(request, response, next) {
  try {
    const token = request.header("x-anythingllm-mobile-device-token");
    if (!token)
      return response.status(400).json({ error: "Device token is required" });

    const device = await MobileDevice.get(
      { token: String(token) },
      { user: true }
    );
    if (!device)
      return response.status(400).json({ error: "Device not found" });
    if (!device.approved)
      return response.status(400).json({ error: "Device not approved" });

    // If the device is associated with a user then we can associate it with the locals
    // so we can reuse it later.
    if (device.user) {
      if (device.user.suspended)
        return response.status(400).json({ error: "User is suspended." });
      response.locals.user = device.user;
    }

    delete device.user;
    response.locals.device = device;
    next();
  } catch (error) {
    console.error("validDeviceToken", error);
    response.status(500).json({ error: "Invalid middleware response" });
  }
}

/**
 * Validates a temporary registration token that is passed in the request
 * and associates the user with the token (if valid). Temporary token is consumed
 * and cannot be used again after this middleware is called.
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
async function validRegistrationToken(request, response, next) {
  try {
    const authHeader = request.header("Authorization");
    const tempToken = authHeader ? authHeader.split(" ")[1] : null;
    if (!tempToken)
      return response
        .status(400)
        .json({ error: "Registration token is required" });

    const tempTokenData = MobileDevice.tempToken(tempToken);
    if (!tempTokenData)
      return response
        .status(400)
        .json({ error: "Invalid or expired registration token" });

    // If in multi-user mode, we need to validate the user id
    // associated exists, is not banned and then associate with locals so we can reuse it later.
    // If not in multi-user mode then simply having a valid token is enough.
    const multiUserMode = await SystemSettings.isMultiUserMode();
    if (multiUserMode) {
      if (!tempTokenData.userId)
        return response
          .status(400)
          .json({ error: "User id not found in registration token" });
      const user = await User.get({ id: Number(tempTokenData.userId) });
      if (!user) return response.status(400).json({ error: "User not found" });
      if (user.suspended)
        return response
          .status(400)
          .json({ error: "User is suspended - cannot register device" });
      response.locals.user = user;
    }

    next();
  } catch (error) {
    console.error("validRegistrationToken:error", error);
    response.status(500).json({
      error: "Invalid middleware response from validRegistrationToken",
    });
  }
}

module.exports = {
  validDeviceToken,
  validRegistrationToken,
};
