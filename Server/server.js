require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/chat.routes');
//const answerRoutes=require("./routes/chatNode.routes")
const corsOptions=require("./config/corsOptions")
const connectDB=require("./config/dbconn")

const app = express();
const PORT=process.env.PORT||2200
connectDB()

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static('public'));
app.use('/api/users', userRoutes);
app.use('/api/auth', userRoutes);
app.use('/api/chat', chatRoutes);
//app.use('/api/replay', answerRoutes);
app.get('/', (req, res) => {
  res.send('🍎 ברוכים הבאים לאתר תזונה בריאה!');
});
const startServer = async () => {
  try {
    await connectDB(); 
    mongoose.connection.once('open', () => {
      console.log('Connected to MongoDB', process.env.MONGO_URI);
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();

