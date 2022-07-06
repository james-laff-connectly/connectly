const path = require('path');
const express = require('express');
require('dotenv').config();

const facebookRouter = require('./routes/facebookRouter');

const businessController = require('./controllers/businessController');

const app = express();
const port = process.env.PORT || 3000;

// app.use(express.json());

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('/', (req, res) => {
    return res.status(200).sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.use('/facebook', facebookRouter);

app.post('/business', express.json(), businessController.requestFeedback, (req, res) => {
  return res.status(200).send('EVENT_RECEIVED');
});

app.use((req, res) => res.status(404).send('Page not found.'));

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});

app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports = app;