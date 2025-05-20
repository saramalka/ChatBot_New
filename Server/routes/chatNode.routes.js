
const express = require('express');
const router = express.Router();
const chatNodeController=require("../controllers/chatNodeController")
const {auth,isAdmin}=require("../middlewares/authMiddleware")

router.get('/',chatNodeController.getChatNodes );

router.post('/',auth, isAdmin,chatNodeController.createChatNode );

router.put('/:id', auth,isAdmin, chatNodeController.updateChatNode);

router.delete('/:id',auth, isAdmin,chatNodeController.deleteChatNode);

module.exports = router;
