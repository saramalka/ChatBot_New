const express = require('express');
const chatController=require("../controllers/chatController")
const {auth} =require("../middlewares/authMiddleware")
const router = express.Router();

router.post('/', auth,chatController.createMessage );

router.get('/', auth, chatController.returnMessage);
router.post('/api/messages', auth,chatController.returnAutoMessage );

module.exports = router;
