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

const returnAutoMessage=async(req, res) => {
    const { content, role } = req.body;
  
    const userMessage = new Message({ content, role });
    await userMessage.save();
  
    const botContent = `הבוט ענה: קיבלתי "${content}"`;
    const botMessage = new Message({ content: botContent, role: 'bot' });
    await botMessage.save();
  
    res.status(201).json({ userMessage, botMessage });
  }  

module.exports= {createMessage,returnMessage,returnAutoMessage}  