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

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', userSchema);
