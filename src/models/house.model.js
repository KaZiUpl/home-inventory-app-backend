const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const houseSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true
    },
    collaborators: [
        Schema.Types.ObjectId
    ],
    description: {
        type: String
    }
});


module.exports = mongoose.model('House', houseSchema);