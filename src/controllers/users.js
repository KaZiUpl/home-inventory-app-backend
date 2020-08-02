const express = require('express');
const User = require('../models/user.model');

exports.test = async function (req, res) {
  return res.status(200).json({ msg: 'Hello World!' });
};
