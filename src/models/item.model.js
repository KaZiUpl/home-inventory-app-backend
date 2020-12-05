const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String
  },
  owner: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  manufacturer: {
    type: String,
    trim: true
  },
  ean: {
    type: String,
    trim: true
  },
  photo: {
    type: String
  }
});

module.exports = mongoose.model('Item', itemSchema);
