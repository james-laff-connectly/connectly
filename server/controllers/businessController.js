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

module.exports = businessController;