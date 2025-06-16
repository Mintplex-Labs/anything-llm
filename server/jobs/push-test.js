const { log, conclude } = require('./helpers/index.js');
const webpush = require('web-push');
const { pushNotificationService } = require('../utils/PushNotifications');

(async () => {
  try {
    console.log('Testing push notification service...');
    const subscriptions = pushNotificationService.subscriptions;
    console.log(`Found ${subscriptions.length} subscriptions`);

    for (const subscription of subscriptions) {
      console.log(subscription);
      webpush.sendNotification(subscription, JSON.stringify({ title: 'Local Push', message: 'Hello, world!' }))
        .catch(err => {
          console.error('Failed to send notification', err);
        });
    }
  } catch (e) {
    console.error(e)
    log(`errored with ${e.message}`)
  } finally {
    conclude();
  }
})();
