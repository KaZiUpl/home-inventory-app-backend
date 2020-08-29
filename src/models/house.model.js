const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const houseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Room'
    }
  ],
  description: {
    type: String
  }
});

module.exports = mongoose.model('House', houseSchema);
