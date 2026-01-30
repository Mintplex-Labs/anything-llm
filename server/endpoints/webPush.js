const { reqBody } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { pushNotificationService } = require("../utils/PushNotifications");

function webPushEndpoints(app) {
  if (!app) return;

  app.post(
    "/web-push/subscribe",
    [validatedRequest],
    async (request, response) => {
      const subscription = reqBody(request);
      await pushNotificationService.registerSubscription(
        response.locals.user,
        subscription
      );
      response.status(201).json({});
    }
  );

  app.get("/web-push/pubkey", [validatedRequest], (_request, response) => {
    const publicKey = pushNotificationService.publicVapidKey;
    response.status(200).json({ publicKey });
  });

  // TODO: Remove this endpoint after testing
  app.get("/web-push/test", [validatedRequest], async (_request, response) => {
    if (response.locals.multiUserMode) {
      console.log("Sending notification to user");
      const { user } = response.locals;
      console.log(JSON.stringify(user, null, 2));
      pushNotificationService.sendNotification({
        to: user.id,
        payload: {
          title: `Hello, ${user.username}`,
          body: `This is a test notification for ${user.username} from AnythingLLM`,
        },
      });
      return response.status(200).json({});
    }

    console.log("Sending notification to primary user");
    pushNotificationService.sendNotification({
      to: "primary",
      payload: {
        title: "Test Notification",
        body: "This is a test notification",
      },
    });
    response.status(200).json({});
  });
}

module.exports = { webPushEndpoints };
