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
    ref: 'House',
    required: true
  },
  storage: [
    new Schema({
      item: {
        type: mongoose.Types.ObjectId,
        ref: 'Item',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      expiration: {
        type: Date
      },
      description: {
        type: String
      }
    })
  ]
});

module.exports = mongoose.model('Room', roomSchema);
