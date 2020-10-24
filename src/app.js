const server = require('./config/express');
const mongoose = require('mongoose');

const dotenv = require('./config/dotenv');
const morgan = require('morgan');

mongoose
  .connect(dotenv.mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  })
  .then((result) => {})
  .catch((error) => {
    console.log('Error on db connection');
    throw error;
  });

server.listen(dotenv.port, (err) => {
  if (err) {
    console.log('Server initialization failed');
    console.log(err);
  }
  console.log(`Server started on port ${dotenv.port}!`);
});
