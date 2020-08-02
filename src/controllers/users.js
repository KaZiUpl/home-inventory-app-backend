const express = require('express');
const User = require('../models/user.model');

exports.createNewUser = async function (req, res, next) {
  return res.status(200).json({ msg: 'User created.' });
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
