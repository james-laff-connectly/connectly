const fetch = require('node-fetch');
const db = require('../models/psql');

const respond = {};

respond.handleMessaging = function(userProfile, webhookEvent) {
  let response;

  // Received message with quick reply
  if (webhookEvent.message && webhookEvent.message?.quick_reply) {
    const quickReplyPayload = webhookEvent.message.quick_reply.payload;
    console.log('received message: ', quickReplyPayload);
    if (quickReplyPayload === 'feedback') {
      respond.sendFeedbackTemplate(webhookEvent.recipient.id, 1, userProfile.psid);
    }
    else if (quickReplyPayload === 'psid') {
      response = {
        text: `Okay - your PSID is ${userProfile.psid}. Enter it on the dashboard to demo a completed transaction.`
      };
    }
    else if (quickReplyPayload === 'agent') {
      response = {
        text: 'Okay - let me get someone who can help. (Demo ends here.)'
      };
    }
    else {
      response = {
        text: 'Okay. Is there anything else I can do to help?'
      };  
    }
  }

  // Received message with text
  else if (webhookEvent.message && webhookEvent.message?.text) {
    const messageText = webhookEvent.message.text;
    console.log('received message: ', messageText);
    response = {
      text: `Hi ${userProfile.first_name}! How can I help you?`,
      quick_replies: [
        {
          content_type: 'text',
          title: 'Share feedback',
          payload: 'feedback'
        },
        {
          content_type: 'text',
          title: 'Speak to an agent',
          payload: 'agent'
        },
        {
          content_type: 'text',
          title: 'Get my PSID',
          payload: 'psid'
        }
      ]
    };
  }
  
  // Received postback
  else if (webhookEvent.postback) {
    const { payload } = webhookEvent.postback;
    console.log('received postback');
  }
 
  // Received feedback
  else if (webhookEvent.messaging_feedback && webhookEvent.messaging_feedback?.feedback_screens) {
    const messageFeedback = webhookEvent.messaging_feedback.feedback_screens[0].questions;
    console.log('received feedback: ', messageFeedback);
    const feedbackId = Object.keys(messageFeedback)[0];
    const businessPageId = feedbackId.split('_')[0];
    const reviewTypeId = feedbackId.split('_')[1];
    const score = messageFeedback[feedbackId].payload;
    const body = messageFeedback[feedbackId].follow_up.payload;
    
    const addReviewQuery = 'INSERT INTO review (customer_psid, business_id, review_type_id, score, body) VALUES ($1, $2, $3, $4, $5)';
    const addReviewQueryValues = [userProfile.psid, businessPageId, reviewTypeId, score, body];
    console.log('addReviewQueryValues', addReviewQueryValues);

    db.query(addReviewQuery, addReviewQueryValues);

    response = {
      text: `Thanks for your feedback, ${userProfile.first_name}.`
    };

    if (score > 8) {
      response.text += ' Glad to hear you had a good experience!';
    }
    else if (score > 6) {
      response.text += ' We hope to do even better in the future!';
    }
    else {
      response.text += ' We\'re sorry to hear things were less than perfect. Would you like to speak with a customer service representative?';
      response.quick_replies = [
        {
          content_type: 'text',
          title: 'Yes',
          payload: 'agent'
        },
        {
          content_type: 'text',
          title: 'No',
          payload: 'none'
        }
      ];
    } 
  }
  
  // Default fallback response
  else {
    response = {
      text: `I'm not sure how to respond to that message, ${userProfile.first_name}!`
    };
  } 
  
  // Sends the response message
  respond.callSendAPI(userProfile.psid, response);    
};

respond.callSendAPI = function(senderPsid, response) {
  // Construct the message body
  const request_body = {
    recipient: {
      id: senderPsid
    },
    message: response
  };
  console.log('trying to send');
  fetch(`https://graph.facebook.com/v14.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      recipient: {
        id: senderPsid
      },
      sender_action: 'typing_off'
    })
  });
  // Send the HTTP request to the Messenger Platform
  fetch(`https://graph.facebook.com/v14.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(request_body)
  })
    .then(() => console.log('message sent!'))
    .catch((err) => console.error(`Unable to send message: ${err}`));
};

respond.sendFeedbackTemplate = async function(businessPageId, reviewTypeId, customerId) {
  const feedbackId = `${businessPageId}_${reviewTypeId}`;
  const businessQueryText = 'SELECT _id, name FROM business WHERE page_id = $1';
  let businessQuery;

  try {
    businessQuery = await db.query(businessQueryText, [businessPageId]);
  }
  catch(err) {
    throw new Error(`businessQuery failed: ${err}`);
  }
  
  const businessName = businessQuery.rows[0].name;  

  const message = {
    'attachment': {
      'type': 'template',
      'payload': {
        'template_type': 'customer_feedback',
        'title': `Rate your experience with ${businessName}.`, // Business needs to define. 
        'subtitle': `Let ${businessName} know how they are doing by answering two questions`, 
        'button_title': 'Rate Experience', // Business needs to define. 
        'feedback_screens': [{
          'questions':[{
            'id': feedbackId, // Unique id for question that business sets
            'type': 'nps',
            'title': `How likely are you to recommend ${businessName} to a friend or colleague?`, // Optional. If business does not define, we show standard text. Standard text based on question type ("csat", "nps", "ces" >>> "text")
            'follow_up': // Optional. Inherits the title and id from the previous question on the same page.  Only free-from input is allowed. No other title will show. 
                {
                  'type': 'free_form', 
                  'placeholder': 'Give additional feedback' // Optional
                }
          }]
        }],
        'business_privacy': 
            {
              'url': 'https://www.example.com'
            },
        'expires_in_days' : 7 // Optional, default 1 day, business defines 1-7 days
      }
    }
  };

  // console.log('message for feedback: ', message.attachment.payload.feedback_screens[0].questions);

  const sendFeedback = await fetch(`https://graph.facebook.com/v14.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      recipient: {
        id: customerId
      },
      message: message,
      tag: 'CUSTOMER_FEEDBACK'
    })
  });
  if (sendFeedback?.status !== 200) {
    throw new Error('fetch to send feedback failed');
  }
};

module.exports = respond;