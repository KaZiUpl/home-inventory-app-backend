const express = require('express');
const User = require('../models/user.model');

exports.createNewUser = async function (req, res, next) {
  try {
    let newUser = new User({
      login: req.body.login,
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();

    return res.status(201).json({ msg: 'User created.' });
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
  return res.status(200).json({ msg: 'User logged in.' });
};

exports.refreshToken = async function (req, res, next) {
  return res.status(200).json({ msg: 'Token refreshed.' });
};

exports.logout = async function (req, res, next) {
  return res.status(200).json({ msg: 'User logged out.' });
};
