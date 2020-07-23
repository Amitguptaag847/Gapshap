const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
    user1_id: {
        type: String,
        required: true
    },
    user2_id: {
        type: String,
        required: true
    }
});

module.exports = Contact = mongoose.model('contact', ContactSchema);