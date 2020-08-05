const jwt = require('jsonwebtoken');
const dotenv = require('../config/index');

const User = require('../models/user.model');

module.exports = async function (req, res, next) {
  try {
    // get access token from authorization header
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, dotenv.jwtSecret);
    req.userData = decoded;

    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: 'You have to log in to access this resource.' });
  }
};