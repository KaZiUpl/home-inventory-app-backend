const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('./config/index');
const { InternalServerError, NotFoundError } = require('./error/errors');

// Routes
const usersRoutes = require('./routes/users');
const housesRoutes = require('./routes/houses');
const roomsRoutes = require('./routes/rooms');

const app = express();

app.use(express.static(path.join(__dirname + '../public')));
app.use('/docs', express.static('public/docs'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add routes
app.use('/users', usersRoutes);
app.use('/houses', housesRoutes);
app.use('/rooms', roomsRoutes);

app.use((req, res, next) => {
  next(new NotFoundError());
});
// Catching errors
app.use((error, req, res, next) => {
  console.error(error);
  if (!error.status) {
    error = new InternalServerError();
  }
  return res.status(error.status).json({ message: error.message });
});

mongoose
  .connect(dotenv.mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => {})
  .catch((error) => {
    console.log('Error on db connection');
    throw error;
  });

app.listen(dotenv.port, (err) => {
  if (err) {
    console.log('Server initialization failed');
    console.log(err);
  }
  console.log(`Server started on port ${dotenv.port}!`);
});

module.exports = app;
