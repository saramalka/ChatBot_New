// const mongoose = require('mongoose');

// const healthDataSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
//   weight: Number,
//   height: Number,
//   age: Number,
//   gender: String,
//   allergies: [String] // אם אתה מקבל כטקסט, תפרק אותו קודם
// });

// module.exports = mongoose.model('HealthDataUser', healthDataSchema);

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
});

module.exports = mongoose.model('HealthDataUser', healthDataSchema);
