const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ChatSchema = new Schema({
    contactId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

module.exports = Chat = mongoose.model('chat', ChatSchema);