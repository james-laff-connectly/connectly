const express = require('express');
const crypto = require('crypto');
const router = express.Router();

const facebookController = require('../controllers/facebookController');

router.use(express.json({ verify: verifyRequestSignature }));

router.get('/', facebookController.verify, (req,res) => {
  return res.status(200).send(res.locals.challenge);
});

router.post('/', facebookController.parseMessage, (req, res) => {
  return res.status(200).send('EVENT_RECEIVED');
});

// Verify that the callback came from Facebook
function verifyRequestSignature(req, res, buf) {
  const signature = req.headers['x-hub-signature'];

  if (!signature) {
    console.warn('Couldn\'t find "x-hub-signature" in headers.');
  } else {
    const elements = signature.split('=');
    const signatureHash = elements[1];
    const expectedHash = crypto
      .createHmac('sha1', process.env.APP_SECRET)
      .update(buf)
      .digest('hex');
    if (signatureHash != expectedHash) {
      throw new Error('Couldn\'t validate the request signature.');
    }
    else console.log('Facebook signature verified');
  }
}

module.exports = router;