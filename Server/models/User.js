const mongoose = require('mongoose');

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
    default: 'user'
  },
  password: String,
  nutritionGoals: [nutritionGoalSchema],
},{timestamps: true});

module.exports = mongoose.model('User', userSchema);
