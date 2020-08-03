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
    //check for duplicate login
    let user = await User.findOne({login: newUser.login});
    if(user !== null) {
      return res.status(400).json({message: 'User with such login already exist.'});
    }
    //check for duplicate email
    user = await User.findOne({email: newUser.email});
    if(user !== null) {
      return res.status(400).json({message: 'User with such email already exist.'});
    }
    //add new user
    //set password
    let passwordHash = await bcrypt.hash(newUser.password, 10);
    newUser.password = passwordHash;
    //set role
    newUser.role = 'user';
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
      login: credentials.login,
    });
    // user not found, wrong username
    if (user === null) {
      return res.status(400).json({ message: 'Wrong credentials' });
    }
    // user exists
    // TODO: uncomment after example user changed passwd to encrypted
    let passwordMatch = await bcrypt.compare(
      credentials.password,
      user.password
    );
    // wrong password
    if (!passwordMatch) {
      return res.status(400).json({ message: 'Wrong credentials' });
    }
    // create access token
    const tokenTimestamp = Math.floor(Date.now() / 1000) + 15 * 60; // expires in 15 minutes
    const tokenExpDate = new Date(tokenTimestamp * 1000);

    const token = jwt.sign(
      {
        login: user.login,
        email: user.email,
        id: user._id,
        role: user.role,
        exp: tokenTimestamp,
      },
      dotenv.jwtSecret
    );

    // create refresh token
    const refreshTokenTimestamp =
      Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // expires in 1 year
    const refreshToken = jwt.sign(
      {
        login: user.login,
        email: user.email,
        id: user._id,
        role: user.role,
        exp: refreshTokenTimestamp,
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
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async function (req, res, next) {
  try {
    // get user with provided refresh token
    let user = await User.findOne({ refresh_token: req.body.token });
    // if user is not logged in
    if (user === null) {
      return res.status(400).json({ message: 'User not logged in' });
    }

    // create new access token
    const tokenTimestamp = Math.floor(Date.now() / 1000) + 15 * 60; // expires in 15 minutes
    const tokenExpDate = new Date(tokenTimestamp * 1000);

    const token = jwt.sign(
      {
        login: user.login,
        email: user.email,
        id: user._id,
        role: user.role,
        exp: tokenTimestamp,
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
      role: user.role,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = async function (req, res, next) {
  try {
    let user = await User.findOne({ refresh_token: req.body.token });
    // user with provided token does not exist
    if (user === null) {
      return res.status(200).json({ message: 'User logged out.' });
    }
    // delete refresh token
    user.refresh_token = undefined;
    await user.save();
    return res.status(200).json({ msg: 'User logged out.' });
  } catch (error) {
    next(error);
  }
};
