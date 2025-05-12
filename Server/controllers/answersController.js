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
    res.status(201).json(newAnswer);
  }
  
  const updateAnswer = async (req, res) => {
    const { id } = req.params
    const { text } = req.body
  
    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(400).send('Answer not found');
    }
  
    answer.text = text
    const updated = await answer.save()
  
    res.json(updated)
  };
  

const deleteAnswer= async (req, res) => {
    const { id } = req.params;
    const deletedUser=await Answer.findByIdAndDelete(id);
    if(!deletedUser)
        return res.status(400).send('failed to delete answer')
    res.json({ message: 'Deleted successfully' });
  }
  
module.exports={deleteAnswer,getAnswers,createAnswer,updateAnswer}  