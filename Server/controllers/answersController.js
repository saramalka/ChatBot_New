const Answer = require('../models/Answer');

const getAnswers=async (req, res) => {
    const answers = await Answer.find();
    res.json(answers);
  }

const createAnswer=async (req, res) => {
    const answer = req.body;
    const newAnswer=await Answer.create(answer)
    if(!newAnswer)
        return res.status(400).send('faild to create answer')
    res.status(201).json(res);
  }
  
const updateAnswer=async (req, res) => {
    const updated = await Answer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  }  

const deleteAnswer= async (req, res) => {
    const deletedUser=await Answer.findByIdAndDelete(req.params.id);
    if(!deletedUser)
        return res.status(400).send('failed to delete answer')
    res.json({ message: 'Deleted successfully' });
  }
  
module.exports={deleteAnswer,getAnswers,createAnswer,updateAnswer}  