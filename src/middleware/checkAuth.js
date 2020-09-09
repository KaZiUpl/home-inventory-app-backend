const jwt = require('jsonwebtoken');
const dotenv = require('../config/index');

const User = require('../models/user.model');
const { UnauthorizedError } = require('../error/errors');

module.exports = function (req, res, next) {
  try {
    // get access token from authorization header
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedError();
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError();
    }
    const decoded = jwt.verify(token, dotenv.jwtSecret);
    req.userData = decoded;

    next();
  } catch (error) {
    throw error;
  }
};
