
const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: String,
  nextQuestionId: String, 
});

const ChatNodeSchema = new mongoose.Schema({
  questionId: { type: String, required: true, unique: true },
  questionText: { type: String }, 
  options: [optionSchema],
  reply: String,
});

module.exports = mongoose.model('ChatNode', ChatNodeSchema);






