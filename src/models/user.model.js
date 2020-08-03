const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  refresh_token: {
    type: String,
  },
});

// TODO: add unique validator for email and login (https://stackoverflow.com/questions/13580589/mongoose-unique-validation-error-type)

module.exports = mongoose.model('User', userSchema);
