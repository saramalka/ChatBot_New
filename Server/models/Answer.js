const mongoose = require('mongoose');

const quickReplySchema = new mongoose.Schema({
  text: { type: String, required: true }
});

module.exports = mongoose.model('QuickReply', quickReplySchema);
