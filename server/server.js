const path = require('path');
const express = require('express');
require('dotenv').config();

const facebookRouter = require('./routes/facebookRouter');
const businessRouter = require('./routes/businessRouter');

const app = express();
const port = process.env.PORT || 3000;

if(process.env.NODE_ENV === 'production'){
  app.get('*.js', (req, res, next) => {
    req.url = req.url + '.br';
    res.set('Content-Encoding', 'br');
    res.set('Content-Type', 'application/javascript; charset=UTF-8');
    next();
  });
  app.use('/', express.static(path.resolve(__dirname, '../dist')));
  app.get('/', (req, res) => {
    return res.status(200).sendFile(path.resolve(__dirname, '../dist/index.html'));
  });
}

app.use('/facebook', facebookRouter);
app.use('/business', businessRouter);

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