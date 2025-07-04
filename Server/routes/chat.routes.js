const express = require('express');
const chatController=require("../controllers/chatController")
const {auth} =require("../middlewares/authMiddleware")
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
router.get('/initial', auth, chatController.initial);
router.post('/updateNutritionGoals', auth, chatController.updateNutritionGoals);
router.post('/', auth,chatController.createMessage);
// router.get('/initial', auth,chatController.createMessage);
router.get('/', auth, chatController.returnMessage);
router.post('/api/messages', auth,chatController.returnAutoMessage );
router.get('/all', auth, chatController.all);
router.post('/healthData', auth, chatController.healthData);
router.get('/healthDataGet', auth, chatController.healthDataGet);
module.exports = router;
