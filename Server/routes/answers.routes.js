
const express = require('express');
const router = express.Router();
const answerController=require("../controllers/answersController")
const {auth,isAdmin}=require("../middlewares/authMiddleware")

router.get('/',answerController.getAnswers );

router.post('/',auth, isAdmin,answerController.createAnswer );

router.put('/:id', auth,isAdmin, answerController.updateAnswer);

router.delete('/:id',auth, isAdmin,answerController.deleteAnswer);

module.exports = router;
