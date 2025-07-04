const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const nutritionGoalSchema = new mongoose.Schema({
  title: String,
  description: String,
  targetCalories: Number,
  targetCarbs: Number,
  targetProtein: Number,
  targetFat: Number
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  role:{
    type: String,
    enum: ['admin', 'user'], 
    default: 'User'
  },
  password: String,
  nutritionGoals: [nutritionGoalSchema],
});

module.exports = mongoose.model('User', userSchema);
