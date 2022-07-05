const fetch = require('node-fetch');
const db = require('../models/psql');

function handleMessage(sender_psid, received_message) {
  let response;

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
      text: `Howdy! Thanks for saying: "${received_message.text}". Now send me an image!`
    };
  } else {
    response = {
      text: 'I\'m not sure how to respond to that message yet!'
    };
  } 
  
  // Sends the response message
  callSendAPI(sender_psid, response);    
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  const request_body = {
    recipient: {
      id: sender_psid
    },
    message: response
  };
  console.log('trying to send');
  // Send the HTTP request to the Messenger Platform
  fetch(`https://graph.facebook.com/v2.6/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(request_body)
  })
    .then(() => console.log('message sent!'))
    .catch((err) => console.error(`Unable to send message: ${err}`)); 
  // .catch((err) => next({
  //   log: `webhookController - callSendAPI - fetch: ${err}`,
  //   message: { err: 'Unable to send message' }
  // }));
}

const webhookController = {};

webhookController.verify = (req, res, next) => {
  // Your verify token. Should be a random string.
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
    
  // Parse the query params
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
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

webhookController.parseMessage = (req, res, next) => {
  const { body } = req;
  
  console.log('**Received webhook:');
  console.dir(body, { depth: null });

  if (body.object === 'page') {
    body.entry.forEach((entry) => {

      entry.messaging.forEach(webhookEvent => {
        const senderPsid = webhookEvent.sender.id;
        console.log(`Sender PSID: ${senderPsid}`);
        
        if (senderPsid) {
          const psidQuery = 'SELECT * FROM customer WHERE psid = $1';

          db.query(psidQuery, [senderPsid])
            .then(data => {
              if (data.rows.length) {
                console.log('user in db: ', data.rows[0]);
                res.locals.userProfile = data[0];
                if ('message' in webhookEvent) {
                  handleMessage(senderPsid, webhookEvent.message);        
                }
                return next();
              }
              else {
                fetch(`https://graph.facebook.com/v11.0/${senderPsid}?fields=first_name,last_name,gender,locale,timezone&access_token=${process.env.PAGE_ACCESS_TOKEN}`)
                  .then(response => response.json())
                  .then(userProfileFetched => {
                    console.log('user found via GraphAPI: ', userProfileFetched);
                    res.locals.userProfile = userProfileFetched;

                    const { first_name, last_name, gender, locale, timezone } = userProfileFetched;
                    const addCustomerQuery = 'INSERT INTO customer (psid, first_name, last_name, gender, locale, timezone) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT DO NOTHING';
                    const addCustomerQueryValues = [senderPsid, first_name, last_name, gender, locale, timezone];

                    db.query(addCustomerQuery, addCustomerQueryValues)
                      .then(() => {
                        if ('message' in webhookEvent) {
                          handleMessage(senderPsid, webhookEvent.message);        
                        }
                        return next();
                      })
                      .catch(err => next({
                        log: `webhookController.parseMessage - addCustomerQuery: ${err}`,
                        message: { err: 'Profile not added' }
                      }));
                  })
                  .catch(err => next({
                    log: `webhookController.parseMessage - fetch: ${err}`,
                    message: { err: 'Profile not found' }
                  }));
              }
            })
            .catch(err => next({
              log: `webhookController.parseMessage - psidQuery: ${err}`,
              message: { err: 'Profile not found' }
            }));
        }
        // if ('message' in webhookEvent) {
        //   handleMessage(senderPsid, webhookEvent.message);        
        // }
        // else if ('postback' in webhook_event) {
        //   handlePostback(sender_psid, webhook_event.postback);
        // }
      });
    });
  }
  else return next({
    log: 'webhookController.parseMessage - event not from page subscription',
    status: 404,
    message: { err: 'Invalid event' }
  });
};

module.exports = webhookController;