require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require('./routes/chat.routes');
const authRoutes = require('./routes/auth.routes');
const corsOptions=require("./config/corsOptions")
const connectDB=require("./config/dbconn")

const app = express();
const PORT=process.env.PORT||2200
connectDB()

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.static('public'));
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

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

