
const express = require('express');
const router = express.Router();
const answerController=require("../controllers/answersController")
const {isAdmin}=require("../middlewares/authMiddleware")

router.get('/',answerController.getAnswers );

router.post('/', isAdmin,answerController.createAnswer );

router.put('/:id', isAdmin, answerController.updateAnswer);

router.delete('/:id', isAdmin,answerController.deleteAnswer);

module.exports = router;
