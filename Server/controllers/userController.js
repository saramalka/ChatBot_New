const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User=require("../models/User")

const register= async (req, res) => {
  const { username, email, password } = req.body;
  if(!username||!email||!password)
    return res.status(400).send('username, email and password are required')
  const hash = await bcrypt.hash(password, 10);
  const user = User.create({ username, email, password: hash });
  if(!user)
    return res.status(400).send('fail to register')
  return res.json({ msg: 'User registered' });

}

const login=async (req, res) => {
  const { email, password } = req.body;
  if(!email||!password)
    return res.status(400).send(' email and password are required')
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ msg: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, username: user.username });
}

module.exports={register,login}