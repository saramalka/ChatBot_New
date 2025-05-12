const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send('Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = decoded;
      next();
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }

};
const isAdmin = (req, res, next) => {
  console.log("Decoded user:", req.user);
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied - Admins only' });
  }
  next();
};

module.exports = { auth, isAdmin };