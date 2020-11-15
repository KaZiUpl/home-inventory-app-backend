const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  manufacturer: {
    type: String
  },
  photo: {
    type: String
  }
});

module.exports = mongoose.model('Item', itemSchema);
