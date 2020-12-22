const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const helmet = require("helmet");

const {
  InternalServerError,
  NotFoundError,
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
  HTTPError
} = require('../error/errors');

// Routes
const usersRoutes = require('../routes/users');
const housesRoutes = require('../routes/houses');
const roomsRoutes = require('../routes/rooms');
const itemsRoutes = require('../routes/items');

const app = express();

ap.use(helmet());

if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() !== 'test') {
  app.use(morgan('dev'));
}

//set static documentation files
app.use(express.static(path.join(__dirname + '../public')));
app.use('/docs', express.static('public/docs'));
app.use('/img', express.static('public/img'));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '5mb' }));

//add routes
app.use('/users', usersRoutes);
app.use('/houses', housesRoutes);
app.use('/rooms', roomsRoutes);
app.use('/items', itemsRoutes);

//handle non-existent routes
app.use((req, res, next) => {
  next(new NotFoundError('This endpoint does not exist'));
});
//handle errors
app.use((error, req, res, next) => {
  if (!(error instanceof HTTPError)) {
    if (['CastError', 'ValidationError'].includes(error.constructor.name)) {
      error = new BadRequestError({
        message: error.message,
        stack: error.stack
      });
    } else {
      console.log(error.stack);
      error = new InternalServerError(error.message);
    }
  }
  res.status(error.status).json(error.body);
});

module.exports = app;
