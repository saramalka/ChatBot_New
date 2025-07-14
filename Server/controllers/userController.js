const bcrypt = require('bcryptjs');
const User = require("../models/User");

const getUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(400).send('users not found');
  res.json(users);
};

const updateUser = async (req, res) => {
  const { username, role, email, password, _id } = req.body;
  const user = await User.findById(_id);
  if (!user)
    return res.status(401).json({ msg: `not found user with id ${_id}` });

  if (password) {
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
  }

  user.username = username;
  user.role = role;
  user.email = email;

  await user.save();
  return res.json(user);
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);
  if (!user) return res.status(404).send('User not found');
  res.send('User deleted successfully');
};



module.exports = {
  updateUser,
  getUsers,
  deleteUser,

};
