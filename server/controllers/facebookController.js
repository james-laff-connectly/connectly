const fetch = require('node-fetch');
const db = require('../models/psql');

const respond = require('../services/respond');

const facebookController = {};

facebookController.verify = (req, res, next) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.locals.challenge = challenge;
      return next();
    }
    else return next({
      log: 'webhookController.verify - mode or token incorrect',
      status: 403,
      message: { err: 'Forbidden' }
    });
  }
  else return next({
    log: 'webhookController.verify - mode or token not found',
    status: 403,
    message: { err: 'Forbidden' }
  });
};

facebookController.parseMessage = (req, res, next) => {
  const { body } = req;
  
  console.log('**Received webhook:');
  console.dir(body, { depth: null });

  if (body.object === 'page') {
    body.entry.forEach(entry => {

      entry.messaging.forEach(async (webhookEvent) => {
        // TODO: should account for user_ref alternative to senderPsid
        const senderPsid = webhookEvent.sender.id;
        
        const setTypingOn = await fetch(`https://graph.facebook.com/v14.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            recipient: {
              id: senderPsid
            },
            sender_action: 'typing_on'
          })
        });
        if (setTypingOn.status !== 200) {
          console.error('facebookController.parseMessage - failed to set typing_on');
        }
        

        let psidQuery;
        const psidQueryText = 'SELECT * FROM customer WHERE psid = $1';
        
        try {
          psidQuery = await db.query(psidQueryText, [senderPsid]);
        }
        catch(err) {
          // would want to set up a queue to hold messages that lead to errors
          console.error(`webhookController.parseMessage - psidQuery: ${err}`);
          return next();
        }

        if (psidQuery.rows.length) {
          console.log('user in db: ', psidQuery.rows[0]);
          res.locals.userProfile = psidQuery.rows[0];
          respond.handleMessaging(res.locals.userProfile, webhookEvent);        
          return next();
        }
        else {
          const fetchUser = await fetch(`https://graph.facebook.com/v11.0/${senderPsid}?fields=first_name,last_name,gender,locale,timezone&access_token=${process.env.PAGE_ACCESS_TOKEN}`);
          if (fetchUser.status !== 200) {
            console.error('facebookController.parseMessage - failed to fetch profile data');
          }
          
          const userProfileFetched = await fetchUser.json();

          console.log('user found via GraphAPI: ', userProfileFetched);
          res.locals.userProfile = userProfileFetched;

          const { first_name, last_name, gender, locale, timezone } = userProfileFetched;
          const addCustomerQuery = 'INSERT INTO customer (psid, first_name, last_name, gender, locale, timezone) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING';
          const addCustomerQueryValues = [senderPsid, first_name, last_name, gender, locale, timezone];

          try {
            await db.query(addCustomerQuery, addCustomerQueryValues);
          }
          catch(err) {
            // would want to set up a queue to hold messages that lead to errors
            console.error(`webhookController.parseMessage - addCustomerQuery: ${err}`);
            return next();
          }
          
          respond.handleMessaging(res.locals.userProfile, webhookEvent);
          return next();
        }
      });
    });
  }
  else return next({
    log: 'webhookController.parseMessage - event not from page subscription',
    status: 404,
    message: { err: 'Invalid event' }
  });
};

module.exports = facebookController;