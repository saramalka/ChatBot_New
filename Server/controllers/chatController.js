const Chat = require('../models/Chat');
const mongoose=require("mongoose")

const createMessage=async (req, res) => {
    const { message } = req.body;
    const botReply = `הבוט עונה: קיבלתי את "${message}"`;
  
    let chat = await Chat.findOne({ userId: req.user.id });
    if (!chat) {
      chat = new Chat({ userId: req.user.id, messages: [] });
    }
  
    chat.messages.push({ role: 'user', content: message });
    chat.messages.push({ role: 'bot', content: botReply });
  
    await chat.save();
  
    res.json({ reply: botReply });
  }

const returnMessage=async (req, res) => {
    const chat = await Chat.findOne({ userId: req.user.id });
    res.json(chat?.messages || []);
  }  

module.exports= {createMessage,returnMessage}  