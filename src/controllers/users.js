const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const dotenv = require('../config/index');
const User = require('../models/user.model');

exports.createNewUser = async function (req, res, next) {
  try {
    let newUser = new User({
      login: req.body.login,
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();

    return res.status(201).json({ message: 'User created.' });
  } catch (error) {
    next(error);
  }
};

exports.modifyUser = async function (req, res, next) {
  return res.status(200).json({ msg: 'User modified.' });
};

exports.getUser = async function (req, res, next) {
  return res.status(200).json({ msg: 'User retrieved.' });
};

exports.login = async function (req, res, next) {
  try {
    let credentials = new User({
      login: req.body.login,
      password: req.body.password,
    });
    let user = await User.findOne({
      login: credentials.login
    });
    // user not found, wrong username
    if (user === null) {
      return res.status(400).json({ message: 'Wrong credentials' });
    }
    // user exists
    // TODO: uncomment after example user changed passwd to encrypted
    let passwordMatch = await bcrypt.compare(credentials.password, user.password);
    // wrong password
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Wrong credentials' });
    }
    // create access token
    const tokenTimestamp = Math.floor(Date.now() / 1000) + 15*60; // expires in 15 minutes
    const tokenExpDate = new Date(tokenTimestamp*1000);

    const token = jwt.sign(
      {
        login: user.login,
        email: user.email,
        id: user._id,
        role: user.role,
        exp: tokenTimestamp
      },
      dotenv.jwtSecret
    );

    // create refresh token
    const refreshTokenTimestamp = Math.floor(Date.now() / 1000) + 365*24*60*60; // expires in 1 year
    const refreshToken = jwt.sign(
      {
        login: user.login,
        email: user.email,
        id: user._id,
        role: user.role,
        exp: refreshTokenTimestamp
      },
      dotenv.jwtSecret
    );

    // add refresh token to database
    user.refresh_token = refreshToken;
    await user.save();

    // return token output
    return res.status(200).json({ 
      access_token: token,
      refresh_token: refreshToken,
      expires: tokenExpDate,
      id: user._id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async function (req, res, next) {
  try {
    // get user with provided refresh token
    let user = await User.findOne({refresh_token: req.body.token});

    // create new access token
    const tokenTimestamp = Math.floor(Date.now() / 1000) + 15*60; // expires in 15 minutes
    const tokenExpDate = new Date(tokenTimestamp*1000);

    const token = jwt.sign(
      {
        login: user.login,
        email: user.email,
        id: user._id,
        role: user.role,
        exp: tokenTimestamp
      },
      dotenv.jwtSecret
    );

    // return token output
    return res.status(200).json({ 
      access_token: token,
      refresh_token: user.refresh_token,
      expires: tokenExpDate,
      id: user._id,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    next(error);
  }
  return res.status(200).json({ msg: 'Token refreshed.' });
};

exports.logout = async function (req, res, next) {
  return res.status(200).json({ msg: 'User logged out.' });
};
