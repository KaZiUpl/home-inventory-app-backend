const express = require('express');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const UsersService = require('../services/users.service');
const { ForbiddenError, UnprocessableEntityError } = require('../error/errors');

exports.createUser = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
    return;
  }
  try {
    let newUserId = await UsersService.createUser(
      req.body.login,
      req.body.email,
      req.body.password
    );

    return res
      .status(201)
      .json({ message: 'User created successfully', id: newUserId });
  } catch (error) {
    next(error);
  }
};

exports.putUser = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
    return;
  }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('User id is invalid');
    }
    //check whether user is trying to change his data
    if (req.params.id != req.userData.id) {
      throw new ForbiddenError("You can't modify other user's profile");
    }

    await UsersService.modifyUser(req.params.id, req.body);

    return res.status(200).json({ message: 'User modified' });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async function (req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('User id is invalid');
    }
    //check whether user is requesting his info
    if (req.params.id !== req.userData.id) {
      throw new ForbiddenError();
    }
    let user = await UsersService.getUser(req.params.id);

    //res.set('Cache-Control', 'private, max-age=86400, must-revalidate');
    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.login = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
    return;
  }
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      throw new BadRequestError('User id is invalid');
    }

    let tokenOutput = await UsersService.login(
      req.body.login,
      req.body.password
    );

    //res.set('Cache-Control', 'private, max-age=900, must-revalidate');
    return res.status(200).json(tokenOutput);
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
    return;
  }
  try {
    let tokenOutput = await UsersService.refreshToken(req.body.token);

    //res.set('Cache-Control', 'private, max-age=900, must-revalidate');
    return res.status(200).json(tokenOutput);
  } catch (error) {
    next(error);
  }
};

exports.logout = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new UnprocessableEntityError(errors.array()));
    return;
  }
  try {
    await UsersService.logout(req.body.token);

    return res.status(200).json({ message: 'User logged out' });
  } catch (error) {
    next(error);
  }
};

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
