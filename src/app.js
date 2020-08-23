const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require('./config/index');

// Routes
const usersRoutes = require('./routes/users');
const housesRoutes = require('./routes/houses');

const app = express();

app.use(express.static(path.join(__dirname + '../public')));
app.use('/docs', express.static('public/docs'));

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Add routes
app.use('/users', usersRoutes);
app.use('/houses', housesRoutes);

// Catching errors
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(error.status || 500);
});

mongoose
  .connect(dotenv.mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then((result) => {
    app.listen(dotenv.port, (err) => {
      if (err) {
        console.log('Server initialization failed');
        console.log(err);
      }
      console.log(`Server started on port ${dotenv.port}!`);
    });
  })
  .catch((error) => {
    console.log('Error on db connection');
    console.log(error);
  });
