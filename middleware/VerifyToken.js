const jwt = require('jsonwebtoken')
const User = require('../models/User')

module.exports = async function (req, res, next) {
    const authHeader = req.header('Authorization');
    
    // Check if the Authorization header is present and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({ error: 'Access denied, login again' });
    }
    
    const token = authHeader.split(' ')[1]; // Extract the token part
  
    try {
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = await User.findById(verified._id); // Fetch user from DB
      next();
    } catch (err) {
      res.status(400).json({ error: 'Invalid token' });
    }
  };
  