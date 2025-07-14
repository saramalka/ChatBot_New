const User = require("../models/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).send('username, email and password are required');
    }

    const hash = await bcrypt.hash(password, 10);
    const userRole = role === "admin" ? "admin" : "user";

    const user = await User.create({
      username,
      email,
      password: hash,
      role: userRole
    });

    if (!user) {
      return res.status(400).send('fail to register');
    }
console.log('User registered successfully:', user);   
    req.body = { email, password }; 
    return login(req, res);
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).send('Server error during registration');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send('email and password are required');

  const user = await User.findOne({ email });
  if (!user) {
    console.log('משתמש לא נמצא');
    return res.status(404).json({ msg: 'User not found' });
  }

  console.log(' User from DB login:', user);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log('Invalid password');
    return res.status(401).json({ msg: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  console.log(' Login Success');
  res.json({ token, username: user.username, role: user.role });
};
