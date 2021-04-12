const server = require('./config/express');
const mongoose = require('mongoose');
const https = require('https');
const dotenv = require('./config/dotenv');
const fs = require('fs');

let privateKey = fs.readFileSync('./src/selfsigned.key', 'utf8');
let certificate = fs.readFileSync('./src/selfsigned.cert', 'utf8');

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

const credentials = { key: privateKey, cert: certificate };
let httpsServer = https.createServer(credentials, server);

httpsServer.listen(dotenv.port, (err) => {
  if (err) {
    console.log('Server initialization failed');
    console.log(err);
  }
  console.log(`Server started on port ${dotenv.port}!`);
});
