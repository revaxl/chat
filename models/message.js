const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  name: String,
  message: String,
  room: String
});

module.exports = mongoose.model('Message', MessageSchema);
