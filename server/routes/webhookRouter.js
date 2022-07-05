const express = require('express');
const router = express.Router();

const webhookController = require('../controllers/webhookController');

router.get('/', webhookController.verify, (req,res) => {
  return res.status(200).send(res.locals.challenge);
});

router.post('/', webhookController.parseMessage, (req, res) => {
  return res.status(200).send('EVENT_RECEIVED');
});

module.exports = router;