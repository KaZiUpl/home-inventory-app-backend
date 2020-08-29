const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  house: {
    type: mongoose.Types.ObjectId,
    required: true
  }
});

module.exports = mongoose.model('Room', roomSchema);
