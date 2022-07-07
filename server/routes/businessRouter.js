const express = require('express');
const router = express.Router();

const businessController = require('../controllers/businessController');

router.use(express.json());

router.get('/:businessPageId', businessController.compileFeedback, (req, res) => {
  return res.status(200).json({ scores: res.locals.scores });
});

router.post('/', express.json(), businessController.requestFeedback, (req, res) => {
  return res.status(200).send('EVENT_RECEIVED');
});

module.exports = router;