const db = require('../models/psql');
const respond = require('../services/respond');

const businessController = {};

businessController.requestFeedback = async (req, res, next) => {
  const { businessPageId, reviewTypeId, customerId } = req.body;
  if (!businessPageId || !reviewTypeId || !customerId) return next({
    log: 'businessController.requestFeedback - property not found on req.body',
    status: 400,
    message: { err: 'Invalid request for feedback' }
  });

  try {
    await respond.sendFeedbackTemplate(businessPageId, reviewTypeId, customerId);
    return next();
  }
  catch(err) {
    return next({
      log: `businessController.requestFeedback - sendFeedbackTemplate ${err}`,
      message: { err: 'Feedback request failed' }
    });
  }
};

businessController.updateFeedbackMessage = async (req, res, next) => {
  const { feedbackMessage, businessPageId } = req.body;
  const updateFeedbackMessageQueryText = 'UPDATE business SET feedback_message = $1 WHERE page_id = $2';
  console.log('update', feedbackMessage, businessPageId);
  try {
    await db.query(updateFeedbackMessageQueryText, [feedbackMessage, businessPageId]);
    return next();
  }
  catch(err) {
    return next({
      log: `businessController.updateFeedbackMessage - updateFeedbackMessageQuery ${err}`,
      message: { err: 'Feedback message update failed' }
    });
  }
};

businessController.compileFeedback = async (req, res, next) => {
  const { businessPageId } = req.params;
  const compileFeedbackQueryText = 'SELECT score FROM review WHERE business_page_id = $1';

  try {
    // TODO: add logic to compile and ID different types of reviews
    const compileFeedbackQuery = await db.query(compileFeedbackQueryText, [businessPageId]);
    const compiledScores = compileFeedbackQuery.rows.map(ele => ele.score);

    let detractors = 0, passives = 0, promoters = 0;
    compiledScores.forEach(score => {
      if (score > 8) promoters++;
      else if (score > 6) passives++;
      else detractors++;
    });
    res.locals.scores = [{ metric: 'Overall', detractors, passives, promoters }];
    return next();
  }
  catch(err) {
    return next({
      log: `businessController.compileFeedback - compileFeedbackQuery ${err}`,
      message: { err: 'Feedback compilation query failed' }
    });
  }
};

module.exports = businessController;