const express = require('express');
const jwt = require('jsonwebtoken');
const Chat = require('../models/Chat');

const router = express.Router();

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(403).json({ msg: 'Invalid token' });
  }
}

router.post('/', auth, async (req, res) => {
  const { message } = req.body;

  // תגובה דמה מהבוט:
  const botReply = `הבוט עונה: קיבלתי את "${message}"`;

  let chat = await Chat.findOne({ userId: req.user.id });
  if (!chat) {
    chat = new Chat({ userId: req.user.id, messages: [] });
  }

  chat.messages.push({ role: 'user', content: message });
  chat.messages.push({ role: 'bot', content: botReply });

  await chat.save();

  res.json({ reply: botReply });
});

router.get('/', auth, async (req, res) => {
  const chat = await Chat.findOne({ userId: req.user.id });
  res.json(chat?.messages || []);
});

module.exports = router;
