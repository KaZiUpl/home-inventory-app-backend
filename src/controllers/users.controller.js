const express = require('express');
const { validationResult } = require('express-validator');

const UsersService = require('../services/users.service');
const { ForbiddenError, UnprocessableEntityError } = require('../error/errors');

exports.createUser = async function (req, res, next) {
  if (!validationResult(req).isEmpty()) {
    next(new UnprocessableEntityError());
  }
  try {
    let newUserId = await UsersService.createUser(
      req.body.login,
      req.body.email,
      req.body.password
    );

    return res
      .status(201)
      .json({ message: 'User created successfully.', id: newUserId });
  } catch (error) {
    next(error);
  }
};

exports.putUser = async function (req, res, next) {
  if (!validationResult(req).isEmpty()) {
    next(new UnprocessableEntityError());
  }
  try {
    //check whether user is trying to change his data
    if (req.params.id != req.userData.id) {
      throw new ForbiddenError("You can't modify other user's profile");
    }

    await UsersService.modifyUser(req.params.id, req.body);

    return res.status(200).json({ message: 'User modified.' });
  } catch (error) {
    next(error);
  }
};

exports.getUser = async function (req, res, next) {
  try {
    //check whether user is requesting his info
    if (req.params.id !== req.userData.id) {
      throw new ForbiddenError();
    }
    let user = await UsersService.getUser(req.params.id);

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.login = async function (req, res, next) {
  if (!validationResult(req).isEmpty()) {
    next(new UnprocessableEntityError());
  }
  try {
    let tokenOutput = await UsersService.login(
      req.body.login,
      req.body.password
    );

    return res.status(200).json(tokenOutput);
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async function (req, res, next) {
  if (!validationResult(req).isEmpty()) {
    next(new UnprocessableEntityError());
  }
  try {
    let tokenOutput = await UsersService.refreshToken(req.body.token);

    return res.status(200).json(tokenOutput);
  } catch (error) {
    next(error);
  }
};

exports.logout = async function (req, res, next) {
  if (!validationResult(req).isEmpty()) {
    next(new UnprocessableEntityError());
  }
  try {
    await UsersService.logout(req.body.token);

    return res.status(200).json({ message: 'User logged out.' });
  } catch (error) {
    next(error);
  }
};

exports.changeLogin = async function (req, res, next) {
  if (!validationResult(req).isEmpty()) {
    next(new UnprocessableEntityError());
  }
  try {
    //check whether user is requesting his info
    if (req.params.id != req.userData.id) {
      throw new ForbiddenError();
    }

    await UsersService.changeLogin(req.params.id, req.body.login);

    return res.status(200).json({ message: 'Login changed successfully.' });
  } catch (error) {
    next(error);
  }
};

function validateEmail(email) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
