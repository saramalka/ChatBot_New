
const mongoose = require('mongoose');

const nutritionGoalSchema = new mongoose.Schema({
  title: String,
  description: String,
  targetCalories: Number,
  targetCarbs: Number,
  targetProtein: Number,
  targetFat: Number ,
    status: {
    type: String,
    enum:  ['notStarted', 'inProgress', 'completed'] ,
    default: 'notStarted'
  }
}, { _id: false });

const healthDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  weight: Number,
  height: Number,
  age: Number,
  gender: String,
  allergies: [String],
  nutritionGoals: [nutritionGoalSchema] 
},{ timestamps: true });

module.exports = mongoose.model('HealthDataUser', healthDataSchema);
