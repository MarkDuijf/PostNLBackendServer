var express = require('express');
var router = express.Router();

const webpush = require('web-push');
const vapidKeys = {
    "publicKey":"BKGTzBboKnlzM8dhnoNQJBdLf-blbnvUTcD7Q3t8z3KKFx-KKYFtAchA9qAEIcxDCIH6m_XCZJP05cPLBLMB68E",
    "privateKey":"ShoZwyYBcqS3Sy3fQq5L3El6ANbha3U11YaZvSoInQ0"
};

webpush.setVapidDetails(
    'mailto:markduijf@dearnova.nl',
    vapidKeys.publicKey,
    vapidKeys.privateKey
);

var subs = [];

/* GET users listing. */
router.get('/allsubs', function(req, res, next) {
    res.send(subs);
  });

router.post('/newsub', function(req, res, next) {
    subs.push(req.body);
    res.send(subs);
  });

router.post('/sendnotifications', function(req, res, next) {
    

    const allSubscriptions = subs;
    
        console.log('Total subscriptions', allSubscriptions.length);
    
        const notificationPayload = {
            "notification": {
                "title": "Angular News",
                "body": "Newsletter Available!",
                "icon": "assets/main-page-logo-small-hat.png",
                "vibrate": [100, 50, 100],
                "data": {
                    "dateOfArrival": Date.now(),
                    "primaryKey": 1
                },
                "actions": [{
                    "action": "explore",
                    "title": "Go to the site"
                }]
            }
        };
    
        Promise.all(allSubscriptions.map(sub => webpush.sendNotification(
            sub, JSON.stringify(notificationPayload) )))
            .then(() => console.log('Newsletter sent successfully.'))
            .catch(err => {
                console.error("Error sending notification, reason: ", err);
            });

        res.send('notifications sent');
  });

  module.exports = router;


