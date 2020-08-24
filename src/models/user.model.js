const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  login: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  refresh_token: {
    type: String
  }
});

module.exports = mongoose.model('User', userSchema);
