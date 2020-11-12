const jwt = require('jsonwebtoken');
const dotenv = require('../config/dotenv');

const User = require('../models/user.model');
const { UnauthorizedError } = require('../error/errors');

module.exports = async function (req, res, next) {
  try {
    // get access token from authorization header
    const authHeader = req.get('Authorization');
    if (!authHeader) {
      throw new UnauthorizedError('Missing authorization header');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Wrong authorization header');
    }
    let decoded;
    try {
      decoded = jwt.verify(token, dotenv.jwtSecret);
    } catch (error) {
      throw new UnauthorizedError('Invalid access token');
    }
    req.userData = decoded;

    let user = await User.findById(req.userData.id);
    if (!user.refresh_token) {
      throw new UnauthorizedError('User not logged in');
    }

    next();
  } catch (error) {
    next(error);
  }
};
