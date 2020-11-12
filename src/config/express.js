const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const {
  InternalServerError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError
} = require('../error/errors');

// Routes
const usersRoutes = require('../routes/users');
const housesRoutes = require('../routes/houses');
const roomsRoutes = require('../routes/rooms');

const app = express();

if (process.env.NODE_ENV.toLowerCase() !== 'test') {
  app.use(morgan('dev'));
}

//set static documentation files
app.use(express.static(path.join(__dirname + '../public')));
app.use('/docs', express.static('public/docs'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//add routes
app.use('/users', usersRoutes);
app.use('/houses', housesRoutes);
app.use('/rooms', roomsRoutes);

//handle non-existent routes
app.use((req, res, next) => {
  next(new NotFoundError());
});
//handle errors
app.use((error, req, res, next) => {
  if (error.constructor.name == 'CastError') {
    error = new BadRequestError();
  }
  if (error.constructor.name == 'Error') {
    error = new BadRequestError(error.message);
  }
  if (!error.status) {
    error = new InternalServerError();
  }
  return res.status(error.status).json({ message: error.message });
});

module.exports = app;
